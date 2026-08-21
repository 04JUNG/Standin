import { Container } from "../common/Container";
import { MediaVideo } from "../common/MediaVideo";
import { flow } from "../../data/content";

export function ResultSection() {
  return (
    <section id="result" className="py-20 sm:py-24 lg:py-28">
      <Container wide>
        <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <MediaVideo
            src="/assets/videos/result-demo-rough-v1.mp4"
            poster="/assets/videos/result-demo-rough-v1-poster.jpg"
            ariaLabel="Standin이 찾은 3D 포즈를 Clip Studio 캔버스에 배치해 레이어로 생성하는 화면 녹화"
            aspect="aspect-[144/85]"
          />

          <div className="max-w-xl">
            <p className="eyebrow">{flow.result.eyebrow}</p>
            <h2 className="mt-4 text-[34px] leading-[1.15] font-bold tracking-tight text-brand-ink sm:text-[40px] lg:text-[46px]">
              {flow.result.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600 lg:text-xl">
              {flow.result.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
