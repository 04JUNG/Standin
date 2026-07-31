export type PoseId = "side" | "lean" | "reach" | "duo" | "sit";

export type PoseCandidate = {
  id: PoseId;
  title: string;
  tags: string[];
  /** SVG 마네킹 포즈 키 (실제 3D/이미지 에셋 확정 전 대체 비주얼) */
  imageAlt: string;
  confidence?: "high" | "medium" | "low";
};

export type WorkflowStep = {
  id: string;
  step: number;
  title: string;
  description: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type BetaRole = "" | "artist" | "studio" | "assistant" | "other";

export type BetaFormValues = {
  email: string;
  role: BetaRole;
  consent: boolean;
};

export type SubmitState = "idle" | "submitting" | "success" | "error";

export type SignupFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  displayName: string;
  consent: boolean;
};
