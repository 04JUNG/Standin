import { Check, Maximize2, Minus, MousePointer2, RotateCcw } from "lucide-react";

type PoseSearchVideoProps = {
  label?: string;
  ariaLabel?: string;
};

const candidates = [
  { variant: "variant-1", match: "보정 필요" },
  { variant: "variant-2", match: "유사" },
  { variant: "variant-3", match: "유사" },
  { variant: "variant-4", match: "유사" },
] as const;

export function PoseSearchVideo({ label, ariaLabel }: PoseSearchVideoProps) {
  return (
    <figure className="pose-reference-demo">
      <div
        className="pose-reference-demo__screen"
        role="img"
        aria-label={
          ariaLabel ??
          "클립스튜디오의 배구 러프 위에서 서로 다른 3D 포즈 후보 다섯 개를 비교하고 가장 가까운 자세를 선택하는 짧은 데모"
        }
      >
        <img
          className="pose-reference-demo__workspace"
          src="/assets/workspace/clip-studio-volleyball-workflow.png"
          alt=""
          aria-hidden="true"
        />

        <div className="pose-reference-demo__loading" aria-hidden="true">
          <span />
          러프를 분석하는 중
        </div>

        <section className="pose-candidate-window" aria-hidden="true">
          <header className="pose-candidate-window__header">
            <div>
              <strong>포즈 후보</strong>
              <span>1 / 1</span>
            </div>
            <div className="pose-candidate-window__window-actions">
              <Minus size={11} />
              <Maximize2 size={10} />
            </div>
          </header>

          <div className="pose-candidate-window__cards">
            {candidates.map((candidate, index) => (
              <article
                className={`pose-reference-card ${candidate.variant}`}
                key={candidate.variant}
              >
                <div className="pose-reference-card__image">
                  <span className="pose-reference-card__sprite">
                    <img
                      src="/assets/process/volleyball-pose-variants-v2-sheet.png"
                      alt=""
                    />
                  </span>
                  <span className="pose-reference-card__number">0{index + 1}</span>
                  <span className="pose-reference-card__check">
                    <Check size={8} strokeWidth={3} />
                  </span>
                </div>
                <div className="pose-reference-card__info">
                  <span>{candidate.match}</span>
                  <small>3D 인체 · 동적 포즈</small>
                </div>
              </article>
            ))}

            <article className="pose-reference-card is-answer">
              <div className="pose-reference-card__image">
                <img
                  src="/assets/hero-poses/pose-showcase-volleyball-mannequin-cutout.png"
                  alt=""
                />
                <span className="pose-reference-card__number">05</span>
                <span className="pose-reference-card__check">
                  <Check size={8} strokeWidth={3} />
                </span>
              </div>
              <div className="pose-reference-card__info">
                <span>높은 일치</span>
                <small>3D 인체 · 추천 포즈</small>
              </div>
            </article>
          </div>

          <footer className="pose-candidate-window__footer">
            <button type="button" tabIndex={-1}>
              <RotateCcw size={10} /> 다시 검색 <kbd>R</kbd>
            </button>
            <button type="button" className="is-primary" tabIndex={-1}>
              이 포즈 사용 <kbd>Ctrl</kbd><kbd>Enter</kbd>
            </button>
          </footer>

          <MousePointer2
            className="pose-reference-demo__cursor"
            size={19}
            fill="white"
          />
        </section>

        <div className="pose-reference-demo__applied" aria-hidden="true">
          <Check size={12} strokeWidth={3} /> 배구 스파이크 포즈 선택 완료
        </div>
      </div>

      <figcaption>
        {label ?? "배구 러프와 가까운 3D 자세 5개를 비교하고 선택하는 약 5초 데모"}
      </figcaption>
    </figure>
  );
}
