import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/hero/HeroSection";
import { ProductDemo } from "./components/demo/ProductDemo";
import { ProblemSection } from "./components/sections/ProblemSection";
import { WorkflowSection } from "./components/sections/WorkflowSection";
import { BenefitsSection } from "./components/sections/BenefitsSection";
import { PrinciplesSection } from "./components/sections/PrinciplesSection";
import { ClipStudioSection } from "./components/sections/ClipStudioSection";
import { BetaSection } from "./components/sections/BetaSection";
import { FaqSection } from "./components/sections/FaqSection";

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main-content">
        <HeroSection />
        <ProductDemo />
        <ProblemSection />
        <WorkflowSection />
        <BenefitsSection />
        <PrinciplesSection />
        <ClipStudioSection />
        <BetaSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
