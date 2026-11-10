import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const origin = 'https://www.standinpose.com';
const remote = execFileSync('git', ['ls-remote', '--exit-code', 'https://github.com/04JUNG/Standin.git', 'refs/heads/main'], { encoding: 'utf8', timeout: 30_000 });
const expected = remote.trim().split(/\s+/)[0];
assert.match(expected, /^[a-f0-9]{40}$/);
async function get(path) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(20_000), headers: { 'Cache-Control': 'no-cache' } });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') ?? ''), `${path}: indexing header`);
  return response.text();
}
const version = JSON.parse(await get('/deployment.json'));
assert.equal(version.commit, expected, 'Production must serve the latest main commit; an old deployment may have been promoted.');
const sitemap = await get('/sitemap.xml');
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => {
  const parsed = new URL(url);
  assert.equal(parsed.origin, origin);
  return parsed.pathname;
});
assert.equal(paths.length, 8, 'Verify all public pages');
await Promise.all(paths.map(async path => {
  const html = await get(path);
  assert.ok(!/오픈\s*베타|클로즈\s*베타|OPEN BETA|CLOSED BETA|オープンベータ/i.test(html), `${path}: retired promotion returned`);
  assert.ok(!/href="[^"]*(?:#beta|\/feedback\/|\/closed-beta\/|\/legal\/beta\/|Standin-client\/releases)/.test(html), `${path}: retired link returned`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), `${path}: canonical`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html), `${path}: noindex`);
  if (path.startsWith('/blog/') && path !== '/blog/') assert.ok(html.includes('id="article-questions"'), `${path}: server-rendered answers`);
}));
for (const path of ['/feedback/', '/closed-beta/']) {
  // Retired pages intentionally use noindex in HTML.
  assert.ok((await get(path)).includes('http-equiv="refresh" content="0; url=/"'), `${path}: retired campaign redirects home`);
}
assert.equal(((await get('/blog/feed.xml')).match(/<item>/g) ?? []).length, 3);
console.log(`Production verified: ${expected}; ${paths.length} public pages, retired campaigns and blog feed.`);
