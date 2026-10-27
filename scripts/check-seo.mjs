import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { publicPaths } from "../dist-ssr/entry-server.js";

const origin = "https://www.standinpose.com";
const dist = new URL("../dist/", import.meta.url);
const documents = new Map();
const unescapeHtml = (value) => value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

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
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  const meta = new Map([...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/g)].map(([, key, value]) => [key, value]));
  assert.equal(meta.get("twitter:title"), title, `${path}: Twitter title matches page title`);
  assert.equal(meta.get("twitter:description"), description, `${path}: Twitter description matches page description`);
  assert.ok(meta.get("og:image:alt"), `${path}: descriptive social image`);
  assert.ok(meta.get("twitter:image:alt"), `${path}: descriptive Twitter image`);
  assert.equal(description, contentNode.description, `${path}: metadata and schema must describe the visible content consistently`);
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
  assert.ok(paragraphs.includes(description), `${path}: description must be visible`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique link targets`);
  const organization = schema["@graph"].find((node) => node["@type"] === "Organization");
  assert.ok(html.includes(`href="mailto:${organization.contactPoint.email}"`), `${path}: public support contact matches schema`);
  const visibleText = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "");
  assert.ok(visibleText.includes(organization.name), `${path}: organization is visible`);
  for (const profile of organization.sameAs ?? []) {
    assert.ok(html.includes(`href="${profile}"`), `${path}: organization profiles must be visible`);
  }
  await access(new URL(`.${new URL(organization.logo).pathname}`, dist));
  assert.ok(!html.includes("오픈베타 공개 시"), `${path}: no stale post-launch instructions`);
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
const homeGraph = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
const faqSchema = homeGraph.find((node) => node["@type"] === "FAQPage");
const homePage = homeGraph.find((node) => node["@type"] === "WebPage");
const application = homeGraph.find((node) => node["@type"] === "SoftwareApplication");
const visibleFaq = [...faq.matchAll(/<details\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/details>/g)];
assert.equal(visibleFaq.length, 16, "All product FAQ answers must exist in the initial HTML");
assert.equal(faqSchema.mainEntity.length, visibleFaq.length, "Schema must describe exactly the visible FAQ");
for (const [index, [, id, markup]] of visibleFaq.entries()) {
  const question = unescapeHtml(markup.match(/<summary[^>]*>([\s\S]*?)<span/)[1]);
  const answer = unescapeHtml(markup.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)[1]);
  const structured = faqSchema.mainEntity[index];
  assert.equal(structured["@id"], `${origin}/#${id}`, `FAQ ${id}: resolvable question anchor`);
  assert.equal(structured["@type"], "Question");
  assert.equal(structured.name, question, `FAQ ${id}: question matches visible text`);
  assert.deepEqual(structured.acceptedAnswer, { "@type": "Answer", text: answer }, `FAQ ${id}: no hidden or conflicting answer`);
}
assert.equal(homePage.hasPart["@id"], faqSchema["@id"]);
assert.equal(homePage.mainEntity["@id"], application["@id"]);
assert.equal(homePage.dateModified, faqSchema.dateModified);
assert.ok(home.includes(`dateTime="${homePage.dateModified}"`), "FAQ review date is visible");
assert.deepEqual(application.operatingSystem, ["Windows", "macOS"]);
assert.equal(application.description, homePage.description);
assert.equal(application.installUrl, `${origin}/#beta`);
for (const feature of application.featureList) assert.ok(home.includes(feature), "Application features match visible copy");
assert.ok(!application.aggregateRating && !application.review, "Do not invent software ratings or reviews");
for (const id of ["pricing", "supported-platforms", "export-formats", "unpublished-artwork", "commercial-use"]) {
  assert.ok(home.includes(`id="faq-${id}"`), `Answer buying and trust question: ${id}`);
}
assert.ok(home.includes('id="faq-text-search"') && home.includes('id="faq-body-type"'), "Answer text search and body type questions");
assert.match(home, /Standin 다운로드/, "Show open beta downloads");
assert.match(home, /정식 출시 후 1개월 무료 이용/, "Show the participant perk");
assert.match(home, /오픈베타 참여자 전원/, "Free month is for all beta participants");
assert.match(home, /설문 작성 \+ 사용 화면 스크린샷 제출/, "Show both survey entry requirements");
assert.match(home, /2026\.10\.21–11\.11/, "Show the survey event period");
assert.match(home, /추첨 5명 \+ 정성 후기 5명/, "Show the ten-recipient survey award split separately from the universal perk");
assert.match(home, /검색 화면 개편 예정/, "Do not present the planned search UI as released");
assert.ok(home.includes('id="faq-availability"'), "Answer the availability question with the open beta status");
assert.ok(!home.includes("data-launch-countdown"), "Launch PR replaces the countdown");
assert.ok(!/클로즈베타|CLOSED BETA/i.test(home), "Closed beta copy must not remain on the landing");
assert.ok(!home.includes("오픈베타 사전등록"), "Do not ask users to preregister after launch");
assert.match(home, /href="https:\/\/github\.com\/04JUNG\/Standin-client\/releases\/download\/[^\"]+\.exe"/, "Windows installer works before hydration");
assert.match(home, /href="https:\/\/github\.com\/04JUNG\/Standin-client\/releases\/download\/[^\"]+\.dmg"/, "macOS installer works before hydration");
assert.ok(!home.includes('href="https://github.com/04JUNG/Standin-client/releases/latest"'), "Downloads stay on the landing instead of linking to GitHub UI");
for (const [path, html] of documents) {
  const downloadHref = path === "/" ? "#beta" : "/#beta";
  assert.match(html, new RegExp(`href="${downloadHref}"[^>]*>오픈베타 다운로드`), `${path}: link to downloads without dropping home campaign parameters`);
  assert.ok(!html.includes('href="/closed-beta/"') && html.includes('href="/feedback/"'), `${path}: open beta feedback navigation`);
}
const signupHtml = await readFile(new URL("signup/index.html", dist), "utf8");
assert.match(signupHtml, /name="robots" content="noindex"/, "signup: existing private-flow indexing policy");
assert.match(signupHtml, /<script type="module"[^>]*src="\/assets\//, "signup: preserve the browser entry point");
const feedbackHtml = await readFile(new URL("feedback/index.html", dist), "utf8");
assert.match(feedbackHtml, /name="robots" content="noindex"/);
assert.match(feedbackHtml, /<script type="module"[^>]*src="\/assets\//);
assert.ok(!feedbackHtml.includes('http-equiv="refresh"'), "Feedback must open the survey, not redirect");
for (const path of ["closed-beta"]) {
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
  const page = graph.find((node) => ["Article", "WebPage"].includes(node["@type"]));
  assert.equal(lastmod, page.dateModified, `${url}: sitemap and editorial dates agree`);
}
const robots = await readFile(new URL("robots.txt", dist), "utf8");
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), "Public pages must remain crawlable");
console.log(`SEO checks passed: ${publicPaths.length} prerendered pages, metadata, links, FAQ, open beta downloads, feedback and sitemap.`);
