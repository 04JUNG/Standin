import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const ja = await readFile(new URL("ja/index.html", dist), "utf8");
const ko = await readFile(new URL("index.html", dist), "utf8");
const origin = "https://www.standinpose.com";
for (const [locale, html, path] of [["ko", ko, "/"], ["ja", ja, "/ja/"]]) {
  assert.ok(html.includes(`<html lang="${locale}">`));
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`));
  for (const [language, url] of [["ko", "/"], ["ja", "/ja/"], ["x-default", "/"]]) {
    assert.ok(html.includes(`rel="alternate" hreflang="${language}" href="${origin}${url}"`), `${locale}: reciprocal alternate ${language}`);
  }
}

const withoutCode = ja.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "");
assert.ok(!/[가-힣]/.test(withoutCode.replaceAll("한국어", "")), "Japanese HTML, labels and alt text must not fall back to Korean");
for (const marker of ["supporters-popup", "funding-popup", "survey-reward", "baemin-giftcard"]) assert.ok(!ja.includes(marker), `Japanese page excludes Korean promotion: ${marker}`);
assert.ok(!/オープンベータ|ベータ版をダウンロード|インストーラーをダウンロード/.test(ja));
assert.ok(!/href="[^"]*(?:#beta|Standin-client\/releases)/.test(ja));
assert.match(ja, /property="og:locale" content="ja_JP"/);
assert.match(ja, /property="og:image" content="https:\/\/www.standinpose.com\/standin-social-card-ja.png"/);
const png = await readFile(new URL("standin-social-card-ja.png", dist));
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);

const graph = JSON.parse(ja.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
const page = graph.find(node => node["@type"] === "WebPage");
const faq = graph.find(node => node["@type"] === "FAQPage");
assert.equal(page.inLanguage, "ja");
assert.equal(faq.inLanguage, "ja");
assert.equal(page.hasPart["@id"], faq["@id"]);
assert.ok(!graph.find(node => node["@type"] === "SoftwareApplication").installUrl);
const answers = [...ja.matchAll(/<details\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/details>/g)];
assert.equal(answers.length, 14);
assert.equal(faq.mainEntity.length, answers.length);
const unescape = text => text.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
answers.forEach(([, id, markup], i) => {
  assert.equal(faq.mainEntity[i]["@id"], `${origin}/ja/#${id}`);
  assert.equal(faq.mainEntity[i].name, unescape(markup.match(/<h3\b[^>]*>([\s\S]*?)<span/)[1]));
  assert.equal(faq.mainEntity[i].acceptedAnswer.text, unescape(markup.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)[1]));
});
console.log("Localization checks passed: Korean/Japanese alternates, Japanese HTML, visible FAQ/schema, retired download absence and social image.");
