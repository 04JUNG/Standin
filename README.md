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
- **베타 폼**: [Formspree](https://formspree.io) 연동을 지원합니다. 폼 ID를
  환경변수(`VITE_FORMSPREE_ID`)로 주입하면 실제 제출 모드로, 없으면 검증만
  수행하는 데모 모드로 동작합니다. 데모 모드에서는 등록 성공을 위조하지 않고
  "화면 시연용"임을 명시합니다.
- **접근성**: skip link, `focus-visible` 링, `prefers-reduced-motion` 대응,
  키보드 접근(후보 버튼·네이티브 `<details>` FAQ), 색+아이콘 병행 표기.

## 베타 폼(Formspree) 연동

1. [formspree.io](https://formspree.io)에 가입하고 새 폼을 생성합니다.
2. 발급된 엔드포인트(`https://formspree.io/f/xxxxxxxx`)에서 **폼 ID**(`xxxxxxxx`)를 복사합니다.
3. 프로젝트 루트에 `.env.local`을 만들고 아래처럼 넣습니다(커밋하지 않음):
   ```env
   VITE_FORMSPREE_ID=xxxxxxxx
   ```
4. 개발 서버를 재시작(`npm run dev`)하면 폼이 실제 제출 모드로 바뀝니다.
5. 첫 제출 후 Formspree 대시보드에서 등록 내역을 확인하고,
   이메일 알림을 받으려면 폼 설정에서 알림 주소를 지정하세요.

> 배포 환경(Vercel/Netlify 등)에서는 해당 플랫폼의 환경변수 설정에
> `VITE_FORMSPREE_ID`를 등록합니다. Formspree 무료 플랜은 도메인 등록/월 제출
> 한도가 있으니 공개 전 플랜과 스팸 필터(reCAPTCHA 등)를 확인하세요.

## 남은 TODO

- [ ] 실제 3D/이미지 포즈 에셋 및 OG 이미지(1200×630) 제작 후 교체
- [ ] Formspree 폼 ID 발급·주입 및 개인정보 처리방침 문서 링크
- [ ] canonical / og:url / og:image 실제 도메인 확정 후 추가
