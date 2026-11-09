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
