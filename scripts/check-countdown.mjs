import assert from "node:assert/strict";
import { openBetaCountdown } from "../src/lib/openBeta.ts";

const cases = [
  ["2026-10-18T15:00:00Z", "오픈베타 D-2"],
  ["2026-10-19T14:59:59Z", "오픈베타 D-2"],
  ["2026-10-19T15:00:00Z", "오픈베타 D-1"],
  ["2026-10-20T14:59:59Z", "오픈베타 D-1"],
  ["2026-10-20T15:00:00Z", "오픈베타 D-DAY · 오늘 공개 예정"],
  ["2026-10-21T14:59:59Z", "오픈베타 D-DAY · 오늘 공개 예정"],
  ["2026-10-21T15:00:00Z", "오픈베타 공개 안내"],
  ["2026-11-11T12:00:00+09:00", "오픈베타 공개 안내"],
  ["2026-10-20T08:00:00-07:00", "오픈베타 D-DAY · 오늘 공개 예정"],
];
for (const [instant, expected] of cases) {
  assert.equal(openBetaCountdown(new Date(instant)), expected, instant);
}
console.log(`Countdown: ${cases.length} Korean calendar boundary checks passed.`);
