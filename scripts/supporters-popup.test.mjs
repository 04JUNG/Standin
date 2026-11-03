import test from "node:test";
import assert from "node:assert/strict";
import { dismissSupportersToday, isSupportersDismissedToday, koreaDate, SUPPORTERS_DISMISSAL_KEY } from "../src/lib/supportersPopup.ts";

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("dismissal lasts until Korea midnight, including across month and year boundaries", () => {
  for (const [before, after] of [
    ["2026-11-03T14:59:59.999Z", "2026-11-03T15:00:00Z"],
    ["2026-11-30T14:59:59.999Z", "2026-11-30T15:00:00Z"],
    ["2026-12-31T14:59:59.999Z", "2026-12-31T15:00:00Z"],
  ]) {
    const target = storage();
    dismissSupportersToday(Date.parse(before), target);
    assert.equal(isSupportersDismissedToday(Date.parse(before), target), true);
    assert.equal(isSupportersDismissedToday(Date.parse(after), target), false);
    assert.equal(target.getItem(SUPPORTERS_DISMISSAL_KEY), null);
  }
  assert.equal(koreaDate(Date.parse("2026-11-03T16:00:00-08:00")), "2026-11-04");
});

test("invalid saved values and unavailable storage do not block showing or closing", () => {
  const target = storage();
  target.setItem(SUPPORTERS_DISMISSAL_KEY, "invalid");
  assert.equal(isSupportersDismissedToday(Date.now(), target), false);
  const blocked = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); }, removeItem() { throw Error("blocked"); } };
  assert.doesNotThrow(() => dismissSupportersToday(Date.now(), blocked));
  assert.equal(isSupportersDismissedToday(Date.now(), blocked), false);
});
