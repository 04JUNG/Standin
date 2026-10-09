# AEO 운영 체크리스트

2026-10-09 · 공식 주소: https://www.standinpose.com/

사용자 지시에 따라 현재 클로즈베타 안내·일정·CTA·동의 목적을 보존한다.
오픈베타 준비는 진행 중이지만, 대외 안내 최신화는 이번 작업 범위에서 제외한다.

## 코드에 반영한 범위

- 홈과 가이드 2개를 빌드 시 사전 렌더링한다. 같은 React 컴포넌트를 사용해 본문과
  브라우저 화면의 내용이 일치한다.
- 기존 제품 카피의 H1·설명을 보이게 하고, 첫 문장에서 답하는 제품 FAQ 8개를 연결한다.
  과거 사전등록을 안내하는 FAQ는 노출하지 않으며 참여 방법은 기존 `/closed-beta/` 동선을 유지한다.
- 기존 사용 범위와 영상으로 러프→포즈, 클립스튜디오 활용 가이드를 작성한다.
- 공개 페이지별 canonical·OG·JSON-LD, robots.txt, sitemap.xml을 제공한다.
- 가격·평점·지원 OS·새 출시일·최신 앱 기능은 추가하지 않는다.

## 배포와 발견

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
- 폼 운영 엔드포인트의 수신 확인과 개인정보 문서 연결은 기존 운영 확인 항목이다.
  로컬 폼의 데모 상태를 운영 수신 여부의 증거로 보지 않는다.

## 성과 기준선

현재 분석 서비스나 외부 보고서 설정은 변경하지 않았다. 접근 가능한 기존 계측부터
확인한 뒤 방문 출처·가이드→베타 시작 클릭·다운로드·피드백 접수 성공을 연결한다.

- Google: Search Console의 검색 실적과 URL 검사. 실제 계정에서 확인한 지표만 기록한다.
- Bing/Copilot: Bing Webmaster Tools에서 접근 가능한 검색·AI 인용 지표를 확인한다.
- 웹: 확인 가능한 AI referrer/UTM과 서버 접수 성공 건수. 이메일은 분석 이벤트에 넣지 않는다.
- 수동 관찰: 브랜드 5개·비브랜드 20개 질문을 같은 언어·검색 조건에서 반복해
  브랜드 언급·공식 URL 인용·제품 설명 정확성을 구분한다.

4주 단위로 기준선을 비교한다. 인용 수와 방문 수만으로 성공을 판단하지 않고
클로즈베타 참여까지 확인한다. 리퍼러 누락과 응답 변동도 기록한다.

## 공식 참고

- [Google AI 검색 최적화](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google AI 검색과 측정](https://developers.google.com/search/docs/appearance/ai-features)
- [OpenAI 크롤러](https://developers.openai.com/api/docs/bots)
- [Perplexity 크롤러](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)
