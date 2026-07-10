import { Check, ScanLine } from "lucide-react";
import { Mannequin } from "../demo/Mannequin";
import { poseCandidates } from "../../data/poseCandidates";
import { hero } from "../../data/content";

/**
 * Hero 제품 미리보기 — 정적 합성(docs/05 §4).
 * 실제 3D/분석 없이 "콘티 → 후보 검색 → 작가 선택" 흐름을 한 장면으로 보여준다.
 */
export function HeroProductPreview() {
  const selected = poseCandidates[1]; // 상체를 기울인 자세

  return (
    <div className="relative">
      {/* 제품 흐름 예시 라벨 */}
      <div className="absolute -top-3 left-4 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-canvas px-3 py-1 text-xs font-semibold text-brand-sky ring-1 ring-white/15">
          <ScanLine size={13} />
          {hero.demoLabel}
        </span>
      </div>

      <div className="rounded-[26px] bg-brand-canvas p-4 shadow-[var(--shadow-float)] ring-1 ring-white/10 sm:p-5">
        {/* 상단 단계 라벨 */}
        <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-neutral-400">
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/80">콘티</span>
          <span className="text-white/25">→</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/80">후보 검색</span>
          <span className="text-white/25">→</span>
          <span className="rounded-full bg-brand-coral/20 px-2.5 py-1 text-brand-coral">
            작가 선택
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 콘티 + 스켈레톤 */}
          <figure className="rounded-2xl bg-brand-paper p-3">
            <figcaption className="mb-2 text-[11px] font-semibold text-neutral-600">
              러프 콘티 · 인물 01
            </figcaption>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white ring-1 ring-neutral-250">
              <StoryboardSketch />
            </div>
          </figure>

          {/* 선택된 3D 프리뷰 */}
          <figure className="rounded-2xl bg-[#1a2434] p-3 ring-1 ring-brand-coral/40">
            <figcaption className="mb-2 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-neutral-400">3D 프리뷰</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-coral px-2 py-0.5 text-white">
                <Check size={11} /> 선택됨
              </span>
            </figcaption>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#1a2434]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(142,216,232,0.12),transparent_60%)]" />
              <Mannequin pose={selected.id} accent className="h-full w-full" />
            </div>
          </figure>
        </div>

        {/* 후보 카드 5개 (썸네일) */}
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-semibold text-neutral-400">
            가까운 후보 5개 · 하나를 선택
          </p>
          <ul className="grid grid-cols-5 gap-2">
            {poseCandidates.map((c) => {
              const isSelected = c.id === selected.id;
              return (
                <li
                  key={c.id}
                  className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-[#1a2434] ring-1 ${
                    isSelected
                      ? "ring-2 ring-brand-coral"
                      : "ring-white/10"
                  }`}
                >
                  <Mannequin pose={c.id} accent={isSelected} className="h-full w-full opacity-90" />
                  {isSelected && (
                    <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-coral text-white">
                      <Check size={10} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** 러프 콘티 스케치 + 관절 오버레이 (docs/07 §4 Hero 장면: 몸을 숙이고 팔을 내미는 전신) */
function StoryboardSketch() {
  const ink = "#152238";
  return (
    <svg viewBox="0 0 120 160" className="h-full w-full" aria-hidden="true">
      {/* 러프 선 (Ink 60%) */}
      <g stroke={ink} strokeOpacity={0.6} strokeWidth={1.6} fill="none" strokeLinecap="round">
        <ellipse cx="70" cy="34" rx="10" ry="12" />
        <path d="M70 46 C 66 62, 58 74, 52 92" />
        <path d="M66 54 C 74 60, 88 58, 100 52" />
        <path d="M60 66 C 50 66, 40 70, 32 76" />
        <path d="M52 92 C 50 110, 48 128, 44 146" />
        <path d="M54 94 C 62 112, 66 130, 70 146" />
      </g>
      {/* 분석 인물 박스 (Sky) */}
      <rect
        x="24"
        y="18"
        width="86"
        height="134"
        rx="6"
        fill="none"
        stroke="#8ed8e8"
        strokeWidth="1.4"
        strokeDasharray="4 3"
      />
      {/* 관절점 (Coral) */}
      <g fill="#ff6b57">
        <circle cx="70" cy="34" r="2.6" />
        <circle cx="66" cy="54" r="2.6" />
        <circle cx="100" cy="52" r="2.6" />
        <circle cx="52" cy="92" r="2.6" />
        <circle cx="44" cy="146" r="2.6" />
        <circle cx="70" cy="146" r="2.6" />
      </g>
    </svg>
  );
}
