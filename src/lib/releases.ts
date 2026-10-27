export const RELEASES_URL = "https://github.com/04JUNG/Standin-client/releases/latest";
export const RELEASES_API = "https://api.github.com/repos/04JUNG/Standin-client/releases/latest";
const assetPrefix = "https://github.com/04JUNG/Standin-client/releases/download/";

export type DownloadAsset = { label: string; name: string; url: string; size: number };
export type PublicRelease = { tag: string; assets: DownloadAsset[] };

// Verified public installers (2026-10-27). Keep downloads usable before JS and
// during API outages; refresh this snapshot when publishing a client release.
export const fallbackRelease: PublicRelease = {
  tag: "v0.2.3",
  assets: [
    { label: "Windows · 64비트", name: "Standin_0.2.3_x64-setup.exe", url: `${assetPrefix}v0.2.3/Standin_0.2.3_x64-setup.exe`, size: 4837488 },
    { label: "macOS · Apple Silicon / Intel", name: "Standin_0.2.3_universal.dmg", url: `${assetPrefix}v0.2.3/Standin_0.2.3_universal.dmg`, size: 13355919 },
  ],
};

/** Only the release selected by GitHub's /latest endpoint is eligible. */
export function parseRelease(value: unknown): PublicRelease {
  if (!value || typeof value !== "object") throw new Error("INVALID_RELEASE");
  const release = value as Record<string, unknown>;
  if (release.draft !== false || release.prerelease !== false ||
      typeof release.tag_name !== "string" || /^staging[-/]/i.test(release.tag_name) ||
      !Array.isArray(release.assets)) throw new Error("INVALID_RELEASE");
  const releaseAssets: Record<string, unknown>[] = release.assets;
  const platforms = [
    { label: "Windows · 64비트", pattern: /^Standin_[\w.+-]+_x64-setup\.exe$/i },
    { label: "macOS · Apple Silicon / Intel", pattern: /^Standin_[\w.+-]+_universal\.dmg$/i },
    { label: "macOS · Apple Silicon", pattern: /^Standin_[\w.+-]+_aarch64\.dmg$/i },
    { label: "macOS · Intel", pattern: /^Standin_[\w.+-]+_x64\.dmg$/i },
  ];
  const assets = platforms.flatMap(({ label, pattern }) => {
    const asset = releaseAssets.find((item) =>
      typeof item?.name === "string" && pattern.test(item.name) &&
      typeof item.browser_download_url === "string" &&
      item.browser_download_url.startsWith(`${assetPrefix}${encodeURIComponent(release.tag_name as string)}/`));
    return asset ? [{ label, name: asset.name as string, url: asset.browser_download_url as string, size: Number(asset.size) || 0 }] : [];
  });
  if (!assets.length) throw new Error("NO_INSTALLERS");
  return { tag: release.tag_name, assets };
}
