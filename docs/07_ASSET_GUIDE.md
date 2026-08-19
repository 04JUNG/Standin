# Standin 에셋 가이드

## 1. 필요한 에셋 목록

### 필수

1. Standin 워드마크
2. favicon / app icon
3. Hero 콘티 샘플
4. 스켈레톤 오버레이
5. 3D 마네킹 포즈 후보 5개
6. 선택된 포즈 메인 프리뷰
7. Workflow 단계 이미지 4개
8. Clip Studio 연결 개념 이미지
9. Open Graph 이미지

### 선택

- 종이 텍스처
- 웹툰 패널 프레임 패턴
- 마우스 커서 또는 조정 핸들
- 포즈 태그 아이콘

---

## 2. 에셋 폴더

```text
src/assets/
├─ brand/
│  ├─ standin-wordmark.svg
│  ├─ standin-symbol.svg
│  └─ favicon.svg
├─ storyboard/
│  ├─ rough-panel-01.webp
│  ├─ rough-panel-02.webp
│  └─ panel-overlay-01.svg
├─ poses/
│  ├─ pose-01.webp
│  ├─ pose-02.webp
│  ├─ pose-03.webp
│  ├─ pose-04.webp
│  ├─ pose-05.webp
│  └─ pose-selected.webp
├─ workflow/
│  ├─ step-upload.webp
│  ├─ step-analyze.webp
│  ├─ step-select.webp
│  └─ step-export.webp
├─ integration/
│  └─ workflow-bridge.webp
└─ og/
   └─ standin-og.png
```

---

## 3. 워드마크 방향

### 기본

- `Standin`
- S만 대문자
- 단단한 산세리프
- `in` 부분에 약한 포인트를 줄 수 있으나 가독성 우선

### 심볼 아이디어

- 두 개의 겹친 인체 실루엣
- 러프 선 위에 정렬된 관절점
- 웹툰 패널 모서리 + 사람 스탠드
- S 형태의 포즈 가이드 라인

피해야 할 것:
- 로봇 얼굴
- 마법 지팡이
- 뇌 모양
- 일반적인 반짝이 AI 심볼
- 특정 3D 소프트웨어와 혼동되는 큐브 로고

---

## 4. 샘플 콘티 제작

권장:
- 자체 제작한 매우 단순한 러프
- 1인 전신 1컷
- 2인 마주 보는 반신 1컷
- 저작권이 명확한 내부 샘플

표현:
- 회색 또는 네이비 러프 선
- 얼굴 디테일 최소화
- 대사는 브랜드 메시지에 꼭 필요할 때만
- 실제 작가의 미공개 콘티를 허락 없이 사용하지 않음

권장 Hero 장면:
- 한 인물이 몸을 약간 숙이고 한쪽 팔을 내미는 전신 포즈
- 스켈레톤과 포즈 후보 차이를 보여주기 쉬움

---

## 5. 3D 마네킹

### 스타일

- 회색 단색
- 비현실적으로 근육질이거나 성별 특징이 강하지 않음
- 얼굴 없음 또는 단순한 타원
- 관절 구조가 읽히는 형태
- 배경 투명 PNG/WebP 또는 GLB

### 포즈 후보 구성

같은 쿼리에 대해 미세하게 다른 포즈:
1. 상체 기울기 작음
2. 상체 기울기 큼
3. 팔 높이 다름
4. 반대쪽 다리 무게 중심
5. 카메라 방향 차이

후보가 완전히 무관한 포즈로 보이지 않게 한다.

---

## 6. 3D 에셋 사용 시 라이선스

- 자체 제작 또는 상업 이용이 명시된 에셋 우선
- “무료 다운로드 가능”만으로 상업 이용 가능하다고 판단하지 않음
- Mixamo, 모션캡처 데이터, 마네킹 모델은 배포·재판매 조항 별도 확인
- 원본 3D 파일이 정적 사이트에서 추출될 수 있음을 고려
- 라이선스 파일 또는 출처 기록 보관

랜딩페이지 번들에 원본 고해상도 모델을 넣지 않아도 되는 경우 렌더 이미지로 대체한다.

---

## 7. Clip Studio 관련 표현

- 공식 로고 사용은 브랜드 가이드와 허용 범위 확인
- 확인 전에는 `Clip Studio Paint` 텍스트 또는 일반적인 작화 앱 프레임 사용
- 공식 제휴처럼 보이는 병렬 로고 락업 금지
- UI 스크린샷 사용 시 저작권과 상표 가이드 확인
- 가장 안전한 초기안은 자체 제작한 “작화 화면 모형” 사용

---

## 8. 이미지 생성 프롬프트 초안

이미지 생성 도구를 사용할 경우, 완성 웹툰 스타일보다 **제품 UI용 중립 에셋**을 목표로 한다.

### Hero 콘티

`minimal rough storyboard sketch for a webtoon production tool, one full-body human figure leaning slightly forward with one arm extended, loose graphite-like digital lines, no facial details, off-white paper background, clean negative space, original generic character, UI asset, no text`

### 3D 마네킹

`neutral gray articulated 3D artist mannequin, full body, slightly leaning forward with one arm extended, studio orthographic render, soft neutral lighting, transparent background, no clothing, no anatomy detail, clean product UI asset`

### 2인 반신 샘플

`rough webtoon storyboard sketch, two generic characters facing each other in a medium shot, simple construction lines, no facial details, original composition, off-white background, product demonstration asset, no speech bubbles`

주의:
- 생성 결과의 손과 관절이 비정상적이면 직접 수정
- 특정 작가 스타일을 모방하도록 요청하지 않음
- 유명 캐릭터를 넣지 않음

---

## 9. 이미지 규격

| 에셋 | 권장 크기 | 형식 |
|---|---:|---|
| Hero preview | 1400×1100 | WebP |
| Pose thumbnail | 320×400 | WebP |
| Workflow image | 720×540 | WebP |
| OG image | 1200×630 | PNG/JPG |
| Logo | vector | SVG |
| Overlay | vector | SVG |

Retina 대응을 고려하되 과도한 원본을 그대로 배포하지 않는다.

---

## 10. Alt Text 예시

- `러프 콘티 위에 인체 관절 분석선이 표시된 화면`
- `콘티와 비슷한 다섯 개의 3D 마네킹 포즈 후보`
- `선택된 3D 포즈를 회전하고 조정하는 작업 화면`
- `Standin에서 내보낸 3D를 작화 화면에서 참고하는 흐름`

장식용 격자, 빛, 종이 질감은 `alt=""`.
