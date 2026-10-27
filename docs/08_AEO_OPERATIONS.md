# AEO 운영 체크리스트

2026-10-10 · 2026-10-14 갱신 · 공식 주소: https://www.standinpose.com/

2026-10-14: 클로즈베타 종료에 맞춰 대외 안내를 "오픈베타 준비 중"으로 최신화했다.
클로즈베타 다운로드·피드백 페이지와 피드백 수집은 없앴고, 기존 사전등록 폼은
오픈베타 사전등록으로 전환했다. 예전 경로는 `noindex` 리다이렉트 문서로 `/#beta`에 연결한다.

## 코드에 반영한 범위

- 홈과 가이드 2개를 빌드 시 사전 렌더링한다. 같은 React 컴포넌트를 사용해 본문과
  브라우저 화면의 내용이 일치한다.
- 기존 제품 카피의 H1·설명을 보이게 하고, 첫 문장에서 답하는 FAQ 11개를 연결한다(2026-10-15 자연어 검색·체형/3D 모델 질문 추가).
  이용 가능 여부 FAQ는 오픈베타 준비 상태로 답한다.
- 기존 사용 범위와 영상으로 러프→포즈, 클립스튜디오 활용 가이드를 작성한다.
- 공개 페이지별 canonical·OG·JSON-LD, robots.txt, sitemap.xml을 제공한다.
- 가격·평점·지원 OS·새 출시일·최신 앱 기능은 추가하지 않는다.

### 10월 10일 후속 보강

- 첫 화면 제목에 Standin과 웹툰 3D 포즈를 함께 명시하고, 본문에서 입력·후보 선택·클립스튜디오 활용을 바로 설명한다.
- 공개 페이지의 검색·소셜 메타 설명을 보이는 본문 및 JSON-LD와 같은 데이터로 생성한다.
- 가이드에 질문 목차와 고정 문단 링크를 제공하고, 사진 참고·완성 그림 생성과의 차이 및 포즈·원근 점검 방법을 보강한다.
- `/#faq-...`로 방문하거나 같은 페이지에서 해시를 바꾸면 해당 답변을 펼친다. 원문은 JavaScript 없이도 초기 HTML에 포함된다.
- 기존 25개 질문 기준선은 유지한다. 로그인 필요한 측정·색인 확인은 보류하며 즉시 재질문한 결과를 개선 효과로 보고하지 않는다.

## 배포와 발견

### 2026-10-27 추가 최적화

