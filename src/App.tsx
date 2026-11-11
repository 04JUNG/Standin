import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/hero/HeroSection";
import { InputSection } from "./components/sections/InputSection";
import { ProcessSection } from "./components/sections/ProcessSection";
import { ResultSection } from "./components/sections/ResultSection";
import { StandinIntro } from "./components/hero/StandinIntro";
import { FundingPopup } from "./components/common/FundingPopup";
import { FaqSection } from "./components/sections/FaqSection";
import { GuidesSection } from "./components/sections/GuidesSection";
import { FeatureShowcaseSection } from "./components/sections/FeatureShowcaseSection";
import { LocaleContext, useI18n } from "./i18n/context";
import type { Locale } from "./i18n/locale";

export function App({ locale = "ko" }: { locale?: Locale }) {
  return <LocaleContext.Provider value={locale}><Landing /></LocaleContext.Provider>;
}

function Landing() {
  const { locale } = useI18n();
  return (
    <div className="landing-shell">
      <StandinIntro />
      {locale === "ko" && <FundingPopup />}
      <a className="skip-link" href="#main-content">
        {locale === "ja" ? "本文へスキップ" : "본문으로 바로가기"}
      </a>
      <Header />
      <main id="main-content">
        <HeroSection />
        <InputSection />
        <ProcessSection />
        <ResultSection />
        <FeatureShowcaseSection />
        <GuidesSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
