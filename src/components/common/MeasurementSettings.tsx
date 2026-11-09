import { useI18n } from "../../i18n/context";
import { useEffect, useRef, useState } from "react";
import { measurement } from "../../lib/measurement-client";
import type { MeasurementChoice } from "../../lib/measurement";

export function MeasurementSettings() {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [choice, setChoice] = useState<MeasurementChoice>({ analytics: false, advertising: false });
  const settingsButton = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!measurement.available) return;
    const saved = measurement.start();
    if (saved) setChoice(saved);
    else setOpen(true);
    setReady(true);
  }, []);
  if (!ready) return null;
  async function save(next: MeasurementChoice) {
    setBusy(true);
    const erased = await measurement.saveChoice(next);
    setChoice(next);
    setBusy(false);
    if (!erased) { setMessage(t("수집은 중단했습니다. 기존 경로 기록 삭제는 연결 복구 후 다시 시도합니다. 이 화면을 다시 열어 저장할 수 있습니다.")); return; }
    setOpen(false); setMessage("");
    settingsButton.current?.focus({ preventScroll: true });
  }
  return <>
    <button type="button" ref={settingsButton} onClick={() => { setOpen(true); requestAnimationFrame(() => title.current?.focus({ preventScroll: true })); }} className="min-h-11 text-sm underline underline-offset-4">{t("쿠키 설정")}</button>
    {open && <section aria-labelledby="measurement-title" className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-h-[70vh] max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-250 bg-white p-4 text-brand-ink shadow-xl sm:p-5">
      <div className="min-h-0 overflow-y-auto">
      <h2 id="measurement-title" ref={title} tabIndex={-1} className="text-lg font-bold">{t("방문 통계와 광고 성과 측정")}</h2>
      <p className="mt-2 text-sm leading-relaxed">{t("쿠키로 방문 경로와 광고 성과를 분석합니다. 허용 여부는 언제든 바꿀 수 있습니다.")}</p>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer py-2 underline underline-offset-4">{t("항목 선택 · 자세히 보기")}</summary>
      <p className="mt-2 text-sm leading-relaxed">{t("허용한 항목만 수집합니다. 쿠키로 방문 경로와 체류 시간을 분석하고 다운로드 경험을 개선합니다. 거절해도 다운로드와 서비스 이용에 불이익이 없습니다. 언제든 하단 쿠키 설정에서 바꿀 수 있습니다.")}</p>
      <div className="mt-3 space-y-2 text-sm">
        {measurement.hasAnalytics && <div>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" aria-describedby="measurement-analytics-detail" checked={choice.analytics} onChange={(event) => setChoice({ ...choice, analytics: event.target.checked })} className="h-5 w-5 shrink-0" />{t("방문·이용 경로 분석 (Standin·Google Analytics, 선택)")}</label>
          <p id="measurement-analytics-detail" className="pl-8 text-sm leading-relaxed">{t("Standin은 임의 방문 식별자, 구간별 체류·스크롤·버튼·다운로드 클릭과 캠페인·기기 구분을 최대 90일 보관합니다. Google에는 페이지 조회·다운로드 클릭·PC 링크 복사와 캠페인·기기 정보가 전송됩니다. 앱 이용 연결은 앱에서 별도로 선택합니다. 입력 내용은 수집하지 않습니다.")}</p>
        </div>}
        {measurement.hasAdvertising && <div>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" aria-describedby="measurement-advertising-detail" checked={choice.advertising} onChange={(event) => setChoice({ ...choice, advertising: event.target.checked })} className="h-5 w-5 shrink-0" />{t("광고 측정·개인화 (Meta)")}</label>
          <p id="measurement-advertising-detail" className="pl-8 text-sm leading-relaxed">{t("Meta에 페이지 조회·클릭과 쿠키·접속 정보를 전송합니다. Meta는 광고 성과 측정 외에도 광고·추천 개인화, 서비스 개선과 보안에 사용할 수 있습니다. 아래 쿠키 설정에서 언제든 철회할 수 있습니다.")}</p>
        </div>}
      </div>
      <p className="mt-3 text-sm leading-relaxed">{t("사용 중인 항목은 Google LLC 또는 Meta Platforms, Inc.에 정보를 전송하며 미국 등 국외에서 처리될 수 있습니다. 수신자별 국가·항목·목적·보유기간·연락처를 아래 고지에서 확인해 주세요.")}</p>
      <a href="/legal/measurement/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline underline-offset-4">{t("웹사이트 측정·국외 이전 상세 고지 (새 창)")}</a>
      </details>
      {message && <p role="status" className="mt-3 text-sm">{message}</p>}
      </div>
      <div className="mt-4 grid shrink-0 grid-cols-3 gap-2 text-sm">
        <button disabled={busy} type="button" onClick={() => void save({ analytics: false, advertising: false })} className="min-h-12 rounded-xl border border-neutral-250 px-3 font-semibold">{t("허용 안 함")}</button>
        <button disabled={busy} type="button" onClick={() => void save(choice)} className="min-h-12 rounded-xl border border-neutral-250 px-3 font-semibold">{t("선택 저장")}</button>
        <button disabled={busy} type="button" onClick={() => void save({ analytics: true, advertising: true })} className="min-h-12 rounded-xl bg-brand-ink px-3 font-semibold text-white">{t("모두 허용")}</button>
      </div>
    </section>}
  </>;
}
