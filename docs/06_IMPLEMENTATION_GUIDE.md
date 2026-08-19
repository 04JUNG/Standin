# Standin 구현 가이드

## 1. 목표

이 문서는 Claude가 랜딩페이지를 실제 코드로 옮길 때의 기술적 기준을 정의한다.

기본 우선순위:

1. 메시지 정확성
2. 반응형 레이아웃
3. 제품 흐름 이해
4. 접근성
5. 성능
6. 장식적 애니메이션

---

## 2. 초기 설정

기존 저장소가 비어 있을 때 권장:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install lucide-react
```

Tailwind 사용 시 해당 버전에 맞는 공식 설치 방식을 따른다. 버전별 설정을 기억으로 추정하지 말고 설치된 패키지와 공식 문서 기준으로 확인한다.

Framer Motion은 정적 CSS 전환으로 부족한 경우에만 추가한다.

---

## 3. 디자인 토큰

CSS 변수 예시:

```css
:root {
  --color-brand-ink: #152238;
  --color-brand-coral: #ff6b57;
  --color-brand-coral-dark: #e95543;
  --color-brand-sky: #8ed8e8;
  --color-brand-paper: #f8f5ef;
  --color-brand-canvas: #202b3c;

  --color-text-primary: #101722;
  --color-text-secondary: #667085;
  --color-border: #d8dde5;
  --color-surface: #ffffff;
  --color-surface-muted: #eef1f4;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-xl: 32px;

  --container: 1200px;
  --shadow-float: 0 24px 60px rgba(16, 23, 34, 0.14);
}
```

토큰을 컴포넌트마다 하드코딩하지 않는다.

---

## 4. 기본 HTML 구조

```tsx
<>
  <Header />
  <main>
    <HeroSection />
    <ProductDemo />
    <ProblemSection />
    <WorkflowSection />
    <BenefitsSection />
    <PrinciplesSection />
    <ClipStudioSection />
    <BetaSection />
    <FaqSection />
  </main>
  <Footer />
</>
```

각 섹션에 명확한 id를 부여한다.

---

## 5. Hero 구현

### 레이아웃

```css
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(480px, 1.05fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}
```

1024px 이하에서 단일 컬럼으로 전환한다.

### H1

`clamp()` 사용:
```css
font-size: clamp(2.5rem, 6vw, 4rem);
```

### 제품 미리보기

실제 3D가 준비되지 않았다면:
- SVG 인체 관절
- CSS transform을 통한 포즈 프레임 전환
- 이미지 sprite 또는 3~5개의 최적화된 WebP
- 캔버스 구현보다 일반 DOM/SVG 우선

---

## 6. 제품 데모 구현 전략

### Level 1 — 정적

- 샘플 콘티
- 스켈레톤 오버레이
- 후보 5개
- 선택된 3D 프리뷰

### Level 2 — 인터랙티브

- 후보 클릭 시 selected state
- 단계 탭
- 전환 애니메이션
- 안내 툴팁

### Level 3 — 실제 3D

다음 조건을 충족할 때만:
- 라이선스가 명확한 GLB/VRM 에셋
- 모바일 성능 점검
- 로딩 fallback
- WebGL 미지원 fallback
- 모델 최적화

랜딩페이지 목적상 Level 2로도 충분하다.

---

## 7. SVG 스켈레톤 권장

- 관절을 `<circle>`
- 뼈대를 `<line>` 또는 `<path>`
- `vector-effect="non-scaling-stroke"`
- 장식용이면 `aria-hidden="true"`
- 분석 결과를 설명하는 주요 시각이면 별도 캡션 제공
- 선 굵기 2~3px
- 관절점 5~7px

애니메이션:
```css
.skeleton-path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 700ms ease forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

실제 pathLength를 설정하거나 브라우저 호환을 확인한다.
reduced motion에서는 애니메이션을 제거한다.

---

## 8. 반응형 구현

### 360~767

- Header CTA 축약 가능
- Hero 텍스트 우선
- 버튼은 세로 또는 2열
- 데모 UI 단계별 보기
- 카드 padding 20px
- H1 38~42px 이하
- 긴 영문 라벨 줄바꿈 주의

### 768~1023

- Hero 단일 또는 5:7 레이아웃
- Benefits 2열
- Workflow 2×2 가능

### 1024 이상

- Hero 2열
- Problem 3열
- Benefits 4열 또는 2×2
- Principles 2열
- Clip Studio 2열

---

## 9. 폼 구현

간단한 TypeScript 검증 예시:

```ts
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: BetaFormValues) {
  const errors: Partial<Record<keyof BetaFormValues, string>> = {};

  if (!emailPattern.test(values.email)) {
    errors.email = "올바른 이메일 주소를 입력해 주세요.";
  }

  if (!values.role) {
    errors.role = "작업 형태를 선택해 주세요.";
  }

  if (!values.consent) {
    errors.consent = "안내 수신 동의가 필요합니다.";
  }

  return errors;
}
```

실제 API:
- 환경변수로 endpoint 관리
- 로컬에서 endpoint가 없으면 submit disabled 또는 데모 안내
- API 키를 프론트 코드에 넣지 않음

---

## 10. 메타 및 SEO

`index.html` 또는 프레임워크 메타 설정:

```html
<title>Standin — 콘티에서 시작하는 웹툰 3D 포즈 어시스턴트</title>
<meta
  name="description"
  content="러프 콘티를 분석해 가까운 3D 인체 포즈 후보를 제안하고, 작가가 선택·조정해 클립스튜디오 작업으로 이어가는 웹툰 제작 보조 도구입니다."
/>
<meta property="og:title" content="Standin — 웹툰 3D 포즈 어시스턴트" />
<meta property="og:description" content="완성은 작가가. 시작점은 Standin이." />
<meta property="og:type" content="website" />
```

canonical URL과 OG URL은 실제 도메인이 정해진 뒤 추가한다.

---

## 11. 성능

- Hero LCP 에셋은 200KB 안팎을 지향
- WebP/AVIF 사용
- below-the-fold 이미지 lazy load
- width/height 명시
- 3D 라이브러리를 쓴다면 dynamic import
- 스크롤 이벤트는 IntersectionObserver 우선
- 초기 JS 번들에 불필요한 차트·3D 라이브러리 금지

---

## 12. 접근성 구현

### Skip Link

```html
<a class="skip-link" href="#main-content">본문으로 바로가기</a>
```

### Focus

```css
:focus-visible {
  outline: 3px solid var(--color-brand-sky);
  outline-offset: 3px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Accordion

native details 사용을 우선한다.

---

## 13. 콘텐츠 관리

카피는 JSX에 흩어놓기보다 `src/data/content.ts`로 분리하는 것을 권장한다.

예시:
```ts
export const heroContent = {
  eyebrow: "WEBTOON 3D POSE ASSISTANT",
  title: "콘티 속 포즈를, 그릴 수 있는 3D 시작점으로",
  description: "...",
};
```

단, 지나친 CMS 형태의 추상화는 피한다.

---

## 14. 배포 전 확인

```bash
npm run lint
npm run build
```

추가 확인:
- Chrome, Edge, Safari 계열
- 모바일 360px
- 키보드만으로 탐색
- Lighthouse 기본 점검
- 콘솔 warning
- 깨진 링크
- 폼 endpoint
- OG 이미지
- favicon
- 개인정보 처리방침
