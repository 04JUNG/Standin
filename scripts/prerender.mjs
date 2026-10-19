import { readFile, writeFile } from "node:fs/promises";
import { prerenderPaths, render } from "../dist-ssr/entry-server.js";

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const path of prerenderPaths) {
  const file = new URL(`../dist${path}index.html`, import.meta.url);
  const template = await readFile(file, "utf8");
  if (!template.includes('<div id="root"></div>') || !template.includes("<!--structured-data-->")) {
    throw new Error(`Missing prerender placeholders: ${path}`);
  }
  const { html, structuredData, title, description, legalText } = render(path);
  // Replacement functions preserve literal dollar signs in future copy.
  const document = template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta\s+(?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*(")/g, (_, start, end) => `${start}${escapeHtml(description)}${end}`)
    .replace(/(<meta\s+(?:property="og:title"|name="twitter:title")\s+content=")[^"]*(")/g, (_, start, end) => `${start}${escapeHtml(title)}${end}`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
    .replace("<!--structured-data-->", () => `<script type="application/ld+json">${structuredData}</script>`);
  await writeFile(file, document);
  if (legalText !== undefined) {
    const slug = path.split("/").filter(Boolean).at(-1);
    const note = legalText.includes("[확정 필요") ? "검토용 미리보기 — 아직 적용되지 않은 보관·동의 정책과 확인이 필요한 항목이 포함되어 있습니다. 현재 앱 동작을 보장하는 최종 개인정보처리방침이 아닙니다.\n\n" : "";
    const text = `${title}\n게시일: 2026-10-19 / 적용일: 2026-10-19 / 버전: 2026-10-19\n\n${note}${legalText}`;
    await writeFile(new URL(`../dist${path}${slug}-2026-10-19.txt`, import.meta.url), text);
  }
  console.log(`Prerendered ${path}`);
}
