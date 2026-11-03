export const SUPPORTERS_DISMISSAL_KEY = "standin.supporters.2026-11.dismissed-date";

/** The recruitment calendar uses Korea time, regardless of the visitor's timezone. */
export function koreaDate(now = Date.now()): string {
  return new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

type PopupStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function isSupportersDismissedToday(now = Date.now(), storage?: PopupStorage): boolean {
  try {
    const target = storage ?? window.localStorage;
    const saved = target.getItem(SUPPORTERS_DISMISSAL_KEY);
    if (saved === koreaDate(now)) return true;
    if (saved !== null) target.removeItem(SUPPORTERS_DISMISSAL_KEY);
  } catch { /* Storage restrictions must not prevent the popup from working. */ }
  return false;
}

export function dismissSupportersToday(now = Date.now(), storage?: PopupStorage): void {
  try {
    (storage ?? window.localStorage).setItem(SUPPORTERS_DISMISSAL_KEY, koreaDate(now));
  } catch { /* The current popup still closes when browser storage is unavailable. */ }
}
