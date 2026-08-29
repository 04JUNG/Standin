// 랜딩페이지 카피 (docs/04_CONTENT_COPY.md) — JSX에 흩지 않고 한곳에서 관리
import type { FooterLink, GuideStep, WorkflowStep } from "../types/landing";
import { RELEASES_PAGE } from "./download";

export const nav = {
  logo: "Standin",
  links: [
    { label: "이미지 입력", href: "#input" },
    { label: "처리 과정", href: "#process" },
    { label: "활용 결과", href: "#result" },
    { label: "사용 방법", href: "#guide" },
    { label: "다운로드", href: "#download" },
  ],
  // 9월 4일에 머지하므로 미래형 날짜 대신 현재 상태로 적는다.
  launchDate: "CLOSED BETA",
};

export const hero = {
  eyebrow: "WEBTOON 3D POSE TOOL",
  title: "러프 이미지에서\n원하는 3D 포즈를 찾아보세요.",
  body: "그림 위에 마우스를 올려 Standin이 찾은 같은 자세의 3D 인형을 직접 비교해 보세요.",
  launchBadge: "CLOSED BETA 진행 중",
  primaryCta: "무료 다운로드",
  secondaryCta: "사용 방법 보기",
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

/**
 * 사전등록 폼 카피.
 * 2026-09 다운로드 CTA로 교체되면서 랜딩에서 언마운트됐다.
 * 정식 출시 알림 폼으로 되살릴 수 있어 파일과 카피를 함께 남겨 둔다.
 */
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
    { value: "webtoon-academy", label: "웹툰 학원" },
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
    { label: "사용 방법", href: "/#guide" },
    { label: "다운로드", href: "/#download" },
    { label: "릴리스 노트", href: RELEASES_PAGE, external: true },
    // 개인정보 처리방침: 실제 문서 준비 전까지 비활성 처리
    { label: "개인정보 처리방침", href: null },
  ] satisfies FooterLink[],
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

/**
 * 다운로드 섹션 카피.
 *
 * 설치 전에 알아야 막히지 않는 정보(클립스튜디오 버전, 베타 동의, 설치 파일 서명)는
 * 접기 안에 숨기지 않고 요구사항 목록에 그대로 노출한다. 받고 나서 알게 되면 늦다.
 */
export const download = {
  eyebrow: "DOWNLOAD",
  title: "Standin 데스크톱 앱 내려받기",
  body: "Windows와 macOS에서 사용할 수 있습니다. 클로즈베타 기간에는 무료입니다.",
  badge: "클로즈베타 · 무료",

  windowsLabel: "Windows용 내려받기",
  macLabel: "macOS용 내려받기",
  recommendedBadge: "이 기기에 맞는 버전",
  otherOsNote: "Windows 또는 macOS에서 설치할 수 있습니다.",
  mobileNote: "설치 파일은 Windows·macOS 데스크톱에서 실행됩니다.",

  checkingVersion: "최신 버전 확인 중",
  releasedSuffix: "배포",
  staleNotice:
    "최신 버전 정보를 불러오지 못해 마지막으로 확인된 버전을 안내합니다.",
  allReleases: "모든 릴리스 보기",

  requirementsTitle: "설치 전 확인",
  requirements: [
    {
      term: "운영체제",
      desc: "Windows 10 이상(64비트) 또는 macOS. macOS는 Apple Silicon과 Intel을 함께 지원하는 하나의 파일입니다.",
    },
    {
      term: "Clip Studio Paint",
      desc: "저장한 포즈 파일(BVH)을 가져오려면 Ver 3.1 이상이 필요합니다. 파일 저장 자체는 클립스튜디오 없이도 됩니다.",
    },
    {
      term: "첫 실행",
      desc: "클로즈베타에는 로그인이 없습니다. 대신 첫 실행에서 베타 데이터 수집 동의를 거칩니다.",
    },
    {
      term: "업데이트",
      desc: "새 버전이 나오면 이 페이지에서 다시 내려받아 설치해 주세요.",
    },
  ],

  windowsInlineNote:
    "설치 파일에 아직 코드 서명이 없어 Windows 경고 화면이 뜰 수 있습니다.",
  macInlineNote: "설치 후 앱을 응용 프로그램 폴더로 옮겨 주세요.",

  windowsHelpTitle: "Windows에서 “알 수 없는 게시자” 경고가 뜬다면",
  windowsHelpSteps: [
    "경고 창에서 “추가 정보”를 누릅니다.",
    "아래에 나타나는 “실행” 버튼을 누릅니다.",
    "설치가 평소처럼 이어집니다.",
  ],
  windowsHelpNote:
    "코드 서명 인증서를 준비하는 중입니다. 서명이 적용되면 이 경고는 사라집니다.",

  macHelpTitle: "macOS 설치 순서",
  macHelpSteps: [
    "내려받은 dmg 파일을 엽니다.",
    "Standin을 응용 프로그램 폴더로 끌어다 놓습니다.",
    "응용 프로그램 폴더에서 Standin을 실행합니다.",
  ],
  macHelpNote:
    "dmg 안이나 다운로드 폴더에서 바로 실행하면 화면 기록 권한이 유지되지 않아 캡처가 엉뚱한 화면을 담습니다. 화면 캡처를 쓰려면 시스템 설정에서 화면 기록 권한을 허용해 주세요.",

  betaNotice:
    "클로즈베타 단계의 앱입니다. 기능과 화면이 업데이트마다 바뀔 수 있습니다.",
};

