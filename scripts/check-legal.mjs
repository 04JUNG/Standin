import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { legalPaths } from "../dist-ssr/entry-server.js";

for (const path of legalPaths) {
  const slug = path.split("/").filter(Boolean).at(-1);
  const html = await readFile(new URL(`../dist${path}index.html`, import.meta.url), "utf8");
  const source = await readFile(new URL(`../src/content/legal/${slug}.md`, import.meta.url), "utf8");
  const text = await readFile(new URL(`../dist${path}${slug}-2026-10-19.txt`, import.meta.url), "utf8");
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one title`);
  assert.equal((html.match(/<h2\b/g) ?? []).length, (source.match(/^## /gm) ?? []).length, `${path}: every policy section is server-rendered`);
  assert.ok(text.endsWith(source), `${path}: download and page use the same full text`);
  assert.match(html, /게시일.*2026년 10월 19일.*적용일.*2026년 10월 19일/s, `${path}: requested dates`);
  assert.ok(!/내부 작성 메모|주소 확인 기록|구현 확인 메모|신청정보 정리 메모|문서 ID:/.test(html), `${path}: internal notes excluded`);
  for (const link of legalPaths) assert.ok(html.includes(`href="${link}"`), `${path}: sibling document ${link}`);
  for (const [, anchor] of html.matchAll(/href="#([^"<]+)"/g)) assert.ok(html.includes(`id="${anchor}"`), `${path}: valid anchor ${anchor}`);
  assert.match(html, /href="https:\/\/x.com\/standin_asm" target="_blank" rel="noopener noreferrer"/, `${path}: social link`);
  assert.match(html, /mailto:standin.asm@gmail.com/, `${path}: contact`);
  assert.match(html, /개인정보 보호책임자: <!-- -->박보라/, `${path}: confirmed contact person`);
  if (source.includes("[확정 필요")) {
    assert.match(html, /검토용 미리보기/, `${path}: unresolved documents must be labeled`);
    assert.match(html, /name="robots" content="noindex"/, `${path}: drafts are not indexed`);
    if (process.argv.includes("--release")) throw new Error(`${path}: unresolved factual disclosures; finish review before publishing`);
  }
}
console.log(`Legal checks passed: ${legalPaths.length} full documents, dates, downloads, anchors, shared footer and draft labeling.`);
