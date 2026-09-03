import { ArrowLeft } from "lucide-react";
import { Container } from "../components/common/Container";
import { BrandMark } from "../components/common/BrandMark";
import { FeedbackSurvey } from "../components/forms/FeedbackSurvey";

export function FeedbackPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <a className="skip-link" href="#feedback-main">
        설문으로 바로가기
      </a>

      <header className="border-b border-neutral-250/70 bg-brand-paper/90 backdrop-blur-md">
        <Container wide>
          <div className="flex h-[72px] items-center justify-between gap-4">
            <a href="/" aria-label="Standin 홈으로" className="rounded-lg">
              <BrandMark className="text-xl" />
            </a>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-brand-coral/25 bg-brand-coral/10 px-3 py-1 text-[12px] font-bold tracking-[0.08em] text-brand-coral-dark sm:inline-flex">
                CLOSED BETA FEEDBACK
              </span>
              <a
                href="/"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-neutral-600 transition-colors hover:bg-white hover:text-brand-ink"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                홈으로
              </a>
            </div>
          </div>
        </Container>
      </header>

      <main id="feedback-main">
        <FeedbackSurvey />
      </main>
    </div>
  );
}
