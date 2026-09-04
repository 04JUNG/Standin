import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Clock3,
  Download,
  ExternalLink,
  Gift,
  Laptop,
  Layers,
  MessageSquareText,
  Monitor,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "../components/common/BrandMark";
import { Button } from "../components/common/Button";
import { Container } from "../components/common/Container";
import { FeedbackSurvey } from "../components/forms/FeedbackSurvey";
import { useLatestRelease } from "../hooks/useLatestRelease";

type OsType = "windows" | "macos";

type DownloadCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  url?: string;
  fileMeta?: string;
  recommended: boolean;
};

function DownloadCard({ icon: Icon, title, description, url, fileMeta, recommended }: DownloadCardProps) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-[26px] border bg-white p-6 shadow-card transition-all sm:p-7 ${
        recommended ? "border-brand-coral shadow-[0_18px_45px_rgba(255,107,87,0.12)]" : "border-neutral-250"
      }`}
    >
      {recommended && (
        <span className="absolute top-5 right-5 rounded-full bg-brand-coral/12 px-3 py-1 text-xs font-bold text-brand-coral-dark">
          현재 기기에 추천
        </span>
      )}
      <span className="inline-flex h-13 w-13 items-center justify-center rounded-[17px] bg-brand-ink text-white">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-brand-ink">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{description}</p>
      {fileMeta && <p className="mt-2 text-xs font-semibold text-neutral-500">{fileMeta}</p>}
      <div className="mt-auto pt-6">
        {url ? (
          <a
            href={url}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-coral px-5 font-bold text-brand-ink transition-all hover:-translate-y-0.5 hover:bg-[#ff806f]"
          >
            <Download size={18} aria-hidden="true" /> 설치 파일 다운로드
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-neutral-100 px-5 font-bold text-neutral-600"
          >
            <Download size={18} aria-hidden="true" /> 다운로드 링크 준비 중
          </button>
        )}
      </div>
    </article>
  );
}

const testSteps = [
  {
    icon: Monitor,
    title: "Clip Studio에서 러프 열기",
    body: "테스트할 콘티나 러프 이미지를 Clip Studio 화면에 띄워주세요.",
  },
  {
    icon: Camera,
    title: "Standin에서 화면 캡처",
    body: "Standin을 함께 실행하고 인물의 자세가 보이도록 캡처합니다.",
  },
  {
    icon: Layers,
    title: "포즈 선택 후 작업에 적용",
    body: "추천된 후보를 비교하고 원하는 3D 인형을 Clip Studio 작업에 활용합니다.",
  },
];

export function ClosedBetaPage() {
  const [preferredOs, setPreferredOs] = useState<OsType | null>(null);
  const { release, state: releaseState } = useLatestRelease();
  const windowsUrl = import.meta.env.VITE_WINDOWS_DOWNLOAD_URL?.trim() || release.windows.url;
  const macosUrl = import.meta.env.VITE_MACOS_DOWNLOAD_URL?.trim() || release.macos.url;

  useEffect(() => {
    const platform = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
    if (platform.includes("mac")) setPreferredOs("macos");
    else if (platform.includes("win")) setPreferredOs("windows");
  }, []);

  return (
    <div className="min-h-screen bg-brand-paper text-brand-ink">
      <a className="skip-link" href="#download">
        다운로드로 바로가기
      </a>

      <header className="sticky top-0 z-50 border-b border-neutral-250/70 bg-brand-paper/90 backdrop-blur-md">
        <Container wide>
          <div className="flex h-[72px] items-center justify-between gap-4">
            <a href="/" aria-label="Standin 홈으로" className="rounded-lg">
              <BrandMark className="text-xl" />
            </a>
            <nav aria-label="클로즈베타 메뉴" className="hidden items-center gap-1 md:flex">
              <a href="#download" className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-white hover:text-brand-ink">
                다운로드
              </a>
              <a href="#start" className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-white hover:text-brand-ink">
                시작 방법
              </a>
              <a href="#feedback" className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-white hover:text-brand-ink">
                피드백
              </a>
            </nav>
            <a href="/" className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-neutral-600 hover:bg-white hover:text-brand-ink">
              <ArrowLeft size={16} aria-hidden="true" /> 홈으로
            </a>
          </div>
        </Container>
      </header>

      <main>
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(142,216,232,0.22),transparent_32%),radial-gradient(circle_at_25%_70%,rgba(255,107,87,0.10),transparent_30%)]" />
          <Container>
            <div className="relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full border border-brand-coral/35 bg-brand-coral/10 px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-brand-coral-dark">
                    CLOSED BETA · OPEN
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-250 bg-white/75 px-3.5 py-1.5 text-xs font-bold text-neutral-600">
                    <CalendarDays size={14} className="text-brand-coral-dark" aria-hidden="true" /> 2026. 09. 04 — 09. 17
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-250 bg-white/75 px-3.5 py-1.5 text-xs font-bold text-neutral-600">
                    <Clock3 size={14} className="text-brand-coral-dark" aria-hidden="true" /> 약 20분 소요
                  </span>
                </div>
                <h1 className="mt-7 text-[clamp(1.5rem,7vw,3rem)] leading-[1.15] font-bold tracking-[-0.05em] text-brand-ink">
                  Standin을 써보고
                  <br />무료 이용 혜택도 받아가세요.
                </h1>
                <div className="mt-7 inline-flex max-w-full items-center gap-3 rounded-2xl border border-brand-coral/20 bg-white/75 px-4 py-3 shadow-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-coral/12 text-brand-coral-dark">
                    <Gift size={18} aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-snug text-neutral-600 sm:text-[15px]">
                    화면 2장과 피드백 제출 시 <strong className="font-bold text-brand-ink">정식 출시 후 1개월 무료 이용</strong>
                  </p>
                </div>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                  설치부터 한 컷 테스트, 피드백 제출까지 이 페이지에서 한 번에 진행됩니다. 테스트 후 화면 2장과 피드백을 남겨주세요.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button as="a" href="#download" size="lg">
                    테스트 시작하기 <ArrowDown size={18} aria-hidden="true" />
                  </Button>
                  <Button as="a" href="#start" variant="secondary" size="lg">
                    진행 순서 보기
                  </Button>
                </div>
              </div>

              <aside className="rounded-[30px] border border-neutral-250 bg-white/85 p-7 shadow-float backdrop-blur sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">TEST FLOW</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-brand-ink">테스트 진행 방법</h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-sky/20 px-3 py-1 text-xs font-bold text-brand-ink">3단계</span>
                </div>
                <ol className="mt-7 space-y-6">
                  {[
                    ["01", "설치 파일 받기", "운영체제에 맞는 파일을 받아 실행합니다."],
                    ["02", "한 컷 바로 테스트", "Clip Studio와 Standin으로 실제 러프를 확인합니다."],
                    ["03", "사용 직후 피드백", "같은 페이지 아래에서 경험을 바로 제출합니다."],
                  ].map(([number, title, body]) => (
                    <li key={number} className="flex gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-brand-ink text-xs font-bold text-white">
                        {number}
                      </span>
                      <div>
                        <h2 className="font-bold text-brand-ink">{title}</h2>
                        <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </Container>
        </section>

        <section id="download" className="scroll-mt-24 border-y border-neutral-250 bg-white/45 py-20 sm:py-28">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">01 · DOWNLOAD</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-brand-ink sm:text-5xl">사용할 운영체제를 선택하세요.</h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                설치를 마친 뒤 이 페이지로 돌아오면 바로 아래에서 테스트 순서를 확인할 수 있습니다.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
              <DownloadCard
                icon={Monitor}
                title="Windows용"
                description="Windows에서 Standin을 설치하고 실행합니다."
                url={windowsUrl}
                fileMeta={`v${release.version} · ${(release.windows.sizeBytes / 1_000_000).toFixed(1)} MB`}
                recommended={preferredOs === "windows"}
              />
              <DownloadCard
                icon={Laptop}
                title="macOS용"
                description="macOS에서 Standin을 설치하고 실행합니다."
                url={macosUrl}
                fileMeta={`v${release.version} · ${(release.macos.sizeBytes / 1_000_000).toFixed(1)} MB`}
                recommended={preferredOs === "macos"}
              />
            </div>
            <div className="mx-auto mt-5 flex max-w-4xl flex-col gap-4 rounded-[20px] border border-brand-coral/30 bg-brand-coral/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white text-brand-coral-dark shadow-sm">
                  <ShieldAlert size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-brand-ink">Windows의 PC 보호 화면이 나타나도 정상입니다.</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    아직 배포 초기라 Windows에서 경고가 표시될 수 있습니다. 아래 순서로 설치를 계속해 주세요.
                  </p>
                </div>
              </div>
              <ol className="flex shrink-0 items-center gap-2 text-sm font-bold text-brand-ink" aria-label="Windows 보호 화면 실행 순서">
                <li className="rounded-full border border-brand-coral/25 bg-white px-3.5 py-2">1. 추가 정보</li>
                <li className="text-brand-coral-dark" aria-hidden="true">→</li>
                <li className="rounded-full bg-brand-ink px-3.5 py-2 text-white">2. 실행</li>
              </ol>
            </div>
            {releaseState === "stale" && (
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-neutral-600">
                최신 버전을 확인하지 못해 마지막으로 확인된 설치 파일을 안내하고 있습니다.
              </p>
            )}
          </Container>
        </section>

        <section id="start" className="scroll-mt-24 bg-brand-ink py-20 text-white sm:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-brand-coral">02 · START TEST</p>
                <h2 className="mt-3 text-3xl leading-tight font-bold tracking-[-0.04em] sm:text-5xl">Clip Studio와 Standin을 함께 켜고 시작하세요.</h2>
                <p className="mt-5 text-lg leading-relaxed text-neutral-250">
                  별도의 연습용 작업을 만들 필요 없이, 지금 작업 중인 러프나 테스트 이미지를 한 장 준비하면 됩니다.
                </p>
                <a href="#feedback" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-sky hover:text-white">
                  테스트 후 설문으로 이동 <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
              <div className="overflow-hidden rounded-[26px] border border-white/10 bg-neutral-950 shadow-float">
                <video
                  className="aspect-video w-full object-cover"
                  src="/assets/videos/input-demo-webtoon-v5.mp4"
                  poster="/assets/videos/input-demo-webtoon-v5-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Clip Studio에서 Standin으로 화면을 캡처하는 사용 예시"
                />
              </div>
            </div>

            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {testSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="rounded-[22px] border border-white/10 bg-white/7 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand-coral text-brand-ink">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.12em] text-neutral-400">STEP 0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-250">{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </Container>
        </section>

        <section id="feedback" className="scroll-mt-20 pt-20 [overflow-anchor:none] sm:pt-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">03 · FEEDBACK</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-brand-ink sm:text-5xl">사용한 직후, 경험을 남겨주세요.</h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                기존에 만든 Standin 피드백 설문이 아래에서 바로 이어집니다. 작성 중인 내용은 이 브라우저에 임시 저장됩니다.
              </p>
            </div>
          </Container>
          <div className="mt-4">
            <FeedbackSurvey embedded />
          </div>
        </section>
      </main>

      <a
        href="#feedback"
        className="fixed right-4 bottom-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-coral px-4 text-sm font-bold text-brand-ink shadow-[0_14px_34px_rgba(21,34,56,0.22)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6 sm:min-h-12 sm:px-5 sm:text-base"
      >
        <MessageSquareText size={18} aria-hidden="true" />
        <span className="sm:hidden">피드백</span>
        <span className="hidden sm:inline">피드백 작성</span>
      </a>

      <footer className="border-t border-neutral-250 bg-white/45 py-10">
        <Container wide>
          <div className="flex flex-col gap-5 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
            <BrandMark className="text-xl" />
            <div className="flex flex-wrap gap-5">
              <a href="https://open.kakao.com/o/sBq53ELi" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold hover:text-brand-coral-dark">
                설치·사용 도움 <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a href="/feedback/" className="font-semibold hover:text-brand-coral-dark">설문만 열기</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
