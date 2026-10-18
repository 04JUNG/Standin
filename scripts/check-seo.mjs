import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { publicPaths } from "../dist-ssr/entry-server.js";

const origin = "https://www.standinpose.com";
const dist = new URL("../dist/", import.meta.url);
const documents = new Map();

for (const path of publicPaths) {
  const html = await readFile(new URL(`.${path}index.html`, dist), "utf8");
  documents.set(path, html);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one product/article heading`);
  assert.match(html, /<main\b[^>]*id="main-content"/, `${path}: initial HTML must contain main content`);
  assert.ok(!html.includes('<div id="root"></div>'), `${path}: empty client-only shell`);
  assert.ok(!html.includes("<!--structured-data-->"), `${path}: unprocessed schema placeholder`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), `${path}: canonical mismatch`);
  assert.ok(html.includes(`property="og:url" content="${origin}${path}"`), `${path}: OG URL mismatch`);
  assert.ok(html.includes('property="og:image" content="https://'), `${path}: absolute social image`);
  assert.ok(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html), `${path}: public page cannot be noindex`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1, `${path}: single JSON-LD graph`);
  const schema = JSON.parse(schemas[0][1]);
  assert.equal(schema["@context"], "https://schema.org");
  assert.ok(schema["@graph"].some((node) => node.url === `${origin}${path}`), `${path}: schema URL`);
  const contentNode = schema["@graph"].find((node) => ["WebPage", "Article"].includes(node["@type"]));
  const description = html.match(/name="description"\s+content="([^"]+)"/)[1];
  assert.equal(description, contentNode.description, `${path}: metadata and schema must describe the visible content consistently`);
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
  assert.ok(paragraphs.includes(description), `${path}: description must be visible`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique link targets`);
  const organization = schema["@graph"].find((node) => node["@type"] === "Organization");
  assert.ok(html.includes(`href="mailto:${organization.contactPoint.email}"`), `${path}: public support contact matches schema`);
  const visibleText = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "");
  assert.ok(visibleText.includes(organization.name), `${path}: organization is visible`);
  if (path.startsWith("/guides/")) {
    assert.match(html, /aria-label="이 가이드의 질문"/, `${path}: question navigation`);
    assert.ok((html.match(/<section\b[^>]*id="/g) ?? []).length >= 6, `${path}: addressable guide answers`);
    for (const field of ["datePublished", "dateModified"]) {
      const date = contentNode[field];
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${path}: explicit editorial date`);
      assert.ok(html.includes(`dateTime="${date}"`), `${path}: article dates must be visible`);
    }
    assert.ok(contentNode.datePublished <= contentNode.dateModified, `${path}: date order`);
    for (const citation of contentNode.citation ?? []) {
      assert.ok(html.includes(`href="${citation}"`), `${path}: citations must be visible links`);
    }
  }
}

for (const [path, html] of documents) {
  for (const [, attribute] of html.matchAll(/(?:href|src|poster)="([^"<]+)"/g)) {
    if (!attribute.startsWith("/") && !attribute.startsWith("#")) continue;
    const target = new URL(attribute.replaceAll("&amp;", "&"), `${origin}${path}`);
    const targetHtml = documents.get(target.pathname);
    if (targetHtml && target.hash) {
      assert.ok(targetHtml.includes(`id="${target.hash.slice(1)}"`), `${path}: missing anchor ${attribute}`);
    } else if (!targetHtml) {
      await access(new URL(`.${target.pathname}${target.pathname.endsWith("/") ? "index.html" : ""}`, dist));
    }
  }
}

const home = documents.get("/");
const faq = home.match(/<section id="faq"[\s\S]*?<\/section>/)[0];
assert.ok((faq.match(/href="\/guides\//g) ?? []).length >= 5, "FAQ answers link to relevant detailed guidance");
assert.ok(documents.get("/guides/rough-to-3d-pose/").includes('id="text-search"'), "Text input has addressable usage guidance");
assert.equal((home.match(/<details\b/g) ?? []).length, 11, "Product FAQ answers must be present before JavaScript runs");
assert.ok(home.includes('id="faq-text-search"') && home.includes('id="faq-body-type"'), "Answer text search and body type questions");
assert.match(home, /오픈베타 공개 예정/, "Features not yet released must be labeled as upcoming");
assert.match(home, /정식 출시 후 1개월 무료 이용/, "Show the preregistration perk");
assert.ok(home.includes('id="faq-availability"'), "Answer the availability question with the open beta status");
assert.match(home, /오픈베타 준비 중/, "Show the open beta status");
assert.ok(!/클로즈베타|CLOSED BETA/i.test(home), "Closed beta copy must not remain on the landing");
assert.match(home, /오픈베타 일정과 참여 방법을 이메일로 받는 데 동의합니다/, "Open beta preregistration consent purpose");
assert.match(home, /<button type="submit" disabled=""/, "Preregistration submit stays disabled until hydration");
for (const [path, html] of documents) {
  assert.match(html, /href="\/#beta"[^>]*>오픈베타 사전등록/, `${path}: link to open beta preregistration`);
  assert.ok(!html.includes('href="/closed-beta/"') && !html.includes('href="/feedback/"'), `${path}: retired closed beta links`);
}
const signupHtml = await readFile(new URL("signup/index.html", dist), "utf8");
assert.match(signupHtml, /name="robots" content="noindex"/, "signup: existing private-flow indexing policy");
assert.match(signupHtml, /<script type="module"[^>]*src="\/assets\//, "signup: preserve the browser entry point");
for (const path of ["feedback", "closed-beta"]) {
  const html = await readFile(new URL(`${path}/index.html`, dist), "utf8");
  assert.match(html, /name="robots" content="noindex"/, `${path}: retired path stays out of the index`);
  assert.match(html, /http-equiv="refresh" content="0; url=\/#beta"/, `${path}: old links redirect to the open beta status`);
}
const sitemap = await readFile(new URL("sitemap.xml", dist), "utf8");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(locations.sort(), publicPaths.map((path) => `${origin}${path}`).sort(), "Only public canonical pages belong in the sitemap");
for (const [, url, lastmod] of sitemap.matchAll(/<url><loc>(.*?)<\/loc><lastmod>(.*?)<\/lastmod><\/url>/g)) {
  const html = documents.get(new URL(url).pathname);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const article = graph.find((node) => node["@type"] === "Article");
  if (article) assert.equal(lastmod, article.dateModified, `${url}: sitemap and article dates agree`);
}
const robots = await readFile(new URL("robots.txt", dist), "utf8");
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), "Public pages must remain crawlable");
console.log(`SEO checks passed: ${publicPaths.length} prerendered pages, metadata, links, FAQ, open beta preregistration and sitemap.`);
