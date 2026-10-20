# Standin — 웹툰 3D 포즈 어시스턴트 랜딩페이지

러프나 참고 이미지를 입력하면 비슷한 3D 자세를 찾고, 결과를 Clip Studio 작업에
활용할 수 있도록 돕는 **웹툰 작업 보조 도구 Standin**의 반응형 랜딩페이지입니다.

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

아홉 개의 독립 문서로 빌드된다(Vite MPA). 라우터는 쓰지 않으므로 정적 호스트에
SPA rewrite 설정이 필요 없다.

- `/` (`index.html`) — 랜딩
  `Header → Hero → 이미지 입력 → Standin 처리 → Clip Studio 활용 결과 →
  사용 가이드 → 오픈베타 다운로드·설문 → FAQ → Footer`
- `/guides/rough-to-3d-pose/` — 러프 입력·포즈 후보 비교 가이드
- `/guides/clip-studio-pose-import/` — 선택한 결과를 클립스튜디오에서 활용하는 가이드
- `/legal/terms/` · `/legal/privacy/` · `/legal/content-license/` · `/legal/beta/` — 약관 4종, 게시일·적용일 2026-10-19. 본문 사전 렌더링·목차·인쇄·TXT 저장 제공. 미확정 내용이 남은 문서는 검토본으로 표시하며, 배포 전 [게시 준비 기록](docs/LEGAL_PUBLICATION.md)을 확인한다.
- `/signup` (`signup/index.html`) — 계정 만들기. 데스크톱 앱의 "웹에서 계정
  만들기" 버튼이 이 페이지를 외부 브라우저로 연다.

- `/feedback/` (`feedback/index.html`) — 오픈베타 사용 경험 설문, `noindex`.

클로즈베타 종료로 `/closed-beta/`는 `public/`의 `noindex` 리다이렉트 문서가
`/#beta`(오픈베타 다운로드)로 보낸다. `/feedback`과 `/signup`은 끝 슬래시를 정규화한다.

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

server/beta-form/  베타 사전등록 수신 웹앱 (Google Apps Script, 클로즈베타·오픈베타 공용)
server/open-beta-feedback/  새 시트를 사용하는 오픈베타 설문 전용 수신 웹앱
scripts/           Formspree → 구글 시트 이관 도구
```

## 구현 노트 (문서 지침 준수)

- **단순한 고객 흐름**: 무엇을 넣는지 → Standin이 무엇을 하는지 → 어디에
  활용하는지 → 다운로드·사용 후기 순서로 안내합니다.
- **미디어 슬롯**: 실제 제품 사진·GIF·영상이 준비되기 전까지 빈 비율 영역만
  확보합니다. `MediaPlaceholder.tsx` 내부를 실제 미디어로 교체하면 됩니다.
- **색상 변경**: 브랜드·중립·상태 색상은 `src/styles/globals.css`의 `@theme`
  토큰에서 한 번에 변경할 수 있습니다.
- **다운로드**: GitHub 최신 공개 릴리스의 Windows·macOS 설치 파일을 표시합니다.
  목록 조회에 실패해도 GitHub Latest 페이지 링크는 사용할 수 있습니다.
- **오픈베타 설문**: 완료·중단 분기로 필요한 질문만 보여줍니다.
  `VITE_FEEDBACK_ENDPOINT`가 없으면 접수 준비 상태로 표시하고 제출을 막습니다.
  새 시트·수신기 연결과 공개 순서는 [오픈베타 공개 안내](docs/OPEN_BETA_LAUNCH.md)를 참고하세요.
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

배포 환경의 BFF는 `https://api.standinpose.com`을 사용한다. Vercel 환경변수
`VITE_API_BASE_URL`도 이 값으로 설정해야 한다. 인증 라우트 레이트리밋과 개인정보
처리방침 문서는 가입 링크 공개 전 선행 조건이다.

## 기존 사전등록 수신 (현재 홈페이지에서는 사용하지 않음)

클로즈베타 때 만든 Apps Script 웹앱이 그대로 받습니다. **시트 기록 → 디스코드
웹훅 → Gmail 알림**을 한 스크립트에서 처리하며 서버 비용과 서비스 계정 키가 없습니다.

