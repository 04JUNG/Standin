import { Container } from "../common/Container";
import { PoseSearchVideo } from "../demo/PoseSearchVideo";
import { flow } from "../../data/content";

export function ProcessSection() {
  return (
    <section id="process" className="bg-neutral-100 py-20 sm:py-24 lg:py-28">
      <Container wide>
        <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="eyebrow">{flow.process.eyebrow}</p>
            <h2 className="mt-4 text-[34px] leading-[1.15] font-bold tracking-tight text-brand-ink sm:text-[40px] lg:text-[46px]">
              {flow.process.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {flow.process.body}
            </p>
            <ol className="mt-7 flex flex-wrap gap-2" aria-label="Standin 처리 순서">
              {flow.process.steps.map((step, index) => (
                <li
                  key={step}
                  className="rounded-full border border-neutral-250 bg-white px-4 py-2 text-[15px] font-medium text-neutral-800 lg:px-5 lg:py-2.5 lg:text-base"
                >
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>

          <PoseSearchVideo
            label={flow.process.mediaLabel}
            ariaLabel="클립스튜디오의 배구 러프를 분석해 서로 다른 3D 자세 후보 다섯 개를 비교하고 가장 가까운 포즈를 선택하는 데모"
          />
        </div>
      </Container>
    </section>
  );
}
