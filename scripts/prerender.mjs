import { readFile, writeFile } from "node:fs/promises";
import { publicPaths, render } from "../dist-ssr/entry-server.js";

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const path of publicPaths) {
  const file = new URL(`../dist${path}index.html`, import.meta.url);
  const template = await readFile(file, "utf8");
  if (!template.includes('<div id="root"></div>') || !template.includes("<!--structured-data-->")) {
    throw new Error(`Missing prerender placeholders: ${path}`);
  }
  const { html, structuredData, title, description } = render(path);
  // Replacement functions preserve literal dollar signs in future copy.
  const document = template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta\s+(?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*(")/g, (_, start, end) => `${start}${escapeHtml(description)}${end}`)
    .replace(/(<meta\s+(?:property="og:title"|name="twitter:title")\s+content=")[^"]*(")/g, (_, start, end) => `${start}${escapeHtml(title)}${end}`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
    .replace("<!--structured-data-->", () => `<script type="application/ld+json">${structuredData}</script>`);
  await writeFile(file, document);
  console.log(`Prerendered ${path}`);
}
