// 랜딩페이지 카피 (docs/04_CONTENT_COPY.md) — JSX에 흩지 않고 한곳에서 관리
import type { WorkflowStep } from "../types/landing";

export const nav = {
  logo: "Standin",
  links: [
    { label: "작동 방식", href: "#workflow" },
    { label: "왜 Standin인가", href: "#benefits" },
    { label: "클립스튜디오 연결", href: "#clip-studio" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "베타 대기 등록",
  ctaHref: "#beta",
};

export const hero = {
  eyebrow: "WEBTOON 3D POSE ASSISTANT",
  title: "콘티 속 포즈를,\n그릴 수 있는 3D 시작점으로",
  body: "Standin은 러프 콘티에서 인물과 포즈의 단서를 읽고, 가까운 3D 인체 후보를 제안합니다. 원하는 후보를 직접 선택하고 조정한 뒤, 익숙한 클립스튜디오 작업으로 이어가세요.",
  primaryCta: "베타 대기 등록",
  secondaryCta: "작동 방식 보기",
  assistiveLine: "완성은 작가가. 시작점은 Standin이.",
  demoLabel: "제품 흐름 예시",
};

export const demo = {
  title: "정답 하나가 아니라, 고쳐 쓸 수 있는 후보부터",
  description:
    "Standin은 포즈를 임의로 확정하지 않습니다. 콘티와 가까운 후보를 보여주고, 작가가 연출에 맞는 시작점을 고릅니다.",
  steps: ["러프 콘티", "인물·포즈 분석", "후보 검색", "작가 선택", "3D 조정"],
  selectionBadge: "선택한 후보",
  guidance:
    "Standin이 포즈를 확정하지 않습니다. 가장 가까운 후보를 비교해 직접 선택하세요.",
  footnote:
    "실제 결과는 콘티의 표현 정도와 포즈 라이브러리에 따라 달라질 수 있습니다.",
  startButton: "선택한 포즈로 시작하기",
};

export const problem = {
  eyebrow: "BEFORE STANDIN",
  title: "포즈를 그리기 전에, 포즈를 만드는 시간이 너무 길었습니다.",
  intro:
    "복잡한 인체를 안정적으로 그리기 위해 3D를 열었지만, 실제 밑그림을 시작하기 전까지 또 다른 준비 작업이 이어집니다.",
  cards: [
    {
      title: "빈 인형에서 시작",
      body: "컷마다 관절과 몸의 방향을 처음부터 잡아야 합니다.",
    },
    {
      title: "맞는 소재를 직접 탐색",
      body: "많은 포즈 중 콘티와 가까운 것을 하나씩 찾아 비교합니다.",
    },
    {
      title: "작화 전 반복 배치",
      body: "인물 위치와 카메라를 맞춘 뒤에야 실제 선을 그리기 시작합니다.",
    },
  ],
  closing: "Standin은 이 준비 과정의 첫 단계를 더 짧게 만듭니다.",
};

export const workflow: {
  eyebrow: string;
  title: string;
  steps: WorkflowStep[];
} = {
  eyebrow: "HOW IT WORKS",
  title: "콘티에서 클립스튜디오까지, 네 단계로",
  steps: [
    {
      id: "upload",
      step: 1,
      title: "콘티를 올립니다",
      description: "인물의 위치와 대략적인 움직임이 담긴 러프를 입력합니다.",
    },
    {
      id: "analyze",
      step: 2,
      title: "필요한 컷을 분석합니다",
      description:
        "전신·반신 컷을 중심으로 인물 수, 위치와 포즈 단서를 파악합니다.",
    },
    {
      id: "select",
      step: 3,
      title: "가까운 후보를 고릅니다",
      description:
        "검색된 3D 포즈를 비교하고, 연출에 가장 가까운 시작점을 선택합니다.",
    },
    {
      id: "export",
      step: 4,
      title: "조정하고 이어 그립니다",
      description:
        "필요한 관절과 구도만 손본 뒤 기존 작화 환경에서 밑그림을 계속합니다.",
    },
  ],
};

export const benefits = {
  eyebrow: "BUILT AROUND THE ARTIST",
  title: "작가의 판단은 남기고, 반복 작업만 줄입니다.",
  cards: [
    {
      title: "후보에서 시작",
      body: "빈 인형보다 빠르고, 자동 완성보다 유연한 시작점을 제공합니다.",
    },
    {
      title: "필요한 컷에 집중",
      body: "전신과 반신처럼 3D 인체가 실제로 도움이 되는 컷부터 처리합니다.",
    },
    {
      title: "기존 작업 흐름 유지",
      body: "새로운 작화 방식을 강요하지 않고 클립스튜디오 작업으로 연결합니다.",
    },
    {
      title: "틀리면 고칠 수 있게",
      body: "애매한 결과를 확정하지 않고, 후보 선택과 수동 조정으로 되돌아갈 수 있습니다.",
    },
  ],
};

export const principles = {
  eyebrow: "CREATOR IN CONTROL",
  title: "자동화보다 중요한 것은, 작가가 계속 통제할 수 있는가입니다.",
  aiSideLabel: "Standin이 돕는 일",
  aiSide: [
    "인물 수와 대략적 위치 파악",
    "포즈와 장면의 단서 분석",
    "가까운 3D 포즈 후보 검색",
    "비슷한 후보를 보기 쉽게 정리",
  ],
  artistSideLabel: "작가가 결정하는 일",
  artistSide: [
    "최종 포즈 선택",
    "인물의 앞뒤와 거리",
    "관절과 카메라의 미세 조정",
    "최종 선화와 연출",
  ],
  scopeTitle: "현재 집중하는 범위",
  scopeBadges: [
    "전신·반신 우선",
    "1~2인 컷 우선",
    "얼굴 클로즈업은 스킵 가능",
    "복잡한 가림은 수동 보정",
  ],
  scopeNote:
    "모든 컷을 억지로 처리하기보다, 3D가 작업 부담을 실제로 줄이는 장면에 집중합니다.",
};

export const clipStudio = {
  eyebrow: "KEEP YOUR WORKFLOW",
  title: "익숙한 작업 환경을 바꾸지 마세요.",
  body: "Standin은 클립스튜디오를 대체하는 작화 앱이 아닙니다. 콘티 분석과 3D 포즈 선택을 마친 뒤 결과를 내보내고, 선화와 최종 작화는 지금 쓰는 환경에서 계속합니다.",
  flowLabels: [
    "Standin에서 후보 선택",
    "3D 결과 내보내기",
    "클립스튜디오에서 이어 그리기",
  ],
  disclaimer:
    "Standin은 클립스튜디오의 공식 플러그인 또는 공식 제휴 서비스가 아닙니다.",
};

export const beta = {
  eyebrow: "EARLY ACCESS",
  title: "다음 컷은, 빈 인형이 아니라 가까운 포즈에서 시작하세요.",
  body: "Standin의 초기 테스트에 참여하고, 실제 웹툰 작업에 필요한 포즈와 기능을 함께 만들어 주세요.",
  emailLabel: "이메일",
  emailPlaceholder: "artist@example.com",
  roleLabel: "작업 형태",
  roleOptions: [
    { value: "", label: "선택해 주세요" },
    { value: "artist", label: "개인 웹툰 작가" },
    { value: "studio", label: "웹툰 스튜디오" },
    { value: "assistant", label: "어시스턴트" },
    { value: "other", label: "기타" },
  ],
  consent: "베타 소식과 테스트 안내를 이메일로 받는 데 동의합니다.",
  cta: "베타 대기 등록",
  success: "등록되었습니다. 테스트 소식이 준비되면 안내드릴게요.",
  demoNotice:
    "현재 폼은 화면 시연용입니다. 실제 신청 수집 기능을 연결한 뒤 공개해 주세요.",
};

export const footer = {
  tagline: "콘티와 밑그림 사이, 더 나은 3D 시작점.",
  links: [
    { label: "작동 방식", href: "#workflow" },
    { label: "제품 원칙", href: "#principles" },
    { label: "FAQ", href: "#faq" },
    // 개인정보 처리방침: 실제 문서 준비 전까지 비활성 처리
    { label: "개인정보 처리방침", href: null },
  ],
  copyright: "© 2026 Standin. All rights reserved.",
};
