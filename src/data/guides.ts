import { clipStudio, demo, flow } from "./content";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  sections: { title: string; body: string; checks?: string[] }[];
  video: { src: string; poster: string; label: string };
};

// 현재 랜딩에서 안내하는 사용 범위만 설명한다. 출시 일정·새 기능은 추가하지 않는다.
export const guides: Guide[] = [
  {
    slug: "rough-to-3d-pose",
    title: "러프 이미지에서 웹툰용 3D 포즈를 찾는 방법",
    description: "인물의 자세가 보이는 러프나 참고 이미지를 입력하고, 가까운 3D 포즈 후보를 비교·선택하는 Standin 사용 흐름을 안내합니다.",
    sections: [
      {
        title: "어떤 이미지를 준비하나요?",
        body: flow.input.body,
        checks: [
          "찾으려는 인물의 몸통과 팔다리 방향을 읽을 수 있는지 살펴보세요.",
          "전신 포즈가 필요한 컷인지, 상체 위주로 참고할 컷인지 먼저 정하세요.",
          "가려진 관절이나 생략한 선은 후보를 비교할 때 따로 확인할 부분으로 남겨 두세요.",
        ],
      },
      {
        title: "입력한 이미지로 무엇을 찾나요?",
        body: flow.process.body,
      },
      {
        title: "여러 포즈 중 무엇을 기준으로 고르나요?",
        body: demo.description,
        checks: [
          "몸통의 기울기와 회전 방향이 러프의 연출에 가까운지 비교하세요.",
          "팔을 뻗는 방향, 다리의 굽힘, 인물의 무게중심을 살펴보세요.",
          "후보 전체의 인상과 함께, 선택한 뒤 손볼 부분이 어디인지 확인하세요.",
        ],
      },
      {
        title: "정확히 맞는 후보가 없으면 어떻게 하나요?",
        body: `${demo.footnote} 가까운 후보가 있다면 필요한 조정 부분을 확인하고 시작점으로 선택하세요. 사용할 만한 후보가 없다면 수동으로 자세를 잡는 방법도 함께 고려하세요.`,
      },
      {
        title: "선택한 포즈로 어떻게 이어서 작업하나요?",
        body: flow.result.body,
      },
    ],
    video: {
      src: "/assets/videos/input-demo-webtoon-v5.mp4",
      poster: "/assets/videos/input-demo-webtoon-v5-poster.jpg",
      label: "Clip Studio에서 러프 이미지를 Standin에 입력하는 화면 녹화",
    },
  },
  {
    slug: "clip-studio-pose-import",
    title: "Standin에서 선택한 3D 포즈를 클립스튜디오 작업에 활용하는 방법",
    description: "Standin에서 가까운 포즈를 선택한 뒤 결과를 내보내고, 클립스튜디오에서 구도와 자세를 확인하며 작화를 이어가는 과정을 안내합니다.",
    sections: [
      {
        title: "Standin과 클립스튜디오는 각각 어떤 역할을 하나요?",
        body: clipStudio.body,
      },
      {
        title: "1. 러프에 가까운 후보를 선택하세요",
        body: "Standin에서 인물의 자세가 보이는 이미지를 입력한 뒤, 검색된 후보를 비교합니다. 몸통과 팔다리의 방향이 컷의 연출에 가까운지 확인하고 원하는 결과를 선택하세요.",
      },
      {
        title: "2. 선택한 결과를 내보내세요",
        body: "선택한 포즈를 내보내고 저장된 결과를 확인하세요. 아래 영상은 클립스튜디오 작업으로 이어지는 사용 장면입니다. 파일 형식과 가져오기 방법은 사용 중인 베타 안내를 함께 확인해 주세요.",
        checks: [
          "선택한 후보와 내보낼 결과가 같은지 확인하세요.",
          "저장 위치와 파일을 확인한 뒤 클립스튜디오에서 사용할 컷을 준비하세요.",
        ],
      },
      {
        title: "3. 작화할 컷에서 구도와 자세를 확인하세요",
        body: "클립스튜디오에서 결과를 가져온 뒤 러프와 나란히 비교하세요. 인물 크기와 방향, 필요한 관절과 카메라 구도를 확인하면서 원하는 연출로 조정합니다.",
        checks: [
          "인물이 컷 안에서 차지하는 크기와 위치가 맞는지 확인하세요.",
          "러프에서 강조한 원근감과 팔다리 방향을 다시 비교하세요.",
          "수정이 필요한 부분을 조정한 뒤 선화와 최종 작화를 이어가세요.",
        ],
      },
      {
        title: "가져온 결과가 예상과 다르면 무엇을 확인하나요?",
        body: "먼저 선택했던 후보와 실제로 저장한 결과를 비교하세요. 그다음 사용 중인 파일 형식과 클립스튜디오 환경을 베타 안내와 대조하세요. 자세 자체의 차이인지, 크기·방향·구도의 차이인지 나누어 확인하면 손볼 부분을 정하기 쉽습니다.",
      },
      {
        title: "클립스튜디오의 공식 플러그인인가요?",
        body: clipStudio.disclaimer,
      },
    ],
    video: {
      src: "/assets/videos/result-demo-rough-v3.mp4",
      poster: "/assets/videos/result-demo-rough-v3-poster.jpg",
      label: "Standin이 찾은 3D 포즈를 Clip Studio 캔버스에 배치하는 화면 녹화",
    },
  },
];

export const guidePath = (guide: Guide) => `/guides/${guide.slug}/`;
