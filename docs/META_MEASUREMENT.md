# Instagram 광고와 다운로드 측정 준비

기준일: 2026-10-27 (KST). Instagram 대표 계정은 `@standin.asm`이다.

## 현재 상태와 활성화 순서

코드는 준비 단계다. `VITE_MEASUREMENT_ENABLED=false`가 기본값이므로 ID만 추가해도 측정이 시작되지 않는다. 운영 반영·광고 게시·실제 이벤트 수신은 별도로 확인한다.

1. Team Standin Google 계정에서 `Standin` 계정 / `Standin Website` GA4 속성을 만든다. 대한민국 시간대, KRW, 웹 트래픽·참여도 목표를 사용한다. 계정 생성 및 약관 확인 후 웹 스트림 `https://www.standinpose.com`의 측정 ID를 받는다.
2. Meta 광고계정과 비즈니스 포트폴리오·Facebook 페이지·`@standin.asm` 자산 연결을 확인한다. 전화번호 인증을 완료하고 웹 데이터 세트(픽셀)를 생성·연결한다. 광고 미리보기에서 Instagram 계정 이름을 확인한다.
3. **현행 개인정보처리방침 §11은 광고/방문 분석 SDK를 사용하지 않는다고 설명한다.** 실제 도입 도구, 전송 항목, 수신자·목적·보관/이전 조건과 동의·철회 방법을 확인해 새 안내를 게시한 다음 측정을 활성화한다. 기존 2026-10-19 문서를 소급 수정하지 않는다. 이 PR은 기존 공개 정책과 시행일을 임의로 바꾸지 않는다.
4. GA4 웹 스트림의 향상된 측정(자동 폼/다운로드/페이지 변경 이벤트)을 끈다. Meta의 자동 이벤트·자동 고급 매칭도 끈다. GTM 등으로 같은 태그를 중복 설치하지 않는다. 본 코드는 직접 태그 방식이다.
5. 환경변수 `VITE_GA4_MEASUREMENT_ID`, `VITE_META_PIXEL_ID`를 넣고, 위 준비 후에만 `VITE_MEASUREMENT_ENABLED=true`로 빌드한다. ID는 공개용 식별자다. CAPI 토큰이나 Measurement Protocol 비밀키를 프런트엔드에 넣지 않는다.
6. GA4 실시간/DebugView, Meta 테스트 이벤트와 실제 브라우저 네트워크를 함께 확인한다. 거부 전 요청 없음, 통계만 허용 시 Meta 요청 없음, 양쪽 허용 시 각 1건, 철회 후 추가 수집 중단, OS별 다운로드 클릭, 실제 파일 전달, UTM 소재 구분을 확인한다. 테스트 방문은 광고 성과 집계에서 제외한다.

## 이벤트 정의

| 사용자 행동 | GA4 | Meta | 해석 |
|---|---|---|---|
| 동의 후 공개 랜딩/가이드 조회 | `page_view` | `PageView` | 웹 조회 |
| 검증된 Windows/macOS 설치 파일 링크 클릭 | `download_click` | `DownloadClick` (custom) | 다운로드 의도. 완료·설치가 아님 |
| PC에서 열 링크 복사 성공 | `pc_link_copy` | `PcLinkCopy` (custom) | PC로 전달하려는 행동. 설치·사용이 아님 |

다운로드에는 `platform=windows|macos`와 `file_extension=exe|dmg`만 추가한다. 이메일·설치 ID·원고·자유 입력·사용자 파일명은 이벤트에 넣지 않는다. 가입·설문·약관 페이지는 측정 대상에서 제외한다. 임의 쿼리나 허용되지 않은 값이 있는 URL에서도 SDK를 로드하지 않는다. SDK 자체가 받는 쿠키·접속 메타데이터는 해당 도구의 안내에 포함해야 한다.

사용자는 랜딩페이지의 OS별 버튼에서 설치 파일을 직접 받는다. GitHub 릴리스 페이지로 이동하는 링크는 제거했다. 파일 보관은 기존 공개 릴리스 자산을 이용하지만 GitHub 화면으로 이동할 필요는 없다. JavaScript 실행 전이나 API 조회 실패 시에도 검증된 공개 버전의 직접 링크를 제공하고, 같은 페이지에서 최신 목록 재시도·문의가 가능하다. `src/lib/releases.ts`의 `fallbackRelease`는 클라이언트 출시 때 함께 갱신한다. 2026-10-27에는 v0.2.3 Windows 4,837,488 bytes / macOS universal 13,355,919 bytes의 실제 파일 전달을 확인했다.

GA4에서 `download_click`을 주요 이벤트로 표시한다. `platform`을 이벤트 범위 맞춤 측정기준으로 등록하면 OS별 비교가 가능하다. Meta에서는 `DownloadClick`을 설치 클릭으로 명확히 이름 붙인 맞춤 전환으로 정의한다. `Purchase`, `Lead`, 앱 설치 이벤트로 대신 기록하지 않는다.

처음에는 랜딩페이지 조회 최적화를 검토한다. 다운로드 수집이 검증되고 유의미한 표본이 쌓인 뒤 해당 맞춤 전환을 최적화 대상으로 사용할 수 있는지 계정 UI에서 확인한다.

## 선택과 철회

