# Open beta landing update — 2026-10-19

- Planned opening: October 21, 2026. The countdown uses Korean calendar days, updates while the page is open, and does not automatically claim the service is live after the scheduled date. SSR includes a dated fallback to avoid hydration mismatches.
- One free month after release is for all open-beta participants, independent of preregistration or the survey.
- The separate survey draw offers five ₩10,000 Baemin mobile gift cards. Entries run from the beta opening (October 21 planned) through November 11. Submission requires the survey and a usage screenshot. The survey URL and announcement date remain unpublished; do not point the event at the current `/feedback` redirect.

## Demonstration assets

`public/assets/open-beta/` includes three 10-second looping GIF masters, MP4 web versions, and JPEG posters. The page uses MP4 to reduce transfer size. Videos pause outside the viewport, offer a pause button, and respect reduced motion.

These are reconstructed feature demonstrations, not live screen recordings or measured search/inference results. They combine the existing Clip Studio screenshot, actual Standin library thumbnails, and the existing neutral body preview. Body changes use illustrative proportion interpolation. The proposed top-search-bar/scrolling-results UI is explicitly labeled as a planned redesign.

The generator records exact asset names and the gift card source in `public/assets/open-beta/sources.json`. Authoring inputs are read-only; they are not runtime dependencies. Recreate on Windows with Python, Pillow, numpy, imageio-ffmpeg, and Malgun Gothic installed:

```powershell
python scripts/generate-feature-demos.py --library-root <Standin-server/data/thumbs> --body-image <standin-master-v2.png>
```

Gift card preview: [Bizcon product page](https://www.biz-con.co.kr/bizconshop/productDetail.do?categoryId=&productId=S0226973), retrieved October 19, 2026. The supplied product image is displayed without distortion.

## Validation

`npm run lint` and `npm run build` cover lint, TypeScript, Korean-midnight countdown boundaries, prerendering, SEO assertions, and legal page checks. Visual QA should cover desktop/mobile layout, all three videos, playback controls, and the distinct benefit/event cards.
