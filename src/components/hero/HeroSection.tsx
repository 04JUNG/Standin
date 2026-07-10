import { ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../common/Button";
import { HeroProductPreview } from "./HeroProductPreview";
import { hero } from "../../data/content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      {/* 은은한 배경 그리드 (장식) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,#e3ddd1_1px,transparent_1px),linear-gradient(to_bottom,#e3ddd1_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <Container wide className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(480px,1.05fr)] lg:gap-16">
          {/* 카피 */}
          <div className="max-w-xl">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1 className="mt-4 text-[clamp(2.35rem,6vw,3.75rem)] leading-[1.12] font-bold tracking-tight text-brand-ink">
              {hero.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-800">
              {hero.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href="#beta" size="lg">
                {hero.primaryCta}
                <ArrowRight size={18} />
              </Button>
              <Button as="a" href="#workflow" variant="secondary" size="lg">
                {hero.secondaryCta}
              </Button>
            </div>

            <p className="mt-6 text-[15px] font-medium text-neutral-600">
              <span className="text-brand-coral-dark">●</span> {hero.assistiveLine}
            </p>
          </div>

          {/* 비주얼 */}
          <div className="reveal is-visible">
            <HeroProductPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
