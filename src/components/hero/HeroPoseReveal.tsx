import {
  ArrowLeft,
  ArrowRight,
  MousePointer2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { HeroWorkspaceDemo } from "./HeroWorkspaceDemo";

type PoseExample = {
  id: string;
  category: string;
  title: string;
  description: string;
  rough: string;
  mannequin: string;
  mannequinCutout: string;
};

type RevealLens = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  size: number;
};

const poseExamples: PoseExample[] = [
  {
    id: "action",
    category: "ACTION",
    title: "낮은 전방 런지",
    description: "뻗은 손의 원근감과 몸통 회전이 강조되는 액션 포즈",
    rough: "/assets/hero-poses/pose-showcase-action-rough-cutout.png",
    mannequin: "/assets/hero-poses/pose-showcase-action-mannequin.png",
    mannequinCutout: "/assets/hero-poses/pose-showcase-action-mannequin-cutout.png",
  },
  {
    id: "run",
    category: "RUN",
    title: "스타트 대시",
    description: "바닥을 짚고 앞으로 튀어나가는 순간의 달리기 포즈",
    rough: "/assets/hero-poses/pose-showcase-run-rough-cutout.png",
    mannequin: "/assets/hero-poses/pose-showcase-run-mannequin.png",
    mannequinCutout: "/assets/hero-poses/pose-showcase-run-mannequin-cutout.png",
  },
  {
    id: "spin",
    category: "DYNAMIC",
    title: "공중 회전",
    description: "팔다리가 교차하며 회전의 방향이 또렷하게 보이는 공중 포즈",
    rough: "/assets/hero-poses/pose-showcase-spin-rough-cutout.png",
    mannequin: "/assets/hero-poses/pose-showcase-spin-mannequin.png",
    mannequinCutout: "/assets/hero-poses/pose-showcase-spin-mannequin-cutout.png",
  },
  {
    id: "volleyball",
    category: "VOLLEYBALL",
    title: "배구 공중 동작",
    description: "허리를 뒤로 젖히고 두 팔을 펼친 역동적인 공중 포즈",
    rough: "/assets/hero-poses/pose-showcase-volleyball-rough-cutout.png",
    mannequin: "/assets/hero-poses/pose-showcase-volleyball-mannequin.png",
    mannequinCutout: "/assets/hero-poses/pose-showcase-volleyball-mannequin-cutout.png",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const POSE_IMAGE_ASPECT = 768 / 1024;
const ACTION_VISUAL_SCALE = 1.17;

export function HeroPoseReveal() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lens, setLens] = useState<RevealLens | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showFullResult, setShowFullResult] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);

  const activePose = poseExamples[activeIndex];
  const previousIndex =
    (activeIndex - 1 + poseExamples.length) % poseExamples.length;
  const nextIndex = (activeIndex + 1) % poseExamples.length;
  const previousPose = poseExamples[previousIndex];
  const nextPose = poseExamples[nextIndex];

  useEffect(() => {
    const query = window.matchMedia("(hover: none), (pointer: coarse)");
    const updatePointerMode = () => setIsCoarsePointer(query.matches);

    updatePointerMode();
    query.addEventListener("change", updatePointerMode);
    return () => query.removeEventListener("change", updatePointerMode);
  }, []);

  useEffect(() => {
    poseExamples.forEach((pose) => {
      const rough = new Image();
      const mannequin = new Image();
      rough.src = pose.rough;
      mannequin.src = pose.mannequin;
    });
  }, []);

  useEffect(() => {
    if (showWorkspace || isHovering || showFullResult) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % poseExamples.length);
      setLens(null);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isHovering, showFullResult, showWorkspace]);

  const updateLens = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !stageRef.current) return;

    const bounds = stageRef.current.getBoundingClientRect();
    const visualScale =
      activePose.id === "action" ? ACTION_VISUAL_SCALE : 1;
    const pointerX =
      (event.clientX - bounds.left - bounds.width / 2) / visualScale +
      bounds.width / 2;
    const pointerY =
      (event.clientY - bounds.top - bounds.height / 2) / visualScale +
      bounds.height / 2;
    const stageAspect = bounds.width / bounds.height;
    const imageWidth =
      stageAspect > POSE_IMAGE_ASPECT
        ? bounds.height * POSE_IMAGE_ASPECT
        : bounds.width;
    const imageHeight =
      stageAspect > POSE_IMAGE_ASPECT
        ? bounds.height
        : bounds.width / POSE_IMAGE_ASPECT;
    const imageLeft = (bounds.width - imageWidth) / 2;
    const imageTop = (bounds.height - imageHeight) / 2;
    const size =
      clamp(
      Math.min(bounds.width * 0.29, imageWidth * 0.7, imageHeight * 0.7),
      220,
      360,
      ) / visualScale;
    const visibleInsetX =
      (bounds.width - bounds.width / visualScale) / 2;
    const visibleInsetY =
      (bounds.height - bounds.height / visualScale) / 2;
    const minLeft = Math.max(imageLeft, visibleInsetX);
    const maxLeft = Math.min(
      imageLeft + imageWidth - size,
      bounds.width - visibleInsetX - size,
    );
    const minTop = Math.max(imageTop, visibleInsetY);
    const maxTop = Math.min(
      imageTop + imageHeight - size,
      bounds.height - visibleInsetY - size,
    );
    const left = clamp(
      pointerX - size / 2,
      minLeft,
      maxLeft,
    );
    const top = clamp(
      pointerY - size / 2,
      minTop,
      maxTop,
    );

    setLens({
      left,
      top,
      right: bounds.width - left - size,
      bottom: bounds.height - top - size,
      size,
    });
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    setHasInteracted(true);
    setIsHovering(true);
    setShowFullResult(false);
    updateLens(event);
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
    setLens(null);
  };

  const changePose = (nextIndex: number) => {
    setActiveIndex((nextIndex + poseExamples.length) % poseExamples.length);
    setShowFullResult(false);
    setLens(null);
    setShowWorkspace(false);
  };

  const handleStagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setHasInteracted(true);
    if (event.pointerType === "mouse" || showFullResult) {
      setShowWorkspace(true);
      return;
    }
    setShowFullResult(true);
  };

  const handleStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setHasInteracted(true);
      if (showFullResult) {
        setShowWorkspace(true);
      } else {
        setShowFullResult(true);
      }
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changePose(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      changePose(activeIndex + 1);
    }
  };

  const shouldShowDemoLens = !hasInteracted && !showFullResult;
  const shouldShowLens = isHovering || shouldShowDemoLens;

  const resultStyle: CSSProperties = showFullResult
    ? { clipPath: "inset(0 round 18px)" }
    : isHovering && lens
      ? {
          clipPath: `inset(${lens.top}px ${lens.right}px ${lens.bottom}px ${lens.left}px round 3px)`,
        }
      : shouldShowDemoLens
        ? { clipPath: "inset(24% 35% 24% 35% round 3px)" }
        : { clipPath: "inset(50% 50% 50% 50% round 3px)" };

  const lensStyle: CSSProperties | undefined =
    isHovering && lens
      ? {
          left: lens.left,
          top: lens.top,
          width: lens.size,
          height: lens.size,
        }
      : undefined;

  return (
    <div className="hero-pose" aria-labelledby="hero-pose-title">
      {showWorkspace ? (
        <>
          <div className="hero-pose__topline">
            <div>
              <span className="hero-pose__category">WORKFLOW</span>
              <h2 id="hero-pose-title" className="hero-pose__title">
                Clip Studio에서 이어서 작업
              </h2>
            </div>
            <p className="hero-pose__description">
              Standin에서 선택한 3D 포즈를 작화 캔버스로 가져오는 흐름
            </p>
          </div>
          <HeroWorkspaceDemo
            pose={activePose}
            onBack={() => setShowWorkspace(false)}
          />
        </>
      ) : (
        <>
          <div className="hero-pose__frame">
            <h1 className="hero-pose__wordmark" aria-label="Stand in">
              <span>Stand</span>
              <em>in</em>
            </h1>

            <button
              type="button"
              className="hero-pose__neighbor is-left"
              data-pose={previousPose.id}
              onClick={() => changePose(previousIndex)}
              aria-label={`${previousPose.title} 포즈로 이동`}
            >
              <img
                src={previousPose.rough}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </button>

            <div
              key={activePose.id}
              ref={stageRef}
              data-pose={activePose.id}
              className={`hero-pose__stage ${
                showFullResult ? "is-result-visible" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-pressed={showFullResult}
              aria-label={`${activePose.title}. 마우스를 움직여 3D 인형을 확인하고 클릭하면 작업 화면으로 이동합니다.`}
              onPointerEnter={handlePointerEnter}
              onPointerMove={updateLens}
              onPointerLeave={handlePointerLeave}
              onPointerUp={handleStagePointerUp}
              onKeyDown={handleStageKeyDown}
            >
              <div className="hero-pose__visual">
                <img
                  className="hero-pose__image hero-pose__rough"
                  src={activePose.rough}
                  alt={`${activePose.title}를 파란 선으로 그린 인체 러프`}
                  draggable={false}
                />
                <img
                  className="hero-pose__image hero-pose__result"
                  src={activePose.mannequin}
                  alt={`${activePose.title}와 같은 자세의 흰색 3D 인형`}
                  draggable={false}
                  style={resultStyle}
                />

                {shouldShowLens && !showFullResult && (
                  <span
                    className={`hero-pose__lens ${
                      shouldShowDemoLens ? "is-demo" : ""
                    }`}
                    style={lensStyle}
                    aria-hidden="true"
                  />
                )}
              </div>

              <span className="hero-pose__mode" aria-hidden="true">
                {showFullResult ? "3D 인형" : "러프"}
              </span>

              <span className="hero-pose__instruction">
                {showFullResult ? (
                  <>
                    <MousePointer2 size={15} /> 클릭해 작업 화면 열기
                  </>
                ) : (
                  <>
                    <MousePointer2 size={15} />
                    {isCoarsePointer
                      ? "눌러서 3D 포즈 확인"
                      : "마우스를 움직여 3D 포즈 확인"}
                  </>
                )}
              </span>
            </div>

            <button
              type="button"
              className="hero-pose__neighbor is-right"
              data-pose={nextPose.id}
              onClick={() => changePose(nextIndex)}
              aria-label={`${nextPose.title} 포즈로 이동`}
            >
              <img
                src={nextPose.rough}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </button>

            <button
              type="button"
              className="hero-pose__arrow is-left"
              onClick={() => changePose(activeIndex - 1)}
              aria-label="이전 포즈 보기"
            >
              <ArrowLeft size={21} />
            </button>
            <button
              type="button"
              className="hero-pose__arrow is-right"
              onClick={() => changePose(activeIndex + 1)}
              aria-label="다음 포즈 보기"
            >
              <ArrowRight size={21} />
            </button>

            <div
              className="hero-pose__meta is-compact"
              aria-live="polite"
            >
              <span className="hero-pose__category">{activePose.category}</span>
              <span id="hero-pose-title" className="sr-only">
                {activePose.title}
              </span>
              <p className="hero-pose__description">{activePose.description}</p>
            </div>
          </div>

          <div className="hero-pose__pagination" aria-label="포즈 예시 선택">
            {poseExamples.map((pose, index) => (
              <button
                key={pose.id}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => changePose(index)}
                aria-label={`${pose.title} 예시 보기`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {pose.category}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
