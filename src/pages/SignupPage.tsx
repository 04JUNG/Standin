import { Container } from "../components/common/Container";
import { Footer } from "../components/layout/Footer";
import { SignupForm } from "../components/forms/SignupForm";
import { BrandMark } from "../components/common/BrandMark";
import { signup } from "../data/content";

/**
 * 가입 페이지(/signup). 데스크톱 앱의 "웹에서 계정 만들기"가 여는 문서다.
 *
 * 랜딩의 Header는 재사용하지 않는다 — nav가 전부 in-page hash라 다른 문서에서
 * 가리킬 대상이 없고, 활성 섹션 추적도 여기선 의미가 없다. 로고만 있는
 * 얇은 헤더가 인증 성격 페이지에 더 맞다.
 */
export function SignupPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="border-b border-neutral-250/70 bg-brand-paper">
        <Container wide>
          <div className="flex h-[72px] items-center">
            <a
              href="/"
              className="rounded-lg"
              aria-label="Standin 홈으로"
            >
              <BrandMark className="text-xl" />
            </a>
          </div>
        </Container>
      </header>

      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-[440px]">
            <p className="eyebrow">{signup.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              {signup.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {signup.body}
            </p>

            <div className="mt-8">
              <SignupForm />
            </div>

            <p className="mt-6 text-center text-[14px] text-neutral-600">
              {signup.hasAccountPrefix} {signup.hasAccountBody}
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
