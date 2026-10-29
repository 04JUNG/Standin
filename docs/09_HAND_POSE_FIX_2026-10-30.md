# 손 형태 및 시선 수정 · 2026-10-30

내장 image_gen 편집 모드 사용. 기존 배치와 스타일 유지. 공중회전은 부채처럼 벌어진 손가락을 자연스럽게 굽힌 손으로, 배구는 화면 오른쪽 손의 측면과 오른쪽을 향한 머리/얼굴 십자선으로 수정. 자연스러운 가림을 허용하며 다섯 손가락을 카메라에 모두 펼치는 조건을 제거했다.

## 최종 소재

- `public/assets/hero-poses/realistic-v2/spin-mannequin-v3.webp`
- `public/assets/hero-poses/realistic-v2/spin-rough-v3.webp`
- `public/assets/hero-poses/realistic-v2/volleyball-mannequin-v3.webp`
- `public/assets/hero-poses/realistic-v2/volleyball-rough-v3.webp`

원본 PNG는 생성 도구 저장 위치에 보존. WebP는 알파 유지 인코딩만 수행했다. 영상도 새 소재로 재합성한다.

## 프롬프트

### spinHandPrompt

Use case: precise-object-edit. Edit target: supplied transparent gray 3D drawing mannequin. Correct ONLY the two hands, especially the hand at lower right, which looks like a frog's radial webbed foot. Make anatomically convincing adult human hands made from the same matte gray plastic: elongated narrower palm, four tapered articulated fingers growing from the curved knuckle row at the END of the palm, fingers grouped in a relaxed slight spread and slight curl with varied lengths, thumb emerging lower on the side of the palm with a believable thenar base. NO starfish radial splay, NO webbing, NO bulbous fingertips. Natural perspective may overlap fingers; do NOT rotate the palms toward camera just to expose all five digits. Keep exact wrists, whole body pose, arm positions, scale, head, lighting, frame and all other details unchanged. Same transparent background and portrait composition. All extremities fully inside frame. This is a manufactured art mannequin, no skin details. No text.

### volleyballHandPrompt

Use case: precise-object-edit. Edit the supplied transparent 3D drawing mannequin asset, preserving body/limb pose, camera, framing, scale, smooth gray material and lighting. Correct the HAND at image RIGHT: rotate the palm away from camera so we see the hand SIDE-ON, narrow edge of the palm, fingers together with natural partial overlap and gentle curve, fingers pointing diagonally upward-right in continuation of that forearm. NOT a flat front-facing palm, NOT a five-pronged fan. Anatomically human 4 fingers plus thumb, plausible wrist rotation. Refine the other hand too to natural varied tapered fingers with modest separation, no frog-webbing; keep its raised pose. Rotate ONLY the HEAD to face image RIGHT in clear three-quarter/profile, still looking slightly upward for the volleyball action. Subtle mannequin nose/chin silhouette and ear may indicate facing direction, keep blank smooth art-dummy face no eyes or facial details. Do not change chest, waist, legs, arms or composition. Manufactured art mannequin not a person. Transparent background, no text, full body contained.

### spinRoughFixPrompt

Use case: precise-object-edit. Image1 is the EDIT TARGET blue-gray rough sketch, image2 is the CORRECTED HAND SHAPE reference of exactly the same pose. Edit ONLY the two hands of image1 to match image2: relaxed articulated tapered human fingers with natural curling and overlap, smaller narrower palm, plausible thumb base; not radially splayed frog digits. Maintain same blue-gray loose hand-drawn rough pencil line style, white figure interior, true transparent exterior. Preserve all existing body lines, head, composition, camera, exact scale and location. No shading, no new details elsewhere. The hands must line up with image2 for a sketch-to-mannequin reveal. Do not change the rest of the sketch. Full hands in frame.

### volleyballRoughFixPrompt

Use case: precise-object-edit. Image1 EDIT TARGET is the blue-gray rough sketch. Image2 is CORRECTED POSE reference for only head and hands. Preserve image1's loose pencil blue-gray rough line style, white interior and true transparent exterior, body pose, arms, legs, framing and scale. Correct head orientation to look toward IMAGE RIGHT matching image2. Draw a simple rough head volume with a small ear on left visible side and minimal right-facing forehead/nose/chin silhouette; shift the vertical face centerline to the RIGHT SIDE of the head close to the facial contour, the horizontal eye construction arc wraps the head and meets it near the right edge. This must read clearly as rightward three-quarter/profile looking upward, NOT a centered cross on a front-facing blank oval. No eyes, mouth or detailed face. Correct the hand at IMAGE RIGHT to the narrow SIDE VIEW in image2, fingers naturally together/overlapping seen edge-on, NOT front-facing splayed palm. Match other hand shape from image2 without exaggerated fan spread. Keep entire rest of sketch unchanged. All hands fully inside frame. No text.
