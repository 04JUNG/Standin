export type BlogSection = { id: string; title: string; paragraphs: string[]; steps?: string[]; table?: { headers: string[]; rows: string[][] }; links?: { label: string; href: string }[] };
export type BlogPost = { slug: string; title: string; description: string; category: string; date: string; takeaway?: { title: string; text: string }; sections: BlogSection[]; sources: { label: string; href: string }[] };
const manual = 'https://help.clip-studio.com/en-us/manual_en/660_3d/Importing_3D_Files.htm';
const release = 'https://www.clipstudio.net/en/dl/release_note/v3/';
export const blogPath = (post: BlogPost) => `/blog/${post.slug}/`;
export const blogDescription = 'Standin 소개부터 클립스튜디오 사용법, BVH·FBX 선택까지. 러프와 3D 포즈를 작화로 연결하는 방법을 안내합니다.';
export const blogPosts: BlogPost[] = [
  {
    slug: 'introducing-standin', category: 'Standin 시작하기', date: '2026-11-09',
    title: 'Standin 소개: 러프에서 가까운 3D 포즈를 찾는 작업 도구',
    description: '러프나 문장으로 3D 포즈 후보를 찾고, 저장한 파일을 클립스튜디오로 바로 드래그합니다. 실제 사용 GIF와 함께 Standin의 작업 흐름을 소개합니다.',
    sections: [
      { id: 'why', title: '러프는 그렸는데, 참고할 자세를 찾기 어렵다면', paragraphs: ['머릿속 장면을 러프로 옮긴 다음에도 할 일은 남습니다. 몸통은 얼마나 기울어지는지, 팔이 어디를 향하는지, 이 각도에서 다리가 어떻게 보이는지 확인해야 하죠. 3D 인체를 처음부터 움직여 참고자료를 만드는 과정이 부담스러울 때 Standin을 시작점으로 사용할 수 있습니다.', 'Standin은 러프 이미지나 자세를 설명하는 문장으로 가까운 3D 인체 포즈 후보를 찾는 도구입니다. 후보를 비교하고 사용할 포즈를 고르는 사람은 작가입니다.'] },
      { id: 'workflow', title: '입력하고, 고르고, 클튜로 끌어놓습니다', paragraphs: ['원본 러프와 후보를 비교하고 사용할 포즈를 고릅니다. 저장이 끝나면 Standin의 파일 목록에서 클립스튜디오 캔버스로 바로 드래그 앤 드롭해 작업을 이어갈 수 있습니다.'], steps: ['입력: 인물의 자세가 보이는 러프를 캡처하거나 이미지 파일을 넣습니다. 문장으로 원하는 자세를 설명할 수도 있습니다.', '선택: 몸통의 기울기, 팔다리 방향, 무게중심이 러프와 가까운 후보를 고릅니다.', '활용: 저장 완료 화면의 FBX·BVH 파일 행을 잡아 클립스튜디오 캔버스로 끌어놓습니다. 적용된 결과를 확인하고 크기·방향·관절·카메라를 조정합니다.'] },
      { id: 'example', title: '예를 들어, 한쪽 팔을 앞으로 뻗는 컷', paragraphs: ['몸을 숙여 한쪽 팔을 내미는 인물을 그린다고 생각해 보세요. 후보를 고를 때 손끝 위치 하나만 맞추려 하기보다 상체의 기울기와 팔을 뻗는 방향을 먼저 비교합니다. 가까운 후보를 찾았다면 클립스튜디오로 가져와 컷의 시점에 맞춥니다.', '손의 세부 모양이나 과장된 원근은 추가 조정이 필요할 수 있습니다. 여기서의 목표는 최종 그림을 대신 얻는 것이 아니라, 자세를 판단할 수 있는 3D 참고자료를 마련하는 것입니다. 이 설명은 작업 예시이며 처리 시간이나 일치율을 측정한 결과는 아닙니다.'] },
      { id: 'fit', title: '어떤 작업에서 먼저 써보면 좋을까요?', paragraphs: ['전신이나 반신의 동세를 확인하고 싶을 때, 머릿속 자세를 문장으로 설명할 수 있을 때, 기존 포즈 후보를 시작점으로 수정하는 방식이 익숙할 때 시도해 보세요.', '첫 시도에는 인물의 팔다리와 몸통이 비교적 잘 보이는 러프 한 컷을 권합니다. 후보가 적절한지 판단하기 쉽고, 자신의 작업에서 어느 부분을 줄일 수 있는지도 확인할 수 있습니다.'] },
      { id: 'limits', title: '마지막 연출과 작화는 작가가 결정합니다', paragraphs: ['입력과 후보가 정확히 일치하지 않을 수 있습니다. 가림이 심한 자세나 과장된 동세는 원하는 결과를 찾기 어려울 수 있고, 사용할 만한 후보가 없다면 직접 포즈를 잡는 편이 나을 수도 있습니다.', 'Standin은 클립스튜디오와 별도로 실행하는 도구입니다. 클립스튜디오의 공식 플러그인이 아니며, 내보낸 파일을 가져오는 방식으로 작업을 이어갑니다. 지원 형식은 저장 화면과 사용하는 클립스튜디오 버전을 확인하세요.'] },
      { id: 'next', title: '이제 러프 한 컷으로 시작해 보세요', paragraphs: ['먼저 사용법 글을 옆에 두고 입력부터 파일 가져오기까지 한 번 진행해 보세요. 파일 형식을 고르는 단계가 헷갈리면 BVH·FBX 비교 글을 함께 참고하면 됩니다.'], links: [{ label: '클립스튜디오에서 사용하는 방법', href: '/blog/standin-clip-studio-guide/' }, { label: 'BVH와 FBX 선택 기준', href: '/blog/bvh-vs-fbx/' }] },
    ],
    sources: [{ label: 'Standin 앱 다운로드·릴리스 안내', href: 'https://github.com/04JUNG/Standin-client/releases/latest' }, { label: 'Standin 러프 입력 가이드', href: '/guides/rough-to-3d-pose/' }],
  },
  {
    slug: 'standin-clip-studio-guide', category: '따라 하는 사용법', date: '2026-11-09',
    title: 'Standin으로 찾은 포즈, 클립스튜디오에서 사용하는 방법',
    description: 'Standin 저장 완료 화면의 FBX·BVH 파일을 클립스튜디오 캔버스로 바로 드래그 앤 드롭하세요. 실제 사용 GIF로 잡을 위치와 적용 과정을 안내합니다.',
    takeaway: { title: '저장한 파일을, Standin에서 클튜로 바로 드래그', text: '저장 완료 → 파일 이름이 적힌 행을 잡기 → 클립스튜디오 캔버스에 놓기. FBX·BVH 모두 이 흐름으로 가져올 수 있습니다. BVH는 CLIP STUDIO PAINT PRO·EX 3.1.0 이상을 사용하세요.' },
    sections: [
      { id: 'prepare', title: '시작 전에 준비할 것', paragraphs: ['Standin과 CLIP STUDIO PAINT를 실행하고, 연습할 러프 한 컷을 준비합니다. 이 글은 Windows·macOS의 데스크톱 작업을 기준으로 합니다. 앱 버전에 따라 버튼 배치와 제공되는 내보내기 옵션이 달라질 수 있습니다.', 'BVH를 사용하려면 CLIP STUDIO PAINT PRO·EX 3.1.0 이상인지 확인하세요. 아래 공식 릴리스 노트에서 BVH 지원이 추가된 버전을 확인할 수 있습니다.'], links: [{ label: 'CLIP STUDIO PAINT 3.1.0 릴리스 노트', href: release }, { label: 'Standin 설치 안내', href: 'https://github.com/04JUNG/Standin-client/releases/latest' }] },
      { id: 'input', title: '1. 러프를 캡처하거나 이미지로 입력합니다', paragraphs: ['Standin의 화면 캡처에서 분석할 영역을 선택하거나 이미지 파일을 불러옵니다. 입력 미리보기에서 의도한 인물이 들어 있는지 확인하세요.', '문장으로 찾고 싶다면 “서서 한쪽 팔을 앞으로 뻗은 자세”처럼 자세의 큰 형태와 팔다리 동작을 적어보세요. 러프 입력과 문장 검색 중 현재 작업에 편한 방식을 고르면 됩니다.'] },
      { id: 'select', title: '2. 러프와 가까운 후보를 선택합니다', paragraphs: ['검색된 후보의 몸통 기울기, 팔·다리 방향, 무게중심을 비교합니다. 화면에서 보는 각도와 실제 관절 자세를 나누어 살펴보면 어떤 후보를 수정하기 편할지 판단하기 쉽습니다.', '사용할 만한 후보가 없다면 입력 범위나 설명을 바꾸어 보세요. 결과가 정확히 일치할 것이라고 가정하기보다, 지금 컷에 활용할 수 있는 시작점인지 확인합니다.'] },
      { id: 'save', title: '3. 저장 완료 창에서 파일 이름이 적힌 행을 찾습니다', paragraphs: ['저장이 끝나면 Standin에 파일 이름과 확장자가 표시됩니다. 이 파일 행이 드래그 시작 지점입니다. 파일 이름 부분이나 왼쪽 점 손잡이를 잡으세요. 별도로 탐색기나 Finder를 열지 않아도 됩니다.', '저장된 파일이 .fbx인지 .bvh인지 확인하세요. 앱에서 FBX 대신 BVH로 저장했다는 안내가 있으면 실제로 저장된 형식을 기준으로 가져옵니다.'], links: [{ label: '어떤 형식을 선택할지 모르겠다면: BVH·FBX 비교', href: '/blog/bvh-vs-fbx/' }] },
      { id: 'import-fbx', title: '4-A. FBX 파일 행을 클튜 캔버스로 끌어놓습니다', paragraphs: ['Standin 창과 클립스튜디오 캔버스가 함께 보이도록 배치합니다. 저장 완료 창의 FBX 파일 행을 잡아 캔버스로 끌어놓으면 파일에 포함된 3D 모델을 가져올 수 있습니다. 위 GIF에서 이 동작을 볼 수 있습니다.'], steps: ['Standin의 저장 완료 화면에서 .fbx 파일 이름이 적힌 행을 잡습니다.', '마우스를 누른 채 클립스튜디오 캔버스로 이동한 뒤 놓습니다.', '가져오기 대화 상자가 나타나면 설정을 확인하고, 캔버스에 표시된 모델과 자세를 확인합니다.'], links: [{ label: '공식 매뉴얼: 3D 파일 가져오기', href: manual }] },
      { id: 'import-bvh', title: '4-B. BVH 파일도 같은 방식으로 끌어놓습니다', paragraphs: ['CLIP STUDIO PAINT PRO·EX 3.1.0 이상에서 Standin의 .bvh 파일 행을 캔버스로 드래그합니다. Standin 팀이 확인한 직접 드롭 경로에서는 인형을 미리 배치하지 않아도 포즈가 적용된 데생 인형을 가져올 수 있습니다.', '이미 쓰고 있는 인형에 포즈를 적용하고 싶거나 직접 드롭이 동작하지 않는 환경이라면, 대상 인형을 선택한 뒤 [파일] → [가져오기] → [3D 데이터]를 사용하세요. 이 메뉴 경로는 공식 매뉴얼에 안내되어 있습니다.'], steps: ['Standin 저장 완료 화면에서 .bvh 파일 행을 클립스튜디오 캔버스로 끌어놓습니다.', '프레임 범위를 묻는 대화 상자가 나타나면 시작·종료 프레임을 확인합니다.', '캔버스에 들어온 인형과 적용된 포즈를 확인합니다.'], links: [{ label: '공식 매뉴얼: 기존 인형에 BVH를 적용하는 메뉴 경로', href: manual }] },
      { id: 'adjust', title: '5. 크기·방향·구도를 맞추고 작화를 이어갑니다', paragraphs: ['불러온 결과와 러프를 나란히 비교합니다. 인물이 차지하는 면적, 몸의 앞면과 옆면이 보이는 정도, 가까운 손발의 원근을 확인하세요. 같은 관절 자세도 카메라에 따라 인상이 달라집니다.', '자세가 다르면 관절을, 시점이 다르면 카메라와 인물 방향을 조정합니다. 필요한 부분을 손본 뒤 선화를 이어갑니다. Standin의 화면과 클립스튜디오의 최종 구도가 자동으로 일치한다는 뜻은 아닙니다.'] },
      { id: 'check', title: '드래그가 안 되면 폴더 열기 또는 메뉴 가져오기를 사용하세요', paragraphs: ['먼저 저장이 완료됐는지, 포즈 미리보기나 경로 복사 버튼 대신 파일 행을 잡았는지 확인하세요. 앱에서 드래그가 시작되지 않으면 “폴더 열기”를 눌러 탐색기·Finder의 파일을 캔버스로 끌어놓습니다.', '클립스튜디오가 파일을 받지 않으면 실제 확장자와 사용 버전을 확인하고 [파일] → [가져오기] → [3D 데이터]를 사용하세요. BVH를 메뉴로 가져올 때는 포즈를 적용할 3D 인형을 먼저 선택합니다. BVH 직접 드롭은 팀 검증 경로이며, 공식 매뉴얼은 메뉴 가져오기를 안내하므로 버전별 동작이 다르면 이 경로를 사용하면 됩니다.', '계속 문제가 생기면 Standin 버전, 운영체제, 클립스튜디오 버전, 파일 형식, 오류 문구를 적어 문의하세요.'], links: [{ label: 'Standin 문의하기', href: 'mailto:standin.asm@gmail.com' }, { label: '자세·원근·호환성에 관한 상세 가이드', href: '/guides/clip-studio-pose-import/' }] },
    ],
    sources: [{ label: 'CLIP STUDIO PAINT 공식 매뉴얼: 3D 파일과 BVH 가져오기', href: manual }, { label: 'CLIP STUDIO PAINT 공식 버전 3 릴리스 노트', href: release }],
  },
  {
    slug: 'bvh-vs-fbx', category: '포즈 파일 이해하기', date: '2026-11-09',
    title: 'BVH와 FBX의 차이: 클립스튜디오에서는 무엇을 선택할까?',
    description: 'BVH는 골격의 움직임을, FBX는 모델과 애니메이션 등 더 넓은 3D 데이터를 담을 수 있습니다. 클립스튜디오 작업 목적에 맞는 선택 기준을 정리합니다.',
    sections: [
      { id: 'basics', title: '둘 다 드래그하고, 담긴 데이터는 구분하세요', paragraphs: ['Standin의 저장 완료 화면에서는 FBX·BVH 모두 파일 이름이 적힌 행을 클립스튜디오 캔버스로 드래그 앤 드롭할 수 있습니다. 가져오는 손동작은 같아도 파일에 담긴 데이터는 다릅니다. 동작을 옮기려면 BVH를, 내보낸 모델도 함께 사용하려면 FBX를 살펴보세요.', 'BVH는 BioVision Hierarchy의 약자로, 골격의 계층 구조와 프레임별 움직임을 기록하는 형식입니다. 메시나 텍스처는 담지 않습니다. BVH를 드롭했을 때 보이는 데생 인형은 클립스튜디오가 제공하는 모델이며, BVH 파일에 모델이 들어 있다는 뜻은 아닙니다. FBX는 모델 형상, 재질, 골격, 애니메이션 등 다양한 3D 데이터를 담을 수 있지만 실제 포함 데이터는 내보내기 설정에 따라 달라집니다.'] },
      { id: 'comparison', title: 'BVH와 FBX, 한눈에 비교하기', paragraphs: ['아래 표는 파일 형식의 성격과 클립스튜디오에서의 활용을 나누어 정리한 것입니다. 모든 FBX가 캐릭터 모델을 포함하거나, 모든 BVH가 같은 인형에 똑같은 자세로 적용되는 것은 아닙니다.'], table: { headers: ['비교 기준', 'BVH', 'FBX'], rows: [['주요 데이터', '골격 계층과 프레임별 움직임', '모델·골격·재질·애니메이션 등'], ['모델의 겉모양', '메시·텍스처를 담지 않음', '포함할 수 있음. 실제 파일 확인 필요'], ['클튜에서의 활용', '드롭하여 포즈가 적용된 인형 가져오기. 기존 인형에는 메뉴로 적용', '파일에 포함된 3D 데이터 가져오기'], ['먼저 확인할 것', '클튜 버전, 포즈 적용 결과, 프레임 범위', '파일 구성, 모델 표시, 가져오기 결과'], ['Standin에서 확인할 곳', '저장 결과의 실제 형식과 안내', '저장 결과의 실제 형식과 안내']] } },
      { id: 'choose-bvh', title: '동작을 옮기려면 BVH', paragraphs: ['Standin에서 저장한 BVH 파일 행을 클립스튜디오 캔버스로 끌어놓으세요. 팀이 검증한 직접 드롭 경로에서는 인형을 미리 놓지 않아도 포즈가 적용된 데생 인형을 가져올 수 있습니다. BVH 지원은 CLIP STUDIO PAINT PRO·EX 3.1.0부터 추가됐습니다.', '기존 인형을 유지하며 포즈만 적용하려면 그 인형을 선택하고 [파일] → [가져오기] → [3D 데이터]로 BVH를 엽니다. 직접 드롭의 버전별 동작이 다를 때도 이 공식 메뉴 경로를 사용할 수 있습니다. 인형의 골격과 비율에 따라 적용 결과를 확인하고 조정하세요.'], links: [{ label: '공식 매뉴얼의 BVH 메뉴 가져오기', href: manual }, { label: 'BVH 지원 버전 확인', href: release }] },
      { id: 'choose-fbx', title: '내보낸 모델을 가져오려면 FBX', paragraphs: ['Standin 저장 완료 화면의 FBX 파일 행을 클립스튜디오 캔버스로 끌어놓으면, 파일에 포함된 모델을 가져올 수 있습니다. 앱에서 드래그가 시작되지 않으면 “폴더 열기”를 눌러 탐색기·Finder에서 같은 파일을 끌어놓으세요.', 'FBX는 담을 수 있는 정보가 많지만 가져오는 프로그램이 모든 정보를 동일하게 해석한다는 뜻은 아닙니다. 모델의 표시, 관절 상태, 체형, 재질은 불러온 결과에서 확인하세요. 카메라까지 자동으로 일치한다고 가정하지 않는 것이 좋습니다.'] },
      { id: 'standin-choice', title: '형식을 고르고, 저장 완료 창에서 바로 드래그하세요', paragraphs: ['동작만 가져올지, 내보낸 모델을 사용할지 정한 다음 Standin 저장 화면에서 실제 파일 형식을 확인합니다. 파일 이름이 적힌 행을 잡고 클립스튜디오 캔버스에 놓으면 됩니다.', 'FBX 대신 BVH로 저장되었다는 안내가 있으면 가져오는 데이터도 달라집니다. 드롭한 뒤 모델과 포즈를 확인하세요. 잡을 위치와 실제 FBX 드래그 장면은 사용법 글의 GIF에서 볼 수 있습니다.'], links: [{ label: 'Standin에서 클튜로 드래그하는 실제 GIF 보기', href: '/blog/standin-clip-studio-guide/' }] },
      { id: 'misconceptions', title: '자주 헷갈리는 세 가지', paragraphs: ['“FBX면 원래 캐릭터가 무조건 들어 있나요?” 파일마다 다릅니다. FBX에 모델을 담을 수 있다는 것과 실제 파일에 모델이 들어 있다는 것은 구분해야 합니다.', '“BVH를 FBX로 바꾸면 모델도 생기나요?” 형식 변환만으로 원래 없던 메시나 텍스처가 생기지는 않습니다. 모델을 함께 쓰려면 별도의 모델 데이터와 연결 작업이 필요합니다.', '“형식을 바꾸면 러프와 구도도 맞아지나요?” 포즈 데이터와 카메라 구도는 별도로 확인해야 합니다. 가져온 뒤 크기·방향·원근을 컷에 맞게 조정하세요.'] },
      { id: 'next', title: '같은 러프로 가져온 결과를 확인해 보세요', paragraphs: ['형식을 고른 뒤에는 자신의 컷에서 필요한 작업이 가능한지 확인하는 것이 가장 중요합니다. 기존 인형에 포즈를 적용할 수 있는지, 기대한 모델이 보이는지, 수정할 부분은 어디인지 비교해 보세요.', '처음 사용하는 경우에는 다음 사용법 글에서 해당 형식의 가져오기 단계로 이동하면 됩니다.'], links: [{ label: 'BVH 가져오기 단계로 이동', href: '/blog/standin-clip-studio-guide/#import-bvh' }, { label: 'FBX 가져오기 단계로 이동', href: '/blog/standin-clip-studio-guide/#import-fbx' }] },
    ],
    sources: [{ label: 'CLIP STUDIO PAINT: 3D 파일·BVH 가져오기', href: manual }, { label: 'CLIP STUDIO PAINT: 버전 3 릴리스 노트', href: release }, { label: 'Blender 매뉴얼: Motion Capture (BVH)', href: 'https://docs.blender.org/manual/en/latest/files/import_export/bvh.html' }, { label: 'Autodesk: FBX 파일에 포함되는 데이터', href: 'https://help.autodesk.com/cloudhelp/2025/ENU/3DSMax-Interoperability/files/GUID-26E80277-1645-4C4E-A6B2-44399376490F.htm' }],
  },
];
