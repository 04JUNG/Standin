import type { FaqItem } from "../types/landing";
import { footer } from "./content";

export const faqItems: FaqItem[] = [
  {
    id: "what-is-standin",
    question: "Standin은 어떤 웹툰 작업 도구인가요?",
    answer:
      footer.tagline,
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
      "Standin의 저장 화면에서 내보낸 파일을 확인한 뒤 클립스튜디오로 가져와 작화에 활용합니다. FBX는 Windows 탐색기나 macOS Finder에서 캔버스로 끌어놓을 수 있습니다. BVH는 클립스튜디오 PRO·EX 3.1.0 이상에서 적용할 3D 인형을 선택하고 파일 > 가져오기 > 3D 데이터로 불러오세요. 가져온 결과의 크기·방향·구도를 러프와 비교하고 조정합니다.",
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
      "네. 키·등신·어깨와 팔다리 비율 등을 직접 조절해 체형을 저장하거나, 러프에 맞춘 자동 체형을 확인한 뒤 필요한 부분을 다듬을 수 있습니다. 오픈베타에서 사용할 수 있습니다.",
  },
  {
    id: "supported-platforms",
    relatedLink: { label: "Windows·macOS 설치 파일 받기", href: "/#beta" },
    question: "Windows와 macOS에서 사용할 수 있나요?",
    answer:
      "Standin은 Windows와 macOS용 데스크톱 앱으로 사용할 수 있습니다. Windows는 .exe 설치 파일, macOS는 Apple Silicon·Intel 공용 .dmg를 제공합니다. Mac에서는 앱을 응용 프로그램 폴더로 옮긴 뒤 실행하세요. 현재 다운로드에는 모바일·태블릿용 앱이 포함되어 있지 않습니다.",
  },
  {
    id: "pricing",
    relatedLink: { label: "오픈베타 무료 범위와 사용 한도", href: "/legal/beta/" },
    question: "Standin은 무료인가요? 유료로 자동 전환되나요?",
    answer:
      "Standin 오픈베타에서 제공하는 분석·후보 선택·보정·내보내기 기능은 무료이며, 별도 유료 신청 없이 자동 결제되지 않습니다. 무료 이용에도 분석 횟수와 전체 처리량 한도가 있으므로 오픈베타 운영정책을 확인하세요. 정식 출시 후 1개월 무료 혜택 이후의 요금은 별도 가격 안내를 확인해야 합니다. 피드백 설문은 무료 이용의 필수 조건이 아닙니다.",
  },
  {
    id: "export-formats",
    relatedLink: { label: "FBX·BVH 가져오기와 버전 확인", href: "/guides/clip-studio-pose-import/#file-formats" },
    question: "FBX와 BVH 내보내기는 무엇이 다른가요?",
    answer:
      "Standin은 저장 화면에 표시된 FBX 또는 BVH 파일을 내보내며, 사용할 수 있는 형식은 서버 지원 상태에 따라 달라집니다. FBX를 사용할 수 없을 때 BVH로 저장되면 체형·손 모양 없이 동작만 포함됩니다. BVH를 불러오려면 클립스튜디오 PRO·EX 3.1.0 이상이 필요합니다. 형식만으로 체형·손·카메라가 모두 똑같이 전달된다고 보장하지 않으므로 가져온 결과를 확인하세요.",
  },
  {
    id: "unpublished-artwork",
    relatedLink: { label: "개인정보처리방침 검토용 미리보기", href: "/legal/privacy/" },
    question: "미공개 원고를 올리기 전에 무엇을 확인해야 하나요?",
    answer:
      "미공개 원고를 올리기 전에는 처리 목적·보관 기간·외부 AI 전달 여부·삭제 방법을 확인하세요. 현재 공개된 Standin 개인정보처리방침은 검토용 미리보기이며, 아직 적용되지 않은 정책과 확인이 필요한 항목을 표시하고 있습니다. 최종 정책과 실제 앱의 동의 안내를 확인하고, 확인되지 않은 처리 조건은 standin.asm@gmail.com으로 문의하세요.",
  },
  {
    id: "commercial-use",
    relatedLink: { label: "콘텐츠 라이선스와 공동 작업 조건", href: "/legal/content-license/" },
    question: "포즈를 참고해 만든 웹툰을 상업적으로 이용할 수 있나요?",
    answer:
      "Standin이 상업 이용 권한을 확보하여 제공하는 자산은 해당 라이선스의 허용 범위 안에서 완성 웹툰·일러스트의 상업 이용에 활용할 수 있습니다. 완성 작품의 이용 허락은 포즈·모델·출력 파일 자체의 재판매나 공개 재배포 허락을 포함하지 않습니다. 제3자 자산의 별도 조건과 공동 작업자에게 파일을 전달하는 조건은 콘텐츠 라이선스에서 확인하세요.",
  },
  {
    id: "availability",
    relatedLink: { label: "현재 버전 다운로드와 참여 안내", href: "/#beta" },
    question: "지금 바로 사용할 수 있나요?",
    answer:
      "Windows·macOS용 설치 파일을 다운로드해 오픈베타에 참여할 수 있습니다. 사전등록이나 피드백 설문 참여는 다운로드와 앱 이용의 필수 조건이 아닙니다. 현재 배포 버전과 설치 파일은 이 페이지의 다운로드 영역에서 확인하세요.",
  },
];
