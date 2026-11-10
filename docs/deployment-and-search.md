# Production deployment and blog search

## Incident and release controls

On 2026-11-09, commit `9b10caf` removed beta promotion and app downloads. A later production rebuild of `7c33d0e` (20:16 KST) restored the old content. On 2026-11-10 the latest production artifact was promoted again. Git main had not been reverted: the production alias had moved to an older build.

Vercel production tracks `main`. Keep automatic production domain assignment enabled. Set the **project-level Build Command** to:

```sh
npm run build:vercel
```

This setting is deliberately outside an individual commit. Commits from before the guard have no `build:vercel` script, so rebuilding them fails. Current code verifies Vercel's branch and full commit SHA against the checked-out source and remote main, both before and after building. Missing identity, an unavailable remote or a stale SHA stops production. Preview/local builds still work.

GitHub CI runs on main as well as PRs. Require `PR checks` and `Production source guard` in Vercel Deployment Checks when available. A new production artifact includes `/deployment.json`. `Verify production content` checks the production commit, canonical URLs, indexability, blog answers/feed and absence of retired campaigns after successful production deployment events; it can also be run manually.

Vercel owners can still explicitly use Instant Rollback / Force Promote to assign an already-built artifact without a build. Build guards cannot intercept that operation. Do not use old deployment cards for routine releases. For an intentional code rollback, revert the change on main and release that new commit through the same checks. Do not override the project build command per deployment.

## Search audit (2026-11-10)

- The eight public canonical pages return rendered HTML, JSON-LD and a sitemap; robots.txt allows search crawling. Blog pages are not noindex.
- The current Google account has no Search Console property access. Index coverage, impressions, query performance and the reason for low search visibility are therefore unverified. A site-search query is not a substitute for an indexing report.
- The blog was first published on 2026-11-09. Preserve that date; the answer and metadata revision is dated 2026-11-10.
- Each article now exposes a concise answer above its media, three visible linked Q&As, an author link, publication/modification dates, matching BlogPosting abstract, contextual social images and an RSS feed. Existing screenshots, citations, drag-and-drop guidance and previous/next navigation remain.
- Google says AI features use ordinary SEO fundamentals and do not require special AI files or schema. These improvements aid understanding and discovery, but do not guarantee crawling, ranking or citation. No invented ratings, statistics, testimonials or author credentials are used.

Next external step: the site owner can register/verify the site in Google Search Console, submit `https://www.standinpose.com/sitemap.xml`, then inspect the three blog URLs and request indexing. This requires authorized account access; it has not been completed by this change.

Sources: [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article), [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build), [Deployment Checks](https://vercel.com/docs/deployment-checks), [Promoting deployments](https://vercel.com/docs/deployments/promoting-a-deployment).
