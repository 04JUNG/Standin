import { useEffect, useRef, useState } from "react";
import { measurement } from "../../lib/measurement-client";
import type { MeasurementChoice } from "../../lib/measurement";

export function MeasurementSettings() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<MeasurementChoice>({ analytics: false, advertising: false });
  const settingsButton = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!measurement.available) return;
    const saved = measurement.start();
    if (saved) setChoice(saved);
    setOpen(!saved);
    setReady(true);
  }, []);
  if (!ready) return null;
  function save(next: MeasurementChoice) {
    measurement.saveChoice(next);
    setChoice(next);
    setOpen(false);
    settingsButton.current?.focus();
  }
  return <>
    <button type="button" ref={settingsButton} onClick={() => { setOpen(true); requestAnimationFrame(() => title.current?.focus()); }} className="min-h-11 text-sm underline underline-offset-4">쿠키 설정</button>
    {open && <section aria-labelledby="measurement-title" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[70vh] max-w-xl overflow-y-auto rounded-2xl border border-neutral-250 bg-white p-5 text-brand-ink shadow-xl sm:p-6">
      <h2 id="measurement-title" ref={title} tabIndex={-1} className="text-lg font-bold">방문 통계와 광고 성과 측정</h2>
      <p className="mt-2 text-sm leading-relaxed">선택한 항목에만 쿠키와 측정 도구를 사용합니다. 허용하지 않아도 다운로드할 수 있고, 아래 쿠키 설정에서 언제든 변경할 수 있습니다.</p>
      <div className="mt-3 space-y-2 text-sm">
        {measurement.hasAnalytics && <div>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" aria-describedby="measurement-analytics-detail" checked={choice.analytics} onChange={(event) => setChoice({ ...choice, analytics: event.target.checked })} className="h-5 w-5 shrink-0" />방문·다운로드 통계 (Google Analytics)</label>
          <p id="measurement-analytics-detail" className="pl-8 text-sm leading-relaxed">Google에 페이지 조회, 설치 파일 클릭, PC 링크 복사와 캠페인·기기 정보를 전송합니다. 설치나 앱 사용 완료를 뜻하지 않습니다.</p>
        </div>}
        {measurement.hasAdvertising && <div>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" aria-describedby="measurement-advertising-detail" checked={choice.advertising} onChange={(event) => setChoice({ ...choice, advertising: event.target.checked })} className="h-5 w-5 shrink-0" />광고 측정·개인화 (Meta)</label>
          <p id="measurement-advertising-detail" className="pl-8 text-sm leading-relaxed">Meta에 페이지 조회·클릭과 쿠키·접속 정보를 전송합니다. Meta는 광고 성과 측정 외에도 광고·추천 개인화, 서비스 개선과 보안에 사용할 수 있습니다. 아래 쿠키 설정에서 언제든 철회할 수 있습니다.</p>
        </div>}
      </div>
      <p className="mt-3 text-sm leading-relaxed">각 선택에는 Google LLC 또는 Meta Platforms, Inc.에 대한 정보 전송과 미국 등 국외 이전 동의가 포함됩니다. 수신자별 국가·항목·목적·보유기간·연락처를 아래 고지에서 확인해 주세요.</p>
      <a href="/legal/measurement/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline underline-offset-4">웹사이트 측정·국외 이전 상세 고지 (새 창)</a>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => save({ analytics: false, advertising: false })} className="min-h-12 rounded-xl border border-neutral-250 px-3 font-semibold">허용 안 함</button>
        <button type="button" onClick={() => save(choice)} className="min-h-12 rounded-xl bg-brand-ink px-3 font-semibold text-white">선택 저장</button>
      </div>
    </section>}
  </>;
}
