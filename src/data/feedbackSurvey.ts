export type FeedbackOption = {
  value: string;
  label: string;
  note?: string;
};

export type FeedbackQuestion = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  type: "email" | "single" | "multi" | "textarea" | "image" | "images" | "artifact";
  options?: FeedbackOption[];
  required?: boolean;
  maxSelections?: number;
  placeholder?: string;
  fileSlots?: { id: string; label: string }[];
  publicConsentId?: string;
  otherOptionValue?: string;
  otherPlaceholder?: string;
};

export type UsageStage = FeedbackOption & {
  branch: "complete" | "dropoff";
};

export const usageStages: UsageStage[] = [
  {
    value: "incomplete",
    label: "사용 중 문제가 생겨 완료하지 못했어요",
    note: "설치·실행 또는 사용 과정에서 중단했어요",
    branch: "dropoff",
  },
  {
    value: "exported",
    label: "3D 결과 생성·내보내기까지 완료했어요",
    note: "3D 결과를 확인하고 내보내기까지 마쳤어요",
    branch: "complete",
  },
];

const roleOptions: FeedbackOption[] = [
  { value: "working-artist", label: "현업 웹툰 작가" },
  { value: "assistant", label: "현업 웹툰 어시스턴트" },
  { value: "studio", label: "웹툰 스튜디오 소속 제작자" },
  { value: "aspiring", label: "웹툰 작가 데뷔 준비생" },
  { value: "student", label: "웹툰·일러스트 전공 학생" },
  { value: "amateur", label: "아마추어 웹툰·일러스트 창작자" },
  { value: "hobby", label: "취미 창작자" },
  { value: "illustrator", label: "일러스트레이터" },
  { value: "other", label: "기타" },
];

const productionOptions: FeedbackOption[] = [
  { value: "serial", label: "연재 또는 납품 중인 작품이 있다" },
  { value: "preparing", label: "연재·투고·공모전을 준비 중인 작품이 있다" },
  { value: "personal", label: "개인 작품이나 포트폴리오를 제작 중이다" },
  { value: "none", label: "현재 제작 중인 작품은 없다" },
];

export const commonQuestions: FeedbackQuestion[] = [
  {
    id: "email",
    eyebrow: "참여자 확인",
    title: "클로즈베타를 신청한 이메일을 알려주세요.",
    description: "사전등록 정보와 설문 보상을 확인하는 용도로만 사용합니다.",
    type: "email",
    required: true,
    placeholder: "artist@example.com",
  },
  {
    id: "role",
    eyebrow: "참여자 확인",
    title: "현재 본인과 가장 가까운 역할은 무엇인가요?",
    type: "single",
    options: roleOptions,
    required: true,
  },
  {
    id: "production",
    eyebrow: "참여자 확인",
    title: "현재 제작 중인 작품이 있나요?",
    type: "single",
    options: productionOptions,
    required: true,
  },
];

