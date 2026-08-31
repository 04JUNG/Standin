# 기존 Formspree 제출 내역 이관

Formspree에 쌓인 클로즈베타 사전등록을 구글 시트로 옮기는 절차다. 한 번만
하면 된다. 이후 제출은 `server/beta-form/`의 웹앱이 시트에 직접 기록한다.

## 1. Formspree에서 데이터 꺼내기

무료 플랜은 CSV 내보내기가 막혀 있을 수 있다. 두 방법 중 되는 쪽을 쓴다.

**A. 내보내기가 되면** — 폼 → Submissions → Export(CSV/JSON)로 파일을 받는다.

**B. 막혀 있으면** — Submissions 표를 마우스로 드래그해 전부 선택하고 복사한
뒤, 메모장 등에 붙여 넣어 `formspree-paste.txt`로 저장한다. 표를 복사하면
셀이 탭으로 구분되므로 변환기가 그대로 읽는다.

첫 줄은 열 이름(헤더)이어야 한다. 폼이 보내던 키 이름과 한글 라벨을 모두
알아본다.

| 우리 필드 | 알아보는 열 이름 |
| --- | --- |
| 접수시각 | `date`, `submitted`, `submitted at`, `submission date`, `created_at`, `접수시각` |
| 이메일 | `email`, `e-mail`, `이메일` |
| 작업 형태 | `role`, `작업 형태` |
| 현재 작업 여부 | `workStatus`, `현재 작업 여부` |
| Clip Studio 제품 | `clipStudioEdition`, `Clip Studio 제품` |
| Clip Studio 버전 | `clipStudioVersion`, `Clip Studio 버전` |
| 3D 인형 사용 경험 | `mannequinExperience`, `3D 인형 사용 경험` |
| 알게 된 경로 | `source`, `알게 된 경로` |
| 수신동의 | `consent`, `수신동의`, `동의` |
| 캠페인 | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` |

헤더 이름이 다르면 파일에서 첫 줄만 위 이름으로 고쳐 쓰면 된다.

## 2. 변환

```bash
node scripts/formspree-to-csv.mjs formspree-paste.txt formspree-legacy.csv
```

- `server/beta-form/Code.gs`의 시트 헤더와 같은 순서로 맞춘다.
- 선택 항목은 코드(`artist`)든 라벨(`개인 웹툰 작가`)이든 **라벨로 통일**한다.
- 모든 행의 **비고**에 `Formspree 이관`을 넣어 신규 제출과 구분한다.
- 유입 페이지·브라우저는 Formspree에 없던 값이라 빈칸으로 둔다.
- 폼에 나중에 추가된 항목(작업 여부·Clip Studio·3D 인형 경험·경로)은 초기
  제출에 값이 없는 게 정상이라 비어 있어도 경고하지 않는다.
- 이메일 형식, 작업 형태, 접수시각이 없거나 모르는 값이 든 행은 변환은 하되
  **경고로 출력**한다. 임의로 값을 지어내지 않고 원문을 남기니, 경고가 뜬
  행은 직접 확인한다.

접수시각은 타임존 표기가 있으면 KST로 변환하고, 없으면 이미 KST로 보고
숫자를 그대로 쓴다. 읽지 못한 값은 원문을 그대로 남긴다.

## 3. 시트에 올리기

이관본은 신규 제출보다 위(과거)에 있어야 보기 편하므로, **웹앱을 배포하기
전에** 넣는 것이 가장 깔끔하다.

1. `server/beta-form/README.md` 3단계의 `setupSheet`를 먼저 실행해 헤더 행을
   만든다.
2. 구글 시트에서 **파일 → 가져오기 → 업로드**로 `formspree-legacy.csv`를 고른다.
3. 가져오기 위치: **현재 시트에 추가**, 구분 문자: **쉼표**.
4. CSV 헤더 행이 데이터 사이에 끼어 들어오므로, 가져온 뒤 그 한 줄만 지운다.
5. 이메일 순으로 정렬해 중복을 눈으로 확인한다. 중복이 있어도 웹앱은 이후
   제출에 `중복(재등록)` 표시만 남기고 거부하지 않는다.

## 4. 알림이 누락된 등록 보정

Formspree 월 50건 한도를 넘겨 알림이 오지 않은 등록은, 시트에 올린 뒤
Apps Script 에디터에서 `resendMissedDiscordAlerts`를 쓴다.

1. 시트에서 해당 등록의 **행 번호**를 확인한다(헤더가 1행).
2. `Code.gs`의 `resendMissedDiscordAlerts` 안 `var ROWS = [];`에 그 번호를
   넣는다. 여러 건이면 `[37, 38]`처럼 나열한다.
3. 함수를 실행한다.

디스코드에 **"클로즈베타 사전등록 (지연 알림)"** 제목으로, 당시 알림이 나가지
않았을 뿐 접수는 정상이었다는 설명과 함께 올라간다.
