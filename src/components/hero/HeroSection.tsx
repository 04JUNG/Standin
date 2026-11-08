import { useI18n } from "../../i18n/context";
import { ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { HeroPoseReveal } from "./HeroPoseReveal";
import { useLandingContent } from "../../i18n/landing";

export function HeroSection() {
  const { t, locale } = useI18n();
  const { footer, hero } = useLandingContent();
  return (
    <section id="hero" className="hero-showcase overflow-hidden pt-20 pb-16 sm:pt-24 lg:pt-28 lg:pb-24">
      <Container wide>
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <h1 id="product-title" className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {locale === "ja"
              ? hero.title.split(/(?<=、)|(?=3D)/).map((phrase) => <span key={phrase} className="inline-block whitespace-nowrap">{phrase}</span>)
              : hero.title.replace("\n", " ")}
          </h1>
          <p className="mt-3 text-base text-neutral-600">{footer.tagline}</p>
        </div>
        <HeroPoseReveal />

        <div className="hero-showcase__footer text-center">
          <p className="hero-showcase__line">{t("러프 위를 움직여 같은 자세의 3D 포즈를 확인해 보세요.")}</p>
          <div className="mb-5 flex justify-center">
            <Badge tone="coral">{t("오픈베타 참여하기")}</Badge>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <Button as="a" href="#beta" size="lg">
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
