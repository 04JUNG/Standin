# 포즈 소재 수정 · 2026-10-29

기존 랜딩의 레이아웃, 로고, 포즈 전환, 마우스 reveal, 작업 화면 드래그 흐름을 유지하고 소재만 교체한다. 이전에 만든 실제 녹화 비교 레이아웃은 철회했다.

## 적용 소재

`public/assets/hero-poses/realistic-v2/`의 네 포즈 × 러프/인형 8개와 후보 시트 1개. 내장 image_gen 사용, PNG 원본은 생성 도구 출력 위치에 보존하며 웹용 파일은 알파를 유지한 WebP로 인코딩했다. 실제 앱 출력으로 제시하지 않는 연출 소재다.

손가락을 세어 액션 5개, 달리기 양손 5개, 공중회전 양손 5개, 배구 양손 5개가 구분되는 시안을 선택했다. 일부 스케치와 렌더의 선은 완전한 픽셀 일치가 아니며 재생성에 따른 미세한 위치 차이가 있다.

## 참고

- 마스터독스 `오픈베타_영업_준비/스크린샷_GIF/README.md` 및 2026-10-20 직접 녹화 영상: 실제 인체 모델/조작 흐름의 참고.
- https://tips.clip-studio.com/en-us/articles/786 : 관절과 카메라를 포함한 3D 데생 인형 포즈 참고.
- https://www.posemaniacs.com/en : 인체 포즈와 시점 참고. 외부 이미지/모델을 재배포하지 않았다.

## 최종 프롬프트 세트

### 인형

Edit this landing-page asset while preserving the pose, camera angle, full-body composition, portrait aspect ratio and original subject scale. This is a manufactured 3D ARTIST DRAWING MANNEQUIN made of matte cool light-gray plastic, NOT a real nude person. Smooth simplified anatomical volumes with modest muscle definition, featureless face, no nipples, no genitalia, no body hair, smooth covered pelvis like a single-piece sculpting dummy, no skin texture. Replace robot armor and blue seams with a continuous clean 3D mesh resembling a professional drawing application's default figure. Moderate ambient occlusion and neutral viewport lighting, no glossy glamour. Most important correction: EVERY OPEN HAND MUST HAVE FIVE VISIBLY SEPARATED DIGITS: four long fingers (little, ring, middle, index) AND a short sideways opposable thumb, each finger visibly attached to its own base on the palm. Splay the fingers enough to count all five; slightly turn each palm toward the viewer if necessary. Do not hide a finger behind another. The original hands are malformed; replace their shapes, do not preserve them. A closed fist may stay closed, with believable knuckles. Natural feet and toes, plausible wrist/elbow/knee joints, no extra limbs. Keep all fingertips and toes inside frame with margin. Single mannequin only, transparent background, no floor, text, marks or UI. Output portrait 3:4.

### 손 수정

Precise local anatomy correction ONLY. Preserve the entire supplied image exactly: mannequin, all body positions, camera, framing, scale, light-gray material, transparency. The open hand at POSITION currently has only three long fingers plus a thumb. Add the missing fourth long finger so the hand has FIVE visible digits total: one thumb, index, middle, ring, little finger. Clearly separate all four long fingers with small visible gaps. Keep natural palm anatomy and finger bases; avoid copying the four-digit error. Do not alter the other hand, any body part, or the image composition. Smooth clean alpha around the corrected hand. No text.

### 공중회전 프레이밍

Extend the transparent canvas around this existing 3D artist mannequin and complete the clipped fingertips of the hand at the right edge. Preserve all existing anatomy, pose, material, proportions and finger count. Scale the whole figure down to fit comfortably inside a 3:4 portrait composition with 8% clear transparent margin around ALL extremities. The right-side hand must be entirely inside the image and show exactly five fingers: four long fingers and one thumb. Do not crop any hand or foot. Smooth neutral plastic art mannequin, no skin details. No text. Preserve true transparency.

### 러프

Use case: style-transfer. Convert this 3D artist mannequin into a believable QUICK HUMAN-DRAWN ROUGH SKETCH for a webtoon artist's working canvas. Same exact pose, camera, proportions, scale and position, same portrait canvas and margin: this sketch will overlay the 3D original, so head, torso, palms, fingertips, knees, feet must align. Single medium blue-gray pencil/pen, uneven pressure, sparse purposeful searching lines, a few short corrections and overshoots, simple face oval and light gesture axes. Like an experienced artist's 45-second rough, not polished concept art. No complete muscle outlines, no repetitive contour hatching, no dense scribbles, no fake paper texture, no armor or robotic segmentation, no vector smoothness, no shaded rendering, no gradients. Keep organic imperfect line rhythm. Fingers must remain readable: four fingers and one thumb on every open hand, never a three-pronged claw. White opaque interior of the figure, genuine transparency outside the figure; no rectangular white backdrop. Keep hands and feet complete inside frame. No text, watermark, UI or extra figures.

### 후보 시트

Edit the 2x2 sprite sheet (image1), keeping FOUR different volleyball jump pose figures, one centered in each quadrant, same grid cell placements, square overall image and true transparent background. Match the matte gray manufactured drawing-mannequin material in image2 (material reference only, not pose). Preserve each distinct pose from image1. Professional 3D drawing figures, smooth sculpted gray plastic, minimal subtle joint segmentation, natural proportions. Correct every hand to have exactly FIVE visible digits: four long fingers plus one thumb. Spread fingers for readability, natural wrists and feet with five toes. No flesh details, no nipples or genitals, no skin, no robot armor, no colored seams, no logos or text. All figures fully inside their own cells with margin, no overlap, no background.

## 영상

`scripts/refresh-pose-videos.py`는 기존 화면 프레임에 새 러프·인형을 합성해 입력 영상과 결과 영상을 재구성한다. 원래 영상 파일을 보존하고 natural 버전으로 새로 저장한다. 새 영상은 실제 시연 녹화가 아니라 작업 흐름 연출 예시다.
