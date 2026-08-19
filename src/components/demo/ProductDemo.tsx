import { useState } from "react";
import { Check, Info } from "lucide-react";
import { Container } from "../common/Container";
import { PoseCandidateCard } from "./PoseCandidateCard";
import { Mannequin } from "./Mannequin";
import { poseCandidates } from "../../data/poseCandidates";
import { demo } from "../../data/content";
import type { PoseId } from "../../types/landing";

export function ProductDemo() {
  const [selectedId, setSelectedId] = useState<PoseId>(poseCandidates[0].id);
  const selected =
    poseCandidates.find((c) => c.id === selectedId) ?? poseCandidates[0];

  return (
    <section id="demo" className="py-20 sm:py-28 lg:py-32">
      <Container>
        {/* 제목 */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">INTERACTIVE PREVIEW</span>
          <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-brand-ink sm:text-4xl">
            {demo.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            {demo.description}
          </p>
        </div>

        {/* 단계 표시 (읽기용) */}
        <ol className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {demo.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span className="font-medium text-neutral-800">
                <span className="mr-1.5 font-bold text-brand-coral">{i + 1}</span>
                {step}
              </span>
              {i < demo.steps.length - 1 && (
                <span aria-hidden="true" className="text-neutral-400">
                  ·
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* 데모 캔버스 */}
        <div className="mt-10 overflow-hidden rounded-[28px] bg-brand-canvas p-4 shadow-[var(--shadow-float)] ring-1 ring-white/10 sm:p-6 lg:p-8">
          <div className="mb-5 flex items-start gap-2 rounded-xl bg-white/5 px-4 py-3 text-[13px] leading-relaxed text-neutral-250">
            <Info size={16} className="mt-0.5 shrink-0 text-brand-sky" />
            <span>{demo.guidance}</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* 선택된 프리뷰 (모바일에서 먼저 노출되지 않도록 lg에서만 좌측) */}
            <div className="order-2 lg:order-1">
              <div className="flex h-full flex-col rounded-2xl bg-[#1a2434] p-4 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-neutral-400">
                    3D 프리뷰 · 조정 준비
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-coral px-2.5 py-1 text-[12px] font-semibold text-white">
                    <Check size={12} /> {demo.selectionBadge}
                  </span>
                </div>

                <div className="relative mt-3 flex-1 overflow-hidden rounded-xl bg-[#141d2b]">
                  <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-brand-sky/25" />
                  <Mannequin
                    key={selected.id}
                    pose={selected.id}
                    accent
                    className="reveal is-visible relative mx-auto h-[320px] w-full sm:h-[380px]"
                  />
                </div>

                <p className="mt-3 text-[15px] font-semibold text-white">
                  {selected.title}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full bg-white/10 px-5 text-[14px] font-semibold text-neutral-400"
                    title="제품 흐름 예시입니다"
                  >
                    {demo.startButton}
                  </button>
                  <span className="text-[12px] text-neutral-400">
                    예시 버튼 · 실제 동작 아님
                  </span>
                </div>
              </div>
            </div>

            {/* 후보 목록 */}
            <div className="order-1 lg:order-2">
              <p className="mb-3 text-[13px] font-semibold text-neutral-400">
                가까운 후보 · 눌러서 프리뷰 교체
              </p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {poseCandidates.map((candidate) => (
                  <li key={candidate.id}>
                    <PoseCandidateCard
                      candidate={candidate}
                      selected={candidate.id === selectedId}
                      onSelect={setSelectedId}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-neutral-400">
            {demo.footnote}
          </p>
        </div>
      </Container>
    </section>
  );
}
