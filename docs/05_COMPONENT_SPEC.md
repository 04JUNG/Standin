# Standin 컴포넌트 명세

## 1. 권장 디렉터리

```text
src/
├─ app/
│  ├─ App.tsx
│  └─ routes.tsx
├─ components/
│  ├─ common/
│  │  ├─ Button.tsx
│  │  ├─ Container.tsx
│  │  ├─ SectionHeading.tsx
│  │  ├─ Badge.tsx
│  │  └─ IconLabel.tsx
│  ├─ layout/
│  │  ├─ Header.tsx
│  │  └─ Footer.tsx
│  ├─ hero/
│  │  ├─ HeroSection.tsx
│  │  └─ HeroProductPreview.tsx
│  ├─ demo/
│  │  ├─ ProductDemo.tsx
│  │  ├─ StoryboardPanel.tsx
│  │  ├─ SkeletonOverlay.tsx
│  │  ├─ PoseCandidateList.tsx
│  │  ├─ PoseCandidateCard.tsx
│  │  └─ PosePreview.tsx
│  ├─ sections/
│  │  ├─ ProblemSection.tsx
│  │  ├─ WorkflowSection.tsx
│  │  ├─ BenefitsSection.tsx
│  │  ├─ PrinciplesSection.tsx
│  │  ├─ ClipStudioSection.tsx
│  │  ├─ BetaSection.tsx
│  │  └─ FaqSection.tsx
│  └─ forms/
│     └─ BetaSignupForm.tsx
├─ data/
│  ├─ content.ts
│  ├─ poseCandidates.ts
│  └─ faq.ts
├─ hooks/
│  ├─ useReducedMotion.ts
│  └─ useActiveSection.ts
├─ assets/
│  ├─ storyboard/
│  ├─ poses/
│  ├─ icons/
│  └─ og/
├─ styles/
│  ├─ globals.css
│  └─ tokens.css
└─ types/
   └─ landing.ts
```

프로젝트 규모가 작다면 `app`, `hooks`, `types`는 단순화할 수 있다. 단, 모든 섹션을 `App.tsx` 한 파일에 작성하지 않는다.

---

## 2. 타입 초안

```ts
export type PoseCandidate = {
  id: string;
  title: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  confidence?: "high" | "medium" | "low";
};

export type WorkflowStep = {
  id: string;
  step: number;
  title: string;
  description: string;
  imageSrc?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type BetaFormValues = {
  email: string;
  role: "" | "artist" | "studio" | "assistant" | "other";
  consent: boolean;
};
```

실제 수치 기반 confidence가 없다면 퍼센트 유사도를 임의로 만들지 않는다.

---

## 3. Header

Props:
```ts
type HeaderProps = {
  ctaHref?: string;
};
```

요구사항:
- 로고 클릭 시 상단 이동
- desktop navigation
- mobile menu 또는 축약 navigation
- sticky 가능
- 페이지 스크롤 후 배경 대비 확보
- CTA는 한 개만 강조

접근성:
- nav에 `aria-label="주요 메뉴"`
- 모바일 토글에 `aria-expanded`
- ESC로 메뉴 닫기

---

## 4. HeroProductPreview

상태:
```ts
type HeroPreviewStage =
  | "storyboard"
  | "analysis"
  | "candidates"
  | "selected";
```

필수 요소:
- 웹툰 패널 프레임
- 스켈레톤 오버레이
- 포즈 후보 미니 카드
- 선택 상태
- “제품 흐름 예시” 라벨

구현 우선순위:
1. CSS/SVG 기반 정적 합성
2. 간단한 상태 전환
3. 실제 3D 렌더는 충분한 에셋과 성능 여유가 있을 때만

자동 애니메이션이 있다면:
- 사용자가 정지 가능
- 브라우저 탭 비활성화 시 불필요한 타이머 정리
- reduced motion에서는 정적 selected 상태 표시

---

## 5. ProductDemo

권장 state:
```ts
const [selectedPoseId, setSelectedPoseId] = useState(candidates[0].id);
const [activeStage, setActiveStage] = useState<DemoStage>("candidates");
```

Desktop:
- 12 column 중 storyboard 4 / preview 5 / candidates 3
- 또는 storyboard 5 / result 7

Mobile:
- 단계 탭
- 한 번에 한 패널
- 후보 목록은 수평 snap 또는 2열
- 선택 결과가 후보 목록보다 먼저 보이지 않도록 논리 순서 유지