/**
 * 사용 방법 섹션 카피.
 *
 * 각 단계의 화면은 실제 앱 UI를 HTML·CSS로 재현한 목업이다(스크린샷이 아니다).
 * 화면 안 문구는 전부 앱 소스에서 그대로 가져왔고, caption에서 재현본임을 밝힌다.
 */
export const guide = {
  eyebrow: "HOW IT WORKS",
  title: "설치하고 나면 이렇게 씁니다.",
  description:
    "러프 한 장에서 포즈 파일까지 다섯 단계입니다. 아래 화면은 실제 앱 화면을 HTML·CSS로 재현한 예시로, 실제 화면과 다를 수 있습니다.",
  steps: [
    {
      id: "install",
      step: 1,
      title: "설치하고 베타 동의하기",
      description:
        "앱을 처음 열면 어떤 데이터를 왜 모으는지 먼저 확인합니다. 동의해야 베타를 시작할 수 있고, 동의는 설정에서 언제든 철회할 수 있습니다.",
      caption: "베타 데이터 수집 동의 화면 재현 예시",
      notes: [
        "클로즈베타에는 로그인이 없습니다. 계정을 만들지 않아도 됩니다.",
        "macOS는 이어서 화면 기록 권한을 물어봅니다. 권한 없이도 파일 업로드로 분석할 수 있습니다.",
      ],
    },
    {
      id: "input",
      step: 2,
      title: "러프를 넣거나 화면에서 캡처하기",
      description:
        "이미지 파일을 끌어다 놓거나, 작업 중인 화면에서 필요한 영역만 바로 캡처합니다. 인물의 자세가 보이는 러프면 됩니다.",
      caption: "홈 화면 재현 예시",
      notes: [
        "PNG · JPG · WEBP, 최대 20 MB까지 넣을 수 있습니다.",
        "넣은 이미지는 파일명과 크기를 확인하는 미리보기를 거쳐 Ctrl+Enter로 분석을 시작합니다.",
        "Ctrl+Alt+S를 누르면 다른 프로그램 위에 뜨는 작은 바에서 클립스튜디오를 벗어나지 않고 캡처할 수 있습니다.",
      ],
    },
    {
      id: "candidates",
      step: 3,
      title: "포즈 후보를 비교하고 직접 고르기",
      description:
        "인물마다 가까운 3D 포즈 후보를 나란히 보여줍니다. Standin은 하나로 확정하지 않습니다. 다섯 개를 비교해 쓸 만한 것을 직접 고릅니다.",
      caption: "포즈 후보 화면 재현 예시",
      notes: [
        "인물이 여럿이면 인물마다 따로 고릅니다. 모두 고르기 전까지는 다음 단계로 넘어가지 않습니다.",
        "“보정 필요”로 표시된 후보는 자세가 덜 맞는다는 뜻으로, 참고용으로만 쓰는 편이 좋습니다.",
      ],
    },
    {
      id: "review",
      step: 4,
      title: "저장할 포즈 확인하기",
      description:
        "고른 포즈를 러프에 맞춰 조정한 뒤 무엇이 저장될지 보여줍니다. 결과가 마음에 들지 않으면 후보 선택으로 돌아갈 수 있습니다.",
      caption: "저장할 포즈 확인 화면 재현 예시",
      notes: [
        "이 단계에서 되돌리면 앞서 고른 후보를 다시 선택할 수 있습니다.",
      ],
    },
    {
      id: "save",
      step: 5,
      title: "저장한 파일을 클립스튜디오로 옮기기",
      description:
        "포즈는 BVH 파일로 저장됩니다. 저장 화면의 파일을 클립스튜디오 캔버스로 끌어다 놓으면 데생 인형이 만들어집니다.",
      caption: "저장 완료 화면 재현 예시",
      notes: [
        "후보를 고르면 저장 대화상자 없이 설정된 폴더로 바로 저장됩니다. 폴더는 설정에서 바꿉니다.",
        "BVH를 가져오려면 Clip Studio Paint Ver 3.1 이상이 필요합니다.",
        "드래그가 잘 안 되면 폴더 열기로 탐색기에서 끌어다 놓거나, 경로를 복사해 파일 > 가져오기로 불러옵니다.",
      ],
    },
  ] satisfies GuideStep[],
  closing:
    "Standin은 작가의 연출을 대신하지 않습니다. 3D 인형을 세우는 반복 작업만 줄입니다.",
};
