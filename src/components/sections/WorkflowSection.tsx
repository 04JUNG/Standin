import { Upload, ScanLine, MousePointerClick, PenTool } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { Reveal } from "../common/Reveal";
import { workflow } from "../../data/content";

const icons = [Upload, ScanLine, MousePointerClick, PenTool];

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading eyebrow={workflow.eyebrow} title={workflow.title} />

        <ol className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 데스크톱 진행선 */}
          <div
            aria-hidden="true"
            className="absolute top-7 left-0 right-0 hidden h-px bg-neutral-250 lg:block"
          />
          {workflow.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={step.id} delay={i * 70}>
                <li className="relative flex h-full flex-col rounded-[22px] border border-neutral-250 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-ink text-white">
                      <Icon size={24} />
                    </span>
                    <span className="text-sm font-bold tracking-wide text-brand-coral">
                      STEP {step.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
