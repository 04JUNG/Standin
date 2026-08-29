/** 3_700_949 → "3.7 MB". 1MB 미만은 KB로 떨어뜨린다. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / 1_000_000;
  if (mb < 1) return `${Math.round(bytes / 1000)} KB`;
  return `${mb.toFixed(1)} MB`;
}

/** ISO 8601 → "2026년 8월 28일". 값이 없거나 파싱되지 않으면 null. */
export function formatReleaseDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
