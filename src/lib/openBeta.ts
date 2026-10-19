export const openBeta = {
  date: "2026-10-21",
  dateLabel: "10월 21일",
  fallbackLabel: "10.21 오픈베타 공개 예정",
};

/** Calendar days in Korea, independent of the visitor's timezone. */
export function openBetaCountdown(now: Date): string {
  const koreanDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  const days = Math.round((Date.parse(`${openBeta.date}T00:00:00Z`) - Date.parse(`${koreanDate}T00:00:00Z`)) / 86_400_000);
  if (days > 0) return `오픈베타 D-${days}`;
  if (days === 0) return "오픈베타 D-DAY · 오늘 공개 예정";
  // A scheduled date alone must not announce that the service is live.
  return "오픈베타 공개 안내";
}
