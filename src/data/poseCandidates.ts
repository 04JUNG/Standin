import type { PoseCandidate } from "../types/landing";

// docs/04_CONTENT_COPY.md 후보 라벨 예시.
// 유사도 퍼센트는 실제 모델 수치가 아니므로 표기하지 않는다(docs/03 §7).
export const poseCandidates: PoseCandidate[] = [
  {
    id: "side",
    title: "서 있는 인물 · 측면",
    tags: ["전신", "측면"],
    imageAlt: "측면으로 서 있는 3D 마네킹 포즈 후보",
    confidence: "high",
  },
  {
    id: "lean",
    title: "상체를 기울인 자세",
    tags: ["전신", "기울임"],
    imageAlt: "상체를 앞으로 기울인 3D 마네킹 포즈 후보",
    confidence: "high",
  },
  {
    id: "reach",
    title: "팔을 앞으로 뻗은 자세",
    tags: ["전신", "동작"],
    imageAlt: "한쪽 팔을 앞으로 뻗은 3D 마네킹 포즈 후보",
    confidence: "medium",
  },
  {
    id: "duo",
    title: "2인 마주 보기",
    tags: ["2인", "반신"],
    imageAlt: "두 인물이 마주 보는 3D 마네킹 포즈 후보",
    confidence: "low",
  },
  {
    id: "sit",
    title: "앉은 자세 · 로우 앵글",
    tags: ["앉음", "로우 앵글"],
    imageAlt: "로우 앵글에서 앉아 있는 3D 마네킹 포즈 후보",
    confidence: "medium",
  },
];
