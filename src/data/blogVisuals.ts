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
      input: {
        src: '/assets/blog/rough-capture.jpg', width: 1920, height: 1138,
        alt: '클립스튜디오 러프 위에 Standin의 드래그로 영역을 선택하세요 안내가 표시된 화면',
        caption: '러프 입력 화면. 인물의 몸통과 팔다리가 함께 들어오도록 캡처 범위를 잡습니다.',
      },
      save: {
        src: '/assets/blog/saved-file-drag.jpg', width: 1920, height: 1138,
        alt: 'Standin 저장 완료 창에서 점 여섯 개 손잡이와 standin_pose_01 (2).fbx 파일 이름이 있는 행',
        caption: '여기를 잡으세요: 저장 완료 창에서 파일 이름이 적힌 행 또는 왼쪽 점 손잡이를 드래그합니다. 오른쪽의 경로 복사 버튼이나 위의 포즈 미리보기는 드래그 시작 지점이 아닙니다.',
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