- 오픈베타 등록은 같은 스프레드시트의 `오픈베타 사전등록` 탭에 쌓이고, 디스코드·메일
  알림 제목도 "오픈베타 사전등록"으로 구분됩니다. 클로즈베타 기록은 그대로 둡니다.
- 클로즈베타 사전등록 탭에 같은 이메일이 있으면 비고에 `클로즈베타 사전등록자`가
  붙습니다. 같은 탭 안의 재등록만 `중복(재등록)`으로 봅니다.
- **배포된 웹앱을 최신 `Code.gs`로 새 버전 재배포해야** 탭이 나뉩니다. 이전 배포본은
  `program`을 모르므로 오픈베타 등록을 클로즈베타 탭과 제목으로 기록합니다.
- 코드와 배포 절차: [`server/beta-form/README.md`](server/beta-form/README.md)
- 기존 Formspree 데이터 이관: [`scripts/README.md`](scripts/README.md)

```env
# .env.local (커밋하지 않음) — 클로즈베타 때 쓰던 웹앱 URL 그대로
VITE_BETA_ENDPOINT=https://script.google.com/macros/s/AKfy.../exec
```

배포 환경(Vercel 등)에서는 해당 플랫폼의 환경변수 설정에 같은 값을 등록합니다.
스팸 대응으로 폼에 허니팟 필드가 들어 있고, 웹앱이 이를 걸러냅니다.
`VITE_WINDOWS_DOWNLOAD_URL`·`VITE_MACOS_DOWNLOAD_URL`은 읽지 않습니다.
`VITE_FEEDBACK_ENDPOINT`는 새 설문 전용 수신기 주소로 사용하며 기존 주소를 재사용하지 않습니다.

> 폼 항목(`src/data/content.ts`의 `beta` 옵션)을 고치면 웹앱의 `FIELDS`와
> 이관 스크립트의 컬럼도 함께 고쳐야 시트 열이 어긋나지 않습니다.

## 남은 TODO

- [x] 최신 포즈 에셋 기반 OG·X 카드 이미지(1200×630) 적용
- [ ] 개인정보 처리방침 문서 링크
- [ ] 새 설문 수신기를 배포하고 `VITE_FEEDBACK_ENDPOINT` 설정 및 실제 Google 저장 검증
- [ ] 오픈베타 클라이언트 릴리스를 Latest로 지정하고 설치 확인
- [x] `www.standinpose.com` 기준 canonical / og:url 및 소셜 이미지 절대 URL

## 검색·AEO 빌드와 검증

`npm run build`는 타입 검사, 브라우저 번들, 빌드 전용 SSR 번들,
본문 사전 렌더링, SEO 회귀 검증을 순서대로 실행한다. **배포 디렉터리는 기존과 같은
`dist/`**다. `dist-ssr/`는 빌드 중 사용하는 파일이며 배포하지 않는다.

홈과 가이드 2개는 응답 HTML에 본문이 들어간다. 브라우저에서는 같은 React 트리를
hydrate하므로 기존 포즈 데모와 폼이 동작한다. 개발 서버는 기존처럼 클라이언트에서
렌더링하므로, 사전 렌더링 확인에는 `npm run build` 후 `npm run preview`를 사용한다.

- 초기 HTML·JSON-LD·canonical·로컬 에셋/앵커·사이트맵: `npm run check:seo`
- `/signup/`·`/feedback/`와 `/closed-beta/` 리다이렉트 문서는 `noindex`이며 사이트맵에 포함하지 않는다.
- 빌드 검증이 다운로드·설문 링크와 이벤트 안내를 확인하고 클로즈베타 문구·카운트다운 재노출을 막는다.
- `src/data/guides.ts`에 가이드 내용을 관리한다. 새 페이지를 추가하면 HTML 진입점,
  Vite 입력 목록, `public/sitemap.xml`을 함께 추가한다. 누락은 빌드 검증에서 확인한다.
- JavaScript가 없을 때도 공개 본문·FAQ·GitHub 다운로드 링크를 사용할 수 있다.
  계정·설문 페이지는 브라우저에서 렌더링한다.
- `robots.txt`는 공개 콘텐츠 수집을 허용한다. 모델 학습용 봇의 별도 정책은 추가하지 않는다.

배포 뒤 확인할 운영 항목은 [AEO 운영 체크리스트](docs/08_AEO_OPERATIONS.md)에 있다.
