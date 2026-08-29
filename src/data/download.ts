/**
 * 데스크톱 앱 배포 정보.
 *
 * 배포는 GitHub Releases 한 곳에서만 나간다(클라이언트 ADR-011).
 * 랜딩은 릴리스를 런타임에 조회해 최신 버전을 안내하되, 조회가 실패해도
 * 버튼이 살아 있어야 하므로 마지막으로 확인된 값을 FALLBACK_RELEASE로 들고 있는다.
 */

export const REPO = "04JUNG/Standin-client";
export const RELEASES_API = `https://api.github.com/repos/${REPO}/releases/latest`;
export const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

/**
 * 자산 URL 검증용 접두사.
 * 응답이든 캐시든 이 접두사로 시작하지 않는 URL은 다운로드 버튼에 붙이지 않는다.
 */
export const DOWNLOAD_URL_PREFIX = `https://github.com/${REPO}/releases/download/`;

/** 릴리스 자산 이름 규칙. Tauri 번들러가 만드는 파일명을 그대로 따른다. */
export const ASSET_PATTERNS = {
  windows: /_x64-setup\.exe$/i,
  mac: /_universal\.dmg$/i,
} as const;

export type ReleaseAsset = {
  name: string;
  url: string;
  /** 0이면 용량을 모른다는 뜻 — 화면에서 용량을 감춘다. */
  sizeBytes: number;
};

export type ReleaseInfo = {
  /** "v0.1.1-beta.6" */
  tag: string;
  /** "0.1.1-beta.6" — 표시용, 앞의 v를 뗀 값 */
  version: string;
  /** ISO 8601. 응답에 없으면 null */
  publishedAt: string | null;
  windows: ReleaseAsset;
  mac: ReleaseAsset;
};

/**
 * 마지막으로 확인된 릴리스(2026-08-28 조회).
 * 화면은 항상 이 값에서 시작하고 조회에 성공하면 그때 갱신한다.
 *
 * 새 릴리스를 낼 때마다 이 상수를 함께 갱신한다 — 자동 조회가 주 경로지만,
 * 오프라인이거나 레이트리밋에 걸린 방문자는 여기 적힌 버전을 받게 된다.
 */
export const FALLBACK_RELEASE: ReleaseInfo = {
  tag: "v0.1.1-beta.6",
  version: "0.1.1-beta.6",
  publishedAt: "2026-08-28T06:12:46Z",
  windows: {
    name: "Standin_0.1.1-beta.6_x64-setup.exe",
    url: `${DOWNLOAD_URL_PREFIX}v0.1.1-beta.6/Standin_0.1.1-beta.6_x64-setup.exe`,
    sizeBytes: 3_700_949,
  },
  mac: {
    name: "Standin_0.1.1-beta.6_universal.dmg",
    url: `${DOWNLOAD_URL_PREFIX}v0.1.1-beta.6/Standin_0.1.1-beta.6_universal.dmg`,
    sizeBytes: 9_826_464,
  },
};
