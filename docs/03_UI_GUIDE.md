# Standin UI 가이드

## 1. 디자인 콘셉트

### 핵심 키워드

- Storyboard
- Pose Guide
- Creator Control
- Practical AI
- Clean Workspace

### 디자인 문장

> 종이 위 러프 선과 디지털 3D 작업 캔버스가 자연스럽게 이어지는, 창작자 중심의 정돈된 제작 도구.

---

## 2. 컬러 시스템

### Brand

| Token | Hex | 용도 |
|---|---:|---|
| `brand-ink` | `#152238` | 로고, 주요 제목, 어두운 섹션 |
| `brand-coral` | `#FF6B57` | Primary CTA, 선택 상태, 관절 포인트 |
| `brand-coral-dark` | `#E95543` | CTA hover |
| `brand-sky` | `#8ED8E8` | 분석 가이드, 보조 강조 |
| `brand-paper` | `#F8F5EF` | 기본 페이지 배경 |
| `brand-canvas` | `#202B3C` | 3D 데모 캔버스 |

### Neutral

| Token | Hex | 용도 |
|---|---:|---|
| `neutral-950` | `#101722` | 본문 최강조 |
| `neutral-800` | `#293446` | 본문 |
| `neutral-600` | `#667085` | 보조 텍스트 |
| `neutral-400` | `#A7AFBD` | 비활성 텍스트 |
| `neutral-250` | `#D8DDE5` | 테두리 |
| `neutral-100` | `#EEF1F4` | 구분 배경 |
| `white` | `#FFFFFF` | 카드와 역상 텍스트 |

### Semantic

| Token | Hex | 용도 |
|---|---:|---|
| `success` | `#2E9B73` | 완료, 사용 가능 |
| `warning` | `#D58A21` | 베타, 보정 필요 |
| `error` | `#D94A4A` | 입력 오류 |
| `info` | `#367EBB` | 안내 |

### 사용 비율

- Paper / White: 70%
- Ink / Canvas: 20%
- Coral: 7%
- Sky 및 Semantic: 3%

코랄을 넓은 배경에 남용하지 않는다. 선택과 행동이 필요한 지점에 집중한다.

---

## 3. 타이포그래피

### 권장 폰트

한국어:
- `Pretendard Variable`
- 대체: `Noto Sans KR`, system-ui

영문 포인트:
- 기본은 동일 폰트 사용
- 별도 디스플레이 폰트 없이도 충분히 브랜드화 가능

### Type Scale

| Style | Desktop | Mobile | Weight | Line Height |
|---|---:|---:|---:|---:|
| Display | 64px | 40px | 700 | 1.08 |
| H1 | 56px | 38px | 700 | 1.12 |
| H2 | 40px | 30px | 700 | 1.2 |
| H3 | 24px | 21px | 650 | 1.3 |
| Lead | 20px | 18px | 400 | 1.65 |
| Body | 16px | 16px | 400 | 1.7 |
| Small | 14px | 14px | 400 | 1.55 |
| Label | 12px | 12px | 650 | 1.4 |

### 규칙

- H1은 최대 2~3줄
- 본문 한 줄 길이는 데스크톱 기준 65자 내외
- 강조를 위해 굵기와 컬러를 함께 과도하게 쓰지 않는다.
- 영문 Eyebrow는 자간 `0.12em` 정도 사용

---

## 4. 레이아웃

### Container

- Max width: `1200px`
- Wide visual max: `1360px`
- Desktop horizontal padding: `32px`
- Tablet: `24px`
- Mobile: `20px`

### Grid

- Desktop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns
- 기본 gap: 24px
- Hero gap: 48~72px

### Section Spacing

- Desktop: 120px 상하
- Tablet: 88px
- Mobile: 72px
- 관련된 두 블록 사이: 32~48px

---

## 5. 형태와 표면

### Radius

| Token | Value |
|---|---:|
| `radius-sm` | 8px |
| `radius-md` | 14px |
| `radius-lg` | 22px |
| `radius-xl` | 32px |
| `radius-pill` | 999px |

### Border

- 기본: `1px solid #D8DDE5`
- 어두운 캔버스 내부: 흰색 12~18% 투명도
- 웹툰 패널은 2px 선을 부분적으로 사용 가능

### Shadow

- 기본 카드: 매우 약한 그림자
- 떠 있는 데모 패널: `0 24px 60px rgba(16, 23, 34, 0.14)`
- CTA hover에서 그림자보다 위치 이동 1~2px 정도를 우선

### Texture

