import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { dismissFundingToday, isFundingDismissedToday, isFundingOpen, FUNDING_DISMISSAL_KEY, FUNDING_OPENS_AT, FUNDING_URL } from "../../lib/fundingPopup";
import "../../styles/funding-popup.css";

export function FundingPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [fundingOpen, setFundingOpen] = useState(false);

  useEffect(() => {
    let launchTimer: number | undefined;
    const syncLaunch = () => {
      window.clearTimeout(launchTimer);
      setFundingOpen(isFundingOpen());
      const remaining = FUNDING_OPENS_AT - Date.now();
      if (remaining > 0) launchTimer = window.setTimeout(syncLaunch, Math.min(remaining, 2_147_483_647));
    };
    syncLaunch();
    document.addEventListener("visibilitychange", syncLaunch);
    window.addEventListener("pageshow", syncLaunch);
    return () => {
      window.clearTimeout(launchTimer);
      document.removeEventListener("visibilitychange", syncLaunch);
      window.removeEventListener("pageshow", syncLaunch);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || isFundingDismissedToday()) return;

    let previousOverflow: string | undefined;
    let previousFocus: HTMLElement | null = null;
    const restorePage = () => {
      if (previousOverflow !== undefined) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = undefined;
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      }
    };
    const closeWhenDismissed = () => {
      if (isFundingDismissedToday()) dialog.close();
    };
    const syncDismissal = (event: StorageEvent) => {
      if (event.key === FUNDING_DISMISSAL_KEY) closeWhenDismissed();
    };

    // Let the existing 2.2-second brand intro finish before opening the dialog.
    const openTimer = window.setTimeout(() => {
      if (isFundingDismissedToday()) return;
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }, 2400);

    dialog.addEventListener("close", restorePage);
    document.addEventListener("visibilitychange", closeWhenDismissed);
    window.addEventListener("pageshow", closeWhenDismissed);
    window.addEventListener("storage", syncDismissal);
    return () => {
      window.clearTimeout(openTimer);
      dialog.removeEventListener("close", restorePage);
      document.removeEventListener("visibilitychange", closeWhenDismissed);
      window.removeEventListener("pageshow", closeWhenDismissed);
      window.removeEventListener("storage", syncDismissal);
      dialog.close();
      restorePage();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="funding-popup"
      aria-labelledby="funding-title"
      aria-describedby="funding-description"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="funding-popup__card">
        <button
          type="button"
          className="funding-popup__close"
          aria-label="텀블벅 펀딩 팝업 닫기"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={22} aria-hidden="true" />
        </button>
        <a className="funding-popup__link" href={FUNDING_URL} aria-label={fundingOpen ? "Standin 펀딩 보러 가기 — 텀블벅으로 이동" : "Standin 오픈 알림 신청하기 — 텀블벅으로 이동"}>
          <div className="funding-popup__intro">
            <span className="funding-popup__eyebrow">STANDIN × 텀블벅</span>
            <h2 id="funding-title">러프 한 장에서<br />시작하는 3D 포즈</h2>
            <p id="funding-description">Standin의 다음 이야기를<br />텀블벅 펀딩에서 만나보세요.</p>
          </div>
          <img
            className="funding-popup__image"
            src="/assets/funding/rough-to-pose.png"
            width={1254}
            height={1254}
            alt="손으로 그린 러프와 그 자세에 맞춰 찾은 3D 포즈"
          />
          <div className="funding-popup__body">
            <span className="funding-popup__schedule">{fundingOpen ? "Standin 텀블벅 펀딩" : "11월 12일 (목) 오전 9시 공개"}</span>
            <span className="funding-popup__cta">{fundingOpen ? "펀딩 보러 가기" : "오픈 알림 신청하기"} <ArrowUpRight size={21} aria-hidden="true" /></span>
            <span className="funding-popup__hint">{fundingOpen ? "프로젝트와 선물 구성은 텀블벅에서 확인해 주세요." : "텀블벅에서 알림을 신청하고 오픈 소식을 받아보세요."}</span>
          </div>
        </a>
        <div className="funding-popup__actions">
          <button type="button" className="funding-popup__dismiss" onClick={() => {
            dismissFundingToday();
            dialogRef.current?.close();
          }}>
            오늘 하루 보지 않기
          </button>
          <button type="button" className="funding-popup__dismiss" onClick={() => dialogRef.current?.close()}>
            닫기
          </button>
        </div>
      </div>
    </dialog>
  );
}
