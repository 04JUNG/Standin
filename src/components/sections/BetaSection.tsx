import { Container } from "../common/Container";
import { BetaSignupForm } from "../forms/BetaSignupForm";
import { beta } from "../../data/content";

/**
 * 사전등록 CTA 섹션.
 *
 * 2026-09 앱이 실제로 배포되면서 주 전환 목표가 이메일 등록에서 다운로드로
 * 바뀌어 App.tsx에서 내렸다(자리는 DownloadSection이 이어받았다).
 * 정식 출시 알림 폼으로 되살릴 수 있어 파일과 카피를 함께 남겨 둔다.
 */
export function BetaSection() {
  return (
    <section id="beta" className="bg-brand-ink py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-xs font-semibold tracking-[0.12em] text-brand-coral uppercase">
                {beta.eyebrow}
              </span>
              <span className="rounded-full border border-brand-coral/40 bg-brand-coral/15 px-3 py-1 text-[13px] font-semibold text-white">
                {beta.launchDate}
              </span>
            </div>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
              {beta.title}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-250">
              {beta.body}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-neutral-400">
              {beta.note}
            </p>
          </div>

          <div className="lg:pl-8">
            <BetaSignupForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
