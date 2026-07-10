# Standin — 웹툰 3D 포즈 어시스턴트 랜딩페이지

러프 콘티에서 가까운 3D 인체 포즈 후보를 제안하고, 작가가 선택·조정해 클립스튜디오
작업으로 이어가는 **작가 보조 도구 Standin**의 반응형 랜딩페이지입니다.

> 완성은 작가가. 시작점은 Standin이.

## 기술 스택

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [lucide-react](https://lucide.dev/) 아이콘
- 폰트: Pretendard Variable (CDN)

## 실행 방법

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (기본 http://localhost:5173)
npm run build    # 타입 체크 + 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

## 페이지 구조

`Header → Hero → Product Demo → Problem → Workflow → Core Benefits →
Product Principles → Clip Studio → Beta CTA → FAQ → Footer`

## 디렉터리

```text
src/
├─ components/   레이아웃·Hero·Demo·섹션·폼·공통 컴포넌트
├─ data/         카피/후보/FAQ 콘텐츠 (content.ts, poseCandidates.ts, faq.ts)
├─ hooks/        useReveal, useActiveSection
├─ types/        landing.ts
└─ styles/       globals.css (디자인 토큰 + 기본 스타일)
```

## 구현 노트 (문서 지침 준수)

- **가짜 처리 없음**: 파일 업로드/서버 분석/가짜 로딩을 넣지 않고, 데모는
  "제품 흐름 예시"로 명시합니다. 후보를 누르면 3D 프리뷰만 교체됩니다.
- **작가 선택 중심**: "AI가 확정"이 아니라 "후보 제안 → 작가 선택" 구조를
  선택 상태·체크 아이콘·카피로 드러냅니다.
- **3D 에셋 대체**: 실제 3D/이미지 에셋 확정 전까지 중립 회색 SVG 관절
  마네킹(`components/demo/Mannequin.tsx`)으로 포즈 5종을 표현합니다.
- **베타 폼**: 백엔드 미연결 상태입니다. 클라이언트 검증까지만 수행하고
  실제 등록 성공을 위조하지 않으며 "화면 시연용"임을 명시합니다.
  실제 수집을 붙일 때 `BetaSignupForm.tsx`의 `HAS_BACKEND`와 endpoint를 연결하세요.
- **접근성**: skip link, `focus-visible` 링, `prefers-reduced-motion` 대응,
  키보드 접근(후보 버튼·네이티브 `<details>` FAQ), 색+아이콘 병행 표기.

## 남은 TODO

- [ ] 실제 3D/이미지 포즈 에셋 및 OG 이미지(1200×630) 제작 후 교체
- [ ] 베타 폼 수집 endpoint 연결 및 개인정보 처리방침 문서 링크
- [ ] canonical / og:url / og:image 실제 도메인 확정 후 추가