- 기준 코드: `79f8f06` (PR #27). 공개된 오픈베타 다운로드·설문·혜택을 보존한다.
- FAQ 11개를 16개로 보완: 지원 OS, 무료 범위, FBX·BVH, 미공개 원고 확인사항, 상업 이용 조건.
- 홈의 `FAQPage`는 화면에 보이는 같은 FAQ 데이터에서 생성한다. `SoftwareApplication`은 지원 OS·현재 기능·설치 경로·사용 가이드를 연결한다. 평점·후기·정식 가격을 만들지 않는다.
- 제품 정의·메타·schema에 이미지/문장 입력과 Windows·macOS 앱을 일치시킨다. 운영팀에는 푸터에 공개된 X 계정과 기존 브랜드 마크를 연결한다.
- FAQ 검토일, 홈 `dateModified`, 클립스튜디오 가이드 수정일, sitemap `lastmod`를 2026-10-27로 맞춘다. 내용 변경이 없는 러프 가이드의 수정일은 2026-10-19를 유지한다.
- 가이드 두 문서의 Twitter 제목·설명과 소셜 이미지 대체 텍스트를 보완한다. 빌드에서 FAQ 16개의 화면/JSON-LD 일치, 날짜·링크·앱 정보·메타를 검사한다.
- 설치 및 내보내기 안내 근거: 공개 앱 [v0.2.3](https://github.com/04JUNG/Standin-client/releases/tag/v0.2.3), 해당 릴리스 커밋 `e6869fad3b3f7d2f7221f280905a2add11ff87a9`의 저장 화면, [CLIP STUDIO 파일 가져오기 매뉴얼](https://help.clip-studio.com/en-us/manual_en/660_3d/Importing_3D_Files.htm), [3.1.0 릴리스 노트](https://www.clipstudio.net/en/dl/release_note/v3/). Standin 출력 파일의 모든 버전·기기 조합을 실제 실행 검증한 것은 아니다.
- 무료 범위와 상업 이용은 현재 공개된 운영정책·콘텐츠 라이선스의 조건을 요약한다. 개인정보처리방침의 검토용 미리보기 표시와 정책 페이지의 noindex를 유지한다.
- robots는 기존 `User-agent: * / Allow: /`로 허용되어 있어 변경하지 않는다. 실제 크롤러 IP 접근과 인용 성과는 별도 확인 대상이다.
- 사용자가 보고한 외부 점수 약 78점과 목표 95점의 평가 도구·항목은 아직 확인되지 않았다. 내부 준비도 82점(10/19)과 같은 점수로 환산하거나 95점 달성을 주장하지 않는다. 같은 URL·도구·설정으로 재검사한 원본 결과가 필요하다.
- 세부 전후 HTTP/HTML 근거는 master-docs `aeo/2026-10-27/`에 기록한다. 로그인 필요한 측정은 보류한다.

### 2026-10-19 점검·보완

- 기준 코드: `1c02a47` (PR #19). 이후 반영된 오픈베타 사전등록·현재/예정 기능 안내를 유지했다.
- 공개 홈/가이드 3개, robots·사이트맵 200, 없는 주소 404, 비공개 흐름 noindex 확인.
  Googlebot/OAI-SearchBot/PerplexityBot User-Agent 요청도 200이지만 실제 크롤러 IP 검증은 아니다.
- FAQ 5개에 관련 가이드 문단 링크를 연결하고, 러프 가이드에 문장 검색 방법과 예시를 추가했다.
- 가이드 최초 게시일(2026-10-09)과 실제 수정일(2026-10-19)을 본문·Article에 기록했다.
  날짜는 콘텐츠를 실질적으로 수정할 때만 갱신하며 sitemap의 lastmod와 맞춘다.
- 클립스튜디오 관절·카메라 안내에 해당 제품의 공식 매뉴얼을 연결했다.
  이것을 Standin 내보내기 파일 형식·호환성 검증 근거로 사용하지 않는다.
- 공개 운영팀 `Standin 팀`과 문의 주소 `standin.asm@gmail.com`을 푸터·Organization에 일치시켰다.
  근거: master-docs의 `오픈베타_영업_준비/약관_정책/README.md`에 기록된 2026-10-19 확정사항.
  정책 본문은 내부 초안이므로 공개하지 않았다.
- 내부 준비도 평가는 5개 영역 각 20점으로 기록한다. 검색엔진의 공식 점수나 AI 인용 확률이 아니다.
  채점표·전후 운영 HTML·HTTP 결과는 master-docs `aeo/2026-10-19/`에 보관한다.
- 공개 검색 2개 질의에서 결과를 찾지 못했다. 도구 검색 결과만으로 전체 검색엔진 미색인을 단정하지 않는다.
  AI 답변 재측정·Search Console·실제 전환 데이터는 이번 기술 점수와 분리한다.

1. `npm run lint`, `npm run build`를 통과한 `dist/`만 배포한다.
2. 운영 홈과 가이드 2개가 직접 접근 시 200, 미존재 경로는 404로 응답하는지 확인한다.
   로컬 Vite는 `appType: mpa`이며, 호스팅의 별도 SPA fallback 설정은 제거 여부를 점검한다.
3. `https://www.standinpose.com/`으로 canonical·OG·사이트맵 URL이 일치하는지 확인한다.
   apex/이전 공개 호스트의 리디렉션은 호스팅에서 설정하고 가입·인증 경로와 쿼리를 보존한다.
4. `robots.txt`, `sitemap.xml`, 필수 에셋의 실제 응답과 호스팅의 `noindex`·봇 차단을 확인한다.
5. Search Console·Bing Webmaster Tools의 소유권을 확인한 뒤 사이트맵을 제출한다.
6. Search Console URL 검사로 색인·수집 상태를 확인하고 OAI-SearchBot·PerplexityBot 접근을 확인한다.
   필요할 때만 공식 IP와 User-Agent를 검증해 방화벽 예외를 적용한다.

사이트맵 게시나 JSON-LD 추가만으로 검색 색인과 AI 인용이 보장되지는 않는다.
FAQPage 리치 결과나 llms.txt 추가를 성과 목표로 잡지 않는다.

## 콘텐츠 운영

- 가이드가 설명하는 실제 입력·선택·내보내기 흐름이 공개 베타와 일치하는지 검수한다.
- 현재 가이드는 포맷별 호환성·OS별 설치 절차를 보장하지 않는다. 해당 정보는 실제
  공개 빌드에서 검증한 뒤 별도 편집 작업으로 확장한다.
- 실제 사례를 추가할 때 공개 가능한 이미지와 측정 조건을 함께 제공한다.
- 수치 근거 없는 시간 절감·정확도·평점이나 날짜만 바꾸는 업데이트를 하지 않는다.
- 오픈베타 사전등록 폼의 운영 엔드포인트 수신 확인(재배포 후 `오픈베타 사전등록` 탭 기록)과
  개인정보 문서 연결은 운영 확인 항목이다. 로컬 폼의 데모 상태를 운영 수신 여부의 증거로 보지 않는다.

## 성과 기준선

현재 분석 서비스나 외부 보고서 설정은 변경하지 않았다. 접근 가능한 기존 계측부터
확인한 뒤 방문 출처·가이드→오픈베타 사전등록 클릭·사전등록 접수 성공을 연결하고, 오픈베타 공개 후 다운로드·참여 지표를 추가한다.

- Google: Search Console의 검색 실적과 URL 검사. 실제 계정에서 확인한 지표만 기록한다.
- Bing/Copilot: Bing Webmaster Tools에서 접근 가능한 검색·AI 인용 지표를 확인한다.
- 웹: 확인 가능한 AI referrer/UTM과 서버 접수 성공 건수. 이메일은 분석 이벤트에 넣지 않는다.
- 수동 관찰: 브랜드 5개·비브랜드 20개 질문을 같은 언어·검색 조건에서 반복해
  브랜드 언급·공식 URL 인용·제품 설명 정확성을 구분한다.

4주 단위로 기준선을 비교한다. 인용 수와 방문 수만으로 성공을 판단하지 않고
오픈베타 공개 후에는 실제 참여까지 확인한다. 리퍼러 누락과 응답 변동도 기록한다.

## 공식 참고

- [Google AI 검색 최적화](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google AI 검색과 측정](https://developers.google.com/search/docs/appearance/ai-features)
- [OpenAI 크롤러](https://developers.openai.com/api/docs/bots)
- [Perplexity 크롤러](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)
