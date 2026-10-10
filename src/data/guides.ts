import { clipStudio, demo, flow } from "./content";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  sections: { id: string; title: string; body: string; checks?: string[] }[];
  video: { src: string; poster: string; label: string };
};

// 현재 랜딩에서 안내하는 사용 범위만 설명한다. 출시 일정·새 기능은 추가하지 않는다.
export const guides: Guide[] = [
  {
    slug: "rough-to-3d-pose",
    title: "러프 이미지에서 웹툰용 3D 포즈를 찾는 방법",
    description: "Standin에 인물의 자세가 보이는 러프나 참고 이미지를 입력하면 가까운 3D 인체 포즈 후보를 비교할 수 있습니다. 몸통과 팔다리 방향이 컷의 연출에 가까운 후보를 선택하고, 필요한 부분을 조정해 작화의 시작점으로 사용하세요.",
    sections: [
      {
        id: "prepare-image",
        title: "어떤 이미지를 준비하나요?",
        body: flow.input.body,
        checks: [
          "찾으려는 인물의 몸통과 팔다리 방향을 읽을 수 있는지 살펴보세요.",
          "전신 포즈가 필요한 컷인지, 상체 위주로 참고할 컷인지 먼저 정하세요.",
          "가려진 관절이나 생략한 선은 후보를 비교할 때 따로 확인할 부분으로 남겨 두세요.",
        ],
      },
      {
        id: "find-candidates",
        title: "입력한 이미지로 무엇을 찾나요?",
        body: flow.process.body,
      },
      {
        id: "compare-candidates",
        title: "여러 포즈 중 무엇을 기준으로 고르나요?",
        body: "몸통의 기울기, 팔다리의 방향, 무게중심을 기준으로 러프와 가까운 후보를 고르세요. 완벽히 일치하는지보다 어떤 부분을 손보면 원하는 연출에 가까워지는지 함께 확인합니다.",
        checks: [
          "몸통의 기울기와 회전 방향이 러프의 연출에 가까운지 비교하세요.",
          "팔을 뻗는 방향, 다리의 굽힘, 인물의 무게중심을 살펴보세요.",
          "후보 전체의 인상과 함께, 선택한 뒤 손볼 부분이 어디인지 확인하세요.",
        ],
      },
      {
        id: "no-match",
        title: "정확히 맞는 후보가 없으면 어떻게 하나요?",
        body: `가까운 후보를 시작점으로 삼아 필요한 부분을 조정하고, 사용할 만한 후보가 없다면 수동으로 자세를 잡으세요. ${demo.footnote}`,
      },
      {
        id: "pose-reference",
        title: "사진 레퍼런스나 완성 그림 생성과 무엇이 다른가요?",
        body: "Standin의 결과는 작가가 비교하고 선택할 3D 인체 포즈 후보입니다. 사진 레퍼런스는 자세를 관찰하는 참고 자료로 활용할 수 있고, Standin은 입력 이미지와 가까운 포즈의 시작점을 찾는 데 사용합니다. 완성 그림을 대신 만들지 않으며 최종 자세·구도와 선화는 작가가 결정합니다.",
      },
      {
        id: "continue-drawing",
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
    description: "Standin에서 선택한 포즈의 결과를 내보낸 뒤 클립스튜디오에서 러프와 크기·방향·구도를 비교하고 작화를 이어갑니다. Standin은 포즈 후보 선택을 돕고, 최종 선화와 연출은 작가가 결정합니다.",
    sections: [
      {
        id: "roles",
        title: "Standin과 클립스튜디오는 각각 어떤 역할을 하나요?",
        body: clipStudio.body,
      },
      {
        id: "select-pose",
        title: "1. 러프에 가까운 후보를 선택하세요",
        body: "Standin에서 인물의 자세가 보이는 이미지를 입력한 뒤, 검색된 후보를 비교합니다. 몸통과 팔다리의 방향이 컷의 연출에 가까운지 확인하고 원하는 결과를 선택하세요.",
      },
      {
        id: "export-result",
        title: "2. 선택한 결과를 내보내세요",
        body: "선택한 포즈를 내보내고 저장된 결과를 확인하세요. 아래 영상은 클립스튜디오 작업으로 이어지는 사용 장면입니다. 파일 형식과 가져오기 방법은 사용 중인 베타 안내를 함께 확인해 주세요.",
        checks: [
          "선택한 후보와 내보낼 결과가 같은지 확인하세요.",
          "저장 위치와 파일을 확인한 뒤 클립스튜디오에서 사용할 컷을 준비하세요.",
        ],
      },
      {
        id: "check-composition",
        title: "3. 작화할 컷에서 구도와 자세를 확인하세요",
        body: "클립스튜디오에서 결과를 가져온 뒤 러프와 나란히 비교하세요. 인물 크기와 방향, 필요한 관절과 카메라 구도를 확인하면서 원하는 연출로 조정합니다.",
        checks: [
          "인물이 컷 안에서 차지하는 크기와 위치가 맞는지 확인하세요.",
          "러프에서 강조한 원근감과 팔다리 방향을 다시 비교하세요.",
          "수정이 필요한 부분을 조정한 뒤 선화와 최종 작화를 이어가세요.",
        ],
      },
      {
        id: "perspective",
        title: "포즈는 비슷한데 원근감이 다르면 무엇을 확인하나요?",
        body: "관절 자세를 다시 바꾸기 전에 인물의 방향과 카메라 구도를 먼저 비교하세요. 같은 포즈도 보는 방향과 화면 안의 크기에 따라 다르게 보입니다. 러프와 결과를 나란히 놓고 차이를 나누어 확인하면 수정할 대상을 정하기 쉽습니다.",
        checks: [
          "팔·다리의 굽힘이 다르면 관절 자세를 비교하세요.",
          "몸의 앞면과 옆면이 보이는 정도가 다르면 인물과 카메라 방향을 확인하세요.",
          "가까운 손·발의 강조가 다르면 카메라 구도와 러프의 원근 표현을 비교하세요.",
          "화면을 차지하는 면적이 다르면 크기와 배치를 확인하세요.",
        ],
      },
      {
        id: "troubleshooting",
        title: "가져온 결과가 예상과 다르면 무엇을 확인하나요?",
        body: "먼저 선택했던 후보와 실제로 저장한 결과를 비교하세요. 그다음 사용 중인 파일 형식과 클립스튜디오 환경을 베타 안내와 대조하세요. 자세 자체의 차이인지, 크기·방향·구도의 차이인지 나누어 확인하면 손볼 부분을 정하기 쉽습니다.",
      },
      {
        id: "independent-tool",
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