export const completeQuestions: FeedbackQuestion[] = [
  {
    id: "q5_use_case",
    eyebrow: "사용 목적",
    title: "Standin을 어떤 작업에 사용했나요?",
    type: "single",
    required: true,
    options: [
      { value: "serial", label: "실제 연재·납품 작품" },
      { value: "preparing", label: "연재·투고·공모전 준비 작품" },
      { value: "personal", label: "개인 작품·포트폴리오" },
      { value: "recreate", label: "기존에 완성한 작업을 다시 만들어 보는 테스트" },
      { value: "feature-test", label: "기능을 확인하기 위한 테스트" },
      { value: "other", label: "기타" },
    ],
  },
  {
    id: "q6_previous_method",
    eyebrow: "기존 작업 방식",
    title: "Standin 사용 전에는 원하는 포즈를 어떻게 준비했나요?",
    description: "사용하던 방법을 모두 골라주세요.",
    type: "multi",
    required: true,
    options: [
      { value: "search", label: "핀터레스트·구글 등에서 레퍼런스 검색" },
      { value: "photo", label: "직접 사진 촬영" },
      { value: "clip-3d", label: "클립스튜디오 3D 인형을 직접 조정" },
      { value: "other-3d", label: "Blender·Unity 등 다른 3D 프로그램에서 조정" },
      { value: "asset", label: "기존 3D 포즈 소재를 검색하거나 구매" },
      { value: "imagine", label: "머릿속으로 구상하여 바로 그림" },
      { value: "none", label: "별도의 준비 과정 없이 작업" },
      { value: "other", label: "기타" },
    ],
  },
  {
    id: "q7_previous_pain",
    eyebrow: "기존 작업 방식",
    title: "기존 방식에서 가장 오래 걸리거나 불편했던 부분은 무엇이었나요?",
    description: "예: 원하는 포즈 검색, 손발 조정, 카메라 구도 설정",
    type: "textarea",
    required: true,
    placeholder: "구체적인 작업 장면을 적어주시면 제품 개선에 큰 도움이 됩니다.",
  },
  {
    id: "q7_outsource_experience",
    eyebrow: "3D 인체 외주 경험",
    title: "웹툰 작업용 3D 인체 포즈·배치를 외주로 맡기거나 수행한 경험이 있나요?",
    type: "single",
    required: true,
    options: [
      "외주로 맡겨본 적이 있다",
      "외주 작업을 수행한 적이 있다",
      "맡긴 경험과 수행한 경험이 모두 있다",
      "알아보거나 제안받았지만 실제로 진행하지 않았다",
      "경험이 없다",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q7_3d_usage_reason",
    eyebrow: "3D 인체 사용 이유",
    title: "웹툰 작업에서 3D 인체를 사용하는 이유는 무엇인가요?",
    description: "직접 그리는 대신 3D 인체를 선택하는 상황과, 이를 통해 해결하려는 문제를 자유롭게 적어주세요.",
    type: "textarea",
    required: true,
    placeholder: "구체적인 작업 상황을 적어주세요.",
  },
  {
    id: "q8_top5_match",
    eyebrow: "추천 결과",
    title: "추천된 TOP 5 중 실제 작업에 활용할 수 있는 포즈는 몇 개였나요?",
    description: "원하는 포즈와 비슷해 조금 수정하면 활용할 수 있는 후보까지 포함해 주세요.",
    type: "single",
    required: true,
    options: [
      "5개 모두",
      "4개",
      "3개",
      "2개",
      "1개",
      "0개",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q8_usage_screens",
    eyebrow: "사용 화면 제출",
    title: "Standin을 사용한 화면 2장을 첨부해 주세요.",
    description: "첫 번째에는 사용한 러프 또는 Standin 사용 과정을, 두 번째에는 3D 인체를 적용한 결과를 올려주세요.",
    type: "images",
    required: true,
    publicConsentId: "q8_public_case_consent",
    fileSlots: [
      { id: "q8_screen_first", label: "1. 사용한 러프 또는 사용 과정" },
      { id: "q9_screen_second", label: "2. 3D 인체를 적용한 결과" },
    ],
  },
  {
    id: "q12_usability",
    eyebrow: "결과 활용",
    title: "Standin으로 만든 결과를 실제 작화에 어느 정도 활용할 수 있었나요?",
    type: "single",
    required: true,
    options: [
      "수정 없이 바로 사용할 수 있었다",
      "간단히 수정하면 사용할 수 있었다",
      "상당한 수정이 필요했지만 참고 자료로 사용할 수 있었다",
      "수정하는 것보다 처음부터 다시 만드는 편이 빨랐다",
      "결과 품질이 부족해 사용할 수 없었다",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q14_time_change",
    eyebrow: "작업 시간",
    title: "기존 방식과 비교해 포즈 준비 시간은 어떻게 달라졌나요?",
    type: "single",
    required: true,
    options: ["70% 이상 줄었다", "50~70% 줄었다", "30~50% 줄었다", "10~30% 줄었다", "기존 방식과 비슷했다", "오히려 더 오래 걸렸다", "비교하기 어렵다"].map((label) => ({ value: label, label })),
  },
  {
    id: "q15_work_ready",
    eyebrow: "작업 도움",
    title: "현재 상태의 Standin이 실제 작업에 어느 정도 도움이 될 수 있다고 생각하나요?",
    type: "single",
    required: true,
    options: [
      "실제 작업에 크게 도움이 될 수 있다",
      "일부 장면이나 작업에서 도움이 될 수 있다",
      "몇 가지 핵심 기능이 개선되면 도움이 될 수 있다",
      "현재 상태로는 도움이 되기 어렵다",
      "아직 판단하기 어렵다",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q22_payment_model",
    eyebrow: "이용 방식",
    title: "가장 선호하는 이용 방식은 무엇인가요?",
    type: "single",
    required: true,
    options: [
      "1회 구매 방식",
      "월 구독 방식",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q23_monthly_price",
    eyebrow: "월 구독 가격",
    title: "개인용 월 구독이라면 매월 얼마까지 지불할 의향이 있나요?",
    type: "single",
    required: true,
    options: [
      "월 5천원 미만",
      "월 5천원~1만원 미만",
      "월 1만~2만원 미만",
      "월 2만~3만원 미만",
      "월 3만원 이상",
      "무료 플랜만 이용하겠다",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q23_plugin_price",
    eyebrow: "1회 구매 가격",
    title: "Standin을 1회 구매하는 방식이라면 얼마까지 지불할 의향이 있나요?",
    type: "single",
    required: true,
    options: [
      "2만원 미만",
      "2만~4만원 미만",
      "4만~7만원 미만",
      "7만~10만원 미만",
      "10만원 이상",
      "1회 구매 의향이 없다",
      "아직 판단하기 어렵다",
    ].map((label) => ({ value: label, label })),
  },
];

export const artifactQuestions: FeedbackQuestion[] = [
  {
    id: "q25_artifact",
    eyebrow: "완성 작업물",
    title: "완성 작업물이 있다면 제출해 주세요.",
    description: "선택 항목입니다. 완성 작업물을 제출하면 정식 출시 후 총 3개월을 무료로 이용할 수 있습니다. PNG·JPG·WEBP·CLIP 파일 또는 공개 가능한 링크를 제출할 수 있습니다.",
    type: "artifact",
    required: false,
    publicConsentId: "q25_public_case_consent",
  },
];

export const dropoffQuestions: FeedbackQuestion[] = [
  {
    id: "exit_q6_reason",
    eyebrow: "사용 경험",
    title: "어느 단계에서 문제가 발생했나요?",
    description: "해당되는 항목을 모두 선택해 주세요.",
    type: "multi",
    required: true,
    otherOptionValue: "기타",
    otherPlaceholder: "직접 입력해 주세요.",
    options: [
      "프로그램 다운로드·설치",
      "프로그램 실행",
      "화면 캡처·이미지 입력",
      "이미지 분석·포즈 검색",
      "3D 인형 생성",
      "Clip Studio 가져오기·내보내기",
      "기타",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "exit_q7_detail",
    eyebrow: "사용 경험",
    title: "어떤 문제가 있었는지 구체적으로 알려주세요.",
    description: "오류 문구, 기대했던 동작, 실제로 발생한 상황을 적어주세요.",
    type: "textarea",
    required: true,
  },
  {
    id: "exit_q8_screen",
    eyebrow: "사용 경험",
    title: "문제가 발생한 화면이 있다면 첨부해 주세요.",
    type: "image",
    required: false,
  },
  {
    id: "exit_q9_retry",
    eyebrow: "지원 안내",
    title: "설치·사용 지원을 받으면 다시 시도할 의향이 있나요?",
    type: "single",
    required: true,
    options: ["지원을 받으면 다시 시도하겠다", "문제를 해결하는 방법만 안내받고 싶다", "시간이 생기면 다시 시도하겠다", "다시 시도할 의향이 없다", "아직 모르겠다"].map((label) => ({ value: label, label })),
  },
  {
    id: "exit_q10_support",
    eyebrow: "지원 안내",
    title: "지원이 필요하다면 어떤 방법이 가장 편한가요?",
    type: "single",
    required: true,
    options: ["이메일로 안내받고 싶다", "1:1 오픈채팅으로 도움받고 싶다", "짧은 사용 영상만 받고 싶다", "별도 지원은 필요하지 않다"].map((label) => ({ value: label, label })),
  },
];

export const closingQuestions: FeedbackQuestion[] = [
  {
    id: "q31_launch_interest",
    eyebrow: "정식 출시 안내",
    title: "Standin이 정식 출시되면 사용해 볼 의향이 있나요?",
    description: "‘네’를 선택하면 설문에 입력한 이메일로 정식 출시 소식을 보내드립니다.",
    type: "single",
    required: true,
    options: [
      {
        value: "yes-email",
        label: "네",
      },
      { value: "no", label: "아니요" },
    ],
  },
  {
    id: "q29_interview",
    eyebrow: "전문가 인터뷰 · 사례비 10만원",
    title: "추가 인터뷰 참여를 희망하시나요?",
    description: "웹툰 업계에서 3년 이상 종사했고 경력 확인이 가능한 분께 30~40분 인터뷰 완료 후 사례비 10만원을 드립니다.",
    type: "single",
    required: true,
    options: [
      "참여 희망",
      "희망하지 않음",
    ].map((label) => ({ value: label, label })),
  },
  {
    id: "q30_comment",
    eyebrow: "마지막 질문",
    title: "추가로 전달하고 싶은 의견이 있나요?",
    description: "선택 항목입니다. Standin을 사용하며 좋았던 점과 불편했던 점을 모두 자유롭게 남겨주세요.",
    type: "textarea",
    required: false,
    placeholder: "자유롭게 적어주세요.",
  },
];
