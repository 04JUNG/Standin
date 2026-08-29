import type { ReactNode } from "react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { Reveal } from "../common/Reveal";
import { guide } from "../../data/content";
import type { GuideStepId } from "../../types/landing";
import { ConsentScreen } from "../guide/screens/ConsentScreen";
import { HomeScreen } from "../guide/screens/HomeScreen";
import { CandidatesScreen } from "../guide/screens/CandidatesScreen";
import { ReviewScreen } from "../guide/screens/ReviewScreen";
import { SaveScreen } from "../guide/screens/SaveScreen";

const screens: Record<GuideStepId, () => ReactNode> = {
  install: ConsentScreen,
  input: HomeScreen,
  candidates: CandidatesScreen,
  review: ReviewScreen,
  save: SaveScreen,
};

/**
 * 다섯 단계를 세로로 쌓는다.
 *
 * 탭이나 스테퍼로 접지 않는 이유: 이 섹션의 목적이 "설치하면 여기까지 간다"를
 * 한눈에 보여주는 것이라, 다섯 중 넷을 숨기면 목적과 반대가 된다. 모든 단계가
 * 문서에 그대로 있어야 검색·순차 읽기·인쇄도 자연스럽다.
 */
export function GuideSection() {
  return (
    <section id="guide" className="bg-neutral-100 py-20 sm:py-24 lg:py-28">
      <Container wide>
        <SectionHeading
          eyebrow={guide.eyebrow}
          title={guide.title}
          description={guide.description}
          align="center"
        />

        <ol className="mt-14 flex list-none flex-col gap-16 p-0 lg:gap-24">
          {guide.steps.map((step, index) => {
            const Screen = screens[step.id];
            return (
              <li key={step.id}>
                <Reveal delay={index === 0 ? 0 : 60}>
                  <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
                    <div>
                      <span className="guide-step__index">{step.step}</span>
                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-lg leading-relaxed text-neutral-800">
                        {step.description}
                      </p>
                      {step.notes && (
                        <ul className="mt-5 space-y-2">
                          {step.notes.map((note) => (
                            <li
                              key={note}
                              className="flex gap-2.5 text-sm leading-relaxed text-neutral-600"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral"
                              />
                              {note}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <figure className="guide-mock">
                      {/*
                        목업은 옆의 제목·설명·보충이 이미 산문으로 전달하는 내용을
                        시각적으로 보강할 뿐이라 보조기기에서는 건너뛴다.
                        재현본이라는 사실은 aria-hidden이 아닌 캡션이 알린다.
                      */}
                      <div aria-hidden="true">
                        <Screen />
                      </div>
                      <figcaption className="guide-mock__caption">
                        {step.caption}
                      </figcaption>
                    </figure>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <p className="mt-16 text-center text-base leading-relaxed text-neutral-600">
          {guide.closing}
        </p>
      </Container>
    </section>
  );
}
