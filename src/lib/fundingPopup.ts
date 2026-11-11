export const FUNDING_DISMISSAL_KEY = "standin.funding.2026-11.dismissed-date";
export const FUNDING_URL = "https://airbridge.tumblbug.com/0096dmv";
export const FUNDING_OPENS_AT = Date.parse("2026-11-12T09:00:00+09:00");

export function isFundingOpen(now = Date.now()): boolean {
  return now >= FUNDING_OPENS_AT;
}

/** The funding campaign calendar uses Korea time, regardless of the visitor's timezone. */
export function koreaDate(now = Date.now()): string {
  return new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

type PopupStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function isFundingDismissedToday(now = Date.now(), storage?: PopupStorage): boolean {
  try {
    const target = storage ?? window.localStorage;
    const saved = target.getItem(FUNDING_DISMISSAL_KEY);
    if (saved === koreaDate(now)) return true;
    if (saved !== null) target.removeItem(FUNDING_DISMISSAL_KEY);
  } catch { /* Storage restrictions must not prevent the popup from working. */ }
  return false;
}

export function dismissFundingToday(now = Date.now(), storage?: PopupStorage): void {
  try {
    (storage ?? window.localStorage).setItem(FUNDING_DISMISSAL_KEY, koreaDate(now));
  } catch { /* The current popup still closes when browser storage is unavailable. */ }
}
