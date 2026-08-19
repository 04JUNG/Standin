import { Container } from "../common/Container";
import { MediaVideo } from "../common/MediaVideo";
import { flow } from "../../data/content";

export function InputSection() {
  return (
    <section id="input" className="border-y border-neutral-250 bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MediaVideo
            src="/assets/videos/input-demo.mp4"
            poster="/assets/videos/input-demo-poster.jpg"
            label={flow.input.mediaLabel}
            ariaLabel="Clip Studio에서 러프 이미지를 Standin에 입력하는 화면 녹화"
          />

          <div className="max-w-lg">
            <p className="eyebrow">{flow.input.eyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-brand-ink sm:text-4xl">
              {flow.input.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">
              {flow.input.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
