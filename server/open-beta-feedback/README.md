# 오픈베타 설문 수신기

이 수신기는 `/feedback/` 전용이다. 기존 `server/beta-form` 및 사전등록 시트와 분리한다.

- 새 응답 시트: [Standin 오픈베타 피드백 · 2026-10-21](https://docs.google.com/spreadsheets/d/1eUOkWlltxkPJfZQknWrDJvlKI-fKn6drgqs1fAzoZfA/edit)
- 탭: `오픈베타 피드백`, 헤더 `A1:Y1`
- 스크립트 속성 `FEEDBACK_SHEET_ID`: `1eUOkWlltxkPJfZQknWrDJvlKI-fKn6drgqs1fAzoZfA`
- 문항 정본: `src/data/feedbackSurvey.ts`. 변경 후 `npm run sync:feedback`을 실행하고 `Schema.gs`도 함께 배포한다.

## 배포

1. **새 시트**에서 확장 프로그램 → Apps Script를 연다. 기존 클로즈베타 수신 스크립트에 덮어쓰지 않는다.
2. 이 폴더의 `Code.gs`, `Schema.gs`, `appsscript.json`을 각각 넣는다. 매니페스트에 Drive v3 고급 서비스가 포함되어야 한다.
3. 프로젝트 설정 → 스크립트 속성에 위 `FEEDBACK_SHEET_ID`를 설정한다.
4. `setupOpenBetaFeedback`을 실행한다. 처음에는 운영 계정의 권한 승인이 필요하다.
   - 기존 헤더가 다르면 덮어쓰지 않고 중단한다.
   - 새 비공개 첨부 폴더를 만들고 `FEEDBACK_UPLOAD_FOLDER_ID`를 저장한다.
   - 응답·첨부를 90일 후 정리하는 일일 트리거를 만든다. 스크립트 실행 실패 알림도 확인한다.
5. 웹 앱으로 배포한다. 실행 사용자: 본인, 접근: 모든 사용자. 응답 시트와 첨부 폴더는 공개 공유하지 않는다.
6. 발급된 `/exec` URL을 랜딩 배포 환경의 `VITE_FEEDBACK_ENDPOINT`에 설정하고 새로 빌드한다. **`VITE_BETA_ENDPOINT`는 사용하지 않는다.**
7. `/exec`를 GET했을 때 `service: standin-open-beta-feedback`, `surveyVersion: open-beta-2026-10-21-v1`을 확인한다.
8. 실제 `/feedback/`에서 완료·중단 각 1건을 제출한다. 선택 이메일·이미지 없이도 저장되는지, 이미지 첨부가 새 비공개 폴더에 들어가는지, 재제출 시 행이 중복되지 않는지 확인한다.

## 운영 연결 상태 (2026-10-21)

- [Apps Script 프로젝트](https://script.google.com/home/projects/12Jz9S8BKsw4_7qnW2wodoVwME2osOwYJgvmCmgwv-qLPffIJ-vF74_7y/edit)의 웹 앱 버전 1 배포를 완료했다.
- 수신 주소: `https://script.google.com/macros/s/AKfycbxHESwtZaF2CIumgLYkYVJTXhwkTKUbgmQq0pawJLT0wCsQ0c5UvO6hA3aeuEKFXmeVXA/exec`
- Vercel `standin` 프로젝트의 **Production·Preview** `VITE_FEEDBACK_ENDPOINT`를 위 주소로 저장했다. 종전 클로즈베타 수신 주소를 교체했다.
- `setupOpenBetaFeedback` 실행을 완료했다. 첨부 폴더 ID는 `1b_-GQQAYL1L8rx4SZIIC4N3oB3WjAM1j`이며, `deleteExpiredFeedback` 시간 기반 트리거 1개를 확인했다.
- [PR 미리보기 설문](https://standin-git-codex-open-beta-launch-linelie00s-projects.vercel.app/feedback/)을 새 환경변수로 재배포한 뒤 실제 브라우저 제출을 확인했다. 운영 홈페이지의 화면 전환은 PR 병합·배포 시 반영된다.

| 검증 | 실제 결과 |
| --- | --- |
| 수신기 GET | `ok: true`, `service: standin-open-beta-feedback`, `surveyVersion: open-beta-2026-10-21-v1` |
| 중단 경로, 이메일·첨부 없음 | 시트 2행에 저장. 제출 ID `f06dc8cd-8cd9-4f0b-829f-5f29ae856bf3` |
| 완료 경로, 공개 소개 이미지 1장 | 시트 3행에 저장. 제출 ID `76b90110-74e5-4646-9593-5f183da89008` |
| 첨부 실제 파일 | 시트 링크에서 열어 이미지와 `나에게만 공개` 상태 확인. 파일 ID `1Ho0mGM-Xj_zubg2T5LrsfF-ZlcjwJddH` |
| 동일 중단 제출 재전송 | `ok: true`, `duplicate: true`. 시트 응답은 2건으로 유지 |
| 브라우저 결과 | 두 경로 모두 저장 완료 화면, 콘솔 오류 없음 |

테스트 2건은 앱 버전과 자유 응답에 `[연동 테스트]` 및 실제 응답 분석 제외 안내를 남겼다. 둘 다 이벤트 미응모이며 실제 사용자의 응답이 아니다. 이미지 테스트에는 저장소의 공개 소개 이미지 `public/standin-social-card.png`를 사용했다.

## 저장·운영

- 수집: 응답, 선택 이메일, 선택 이미지 0~2장, 제출 UUID·버전·접수 시각·동의 여부. URL·UTM·브라우저·설치 식별자는 보내지 않는다.
- 일반 설문은 이메일·이미지가 없어도 제출할 수 있다. 이벤트 응모에는 이메일·이미지 1장 이상이 필요하다.
- 응모 기간은 한국시간 `2026-10-21 00:00` 이상, `2026-11-12 00:00` 미만. 기간 밖 제출은 제품 피드백만 저장하고 `기간 외`로 표시한다. 응모 접수는 당첨 확정이 아니다.
- 이벤트: 추첨 5명 + 정성 후기 5명, 총 10명에게 배달의민족 모바일 상품권 1만원권. 선정·발표 일정은 별도로 확정해 공지한다.
- 뉴스레터·인터뷰 모집·사례 공개 동의는 받지 않는다. 이메일은 답변 확인 및 선택한 이벤트 운영 용도다. Discord·이메일 자동 알림도 보내지 않는다.
- 이미지당 4MiB, 최대 2장. 서버가 크기·MIME·파일 서명을 검증하며 원래 파일명은 저장하지 않는다.
- 시트에는 질문별 한 열을 사용한다. 분기 밖 답변은 버리고 수식으로 해석될 수 있는 문자열은 일반 텍스트로 저장한다.
- 저장 잠금과 제출 UUID로 재시도 중복을 방지한다. 성공 응답을 못 받은 사용자는 같은 초안으로 재제출할 수 있다.
- 웹 설문 보관기간은 90일이며 안내 및 삭제 코드를 함께 배포했다. 일일 작업이므로 삭제 실행은 90일 경과 후 다음 실행 시점이다.
- 삭제 트리거는 전용 폴더에서 이 수신기가 만든 이름의 만료 파일만 영구 삭제하고 만료 행을 제거한다. 별도 다운로드·복제본과 Google의 내부 백업·버전 이력 삭제까지 보장하지 않는다.
- 수동 삭제 요청은 이메일 또는 제출 ID로 행을 찾고 `첨부 파일 ID`의 파일과 해당 행을 함께 처리한다.
- 공개 수신기의 봇·대량 업로드 방어는 제한적이다. 트래픽이 커지면 인증된 BFF, 업로드 제한, CAPTCHA 등을 별도 검토한다.

## 검증

`npm run check:feedback`은 문항/서버 스키마 일치, 완료·중단 분기, 동의·선택값·파일 검증, 중복 제출, 수식 문자열, 저장 실패, 응모기간, 보관기간을 로컬 모의 서비스에서 확인한다. 실제 Google 권한·배포·CORS는 위 2026-10-21 제출 점검으로 확인했다. 수신기 또는 환경변수를 바꾸면 실제 제출 점검을 다시 수행한다.
