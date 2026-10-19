import type { FaqItem } from "../types/landing";

export const faqItems: FaqItem[] = [
  {
    id: "what-is-standin",
    question: "Standin은 어떤 웹툰 작업 도구인가요?",
    answer:
      "Standin은 러프나 참고 이미지와 가까운 3D 인체 포즈 후보를 찾아주는 웹툰 작업 보조 도구입니다. 작가가 후보를 비교하고 원하는 시작점을 선택한 뒤 클립스튜디오에서 작화를 이어갑니다.",
  },
  {
    id: "image-input",
    relatedLink: { label: "러프 준비와 후보 선택 방법", href: "/guides/rough-to-3d-pose/#prepare-image" },
    question: "러프 이미지로 비슷한 3D 포즈를 어떻게 찾나요?",
    answer:
      "Standin에 인물의 자세가 보이는 러프나 참고 이미지를 입력하면 가까운 3D 포즈 후보를 비교할 수 있습니다. 몸통과 팔다리의 방향을 살펴보고 컷의 연출에 맞는 후보를 직접 선택하세요. 결과는 이미지의 표현 정도와 포즈 라이브러리에 따라 달라질 수 있습니다.",
  },
  {
    id: "text-search",
    relatedLink: { label: "문장으로 포즈를 검색하는 방법", href: "/guides/rough-to-3d-pose/#text-search" },
    question: "원하는 포즈를 글로 검색할 수 있나요?",
    answer:
      "네. Standin에서 원하는 자세를 문장으로 입력하면 가까운 3D 포즈 후보를 찾을 수 있습니다. 이미지로 찾을 때와 마찬가지로 후보를 비교해 직접 선택하고, 필요한 부분은 조정해서 사용하세요.",
  },
  {
    id: "clip-studio-workflow",
    relatedLink: { label: "클립스튜디오 활용 단계 보기", href: "/guides/clip-studio-pose-import/#select-pose" },
    question: "선택한 3D 포즈를 클립스튜디오에서 어떻게 활용하나요?",
    answer:
      "Standin에서 선택한 포즈의 결과를 내보내 클립스튜디오의 기존 작화 작업에 활용합니다. 가져온 결과의 크기·방향·구도를 러프와 비교하고 필요한 부분을 조정한 뒤 선화와 작화를 이어가세요. 파일 형식과 가져오기 방법은 오픈베타 공개 시 함께 안내합니다.",
  },
  {
    id: "auto-complete",
    question: "Standin이 그림을 자동으로 완성해 주나요?",
    answer:
      "Standin은 그림을 자동으로 완성하지 않으며, 콘티와 가까운 3D 인체 포즈 후보를 제안합니다. 최종 선택과 조정, 작화는 작가가 진행합니다.",
  },
  {
    id: "best-cuts",
    question: "어떤 컷에서 가장 도움이 되나요?",
    answer:
      "현재는 인체 비율과 구도가 중요한 전신·반신 컷을 중심으로 지원합니다. 두상·흉상 컷에서도 사용할 수 있도록 개선하고 있습니다.",
  },
  {
    id: "no-match",
    relatedLink: { label: "포즈와 원근 차이 확인하기", href: "/guides/clip-studio-pose-import/#perspective" },
    question: "포즈가 정확히 맞지 않으면 어떻게 하나요?",
    answer:
      "가까운 후보를 시작점으로 선택하고 필요한 자세와 방향을 직접 조정하세요. 사용할 만한 후보가 없으면 수동으로 자세를 잡는 방법을 함께 고려하세요. Standin은 모든 러프에 정확히 일치하는 결과를 보장하지 않습니다.",
  },
  {
    id: "plugin",
    relatedLink: { label: "두 도구의 역할 알아보기", href: "/guides/clip-studio-pose-import/#roles" },
    question: "클립스튜디오 플러그인인가요?",
    answer:
      "Standin은 클립스튜디오의 공식 플러그인이나 공식 제휴 서비스가 아닙니다. 클립스튜디오 밖에서 3D 포즈 선택을 돕고 결과를 기존 작화 흐름으로 연결하는 독립적인 보조 도구입니다.",
  },
  {
    id: "multi-figure",
    question: "여러 명이 등장하는 컷도 처리하나요?",
    answer:
      "초기 버전은 1~2인의 비교적 단순한 전신·반신 장면을 우선합니다. 인물이 복잡하게 겹치거나 물리적으로 얽힌 장면은 수동 보정이 필요할 수 있습니다.",
  },
  {
    id: "body-type",
    question: "러프 속 캐릭터에 맞게 체형을 바꿀 수 있나요?",
    answer:
      "네. 키·등신·어깨와 팔다리 비율 등을 직접 조절해 체형을 저장하거나, 러프에 맞춘 자동 체형을 확인한 뒤 필요한 부분을 다듬을 수 있습니다. 10월 21일 공개 예정인 오픈베타에서 사용할 수 있습니다.",
  },
  {
    id: "availability",
    question: "지금 바로 사용할 수 있나요?",
    answer:
      "2026년 10월 21일 오픈베타 공개 예정입니다. 사전등록을 남기면 공개 소식과 참여 방법을 이메일로 안내합니다. 사전등록·설문 참여 여부와 관계없이 오픈베타 참여자 전원에게 정식 출시 후 1개월 무료 이용 혜택을 드립니다. 별도로 오픈베타 공개일(10월 21일 예정)부터 11월 11일까지 설문을 작성하고 사용 화면 스크린샷을 제출한 분 중 5명을 추첨해 배달의민족 모바일 상품권 1만원권을 드립니다. 설문 링크와 당첨 발표 일정은 추후 안내합니다.",
  },
];
