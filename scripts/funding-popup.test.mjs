import test from "node:test";
import assert from "node:assert/strict";
import { dismissFundingToday, isFundingDismissedToday, koreaDate, isFundingOpen, FUNDING_DISMISSAL_KEY } from "../src/lib/fundingPopup.ts";

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("funding copy switches at the announced opening time in Korea", () => {
  assert.equal(isFundingOpen(Date.parse("2026-11-12T08:59:59.999+09:00")), false);
  assert.equal(isFundingOpen(Date.parse("2026-11-12T09:00:00+09:00")), true);
});

test("a supporters dismissal does not suppress the new funding campaign", () => {
  const target = storage();
  target.setItem("standin.supporters.2026-11.dismissed-date", koreaDate());
  assert.equal(isFundingDismissedToday(Date.now(), target), false);
});

test("dismissal lasts until Korea midnight, including across month and year boundaries", () => {
  for (const [before, after] of [
    ["2026-11-03T14:59:59.999Z", "2026-11-03T15:00:00Z"],
    ["2026-11-30T14:59:59.999Z", "2026-11-30T15:00:00Z"],
    ["2026-12-31T14:59:59.999Z", "2026-12-31T15:00:00Z"],
  ]) {
    const target = storage();
    dismissFundingToday(Date.parse(before), target);
    assert.equal(isFundingDismissedToday(Date.parse(before), target), true);
    assert.equal(isFundingDismissedToday(Date.parse(after), target), false);
    assert.equal(target.getItem(FUNDING_DISMISSAL_KEY), null);
  }
  assert.equal(koreaDate(Date.parse("2026-11-03T16:00:00-08:00")), "2026-11-04");
});

test("invalid saved values and unavailable storage do not block showing or closing", () => {
  const target = storage();
  target.setItem(FUNDING_DISMISSAL_KEY, "invalid");
  assert.equal(isFundingDismissedToday(Date.now(), target), false);
  const blocked = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); }, removeItem() { throw Error("blocked"); } };
  assert.doesNotThrow(() => dismissFundingToday(Date.now(), blocked));
  assert.equal(isFundingDismissedToday(Date.now(), blocked), false);
});
