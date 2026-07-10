import { MousePointerClick, FileOutput, PenTool, ArrowRight, ArrowDown } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { clipStudio } from "../../data/content";

const flowIcons = [MousePointerClick, FileOutput, PenTool];

export function ClipStudioSection() {
  return (
    <section id="clip-studio" className="bg-neutral-100/60 py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow={clipStudio.eyebrow}
            title={clipStudio.title}
            description={clipStudio.body}
          />

          {/* 흐름 다이어그램 — 자체 제작 "작화 화면 모형" (docs/07 §7) */}
          <div className="rounded-[24px] border border-neutral-250 bg-white p-6 sm:p-8">
            <ol className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
              {clipStudio.flowLabels.map((label, i) => {
                const Icon = flowIcons[i];
                const isLast = i === clipStudio.flowLabels.length - 1;
                return (
                  <li key={label} className="contents">
                    <div
                      className={`flex flex-1 flex-col items-center gap-3 rounded-2xl p-4 text-center ${
                        isLast
                          ? "bg-brand-ink text-white"
                          : "bg-neutral-100 text-brand-ink"
                      }`}
                    >
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                          isLast
                            ? "bg-white/15 text-white"
                            : "bg-white text-brand-coral-dark"
                        }`}
                      >
                        <Icon size={22} />
                      </span>
                      <span className="text-[14px] font-semibold leading-snug">
                        {label}
                      </span>
                    </div>
                    {!isLast && (
                      <span className="flex shrink-0 justify-center text-neutral-400">
                        <ArrowRight size={20} className="hidden lg:block" aria-hidden="true" />
                        <ArrowDown size={20} className="lg:hidden" aria-hidden="true" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>

            <p className="mt-6 border-t border-neutral-250 pt-4 text-[13px] leading-relaxed text-neutral-500">
              {clipStudio.disclaimer}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