방문 통계와 광고 측정은 별도로 선택하며 기본값은 둘 다 꺼짐이다. 선택 전에는 두 SDK의 코드·네트워크 요청·이벤트 큐를 만들지 않고 과거 클릭도 소급 전송하지 않는다. 선택은 브라우저에 180일 보관한다. 푸터의 쿠키 설정에서 변경할 수 있다. 철회 시 태그를 차단하고 해당 쿠키를 지운 뒤 페이지를 새로 불러온다. 브라우저 저장이 차단된 경우 현재 페이지 선택만 적용되며 다음 문서에서는 다시 선택한다.

GA4 광고 개인 최적화와 Google Signals는 사용하지 않는다. Meta는 고급 매칭 정보를 전달하지 않고 자동 이벤트 구성을 끈다. 사이트 동의 UI만으로 모든 법적·계약상 검토가 완료됐다고 간주하지 않는다.

## 첫 광고 실험

- 첫 집행 상한은 광고비 270,000원 + 세금·결제 비용 예비금 30,000원으로 총 300,000원이다. 실제 과금 조건을 확인해 총액을 넘지 않게 조정한다.
- 7일 A/B 비교에 합계 210,000원: A와 B 각각 총예산 105,000원. 일평균 각각 15,000원이지만 설정은 종료일이 있는 총예산을 우선한다.
- 같은 대상·노출 위치·본문·영상·CTA·랜딩을 쓰고 첫 문구 하나만 비교한다. 대한민국 성인 대상이며 현행 오픈베타 참여 기준인 만 19세 이상에 맞춘다. 관심사는 실제 계정에서 제공되는 웹툰/일러스트 관련 항목을 확인한 뒤 한 타깃군으로 운영한다.
- Instagram 피드·릴스·스토리, 세로 영상과 안전 영역을 확인한다. Facebook 노출도 추가할 경우 별도 출처 태그와 대표 계정 표시를 확인한다.
- Meta A/B 테스트 기능을 사용해 대상이 겹치지 않게 나누고, 실험 중 문구 자동 변형 및 다른 설정 변경을 피한다. 제공 여부·예산 경고는 계정 UI로 확인한다.
- 남은 60,000원은 결과가 충분할 때만 후속 집행한다. 적은 다운로드 표본에서 통계적 우승을 단정하지 않고 필요하면 보류한다.
- 비교 순서: 광고비 → 랜딩 조회 → 다운로드 클릭 수/비용 → 앱 사용. GA4와 Meta는 동의·차단·기여 기준이 달라 수치가 일치하지 않을 수 있다. 합산하지 않는다.

### 소재 초안 (미게시)

공통 시연: 러프 입력 → 후보 비교 → 선택·조정 → Clip Studio에서 활용. 내부 공개용 시연만 사용하며 베타 참여자 화면은 사용하지 않는다.

| 항목 | A | B |
|---|---|---|
| 첫 문구 | 포즈를 처음부터 만들고 있나요? | 내 러프로 가까운 3D 포즈를 찾아보세요. |
| 공통 본문 | 러프나 참고 이미지와 가까운 3D 인체 포즈 후보를 찾아보세요. 후보를 직접 선택·조정하고 클립스튜디오에서 작화를 이어갈 수 있습니다. Standin 오픈베타 · Windows/macOS 지원. | 동일 |
| 공통 CTA | 다운로드 안내 보기 | 동일 |
| UTM 콘텐츠 | `meta-hook-a` | `meta-hook-b` |

A: https://www.standinpose.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=open-beta&utm_content=meta-hook-a#beta

B: https://www.standinpose.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=open-beta&utm_content=meta-hook-b#beta

기존 UTM `open-beta` 캠페인을 유지하고 신규 Meta 매체는 `paid_social`로 구분한다. 방문·전환은 GA4의 세션 소스/매체, 세션 캠페인, 세션 수동 광고 콘텐츠 기준으로 비교한다.

## 실제 사용까지 남은 연결

이번 웹 변경은 앱 첫 실행이나 첫 포즈 분석 성공을 수집하지 않는다. PC 전달 링크에는 소재별 UTM만 남기며 개인별 매칭 토큰·Meta 클릭 ID는 복사하지 않는다. 같은 캠페인으로 PC 유입을 볼 수 있지만 모바일 방문자와 동일인이라고 연결하지 않는다.

앱의 기존 선택적 분석 동의·이벤트를 먼저 점검하고, `app_first_open` / `first_pose_success`에 해당하는 실측 이벤트를 설치 단위로 중복 제거해 정의해야 한다. 익명 설치 ID만으로 광고 클릭과 연결됐다고 간주하지 않는다. 웹→앱 전달 또는 동의한 계정 기반 연결을 별도로 설계·검증하기 전까지 광고별 실제 사용당 비용은 산출하지 않는다.

## 근거

- [Google 캠페인 URL과 UTM](https://support.google.com/analytics/answer/10917952?hl=ko)
- [GA4 태그 설정](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
- [Google 동의 모드](https://developers.google.com/tag-platform/security/guides/consent)
- [Meta 픽셀 구현 참고](https://developers.facebook.com/docs/meta-pixel/implementation/) — 계정 이벤트 관리자의 최신 설치 안내로 대조 필요.
