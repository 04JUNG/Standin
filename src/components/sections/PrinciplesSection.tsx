import { Sparkles, Check, PenTool } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { Badge } from "../common/Badge";
import { principles } from "../../data/content";

export function PrinciplesSection() {
  return (
    <section id="principles" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={principles.eyebrow}
          title={principles.title}
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Standin이 돕는 일 */}
          <div className="rounded-[24px] border border-neutral-250 bg-white p-7">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-sky/25 text-brand-ink">
                <Sparkles size={18} />
              </span>
              <h3 className="text-lg font-semibold text-brand-ink">
                {principles.aiSideLabel}
              </h3>
            </div>
            <ul className="mt-5 space-y-3">
              {principles.aiSide.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-neutral-800">
                  <Check size={18} className="mt-0.5 shrink-0 text-brand-sky" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 작가가 결정하는 일 — 코랄 강조 */}
          <div className="rounded-[24px] border-2 border-brand-coral/40 bg-brand-coral/[0.05] p-7">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-coral text-white">
                <PenTool size={18} />
              </span>
              <h3 className="text-lg font-semibold text-brand-ink">
                {principles.artistSideLabel}
              </h3>
            </div>
            <ul className="mt-5 space-y-3">
              {principles.artistSide.map((item, i) => {
                const isLast = i === principles.artistSide.length - 1;
                return (
                  <li
                    key={item}
                    className={`flex items-start gap-2.5 ${
                      isLast
                        ? "font-semibold text-brand-coral-dark"
                        : "text-neutral-800"
                    }`}
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-coral"
                    />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* 범위 배지 */}
        <div className="mt-8 rounded-[24px] bg-brand-ink p-7 text-white">
          <h3 className="text-lg font-semibold">{principles.scopeTitle}</h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {principles.scopeBadges.map((badge) => (
              <Badge key={badge} tone="sky" className="border-white/20 bg-white/10 text-white">
                {badge}
              </Badge>
            ))}
          </div>
          <p className="mt-5 max-w-2xl leading-relaxed text-neutral-250">
            {principles.scopeNote}
          </p>
        </div>
      </Container>
    </section>
  );
}
