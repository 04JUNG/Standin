import { Boxes, Search, Repeat2 } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { Reveal } from "../common/Reveal";
import { problem } from "../../data/content";

const icons = [Boxes, Search, Repeat2];

export function ProblemSection() {
  return (
    <section id="problem" className="bg-neutral-100/60 py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={problem.eyebrow}
          title={problem.title}
          description={problem.intro}
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problem.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={card.title} delay={i * 70}>
                <article className="h-full rounded-[22px] border border-neutral-250 bg-white p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-brand-ink">
                      <Icon size={22} />
                    </span>
                    <span className="text-[13px] font-semibold text-neutral-400">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-brand-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-neutral-600">
                    {card.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 text-lg font-semibold text-brand-ink">
          {problem.closing}
        </p>
      </Container>
    </section>
  );
}
