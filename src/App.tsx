import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/hero/HeroSection";
import { InputSection } from "./components/sections/InputSection";
import { ProcessSection } from "./components/sections/ProcessSection";
import { ResultSection } from "./components/sections/ResultSection";
import { GuideSection } from "./components/sections/GuideSection";
import { DownloadSection } from "./components/sections/DownloadSection";
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
        {/* 무엇을 하는가(위) → 설치하면 이렇게 쓴다 → 지금 받는다. */}
        <GuideSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