제품 오해 방지:
- 업로드 input을 넣더라도 실제 분석 기능이 없다면 파일을 서버로 보내지 않는다.
- 사용자 이미지가 처리되는 듯한 가짜 로딩을 만들지 않는다.
- 샘플 이미지를 선택하는 구조가 안전하다.

---

## 6. PoseCandidateCard

Props:
```ts
type PoseCandidateCardProps = {
  candidate: PoseCandidate;
  selected: boolean;
  onSelect: (id: string) => void;
};
```

상태 표현:
- selected: border + check icon + `aria-pressed`
- hover: 미세한 상승
- focus-visible: 명확한 ring
- confidence가 low인 경우에만 `보정 필요` 배지

접근성:
- 카드 전체를 button으로 구현
- 이미지 alt 제공
- 키보드 방향키 지원은 선택 사항이나 tab 접근은 필수

---

## 7. WorkflowSection

데이터 기반으로 작성한다.

```ts
const workflowSteps: WorkflowStep[] = [...]
```

기능:
- 데스크톱에서 진행선
- 모바일에서 세로 연결선
- 스크롤 애니메이션은 가볍게
- 단계 번호를 장식이 아닌 텍스트로 제공

---

## 8. PrinciplesSection

두 개의 리스트를 대비시킨다.

컴포넌트:
```tsx
<ResponsibilityColumn
  title="Standin이 돕는 일"
  items={...}
/>
<ResponsibilityColumn
  title="작가가 결정하는 일"
  items={...}
/>
```

작가 쪽 컬럼이 더 강하게 보이도록:
- Coral 강조
- 마지막 행에 “최종 작화” 배치
- 자동화가 사용자를 대체하지 않는 구조를 시각적으로 전달

---

## 9. ClipStudioSection

요구사항:
- 공식 로고 사용 권한이 불확실하면 텍스트와 일반적인 앱 프레임으로 표현
- “공식 연동”이라는 문구 금지
- 흐름 화살표는 모바일에서 아래 방향으로 변경
- 내보내기 포맷을 확정하지 않았다면 FBX 등 특정 포맷을 메인 카피에 넣지 않음

---

## 10. BetaSignupForm

검증:
- 이메일 필수
- consent 필수
- role 선택
- 브라우저 기본 검증에만 의존하지 않고 오류 메시지 제공

상태:
```ts
type SubmitState = "idle" | "submitting" | "success" | "error";
```

백엔드 미연결:
- `onSubmit`에서 실제 성공 상태를 위조하지 않는다.
- 개발 환경에서는 console 또는 로컬 UI로 `데모 폼` 안내
- 공개 배포 전 실제 endpoint 연결 여부 확인

백엔드 연결 시:
- 중복 제출 방지
- 개인정보 최소 수집
- rate limit
- 서버 오류 안내
- 개인정보 처리방침 링크

---

## 11. FAQ

- native `<details>` 또는 접근 가능한 accordion
- 하나만 열리게 강제할 필요 없음
- 질문은 button 또는 summary
- 내용이 열릴 때 레이아웃 점프가 과하지 않게
- URL hash 연동은 선택

---

## 12. 공통 SectionHeading

Props:
```ts
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
};
```

규칙:
- title은 h2
- 섹션 내부 카드 제목은 h3
- eyebrow만 대문자
- description max-width 제한

---

## 13. 아이콘

권장:
- Upload
- ScanLine
- PersonStanding
- Layers3
- MousePointerClick
- SlidersHorizontal
- FileOutput
- PenTool
- Check
- ArrowRight

한 카드에 아이콘 여러 개를 넣지 않는다.
아이콘 크기:
- inline 16~18px
- card 22~28px
- feature emblem 32px 이하

---

## 14. 테스트 체크리스트

### UI

- 360px에서 수평 스크롤 없음
- 768px에서 레이아웃 중간 상태 자연스러움
- 1280px에서 빈 공간이 과도하지 않음
- 다크 데모 영역 텍스트 대비 확인

### Interaction

- 모든 CTA 작동
- 앵커 이동 시 헤더에 가려지지 않음
- 후보 선택 상태 변경
- FAQ 키보드 작동
- 폼 오류와 focus 이동

### Content

- “완전 자동” 과장 문구 없음
- “공식 플러그인” 표현 없음
- 현재 기능과 미래 기능 구분
- 임의 통계와 가짜 사용자 후기 없음

### Performance

- Hero 이미지 최적화
- 불필요한 3D 라이브러리 제외
- 애니메이션 번들 최소화
- 폰트 preload는 필요한 weight만
