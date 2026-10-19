# Open beta landing update — 2026-10-19

- Planned opening: October 21, 2026. The countdown uses Korean calendar days, updates while the page is open, and does not automatically claim the service is live after the scheduled date. SSR includes a dated fallback to avoid hydration mismatches.
- One free month after release is for all open-beta participants, independent of preregistration or the survey.
- The separate survey event offers ten ₩10,000 Baemin mobile gift cards: five random-draw recipients plus five selected for active use and thoughtful feedback. Entries run from the beta opening (October 21 planned) through November 11. Submission requires the survey and a usage screenshot. The survey URL and announcement date remain unpublished; do not point the event at the current `/feedback` redirect.

## Demonstration assets

The original 01 INPUT → 02 STANDIN → 03 RESULT sequence stays together. The new feature group follows RESULT under “NEW IN OPEN BETA”, with NEW labels instead of a second numbered workflow.

`public/assets/open-beta/` includes looping GIF masters, MP4 web versions, and JPEG posters. Search is 12 seconds, manual body control about 17 seconds, and auto-fit 13 seconds. The page uses MP4 to reduce transfer size. Videos pause outside the viewport, offer a pause button, and respect reduced motion.

Manual body control uses the user's October 19 screen recording: Standin alone, with actual sliders, model changes, naming, and the saved card. It trims source seconds 0.8–31.8, plays at 1.8×, and excludes audio. The final shot crops to the saved card so unrelated model-library filters are outside the frame. Its caption identifies actual app footage.

Search and auto-fit are reconstructed demonstrations, not live search/inference recordings. Search begins with the user's blank Clip Studio canvas, shows only the search window, and uses curated sword-bearing combat previews. There is no rough or screen-capture floating bar. The proposed top-search-bar/scrolling-results UI is explicitly labeled as a planned redesign.

Auto-fit uses a new clothed webtoon character rough, generated with the built-in image_gen tool using the user's open-beta card-news v3 pencil style and the actual `dynamic_fantasy_leap_slash` front-view pose as references. The prompt is saved in `source/auto-fit-rough-prompt.txt`. The preview uses the actual male `standin-master-v2.fbx` library mesh, rendered with the server's library lighting and a fixed camera. Nine independently rendered 3D geometry variants show wider shoulders and a smaller head. This is editorial geometry authoring, not automatic inference output or a measured shape-control setting. The UI compares the basic male card with a new character body and ends with the saved body. No 2D body stretching is used.

The generator records exact asset names and the gift card source in `public/assets/open-beta/sources.json`. Reviewed sword previews and the blank canvas reference are in `public/assets/open-beta/source/`; the original user recording stays outside the repository. Sword references are Standin-authored body poses and primitive prop guides on a Quaternius CC0 source rig. Authoring inputs are read-only. Recreate on Windows with Python, Pillow, numpy, imageio-ffmpeg, and Malgun Gothic installed:

```powershell
python scripts/generate-feature-demos.py --body-recording <user-supplied-recording.mp4>
```

Omit `--body-recording` to regenerate only search and auto-fit while retaining the current body-control edit.

Use `python scripts/generate-feature-demos.py --only body-auto` to update only the revised auto-fit film. Its source model frames can be recreated with:

```powershell
blender --background --factory-startup --threads 2 --python scripts/render-auto-fit-previews.py -- --server <Standin-server checkout>
```

Gift card preview: [Bizcon product page](https://www.biz-con.co.kr/bizconshop/productDetail.do?categoryId=&productId=S0226973), retrieved October 19, 2026. The supplied product image is displayed without distortion.

## Validation

`npm run lint` and `npm run build` cover lint, TypeScript, Korean-midnight countdown boundaries, prerendering, SEO assertions, and legal page checks. Visual QA should cover desktop/mobile layout, all three videos, playback controls, and the distinct benefit/event cards.