종이 질감은 2~3% 수준의 미세 노이즈만 허용한다. 텍스트 가독성을 방해하는 강한 질감은 금지한다.

---

## 6. 컴포넌트 스타일

### Primary Button

- 높이: 48px
- 좌우 padding: 20~24px
- 배경: Coral
- 텍스트: White
- Hover: Coral Dark
- Focus: 3px Sky ring
- Disabled: Neutral 250 / Neutral 600
- 아이콘은 오른쪽 또는 왼쪽 한 개만

### Secondary Button

- 밝은 배경: 흰색 또는 투명, Ink border
- 어두운 배경: 투명, White 25% border
- hover 시 배경 대비만 가볍게 변경

### Text Link

- 밑줄을 기본으로 숨길 수 있으나 hover와 focus에서 명확히 표시
- 작은 화살표 아이콘 사용 가능

### Card

- 배경 White
- Border Neutral 250
- Radius 18~22px
- padding 24~32px
- 카드 전체가 클릭 가능할 때만 hover elevation 적용

### Badge

- 높이 28~32px
- pill 형태
- 아이콘은 14~16px
- Coral을 모든 배지에 사용하지 말고 neutral, sky, warning을 구분

### Input

- 높이 최소 48px
- label을 placeholder로 대체하지 않는다.
- 오류 문구는 입력 아래에 연결
- focus border와 ring 동시 제공

---

## 7. 제품 데모 UI

### Canvas

- 배경: `brand-canvas`
- 얇은 격자: 흰색 5~7%
- 중심 가이드: Sky 30%
- 패널 chrome은 실제 디자인 툴처럼 절제

### Rough Panel

- 종이색 또는 아주 밝은 회색
- 러프 선은 Ink 50~70%
- 선택 인물 박스는 Sky
- 관절 점은 Coral
- 인물 인덱스는 `01`, `02`

### Pose Candidate

상태:
- Default: 어두운 카드 또는 흰색 카드
- Hover: 테두리 밝아짐
- Selected: Coral 2px border + 체크 아이콘
- Low confidence: Warning badge
- Unavailable: 투명도 감소

카드 내용:
- 포즈 썸네일
- 간단한 태그 1~2개
- 유사도 숫자는 실제 모델 수치가 아니면 표시하지 않는다.

### 3D Mannequin

- 실제 3D 에셋이 없으면 단순한 관절형 인체 실루엣 사용
- 사실적인 피부나 캐릭터 렌더보다 중립적인 회색 마네킹
- 선택 포인트와 회전 핸들에 Coral/Sky 사용
- 성별·체형 고정관념을 과도하게 드러내지 않는다.

---

## 8. 이미지와 일러스트 방향

### 사용 권장

- 러프 콘티 선
- 패널 분할 프레임
- 2D 스켈레톤 오버레이
- 중립적 3D 마네킹
- 선택된 포즈 후보
- Clip Studio로 넘어가는 파일 카드 또는 화살표

### 피해야 할 것

- 일반적인 로봇 머리 또는 AI 뇌 아이콘
- 우주·네온·홀로그램 중심 이미지
- 실사 웹툰 작가 스톡 사진
- 출처와 사용 권한이 불분명한 웹툰 원고
- 특정 유명 작품을 연상시키는 캐릭터
- 완성 그림이 자동 생성되는 듯한 before/after

---

## 9. 모션 가이드

### 원칙

- 모션은 제품 흐름 이해를 돕는 데만 사용
- 지속적으로 움직이는 장식은 최소화
- 150~350ms 범위
- easing: `cubic-bezier(0.22, 1, 0.36, 1)`

### 권장 모션

- 콘티 카드에서 스켈레톤 선이 순차적으로 나타남
- 후보 카드가 50ms 간격으로 등장
- 후보 선택 시 프리뷰가 부드럽게 교체
- 스크롤 진입 시 12~20px 이동과 fade

### 금지

- 과도한 parallax
- 스크롤을 가로채는 애니메이션
- 긴 로딩 가짜 연출
- 3D 마네킹이 계속 회전하는 연출
- reduced-motion 설정 무시

---

## 10. 접근성

- Coral 배경 위 흰색 텍스트 대비를 실제로 점검
- 작은 Sky 텍스트를 밝은 배경에서 단독 사용하지 않음
- 색상만으로 선택 상태를 표현하지 않음
- 후보 선택에 체크 아이콘과 텍스트 제공
- 최소 터치 영역 44×44px
- 초점 순서가 시각 순서와 일치
- 제품 데모 탭은 ARIA tab pattern을 따름
