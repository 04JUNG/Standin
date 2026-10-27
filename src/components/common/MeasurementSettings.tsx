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
        {measurement.hasAnalytics && <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={choice.analytics} onChange={(event) => setChoice({ ...choice, analytics: event.target.checked })} className="h-5 w-5" />방문·다운로드 통계 (Google Analytics)</label>}
        {measurement.hasAdvertising && <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={choice.advertising} onChange={(event) => setChoice({ ...choice, advertising: event.target.checked })} className="h-5 w-5" />광고 유입·성과 측정 (Meta)</label>}
      </div>
      <a href="/legal/privacy/" className="mt-2 inline-block text-sm underline underline-offset-4">개인정보처리방침</a>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => save({ analytics: false, advertising: false })} className="min-h-12 rounded-xl border border-neutral-250 px-3 font-semibold">허용 안 함</button>
        <button type="button" onClick={() => save(choice)} className="min-h-12 rounded-xl bg-brand-ink px-3 font-semibold text-white">선택 저장</button>
      </div>
    </section>}
  </>;
}
