import { Gift, ScanLine, SlidersHorizontal, TextSearch } from "lucide-react";
import { Container } from "../common/Container";
import { Downloads } from "../common/Downloads";
import { beta } from "../../data/content";

const updateIcons = [TextSearch, ScanLine, SlidersHorizontal];

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
                오픈베타 참여하기
              </span>
            </div>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
              {beta.title}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-250">
              {beta.body}
            </p>
            <div className="mt-6 flex max-w-lg items-center gap-3 rounded-2xl border border-brand-coral/35 bg-brand-coral/12 px-4 py-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-coral text-brand-ink">
                <Gift size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-coral">{beta.perkLabel}</p>
                <p className="mt-1 text-lg font-bold text-white">{beta.perk}</p>
                <p className="mt-1 text-xs text-neutral-250">사전등록·설문 참여 여부와 관계없이 드려요.</p>
              </div>
            </div>
            <div className="survey-reward mt-4 max-w-lg">
              <div className="survey-reward__heading">
                <span>별도 설문 이벤트</span><span>총 10명</span>
              </div>
              <div className="survey-reward__main">
                <img src="/assets/open-beta/baemin-giftcard-10000.jpg" width="400" height="400" loading="lazy" alt="배달의민족 모바일 상품권 1만원권" />
                <div>
                  <h3>써본 이야기를 들려주세요.</h3>
                  <p className="survey-reward__prize">배달의민족 상품권<br /><strong>10,000원 × 10명</strong></p>
                </div>
              </div>
              <dl className="survey-reward__details">
                <div><dt>응모 기간</dt><dd>2026.10.21–11.11</dd></div>
                <div><dt>참여 방법</dt><dd>설문 작성 + 사용 화면 스크린샷 제출</dd></div>
                <div><dt>선정 방식</dt><dd>추첨 5명 + 정성 후기 5명<br /><small>열심히 사용하고 정성껏 후기를 남겨주신 분 중 5명을 선정해요.</small></dd></div>
              </dl>
              <p className="survey-reward__notice"><a href="/feedback/" className="underline underline-offset-4">사용 후기 설문 작성하기</a> · 선정·당첨 발표 일정은 이 페이지에서 안내합니다. 경품은 모바일 상품권으로 발송됩니다.</p>
            </div>
            <p className="mt-8 text-sm font-semibold text-white">{beta.updatesLabel}</p>
            <ul className="mt-3 grid max-w-lg gap-3">
              {beta.updates.map((item, index) => {
                const Icon = updateIcons[index];
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white/10 text-brand-coral">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[12px] font-semibold ${
                            item.upcoming
                              ? "border-white/20 text-neutral-250"
                              : "border-brand-coral/40 bg-brand-coral/15 text-white"
                          }`}
                        >
                          {item.upcoming ? beta.badges.upcoming : beta.badges.added}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-250">{item.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-neutral-400">
              {beta.note}
            </p>
          </div>

          <div className="lg:pl-8">
            <Downloads />
          </div>
        </div>
      </Container>
    </section>
  );
}
