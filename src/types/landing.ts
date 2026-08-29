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
  workStatus: "" | "active" | "occasional" | "not-now";
  clipStudioEdition: "" | "pro" | "ex" | "other" | "none";
  clipStudioVersion: "" | "1" | "2" | "3" | "4" | "5" | "unknown" | "none";
  mannequinExperience: "" | "often" | "sometimes" | "tried" | "none";
  source:
    | ""
    | "pd-network"
    | "ahart"
    | "webtoon-academy"
    | "bansa"
    | "x"
    | "postype"
    | "kakao"
    | "discord"
    | "tumblbug"
    | "bipa"
    | "pinterest"
    | "other";
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

export type GuideStepId =
  | "install"
  | "input"
  | "candidates"
  | "review"
  | "save";

export type GuideStep = {
  id: GuideStepId;
  step: number;
  title: string;
  description: string;
  /** 화면 재현 목업 아래 캡션. "재현 예시"임을 여기서 밝힌다. */
  caption: string;
  /** 화면에 드러나지 않는 보충 정보(단축키·제한·전제). */
  notes?: string[];
};

/** 푸터 링크. external이면 새 탭으로 연다. href가 null이면 준비 중 표시. */
export type FooterLink = {
  label: string;
  href: string | null;
  external?: boolean;
};
