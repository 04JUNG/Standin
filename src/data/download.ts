export const DOWNLOAD_REPOSITORY = "04JUNG/Standin-client";
export const RELEASES_API = `https://api.github.com/repos/${DOWNLOAD_REPOSITORY}/releases/latest`;
export const DOWNLOAD_URL_PREFIX = `https://github.com/${DOWNLOAD_REPOSITORY}/releases/download/`;

export const ASSET_PATTERNS = {
  windows: /_x64-setup\.exe$/i,
  macos: /_universal\.dmg$/i,
} as const;

export type ReleaseAsset = {
  name: string;
  url: string;
  sizeBytes: number;
};

export type ReleaseInfo = {
  tag: string;
  version: string;
  publishedAt: string | null;
  windows: ReleaseAsset;
  macos: ReleaseAsset;
};

/** GitHub API 조회가 실패해도 다운로드 버튼을 유지하기 위한 마지막 확인 버전. */
export const FALLBACK_RELEASE: ReleaseInfo = {
  tag: "v0.1.1-beta.6",
  version: "0.1.1-beta.6",
  publishedAt: "2026-08-28T06:12:46Z",
  windows: {
    name: "Standin_0.1.1-beta.6_x64-setup.exe",
    url: `${DOWNLOAD_URL_PREFIX}v0.1.1-beta.6/Standin_0.1.1-beta.6_x64-setup.exe`,
    sizeBytes: 3_700_949,
  },
  macos: {
    name: "Standin_0.1.1-beta.6_universal.dmg",
    url: `${DOWNLOAD_URL_PREFIX}v0.1.1-beta.6/Standin_0.1.1-beta.6_universal.dmg`,
    sizeBytes: 9_826_464,
  },
};
