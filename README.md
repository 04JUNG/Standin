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

두 개의 독립 문서로 빌드된다(Vite MPA). 라우터는 쓰지 않으므로 정적 호스트에
SPA rewrite 설정이 필요 없다.

- `/` (`index.html`) — 랜딩
  `Header → Hero → Product Demo → Problem → Workflow → Core Benefits →
  Product Principles → Clip Studio → Beta CTA → FAQ → Footer`
- `/signup` (`signup/index.html`) — 계정 만들기. 데스크톱 앱의 "웹에서 계정
  만들기" 버튼이 이 페이지를 외부 브라우저로 연다.

## 디렉터리

```text
src/
├─ components/   레이아웃·Hero·Demo·섹션·폼·공통 컴포넌트
├─ pages/        SignupPage (가입 페이지 문서)
├─ lib/          api.ts (BFF 호출 + 오류 코드 → 문구 매핑)
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

## 가입 페이지(/signup)

회원가입은 데스크톱 앱이 아니라 웹에서 처리한다(앱 `docs/06_AUTH_SPEC.md` §1).
약관 동의와 이메일 인증이 브라우저 흐름이기 때문이다.

흐름:

```text
앱 로그인 화면 → "웹에서 계정 만들기"
  → /signup 에서 가입 (POST /v1/auth/register)
  → "인증 메일을 보냈습니다" + [앱으로 돌아가기]
  → 메일 링크 클릭 → 인증 완료
  → standin:// 로 앱 복귀 → 앱에서 로그인
```

로컬에서 확인하려면 BFF(`Standin-app-server`)를 함께 띄우고 `.env.local`에
`VITE_API_BASE_URL=http://localhost:8080`을 넣는다. 이 값이 없으면 가입 폼은
데모 모드가 되어 **가입 성공을 가장하지 않는다**.

BFF의 `CORS_ORIGINS`에 이 개발 서버 출처(`http://localhost:5173`)가 들어 있어야
요청이 나간다.

> ⚠ **배포된 랜딩에서는 아직 동작하지 않는다.** 랜딩은 HTTPS인데 BFF의 ALB가
> 80 HTTP 전용이라 브라우저가 mixed content로 차단한다. 도메인·ACM 인증서를
> 붙여 443 리스너를 만든 뒤에 가입 링크를 공개한다. 인증 라우트 레이트리밋과
> 개인정보 처리방침 문서도 공개 전 선행 조건이다.

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
