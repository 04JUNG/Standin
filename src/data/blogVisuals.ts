export type BlogVisual = {
  src: string; width: number; height: number; alt: string; caption: string;
  animation?: { src: string; label: string };
};
export const blogVisuals: Record<string, { cover: BlogVisual; sections: Record<string, BlogVisual> }> = {
  'introducing-standin': {
    cover: {
      src: '/assets/blog/text-search-preview.jpg', width: 1920, height: 1080,
      alt: '야구선수가 타격을 하는 자세라는 문장으로 포즈를 찾고, 후보를 골라 클립스튜디오에 적용하는 Standin 사용 장면',
      caption: '문장으로 포즈를 찾고 클립스튜디오에서 활용하는 실제 사용 녹화입니다. GIF는 설명을 위해 편집한 약 9초 반복 영상으로, 검색 소요 시간을 뜻하지 않습니다.',
      animation: { src: '/assets/blog/text-search-use.gif', label: '문장 검색 → 클튜 적용 · 약 9초' },
    },
    sections: { workflow: {
      src: '/assets/blog/pose-candidates.jpg', width: 1920, height: 1138,
      alt: '러프 옆에 포즈 후보 다섯 개와 각 후보의 이 포즈 선택 버튼이 표시된 Standin 화면',
      caption: '후보를 비교할 때는 몸통의 기울기와 팔다리 방향을 봅니다. 준비된 후보로 선택 동작을 보여준 시연 화면입니다.',
    } },
  },
  'standin-clip-studio-guide': {
    cover: {
      src: '/assets/blog/clip-studio-applied.jpg', width: 1920, height: 1138,
      alt: 'Standin에서 러프를 캡처하고 후보를 선택한 뒤 저장 완료 화면의 FBX 파일을 클립스튜디오 캔버스로 드래그해 3D 모델을 배치하는 과정',
      caption: '실제 앱 조작 녹화: 러프 캡처 → 후보 선택 → 저장된 FBX 파일 행을 클튜 캔버스로 드래그 → 적용 확인. 준비된 후보를 사용한 시연이며 원본을 1.4배속으로 재생합니다. 이 GIF는 FBX 적용 장면입니다.',
      animation: { src: '/assets/blog/standin-to-clip-studio.gif', label: '앱에서 클튜로 드래그 앤 드롭 · 9초' },
    },
    sections: {
      prepare: {
        src: '/assets/blog/standin-and-clip-studio.svg', width: 900, height: 300,
        alt: 'Standin 앱 아이콘과 CLIP STUDIO PAINT 앱 아이콘을 나란히 배치한 준비 안내',
        caption: 'Standin에서 포즈를 찾고, CLIP STUDIO PAINT에서 러프에 맞춰 활용합니다. 두 앱을 함께 실행해 주세요.',
      },
      input: {
        src: '/assets/blog/rough-selection.webp', width: 750, height: 970,
        alt: 'Standin 영역 캡처 중 클립스튜디오의 인물 러프를 사각형으로 선택하는 실제 화면',
        caption: '실제 캡처 장면을 확대한 화면입니다. 몸통과 팔다리가 잘리지 않도록 인물 전체를 포함해 범위를 잡습니다.',
      },
      select: {
        src: '/assets/blog/candidate-selection.webp', width: 850, height: 480,
        alt: 'Standin 검색 후보 다섯 개와 각 카드의 이 포즈 선택 버튼을 확대한 화면',
        caption: '후보의 몸통 기울기와 팔다리 방향을 비교한 뒤 ‘이 포즈 선택’을 누릅니다. 준비된 후보를 사용한 실제 앱 조작 시연입니다.',
      },
      save: {
        src: '/assets/blog/saved-file-row.webp', width: 450, height: 484,
        alt: 'Standin 저장 완료 창에서 점 여섯 개 손잡이와 standin_pose_01 (2).fbx 파일 이름이 있는 행',
        caption: '여기를 잡으세요: 저장 완료 창에서 파일 이름이 적힌 행 또는 왼쪽 점 손잡이를 드래그합니다. 오른쪽의 경로 복사 버튼이나 위의 포즈 미리보기는 드래그 시작 지점이 아닙니다.',
      },
      'import-fbx': {
        src: '/assets/blog/fbx-applied.webp', width: 1240, height: 870,
        alt: 'Standin의 FBX 파일 행을 클립스튜디오 캔버스로 드래그한 뒤 러프 위에 3D 모델이 생성된 실제 화면',
        caption: 'FBX 파일 행을 캔버스로 끌어놓은 직후입니다. 오른쪽에는 Standin 저장 완료 창, 왼쪽에는 가져온 3D 모델이 보입니다. 드래그 동작은 글 상단 GIF에서 볼 수 있습니다.',
      },
      'import-bvh': {
        src: '/assets/blog/bvh-applied.webp', width: 850, height: 800,
        alt: 'Standin에서 저장한 BVH 파일을 실제 CLIP STUDIO PAINT에 불러와 3D 데생 인형에 적용한 화면',
        caption: 'BVH 적용 결과도 직접 확인했습니다. 이 화면은 Standin에서 저장한 BVH를 클튜의 3D 데이터 가져오기로 불러온 결과입니다. 앱에서 파일 행을 드래그하는 방법은 본문을 따라 진행하세요.',
      },
      adjust: {
        src: '/assets/blog/pose-adjustment.webp', width: 800, height: 760,
        alt: '클립스튜디오에서 러프 위에 가져온 3D 모델을 선택해 상단 카메라 조작 도구와 하단 조작 바가 표시된 화면',
        caption: '다른 실제 작업 영상의 조정 장면입니다. 인형을 선택하면 조작 도구가 나타납니다. 러프를 보며 방향·크기·위치를 맞춰 보세요.',
      },
      check: {
        src: '/assets/blog/clip-studio-import-menu.webp', width: 600, height: 800,
        alt: '클립스튜디오의 파일 메뉴에서 가져오기 하위 메뉴를 열어 3D 데이터 항목을 표시한 실제 화면',
        caption: '메뉴로 가져올 때는 파일 → 가져오기 → 3D 데이터를 선택합니다. Standin의 ‘폴더 열기’로 저장 위치를 먼저 확인하면 파일을 찾기 쉽습니다.',
      },
    },
  },
  'bvh-vs-fbx': {
    cover: {
      src: '/assets/blog/bvh-fbx-structure.svg', width: 900, height: 600,
      alt: 'BVH는 골격과 움직임을, FBX는 모델까지 담을 수 있음을 보여주는 비교 도해',
      caption: '형식 차이를 설명하는 도해입니다. Standin의 저장 완료 화면에서는 두 형식 모두 파일 행을 클립스튜디오로 끌어놓을 수 있습니다.',
    },
    sections: {},
  },
};
