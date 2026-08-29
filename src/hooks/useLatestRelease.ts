import { useEffect, useState } from "react";
import {
  ASSET_PATTERNS,
  DOWNLOAD_URL_PREFIX,
  FALLBACK_RELEASE,
  RELEASES_API,
  type ReleaseAsset,
  type ReleaseInfo,
} from "../data/download";

/**
 * loading — 조회 중. 화면은 FALLBACK_RELEASE를 보여준다.
 * ready   — 조회 성공. 표시 중인 값이 최신이다.
 * stale   — 조회 실패. FALLBACK_RELEASE를 보여주고 있음을 방문자에게 알린다.
 */
export type ReleaseState = "loading" | "ready" | "stale";

const CACHE_KEY = "standin:latest-release:v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 6000;

type CacheEntry = { at: number; release: ReleaseInfo };

/** 자산 URL은 반드시 이 저장소의 릴리스를 가리켜야 한다. */
function isTrustedAsset(asset: ReleaseAsset): boolean {
  return asset.url.startsWith(DOWNLOAD_URL_PREFIX);
}

function isTrustedRelease(release: ReleaseInfo): boolean {
  return isTrustedAsset(release.windows) && isTrustedAsset(release.mac);
}

function readCache(): ReleaseInfo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (!entry?.release || Date.now() - entry.at > CACHE_TTL_MS) return null;
    // sessionStorage는 같은 출처의 아무 스크립트나 쓸 수 있다.
    // 검증 없이 신뢰하면 오염된 캐시가 다운로드 목적지를 바꿀 수 있다.
    if (!isTrustedRelease(entry.release)) return null;
    return entry.release;
  } catch {
    // JSON 깨짐, 프라이빗 모드에서의 접근 차단 등 — 캐시가 없는 것과 같이 취급한다.
    return null;
  }
}

function writeCache(release: ReleaseInfo): void {
  try {
    const entry: CacheEntry = { at: Date.now(), release };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // 저장에 실패해도 이번 화면은 이미 최신 값을 들고 있다.
  }
}

function pickAsset(assets: unknown[], pattern: RegExp): ReleaseAsset | null {
  for (const raw of assets) {
    if (!raw || typeof raw !== "object") continue;
    const asset = raw as Record<string, unknown>;
    const name = asset.name;
    const url = asset.browser_download_url;
    if (typeof name !== "string" || typeof url !== "string") continue;
    if (!pattern.test(name)) continue;
    const candidate: ReleaseAsset = {
      name,
      url,
      sizeBytes: typeof asset.size === "number" ? asset.size : 0,
    };
    if (!isTrustedAsset(candidate)) continue;
    return candidate;
  }
  return null;
}

function parseRelease(json: unknown): ReleaseInfo | null {
  if (!json || typeof json !== "object") return null;
  const release = json as Record<string, unknown>;
  if (release.draft === true) return null;
  if (typeof release.tag_name !== "string") return null;
  if (!Array.isArray(release.assets)) return null;

  const windows = pickAsset(release.assets, ASSET_PATTERNS.windows);
  const mac = pickAsset(release.assets, ASSET_PATTERNS.mac);
  // 한쪽만 최신인 반쪽짜리 화면을 만들지 않는다.
  if (!windows || !mac) return null;

  return {
    tag: release.tag_name,
    version: release.tag_name.replace(/^v/, ""),
    publishedAt:
      typeof release.published_at === "string" ? release.published_at : null,
    windows,
    mac,
  };
}

/**
 * 최신 릴리스를 GitHub API에서 조회한다.
 *
 * release는 절대 null이 아니다 — 실패하면 FALLBACK_RELEASE를 그대로 돌려주므로
 * 다운로드 버튼이 목적지 없이 렌더되는 순간이 없다.
 *
 * 실패해도 재시도하지 않는다. 비인증 호출은 IP당 시간 60회로 제한되어 있어,
 * 레이트리밋에 걸린 상황에서 재시도를 얹으면 상황을 악화시킬 뿐이다.
 */
export function useLatestRelease(): {
  release: ReleaseInfo;
  state: ReleaseState;
} {
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
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, TIMEOUT_MS);

    fetch(RELEASES_API, {
      // CORS 안전목록 헤더만 써서 preflight를 만들지 않는다.
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((json) => {
        const parsed = parseRelease(json);
        if (!parsed) throw new Error("릴리스 자산을 찾지 못했습니다.");
        writeCache(parsed);
        setRelease(parsed);
        setState("ready");
      })
      .catch((error: unknown) => {
        // 언마운트로 인한 abort는 실패가 아니다 — 상태를 건드리지 않는다.
        if (controller.signal.aborted && !timedOut) return;
        console.warn("[standin] 최신 릴리스 조회 실패", error);
        setState("stale");
      })
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return { release, state };
}
