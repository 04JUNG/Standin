import { Container } from "../common/Container";
import { MediaVideo } from "../common/MediaVideo";
import { flow } from "../../data/content";

export function InputSection() {
  return (
    <section id="input" className="border-y border-neutral-250 bg-white py-20 sm:py-24 lg:py-28">
      <Container wide>
        <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <MediaVideo
            src="/assets/videos/input-demo-webtoon-v5.mp4"
            poster="/assets/videos/input-demo-webtoon-v5-poster.jpg"
            ariaLabel="Clip Studio에서 러프 이미지를 Standin에 입력하는 화면 녹화"
          />

          <div className="max-w-xl">
            <p className="eyebrow">{flow.input.eyebrow}</p>
            <h2 className="mt-4 text-[34px] leading-[1.15] font-bold tracking-tight text-brand-ink sm:text-[40px] lg:text-[46px]">
              {flow.input.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {flow.input.body}
            </p>
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="입력 방법">
              {flow.input.modes.map((mode) => (
                <li
                  key={mode}
                  className="rounded-full border border-neutral-250 bg-neutral-100 px-4 py-2 text-[15px] font-medium text-neutral-800 lg:px-5 lg:py-2.5 lg:text-base"
                >
                  {mode}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
