import { clipStudio, demo, flow } from "./content";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  sections: { id: string; title: string; body: string; checks?: string[] }[];
  video: { src: string; poster: string; label: string };
  references?: { label: string; url: string }[];
};

// 현재 랜딩에서 안내하는 사용 범위만 설명한다. 출시 일정·새 기능은 추가하지 않는다.
export const guides: Guide[] = [
  {
    slug: "rough-to-3d-pose",
    publishedAt: "2026-10-09",
    modifiedAt: "2026-10-19",
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
        id: "text-search",
        title: "이미지 대신 문장으로 포즈를 찾으려면 어떻게 쓰나요?",
        body: "Standin에서 원하는 자세를 문장으로 입력하면 가까운 3D 포즈 후보를 찾을 수 있습니다. 예를 들어 ‘의자에 앉아 한쪽 팔을 앞으로 뻗은 자세’처럼 몸통과 팔다리의 동작을 적고, 나온 후보를 러프의 연출과 비교하세요. 문장은 찾을 자세를 설명하는 입력이며, 최종 포즈와 구도는 작가가 선택하고 조정합니다.",
        checks: [
          "서기·앉기처럼 자세의 큰 형태부터 적어 보세요.",
          "팔을 뻗는 방향이나 다리를 굽히는 동작 등 필요한 특징을 덧붙이세요.",
          "원하는 후보가 없으면 설명을 바꾸거나 이미지 입력과 수동 조정을 함께 고려하세요.",
        ],
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
      src: "/assets/videos/input-demo-natural-v8.mp4",
      poster: "/assets/videos/input-demo-natural-v8-poster.jpg",
      label: "Clip Studio에서 러프 이미지를 Standin에 입력하는 작업 흐름 연출 예시",
    },
  },
  {
    slug: "clip-studio-pose-import",
    publishedAt: "2026-10-09",
    modifiedAt: "2026-10-27",
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
        body: "Standin의 저장 화면에서 저장 완료 여부와 파일 형식·위치를 확인하세요. FBX는 Windows 탐색기나 macOS Finder에서 클립스튜디오 캔버스로 끌어놓거나, 파일 > 가져오기 > 3D 데이터로 불러올 수 있습니다. BVH는 적용할 3D 인형을 먼저 선택한 뒤 파일 > 가져오기 > 3D 데이터에서 불러오고, 가져올 포즈 범위를 확인하세요.",
        checks: [
          "선택한 후보와 내보낼 결과가 같은지 확인하세요.",
          "저장 화면의 ‘폴더 열기’로 파일을 찾고, 실제 확장자가 FBX인지 BVH인지 확인하세요.",
          "BVH는 클립스튜디오 PRO·EX 3.1.0 이상에서 지원합니다. 사용 중인 버전을 먼저 확인하세요.",
        ],
      },
      {
        id: "file-formats",
        title: "FBX·BVH와 클립스튜디오 버전은 어떻게 확인하나요?",
        body: "Standin에서 사용할 수 있는 내보내기 형식은 서버 지원 상태에 따라 달라지므로 저장 화면에 표시된 실제 결과를 기준으로 확인하세요. FBX는 3D 파일로, BVH는 3D 인형에 적용하는 동작·포즈 데이터로 가져옵니다. 클립스튜디오의 형식 지원과 Standin 결과의 체형·손·카메라 재현은 별도로 확인해야 합니다.",
        checks: [
          "FBX: 클립스튜디오의 3D 데이터 가져오기로 열고, 모델과 관절·체형이 기대한 모습인지 확인하세요.",
          "BVH: 클립스튜디오 PRO·EX 3.1.0 이상이 필요합니다. 적용할 3D 인형과 가져올 포즈를 선택하세요.",
          "FBX 대신 BVH로 저장되었다는 안내가 나오면 체형·손 모양 없이 동작만 포함됩니다.",
          "카메라·원근·모델 크기까지 자동으로 일치한다고 가정하지 말고 러프와 나란히 비교하세요.",
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
        body: "먼저 선택했던 후보와 실제로 저장한 결과를 비교하세요. 저장 화면에 표시된 형식과 체형 관련 안내, 클립스튜디오 버전을 확인한 다음 자세 자체의 차이인지, 크기·방향·구도의 차이인지 나누어 살펴보세요. 문제가 계속되면 앱 버전·운영체제·파일 형식·오류 문구를 적어 standin.asm@gmail.com으로 문의하세요. 미공개 원고는 문의에 꼭 필요한 범위만 첨부하세요.",
      },
      {
        id: "independent-tool",
        title: "클립스튜디오의 공식 플러그인인가요?",
        body: clipStudio.disclaimer,
      },
    ],
    video: {
      src: "/assets/videos/result-demo-natural-v6.mp4",
      poster: "/assets/videos/result-demo-natural-v6-poster.jpg",
      label: "Standin이 찾은 3D 포즈를 Clip Studio 캔버스에 배치하는 작업 흐름 연출 예시",
    },
    references: [
      { label: "Standin 공식 앱 릴리스: 설치 안내와 변경 내역", url: "https://github.com/04JUNG/Standin-client/releases/latest" },
      { label: "CLIP STUDIO PAINT 공식 매뉴얼: FBX·BVH 가져오기 (영문)", url: "https://help.clip-studio.com/en-us/manual_en/660_3d/Importing_3D_Files.htm" },
      { label: "CLIP STUDIO PAINT 공식 버전 3 릴리스 노트: 3.1.0 BVH 지원 (영문)", url: "https://www.clipstudio.net/en/dl/release_note/v3/" },
      { label: "CLIP STUDIO PAINT 공식 매뉴얼: 3D 인체 포즈 조정 (영문)", url: "https://help.clip-studio.com/en-us/manual_en/660_3d/Posing_3D_drawing_figures.htm" },
      { label: "CLIP STUDIO PAINT 공식 매뉴얼: 카메라 각도 설정 (영문)", url: "https://help.clip-studio.com/en-us/manual_en/660_3d/Set_camera_angle.htm" },
    ],
  },
];

export const guidePath = (guide: Guide) => `/guides/${guide.slug}/`;
