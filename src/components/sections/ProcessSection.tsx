import { Container } from "../common/Container";
import { MediaPlaceholder } from "../common/MediaPlaceholder";
import { flow } from "../../data/content";

export function ProcessSection() {
  return (
    <section id="process" className="bg-neutral-100 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-lg">
            <p className="eyebrow">{flow.process.eyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-brand-ink sm:text-4xl">
              {flow.process.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">
              {flow.process.body}
            </p>
            <ol className="mt-7 flex flex-wrap gap-2" aria-label="Standin 처리 순서">
              {flow.process.steps.map((step, index) => (
                <li
                  key={step}
                  className="rounded-full border border-neutral-250 bg-white px-4 py-2 text-sm font-medium text-neutral-800"
                >
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>

          <MediaPlaceholder
            label={flow.process.mediaLabel}
            ariaLabel="Standin이 비슷한 3D 자세를 찾는 장면이 들어갈 빈 영역"
          />
        </div>
      </Container>
    </section>
  );
}
