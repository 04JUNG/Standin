import { ArrowRight, Download, MessageSquareText, Play } from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../common/Button";
import { beta } from "../../data/content";

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

          <div className="rounded-[28px] border border-white/12 bg-white/7 p-5 shadow-float sm:p-7 lg:ml-8">
            <ol className="grid gap-3">
              {[
                { icon: Download, title: "설치 파일 다운로드", body: "Windows 또는 macOS용 파일을 선택합니다." },
                { icon: Play, title: "Clip Studio와 Standin 실행", body: "안내 순서에 따라 러프를 불러오고 포즈를 확인합니다." },
                { icon: MessageSquareText, title: "사용 직후 피드백 작성", body: "같은 페이지 하단에서 경험을 바로 남길 수 있습니다." },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex items-start gap-4 rounded-[18px] bg-white/8 p-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-brand-coral text-brand-ink">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-bold tracking-[0.1em] text-brand-sky">0{index + 1}</p>
                      <h3 className="mt-0.5 font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-250">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <Button as="a" href="/closed-beta/" size="lg" className="mt-5 w-full">
              클로즈베타 시작하기 <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
