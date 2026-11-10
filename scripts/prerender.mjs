import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from 'node:child_process';
import { prerenderPaths, render, blogPosts, blogPath } from "../dist-ssr/entry-server.js";

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const path of prerenderPaths) {
  const file = new URL(`../dist${path}index.html`, import.meta.url);
  const template = await readFile(file, "utf8");
  if (!template.includes('<div id="root"></div>') || !template.includes("<!--structured-data-->")) {
    throw new Error(`Missing prerender placeholders: ${path}`);
  }
  const { html, structuredData, title, description, legalText, socialImage } = render(path);
  // Replacement functions preserve literal dollar signs in future copy.
  let document = template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta\s+(?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*(")/g, (_, start, end) => `${start}${escapeHtml(description)}${end}`)
    .replace(/(<meta\s+(?:property="og:title"|name="twitter:title")\s+content=")[^"]*(")/g, (_, start, end) => `${start}${escapeHtml(title)}${end}`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
    .replace("<!--structured-data-->", () => `<script type="application/ld+json">${structuredData}</script>`);
  if (socialImage) {
    const values = { 'og:image': `https://www.standinpose.com${socialImage.src}`, 'twitter:image': `https://www.standinpose.com${socialImage.src}`,
      'og:image:alt': socialImage.alt, 'twitter:image:alt': socialImage.alt,
      'og:image:width': String(socialImage.width), 'og:image:height': String(socialImage.height) };
    document = document.replace(/(<meta\s+(?:name|property)="([^"]+)"\s+content=")[^"]*(")/g,
      (match, start, key, end) => values[key] ? `${start}${escapeHtml(values[key])}${end}` : match);
  }
  await writeFile(file, document);
  if (legalText !== undefined) {
    const slug = path.split("/").filter(Boolean).at(-1);
    const note = legalText.includes("[확정 필요") ? "검토용 미리보기 — 아직 적용되지 않은 보관·동의 정책과 확인이 필요한 항목이 포함되어 있습니다. 현재 앱 동작을 보장하는 최종 개인정보처리방침이 아닙니다.\n\n" : "";
    const text = `${title}\n게시일: 2026-10-19 / 적용일: 2026-10-19 / 버전: 2026-10-19\n\n${note}${legalText}`;
    await writeFile(new URL(`../dist${path}${slug}-2026-10-19.txt`, import.meta.url), text);
  }
  console.log(`Prerendered ${path}`);
}

const origin = 'https://www.standinpose.com';
const items = blogPosts.map(post => `<item><title>${escapeHtml(post.title)}</title><link>${origin}${blogPath(post)}</link><guid isPermaLink="true">${origin}${blogPath(post)}</guid><pubDate>${new Date(`${post.date}T00:00:00+09:00`).toUTCString()}</pubDate><description>${escapeHtml(post.takeaway?.text ?? post.description)}</description></item>`).join('\n');
await writeFile(new URL('../dist/blog/feed.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Standin 블로그</title><link>${origin}/blog/</link><description>클립스튜디오 3D 포즈와 BVH·FBX 사용법</description><language>ko</language><atom:link href="${origin}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}</channel></rss>\n`);
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await writeFile(new URL('../dist/deployment.json', import.meta.url), `${JSON.stringify({ commit })}\n`);
