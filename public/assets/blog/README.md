# Blog illustrations · 2026-11-09

- `standin-workflow.svg`: authored vector explanation of input → artist selection → adjustment. Not a measured inference result.
- `clip-studio-import.svg`: authored vector explanation of model-containing FBX import versus applying BVH to a selected existing figure. Not a screenshot of the import dialog. Based on the official Clip Studio manual already cited in the posts.
- `bvh-fbx-structure.svg`: authored vector explanation of skeleton/motion versus the broader FBX data container. Does not claim every FBX includes a mesh or that all data is preserved on import.
- `rough-capture.jpg`, `pose-candidates.jpg`: unchanged copies of `raw-0.1.jpg`, `raw-1.9.jpg` in the 2026-11-06 representative-video re-recording folder under the master-docs crowdfunding package. Original dimensions 1920 × 1138. User-recorded application demonstration with prepared pose candidates, not a search quality/speed test. No local file paths, accounts, or personal messages are visible in the selected frames.

## Actual-use media revision

Repeated workflow/import diagrams are no longer displayed. The BVH/FBX structure diagram is retained once. Each post has a different purpose and no body image is repeated across posts.

- `text-search-use.gif`: unchanged copy of the crowdfunding package's `프로젝트계획_붙여넣기_2026-11-02/이미지/소개_02_문장으로_포즈찾기.gif`, 1240 × 698, approximately 9 seconds. Based on the actual `자연어검색.mp4` recording; edited timing is not search performance evidence.
- `text-search-preview.jpg`: unchanged `대표영상_재촬영_2026-11-06/edit/frames-45s/021.5s.jpg`, an existing edited still of the same text-search recording.
- `standin-to-clip-studio.gif`: unchanged `대표영상_재촬영_2026-11-06/Standin_러프캡처_원본_1.4배속.gif`, 1240 × 735, 9 seconds, 1.4× speed. Whole user-recorded rough/candidate/save/FBX drag/import demonstration; candidates were prepared. The source `gif-verification.json` documents timing and provenance. This is FBX footage, not proof of BVH behavior.
- `clip-studio-applied.jpg`, `saved-file-drag.jpg`: unchanged `raw-12.1.jpg`, `raw-4.9.jpg` from the same re-recording's `edit` directory. Show final application and the saved file row respectively.

GIFs load only when the user presses Play; Stop replaces the animation with its static preview. No autoplay, including for reduced-motion readers. Original/full-size links remain available. Poster and media dimensions reserve layout space.

Direct BVH drag-and-drop: Standin-client `docs/adr/ADR-009-pose-file-delivery.md` records successful app-to-CSP BVH validation on 2026-07-31, including automatic figure creation without a preselected model. `SavedFileList.tsx` and `drag.tauri.ts` implement a native copy drag from the saved file row for both formats. The official CSP manual documents the menu path for BVH, so the articles distinguish team-tested direct drop from the documented fallback. BVH requires CSP PRO/EX 3.1.0 or later. No new live app verification is claimed.

Captions and alt text live in `src/data/blogVisuals.ts`. No image generation or fabricated app interface is used.

## Section-by-section usage guide · 2026-11-09

All eight instructional sections now have distinct visuals immediately below their headings. References and related links are not instructional steps.

- `standin-and-clip-studio.svg`: authored horizontal layout embedding the unchanged Standin-client `src-tauri/icons/icon.png` and installed CELSYS CLIP STUDIO PAINT `Settings/PAINT/NotificationBoard/toast_icon.png`. These are actual app icons, not generated logos.
- `rough-selection.webp`: 1.26 s of the 2026-11-06 original MP4, crop 750×970 at (520,80).
- `candidate-selection.webp`: 1.9 s, crop 850×480 at (1070,167); all five cards and their selection buttons.
- `saved-file-row.webp`: 4.9 s, crop 450×484 at (1070,167).
- `fbx-applied.webp`: 8.2 s, crop 1240×870 at (680,120); model and saved FBX row after native drop.
- `pose-adjustment.webp`: 34 s of master-docs `오픈베타_영업_준비/스크린샷_GIF/02_영상/러프부터_3D포즈까지_배속자막_2026-10-20.mp4`, crop 800×760 at (430,250). Different actual workflow recording, with the model selected and its controls visible.
- `bvh-applied.webp`: live CUA screenshot on 2026-11-09 after importing the existing Standin-produced `문장검색_standin_pose.bvh` into a new blank CSP canvas via File → Import → 3D Data; crop 850×800 at (327,65). This screenshot proves this file's imported result, not a newly tested native drag. Direct-drop evidence remains ADR-009 above.
- `clip-studio-import-menu.webp`: live CUA screenshot of the expanded File → Import menu, crop 600×800 at (0,0).

Video frames and native screenshots were only cropped and encoded as WebP; no UI was redrawn or generated. New section assets total under 450 KB. GIF playback remains opt-in. Original screenshots are retained in master-docs `tmp/blog-csp-*.png`.
