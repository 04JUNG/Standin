// 랜딩페이지 카피 (docs/04_CONTENT_COPY.md) — JSX에 흩지 않고 한곳에서 관리
import type { WorkflowStep } from "../types/landing";

export const nav = {
  logo: "Standin",
  links: [
    { label: "이미지 입력", href: "#input" },
    { label: "처리 과정", href: "#process" },
    { label: "활용 결과", href: "#result" },
  ],
  launchDate: "9. 4. CLOSED BETA",
  cta: "클로즈베타 사전등록",
  ctaHref: "#beta",
};

export const hero = {
  eyebrow: "WEBTOON 3D POSE TOOL",
  title: "러프 이미지에서\n원하는 3D 포즈를 찾아보세요.",
  body: "그림 위에 마우스를 올려 Standin이 찾은 같은 자세의 3D 인형을 직접 비교해 보세요.",
  launchBadge: "2026. 9. 4. CLOSED BETA",
  primaryCta: "클로즈베타 사전등록",
  secondaryCta: "사용 과정 보기",
  assistiveLine: "스포츠·액션·공중 동작까지 네 가지 포즈 예시를 직접 확인할 수 있습니다.",
  mediaLabel: "실제 Standin 사용 영상 · 추후 삽입",
  demoLabel: "제품 사용 장면",
};

export const flow = {
  input: {
    eyebrow: "01 · INPUT",
    title: "러프나 참고 이미지를 넣으세요.",
    body: "인물의 자세가 보이는 콘티, 러프 또는 참고 이미지를 입력합니다. 별도의 복잡한 설정 없이 이미지 한 장으로 시작합니다.",
    mediaLabel: "이미지 입력 장면 · GIF 또는 짧은 영상 삽입 예정",
  },
  process: {
    eyebrow: "02 · STANDIN",
    title: "Standin이 비슷한 3D 자세를 찾습니다.",
    body: "이미지 속 인물의 자세를 바탕으로 가까운 3D 포즈를 찾아 보여줍니다. 결과를 하나로 확정하지 않고 직접 비교할 수 있게 제공합니다.",
    steps: ["이미지 확인", "비슷한 자세 검색", "결과 비교"],
    mediaLabel: "배구 러프와 3D 포즈 후보 5개를 비교하는 약 5초 데모",
  },
  result: {
    eyebrow: "03 · RESULT",
    title: "원하는 결과를 골라 Clip Studio에서 이어서 작업하세요.",
    body: "가까운 3D 인형을 선택하고 필요한 부분을 조정한 뒤, 내보낸 결과를 기존 작화 작업에 활용합니다.",
    mediaLabel: "Standin 결과와 Clip Studio 적용 장면 · 영상 또는 이미지 삽입 예정",
  },
};

export const demo = {
  title: "이미지에서 찾은 3D 자세를 직접 비교하세요.",
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
  eyebrow: "CLOSED BETA",
  launchDate: "2026. 9. 4. 시작",
  title: "Standin 클로즈베타를 먼저 사용해 보세요.",
  body: "2026년 9월 4일 클로즈베타를 시작합니다. 사전등록한 이메일로 참여 방법을 안내드립니다.",
  note: "가격이나 결제 정보는 받지 않습니다. 등록 정보는 클로즈베타 참여 안내에만 사용합니다.",
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
  workStatusLabel: "현재 웹툰·그림 작업 여부",
  workStatusOptions: [
    { value: "", label: "선택해 주세요" },
    { value: "active", label: "현재 작업 중" },
    { value: "occasional", label: "가끔 작업함" },
    { value: "not-now", label: "현재는 작업하지 않음" },
  ],
  clipStudioEditionLabel: "Clip Studio 제품",
  clipStudioEditionOptions: [
    { value: "", label: "선택해 주세요" },
    { value: "pro", label: "Clip Studio Paint PRO" },
    { value: "ex", label: "Clip Studio Paint EX" },
    { value: "other", label: "기타·제품 모름" },
    { value: "none", label: "사용하지 않음" },
  ],
  clipStudioVersionLabel: "Clip Studio 버전",
  clipStudioVersionOptions: [
    { value: "", label: "선택해 주세요" },
    { value: "1", label: "Ver. 1" },
    { value: "2", label: "Ver. 2" },
    { value: "3", label: "Ver. 3" },
    { value: "4", label: "Ver. 4" },
    { value: "5", label: "Ver. 5" },
    { value: "unknown", label: "버전 모름" },
    { value: "none", label: "사용하지 않음" },
  ],
  mannequinExperienceLabel: "3D 인형 사용 경험",
  mannequinExperienceOptions: [
    { value: "", label: "선택해 주세요" },
    { value: "often", label: "자주 사용함" },
    { value: "sometimes", label: "가끔 사용함" },
    { value: "tried", label: "사용해 본 적 있음" },
    { value: "none", label: "사용 경험 없음" },
  ],
  sourceLabel: "Standin을 알게 된 경로",
  sourceOptions: [
    { value: "", label: "선택해 주세요" },
    { value: "pd-network", label: "작가·PD 소개" },
    { value: "ahart", label: "에이하트" },
    { value: "bansa", label: "방사 네이버 카페" },
    { value: "x", label: "X(트위터)" },
    { value: "postype", label: "포스타입" },
    { value: "kakao", label: "카카오 오픈채팅" },
    { value: "discord", label: "디스코드" },
    { value: "tumblbug", label: "텀블벅" },
    { value: "bipa", label: "부산글로벌웹툰센터" },
    { value: "pinterest", label: "Pinterest" },
    { value: "other", label: "기타" },
  ],
  consent: "클로즈베타 일정과 참여 방법을 이메일로 받는 데 동의합니다.",
  cta: "클로즈베타 사전등록",
  success: "사전등록되었습니다. 클로즈베타 일정과 참여 방법을 이메일로 안내드릴게요.",
  demoSuccess: "입력 형식이 확인되었습니다. 실제 사전등록 수집 기능은 아직 연결되지 않았습니다.",
  demoNotice:
    "현재 폼은 화면 시연용입니다. 실제 신청 수집 기능을 연결한 뒤 공개해 주세요.",
};

