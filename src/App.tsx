import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/hero/HeroSection";
import { InputSection } from "./components/sections/InputSection";
import { ProcessSection } from "./components/sections/ProcessSection";
import { ResultSection } from "./components/sections/ResultSection";
import { BetaSection } from "./components/sections/BetaSection";
import { StandinIntro } from "./components/hero/StandinIntro";

export function App() {
  return (
    <div className="landing-shell">
      <StandinIntro />
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main-content">
        <HeroSection />
        <InputSection />
        <ProcessSection />
        <ResultSection />
        <BetaSection />
      </main>
      <Footer />
    </div>
  );
}
