# 왼손 엄지 방향 재수정 · 2026-10-30

대상은 인물 기준 왼손(화면 오른쪽으로 뻗은 손). 엄지 쪽이 앞에 보이는 측면 시점, 엄지 뿌리의 연결과 엄지-검지 간격을 자연스럽게 수정했다. 반대편 손을 잘못 수정한 중간 시안은 적용하지 않았다. 내장 image_gen 편집 모드 사용. PNG 원본은 생성 도구 저장 위치에 보존하고 WebP는 알파를 유지해 인코딩했다.

## 적용 파일

- `public/assets/hero-poses/realistic-v2/volleyball-mannequin-v4.webp`
- `public/assets/hero-poses/realistic-v2/volleyball-rough-v4.webp`
- `public/assets/videos/input-demo-natural-v8.mp4`
- `public/assets/videos/result-demo-natural-v6.mp4`

## 인형 프롬프트

Precise local anatomical correction, manufactured gray plastic artist dummy. EDIT ONLY FAR UPPER-RIGHT HAND (subject's left hand), preserve opposite raised hand and every other part exactly. REPLACE the entire hand silhouette: thumb currently lies rigidly parallel to fingers and has an odd oval bump. Remove that shape. Give the thumb a natural outward angle about 25 degrees away from index, creating a CLEAR V-SHAPED GAP between thumb tip and index, with a gently curved thumb-index web. Short tapered thumb bends softly at its middle joint, thumb pad faces slightly toward viewer and thumb nail faces sideways (do not draw an oval facing camera). Thenar mound is part of palm, not a separate attached tube. Four long fingers have small natural gaps and soft relaxed bends, middle longest, ring shorter, little shortest. Thumb remains nearest camera, index next, middle/ring/little progressively behind, view slightly oblique from thumb side so palm has dimension, not a flat board. Hand is still lifted diagonally upper-right, same wrist position and scale. Natural reference-quality anatomy, believable soft plastic mesh like an accurate life drawing hand model. Preserve body, head rightward, arms, other hand, legs, camera, composition, lighting. Transparent background, no text.

## 러프 프롬프트

Precise-object-edit. IMAGE1 is the original blue-gray rough sketch EDIT TARGET; IMAGE2 provides the new left-hand geometry. Modify ONLY the SUBJECT'S LEFT HAND at the far UPPER RIGHT (the hand on the straight extended arm), to precisely match IMAGE2's upper-right hand: natural thumb in foreground at lower-right edge of palm, slight open gap between thumb and index, four long fingers grouped/overlapping diagonally up-right behind it. Natural thumb base flows into palm, no oval button. Keep thumb then index then middle/ring/little in depth. All fingers have correct anatomy including naturally occluded digits. The SUBJECT'S RIGHT HAND, the large splayed hand at UPPER LEFT above head, must be IDENTICAL TO IMAGE1. Do not change its thumb or fingers in any way. Keep ALL other lines in image1 unchanged including head profile/cross, all limbs, body, scale and placement. Draw only the corrected small upper-right hand with the same rough blue-gray pencil lines and white interior. Transparent exterior, manufactured artist mannequin drawing, no text. IMPORTANT: Edit upper RIGHT small hand only, never upper LEFT large hand.
