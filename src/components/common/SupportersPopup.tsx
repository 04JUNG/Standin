import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { dismissSupportersToday, isSupportersDismissedToday, SUPPORTERS_DISMISSAL_KEY } from "../../lib/supportersPopup";
import "../../styles/supporters-popup.css";

const APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd7UsyeceNo4so68lUgrRiBSXJ-N1kr07PQlbVYDfH8W74HAQ/viewform?usp=dialog";
// 모집 공고 기준: 2026년 11월 6일 23:59까지 (한국 시간).
const CLOSES_AT = Date.parse("2026-11-07T00:00:00+09:00");

export function SupportersPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || Date.now() >= CLOSES_AT || isSupportersDismissedToday()) return;

    let previousOverflow: string | undefined;
    let previousFocus: HTMLElement | null = null;
    let expiryTimer: number | undefined;
    const restorePage = () => {
      if (previousOverflow !== undefined) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = undefined;
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      }
    };
    const closeWhenExpired = () => {
      if (Date.now() >= CLOSES_AT || isSupportersDismissedToday()) dialog.close();
    };
    const syncDismissal = (event: StorageEvent) => {
      if (event.key === SUPPORTERS_DISMISSAL_KEY) closeWhenExpired();
    };

    // Let the existing 2.2-second brand intro finish before opening the dialog.
    const openTimer = window.setTimeout(() => {
      if (Date.now() >= CLOSES_AT || isSupportersDismissedToday()) return;
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      expiryTimer = window.setTimeout(closeWhenExpired, CLOSES_AT - Date.now());
    }, 2400);

    dialog.addEventListener("close", restorePage);
    document.addEventListener("visibilitychange", closeWhenExpired);
    window.addEventListener("pageshow", closeWhenExpired);
    window.addEventListener("storage", syncDismissal);
    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(expiryTimer);
      dialog.removeEventListener("close", restorePage);
      document.removeEventListener("visibilitychange", closeWhenExpired);
      window.removeEventListener("pageshow", closeWhenExpired);
      window.removeEventListener("storage", syncDismissal);
      dialog.close();
      restorePage();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="supporters-popup"
      aria-labelledby="supporters-title"
      aria-describedby="supporters-description"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="supporters-popup__card">
        <h2 id="supporters-title" className="sr-only">Standin 서포터즈 모집</h2>
        <p id="supporters-description" className="sr-only">
          20명 이내 모집. 기본 활동 완료 시 활동비 20만 원(세전).
          신청 마감은 2026년 11월 6일 23:59, 활동 기간은 11월 9일부터 20일까지입니다. 한국 시간 기준입니다.
          지원 자격과 자세한 활동 조건은 신청폼에서 확인해 주세요.
        </p>
        <button
          type="button"
          className="supporters-popup__close"
          aria-label="서포터즈 모집 팝업 닫기"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={22} aria-hidden="true" />
        </button>
        <a className="supporters-popup__link" href={APPLICATION_URL} aria-label="Standin 서포터즈 신청하기 — 구글 폼으로 이동">
          <img
            className="supporters-popup__image"
            src="/assets/supporters/recruitment-popup-2026-11.jpg"
            width={1092}
            height={1440}
            alt="Standin 2026 서포터즈 모집. 내 그림에 써보고 솔직한 후기를 들려주세요. 기본 활동 완료 시 20만 원(세전), 20명 이내, 11월 6일 23:59 마감. 활동 11월 9일~20일."
          />
          <div className="supporters-popup__body">
            <span className="supporters-popup__cta">서포터즈 신청하기 <ArrowUpRight size={21} aria-hidden="true" /></span>
            <span className="supporters-popup__hint">지원 자격·활동 조건 확인 및 신청 · 구글 폼</span>
          </div>
        </a>
        <div className="supporters-popup__actions">
          <button type="button" className="supporters-popup__dismiss" onClick={() => {
            dismissSupportersToday();
            dialogRef.current?.close();
          }}>
            오늘 하루 보지 않기
          </button>
          <button type="button" className="supporters-popup__dismiss" onClick={() => dialogRef.current?.close()}>
            닫기
          </button>
        </div>
      </div>
    </dialog>
  );
}
