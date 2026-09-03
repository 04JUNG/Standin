import { useEffect, useState } from "react";
import {
  ASSET_PATTERNS,
  DOWNLOAD_URL_PREFIX,
  FALLBACK_RELEASE,
  RELEASES_API,
  type ReleaseAsset,
  type ReleaseInfo,
} from "../data/download";

export type ReleaseState = "loading" | "ready" | "stale";

const CACHE_KEY = "standin:latest-release:v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 6000;

type CacheEntry = { at: number; release: ReleaseInfo };

function isTrustedAsset(asset: ReleaseAsset): boolean {
  return asset.url.startsWith(DOWNLOAD_URL_PREFIX);
}

function isTrustedRelease(release: ReleaseInfo): boolean {
  return isTrustedAsset(release.windows) && isTrustedAsset(release.macos);
}

function readCache(): ReleaseInfo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (!entry?.release || Date.now() - entry.at > CACHE_TTL_MS) return null;
    return isTrustedRelease(entry.release) ? entry.release : null;
  } catch {
    return null;
  }
}

function writeCache(release: ReleaseInfo): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), release }));
  } catch {
    // 캐시 저장 실패는 다운로드 동작에 영향을 주지 않는다.
  }
}

function pickAsset(assets: unknown[], pattern: RegExp): ReleaseAsset | null {
  for (const raw of assets) {
    if (!raw || typeof raw !== "object") continue;
    const asset = raw as Record<string, unknown>;
    if (typeof asset.name !== "string" || typeof asset.browser_download_url !== "string") continue;
    if (!pattern.test(asset.name)) continue;

    const candidate = {
      name: asset.name,
      url: asset.browser_download_url,
      sizeBytes: typeof asset.size === "number" ? asset.size : 0,
    };
    if (isTrustedAsset(candidate)) return candidate;
  }
  return null;
}

function parseRelease(json: unknown): ReleaseInfo | null {
  if (!json || typeof json !== "object") return null;
  const release = json as Record<string, unknown>;
  if (release.draft === true || typeof release.tag_name !== "string" || !Array.isArray(release.assets)) return null;

  const windows = pickAsset(release.assets, ASSET_PATTERNS.windows);
  const macos = pickAsset(release.assets, ASSET_PATTERNS.macos);
  if (!windows || !macos) return null;

  return {
    tag: release.tag_name,
    version: release.tag_name.replace(/^v/, ""),
    publishedAt: typeof release.published_at === "string" ? release.published_at : null,
    windows,
    macos,
  };
}

export function useLatestRelease(): { release: ReleaseInfo; state: ReleaseState } {
  const [release, setRelease] = useState<ReleaseInfo>(FALLBACK_RELEASE);
  const [state, setState] = useState<ReleaseState>("loading");

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setRelease(cached);
      setState("ready");
      return;
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, TIMEOUT_MS);

    fetch(RELEASES_API, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((json) => {
        const parsed = parseRelease(json);
        if (!parsed) throw new Error("릴리스 설치 파일을 찾지 못했습니다.");
        writeCache(parsed);
        setRelease(parsed);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted && !timedOut) return;
        console.warn("[standin] 최신 릴리스 조회 실패", error);
        setState("stale");
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return { release, state };
}
