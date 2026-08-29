# Standin 트위터(X) 소셜 이미지

랜딩페이지 UI 톤(잉크 네이비 + 코랄 포인트 + 워드마크)을 그대로 옮긴 텍스트 중심
소셜 이미지입니다. 3D 마네킹 등 일러스트 없이 타이포그래피로만 구성했습니다.

## 파일

| 파일 | 용도 | 크기 |
|---|---|---|
| `profile.png` | 프로필 사진 | 400×400 |
| `header.png` | 헤더(배너) | 1500×500 |
| `profile.svg` / `header.svg` | 편집용 벡터 소스 | — |

- **프로필**: 트위터에서 원형으로 잘리므로 핵심 텍스트를 중앙 안전 영역에 배치했습니다.
- **헤더**: 좌하단은 프로필 아바타가 겹치므로 텍스트를 중앙~우측 밴드에 배치했습니다.
  모바일에서는 상하가 더 잘릴 수 있어 핵심 문구를 세로 중앙에 두었습니다.

## PNG 재생성

SVG를 수정한 뒤 아래로 다시 PNG를 만듭니다(프로젝트 루트에서 실행).

```bash
npm i -D @resvg/resvg-js   # 최초 1회 (또는 npm install --no-save @resvg/resvg-js)
node brand/twitter/gen-social.mjs
```

## 폰트 참고

브랜드 폰트는 **Pretendard**지만 시스템에 설치돼 있지 않으면 렌더 시 **Malgun Gothic**으로
대체됩니다. SVG 소스의 `font-family`는 Pretendard를 우선 지정해 두었으므로,
Pretendard가 설치된 환경에서 재수출하면 브랜드 폰트로 렌더링됩니다.
정확히 동일한 렌더링이 필요하면 Pretendard(.ttf/.otf)를 설치한 뒤 재생성하세요.
