import { ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { HeroPoseReveal } from "./HeroPoseReveal";
import { hero } from "../../data/content";

export function HeroSection() {
  return (
    <section className="hero-showcase overflow-hidden pt-20 pb-16 sm:pt-24 lg:pt-28 lg:pb-24">
      <Container wide>
        <HeroPoseReveal />

        <div className="hero-showcase__footer text-center">
          <p className="hero-showcase__line">
            러프 위를 움직여 같은 자세의 3D 포즈를 확인해 보세요.
          </p>
          <div className="mb-5 flex justify-center">
            <Badge tone="coral">{hero.launchBadge}</Badge>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <Button as="a" href={hero.primaryHref} size="lg">
              {hero.primaryCta}
              <ArrowRight size={18} />
            </Button>
            <Button as="a" href="#input" variant="secondary" size="lg">
              {hero.secondaryCta}
            </Button>
          </div>

          <p className="mt-6 text-[15px] text-neutral-600">
            {hero.assistiveLine}
          </p>
        </div>
      </Container>
    </section>
  );
}
