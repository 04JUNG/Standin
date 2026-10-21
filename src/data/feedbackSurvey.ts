export const SURVEY_VERSION = "open-beta-2026-10-21-v1";
export type SurveyMode = "complete" | "dropoff";
export type FeedbackQuestion = {
  id: string; title: string; type: "single" | "text";
  options?: string[]; required?: boolean; hint?: string;
};
export const usageStages = [
  { value: "complete", label: "포즈를 확인하고 내보내기까지 했어요", note: "Clip Studio 적용 여부는 이어서 알려주세요." },
  { value: "dropoff", label: "아직 내보내기까지 하지 못했어요", note: "설치가 안 됐거나, 잠깐 둘러본 경우도 포함해요." },
] as const;
export const commonQuestions: FeedbackQuestion[] = [
  { id: "role", title: "어떤 작업을 하고 계신가요?", type: "single", required: true, options: ["현업 웹툰 작가", "어시스턴트·스튜디오 제작자", "데뷔 준비·학생", "개인 창작·취미", "일러스트레이터", "기타"] },
  { id: "os", title: "어떤 컴퓨터에서 사용했나요?", type: "single", required: true, options: ["Windows", "Mac · Apple Silicon", "Mac · Intel", "Mac · 칩 종류 모름", "아직 설치 전", "기타"] },
  { id: "app_version", title: "사용한 Standin 버전을 알고 있다면 적어주세요.", type: "text", hint: "선택 · 앱에 표시된 버전(예: 0.2.0)을 적어주세요." },
];
export const completeQuestions: FeedbackQuestion[] = [
  { id: "use_case", title: "어떤 작업에 사용했나요?", type: "single", required: true, options: ["실제 연재·납품 작업", "데뷔·공모전 준비", "개인 작품·포트폴리오", "기능 확인용 테스트", "기타"] },
  { id: "image_quality", title: "러프·이미지 검색의 포즈 후보는 얼마나 쓸 만했나요?", type: "single", required: true, options: ["바로 사용할 후보가 있었다", "조금 수정하면 사용할 후보가 있었다", "참고할 수 있지만 수정이 많이 필요했다", "쓸 만한 후보가 없었다", "이미지 검색을 사용하지 않았다"] },
  { id: "text_quality", title: "문장으로 검색한 포즈는 의도와 얼마나 맞았나요?", type: "single", required: true, options: ["의도에 잘 맞았다", "비슷한 후보를 찾을 수 있었다", "의도와 거의 맞지 않았다", "검색이 실패했다", "문장 검색을 사용하지 않았다"] },
  { id: "body_manual", title: "직접 체형을 조절하고 저장하는 기능은 어땠나요?", type: "single", required: true, options: ["원하는 체형을 만들고 저장했다", "조절은 됐지만 원하는 체형을 만들기 어려웠다", "조절·저장 중 문제가 있었다", "기능을 찾지 못했다", "사용하지 않았다"] },
  { id: "body_auto", title: "러프에 맞춘 자동 체형은 어땠나요?", type: "single", required: true, options: ["원하는 비율에 가까웠다", "일부 수정하면 사용할 수 있었다", "비율이 맞지 않아 쓰기 어려웠다", "자동 체형 처리가 실패했다", "사용하지 않았다"] },
  { id: "clip_result", title: "내보낸 결과를 Clip Studio에서 적용했나요?", type: "single", required: true, options: ["적용하고 실제 작화에 활용했다", "적용했지만 테스트만 했다", "가져오기에 실패했다", "가져왔지만 포즈·체형이 달라 활용하지 못했다", "아직 시도하지 않았다", "Clip Studio를 사용하지 않는다"] },
  { id: "time_change", title: "기존 방식보다 포즈 준비 시간이 줄었나요?", type: "single", required: true, options: ["많이 줄었다", "조금 줄었다", "비슷했다", "더 오래 걸렸다", "비교하기 어렵다"] },
];
export const dropoffQuestions: FeedbackQuestion[] = [
  { id: "stop_stage", title: "어디까지 진행했나요?", type: "single", required: true, options: ["다운로드·설치 전", "설치", "앱 실행", "이미지 입력·캡처", "이미지·문장 검색", "후보 선택", "체형 조절·저장", "내보내기"] },
  { id: "stop_reason", title: "계속 진행하지 않은 가장 큰 이유는 무엇인가요?", type: "single", required: true, options: ["오류·멈춤이 발생했다", "사용 방법을 찾기 어려웠다", "원하는 포즈·체형을 찾지 못했다", "처리가 너무 오래 걸렸다", "지금은 필요하지 않거나 시간이 없었다", "기능을 둘러보기만 했다", "기타"] },
  { id: "issue_detail", title: "당시 상황을 조금 더 알려주세요.", type: "text", hint: "선택 · 기대했던 동작, 실제 결과, 오류 문구 등을 적어주세요. 개인정보는 넣지 마세요." },
];
export const closingQuestions: FeedbackQuestion[] = [
  { id: "reuse", title: "다음 작업에서도 Standin을 사용할 생각이 있나요?", type: "single", required: true, options: ["지금 상태로도 사용하겠다", "일부 기능이 개선되면 사용하겠다", "아직 판단하기 어렵다", "사용하지 않을 것 같다"] },
  { id: "priority", title: "가장 먼저 개선했으면 하는 한 가지는 무엇인가요?", type: "text", hint: "선택 · 좋았던 점이나 실제 사용 장면을 함께 남겨주셔도 좋아요." },
];
export function getQuestions(mode: SurveyMode): FeedbackQuestion[] {
  return [...commonQuestions, ...(mode === "complete" ? completeQuestions : dropoffQuestions), ...closingQuestions];
}
