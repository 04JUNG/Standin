import { Layers3, Crop, Workflow as WorkflowIcon, Undo2 } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { Reveal } from "../common/Reveal";
import { benefits } from "../../data/content";

const icons = [Layers3, Crop, WorkflowIcon, Undo2];

export function BenefitsSection() {
  return (
    <section id="benefits" className="bg-neutral-100/60 py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading eyebrow={benefits.eyebrow} title={benefits.title} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={card.title} delay={i * 60}>
                <article className="flex h-full flex-col rounded-[22px] border border-neutral-250 bg-white p-6 shadow-[var(--shadow-card)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-coral/12 text-brand-coral-dark">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-brand-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                    {card.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
