import type { Creative } from "./acquisition";
export const RELEASES_URL = "https://github.com/04JUNG/Standin-client/releases/latest";
export const RELEASES_API = "https://api.github.com/repos/04JUNG/Standin-client/releases/latest";
const assetPrefix = "https://github.com/04JUNG/Standin-client/releases/download/";

export type DownloadAsset = { label: string; name: string; url: string; size: number };
export type PublicRelease = { tag: string; assets: DownloadAsset[]; campaignAssets?: Partial<Record<Creative, DownloadAsset[]>> };

// Verified public installers (2026-11-01 KST). Keep downloads usable before JS and
// during API outages; refresh this snapshot when publishing a client release.
export const fallbackRelease: PublicRelease = {
  tag: "v0.2.8",
  assets: [
    { label: "Windows · 64비트", name: "Standin_0.2.8_x64-setup.exe", url: `${assetPrefix}v0.2.8/Standin_0.2.8_x64-setup.exe`, size: 4841144 },
    { label: "macOS · Apple Silicon / Intel", name: "Standin_0.2.8_universal.dmg", url: `${assetPrefix}v0.2.8/Standin_0.2.8_universal.dmg`, size: 13362150 },
  ],
  campaignAssets: {
    'meta-poster-a': [
      { label: "Windows · 64비트", name: "Standin_0.2.8_meta-poster-a_x64-setup.exe", url: `${assetPrefix}v0.2.8/Standin_0.2.8_meta-poster-a_x64-setup.exe`, size: 4841504 },
      { label: "macOS · Apple Silicon / Intel", name: "Standin_0.2.8_meta-poster-a_universal.dmg", url: `${assetPrefix}v0.2.8/Standin_0.2.8_meta-poster-a_universal.dmg`, size: 13361891 },
    ],
    'meta-hook-a': [
      { label: "Windows · 64비트", name: "Standin_0.2.8_meta-hook-a_x64-setup.exe", url: `${assetPrefix}v0.2.8/Standin_0.2.8_meta-hook-a_x64-setup.exe`, size: 4842568 },
      { label: "macOS · Apple Silicon / Intel", name: "Standin_0.2.8_meta-hook-a_universal.dmg", url: `${assetPrefix}v0.2.8/Standin_0.2.8_meta-hook-a_universal.dmg`, size: 13362005 },
    ],
  },
};

/** Only the release selected by GitHub's /latest endpoint is eligible. */
export function parseRelease(value: unknown): PublicRelease {
  if (!value || typeof value !== "object") throw new Error("INVALID_RELEASE");
  const release = value as Record<string, unknown>;
  if (release.draft !== false || release.prerelease !== false ||
      typeof release.tag_name !== "string" || !/^v\d+(?:\.\d+\.\d+)?$/.test(release.tag_name) ||
      !Array.isArray(release.assets)) throw new Error("INVALID_RELEASE");
  const version = release.tag_name.slice(1);
  const releaseAssets = release.assets.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  const platforms = [
    { label: "Windows · 64비트", suffix: "x64-setup.exe" },
    { label: "macOS · Apple Silicon / Intel", suffix: "universal.dmg" },
    { label: "macOS · Apple Silicon", suffix: "aarch64.dmg" },
    { label: "macOS · Intel", suffix: "x64.dmg" },
  ];
  function find(label: string, name: string): DownloadAsset[] {
    const url = `${assetPrefix}${encodeURIComponent(release.tag_name as string)}/${name}`;
    const found = releaseAssets.filter(item => item.name === name && item.browser_download_url === url &&
      typeof item.size === "number" && Number.isFinite(item.size) && item.size > 0);
    return found.length === 1 ? [{ label, name, url, size: found[0].size as number }] : [];
  }
  // Exact names prevent a creative package from becoming the generic download by array order.
  const assets = platforms.flatMap(({ label, suffix }) => find(label, `Standin_${version}_${suffix}`));
  if (!assets.length) throw new Error("NO_INSTALLERS");
  const campaignAssets: Partial<Record<Creative, DownloadAsset[]>> = {};
  const [major, minor, patch] = version.split('.').map(Number);
  if (major > 0 || minor > 2 || minor === 2 && patch >= 8) {
    for (const creative of ['meta-poster-a', 'meta-hook-a'] as const) {
      const installers = platforms.slice(0, 2).flatMap(({ label, suffix }) => find(label, `Standin_${version}_${creative}_${suffix}`));
      if (installers.length === 2) campaignAssets[creative] = installers;
    }
  }
  return { tag: release.tag_name, assets, campaignAssets };
}