export const footer = {
  tagline: "원하는 자세를 찾고 3D 인형으로 만드는 웹툰 작업 보조 도구.",
  // 푸터는 /signup 에서도 렌더되므로 hash를 루트 기준(`/#`)으로 둔다.
  // 인덱스에서는 같은 문서 안의 hash 이동이라 동작이 그대로다.
  links: [
    { label: "이미지 입력", href: "/#input" },
    { label: "처리 과정", href: "/#process" },
    { label: "활용 결과", href: "/#result" },
    // 개인정보 처리방침: 실제 문서 준비 전까지 비활성 처리
    { label: "개인정보 처리방침", href: null },
  ],
  copyright: "© 2026 Standin. All rights reserved.",
};

/**
 * 가입 페이지(/signup) 카피.
 *
 * 회원가입은 데스크톱 앱이 아니라 웹에서 처리한다 — 약관 동의와 이메일 인증이
 * 브라우저 흐름이기 때문이다. 앱은 이 페이지를 외부 브라우저로 열기만 한다.
 */
export const signup = {
  eyebrow: "CREATE ACCOUNT",
  title: "Standin 계정 만들기",
  body: "가입 후 인증 메일의 링크를 누르면 계정이 활성화됩니다. 그다음 데스크톱 앱에서 로그인해 주세요.",
  emailLabel: "이메일",
  emailPlaceholder: "artist@example.com",
  passwordLabel: "비밀번호",
  passwordPlaceholder: "8자 이상",
  passwordConfirmLabel: "비밀번호 확인",
  displayNameLabel: "표시 이름",
  displayNameHint: "선택 · 비워두면 이메일 앞부분을 사용합니다",
  displayNamePlaceholder: "작가명",
  consentPrefix: "서비스 이용약관과",
  consentPolicyLabel: "개인정보 처리방침",
  consentSuffix: "에 동의합니다.",
  cta: "계정 만들기",
  showPassword: "비밀번호 표시",
  hidePassword: "비밀번호 숨기기",
  // 성공 상태
  successTitle: "인증 메일을 보냈습니다",
  successBody:
    "메일의 링크를 눌러 인증을 마친 뒤, 데스크톱 앱에서 로그인해 주세요.",
  successHint: "메일이 보이지 않으면 스팸함도 확인해 주세요.",
  backToApp: "앱으로 돌아가기",
  backToAppHint: "앱이 열리지 않으면 Standin을 직접 실행해 주세요.",
  resend: "인증 메일 다시 보내기",
  resendSending: "보내는 중…",
  resendDone: "인증 메일을 다시 보냈습니다.",
  resendCooldown: (sec: number) => `${sec}초 후 다시 보낼 수 있습니다`,
  // 앱 안내
  hasAccountPrefix: "이미 계정이 있나요?",
  hasAccountBody: "데스크톱 앱에서 로그인하세요.",
  // 백엔드 미연결 시
  demoNotice:
    "현재 서버가 연결되어 있지 않아 실제 가입은 진행되지 않습니다. VITE_API_BASE_URL을 설정한 뒤 다시 시도해 주세요.",
};
