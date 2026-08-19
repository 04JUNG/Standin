import { Container } from "../common/Container";
import { MediaVideo } from "../common/MediaVideo";
import { flow } from "../../data/content";

export function ResultSection() {
  return (
    <section id="result" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MediaVideo
            src="/assets/videos/result-demo.mp4"
            poster="/assets/videos/result-demo-poster.jpg"
            label={flow.result.mediaLabel}
            ariaLabel="Standin이 찾은 3D 포즈를 Clip Studio 캔버스에 배치해 레이어로 생성하는 화면 녹화"
            aspect="aspect-[144/85]"
          />

          <div className="max-w-lg">
            <p className="eyebrow">{flow.result.eyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-brand-ink sm:text-4xl">
              {flow.result.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">
              {flow.result.body}
            </p>
            <p className="mt-6 border-l-2 border-brand-coral pl-4 text-sm leading-relaxed text-neutral-600">
              {flow.result.note}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
