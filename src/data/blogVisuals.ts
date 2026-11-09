export type BlogVisual = { src: string; width: number; height: number; alt: string; caption: string };
const capture: BlogVisual = {
  src: '/assets/blog/rough-capture.jpg', width: 1920, height: 1138,
  alt: '클립스튜디오에 열린 한 인물의 러프와 Standin의 드래그로 영역을 선택하세요 안내',
  caption: '① 러프 입력: 몸통과 팔다리가 함께 들어오도록 캡처 범위를 잡습니다. 2026년 11월 6일 조작 시연 화면입니다.',
};
const candidates: BlogVisual = {
  src: '/assets/blog/pose-candidates.jpg', width: 1920, height: 1138,
  alt: '러프 옆에 포즈 후보 다섯 개와 각 후보의 이 포즈 선택 버튼이 표시된 Standin 화면',
  caption: '② 후보 선택: 몸통의 기울기와 팔다리 방향을 비교하고 사용할 후보를 고릅니다. 준비된 후보로 조작을 보여준 시연 화면이며, 검색 품질이나 속도를 측정한 결과는 아닙니다.',
};
const importFlow: BlogVisual = {
  src: '/assets/blog/clip-studio-import.svg', width: 900, height: 600,
  alt: 'FBX는 파일에 포함된 모델을 가져오고, BVH는 먼저 선택한 기존 인형에 포즈를 적용하는 두 경로',
  caption: '가져오기 개념도. 모델이 포함된 FBX는 해당 모델을 가져옵니다. BVH는 포즈를 적용할 인형을 먼저 선택합니다. 가져온 뒤 자세와 구도를 확인하세요.',
};
export const blogVisuals: Record<string, { cover: BlogVisual; sections: Record<string, BlogVisual> }> = {
  'introducing-standin': {
    cover: { src: '/assets/blog/standin-workflow.svg', width: 900, height: 600,
      alt: '러프를 입력하고, 여러 포즈 후보 중 하나를 선택한 뒤, 3D 참고자료를 조정하는 세 단계',
      caption: 'Standin의 작업 흐름: 입력 → 작가의 후보 선택 → 가져온 뒤 조정. 인체 그림은 흐름을 설명하는 도해입니다.' },
    sections: { workflow: candidates },
  },
  'standin-clip-studio-guide': { cover: importFlow, sections: { input: capture, select: candidates } },
  'bvh-vs-fbx': {
    cover: { src: '/assets/blog/bvh-fbx-structure.svg', width: 900, height: 600,
      alt: 'BVH 쪽에는 관절과 골격이, FBX 쪽에는 표면을 가진 모델이 표시되고 골격과 움직임, 모델까지 담을 수 있음이라고 설명하는 비교 도해',
      caption: 'BVH는 골격과 프레임별 움직임을 기록합니다. FBX는 모델·골격·재질·애니메이션을 담을 수 있습니다. FBX의 실제 구성은 파일마다 다릅니다.' },
    sections: { 'standin-choice': importFlow },
  },
};
