import { readFile, writeFile } from "node:fs/promises";
import { publicPaths, render } from "../dist-ssr/entry-server.js";

for (const path of publicPaths) {
  const file = new URL(`../dist${path}index.html`, import.meta.url);
  const template = await readFile(file, "utf8");
  if (!template.includes('<div id="root"></div>') || !template.includes("<!--structured-data-->")) {
    throw new Error(`Missing prerender placeholders: ${path}`);
  }
  const { html, structuredData } = render(path);
  // Replacement functions preserve literal dollar signs in future copy.
  const document = template
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
    .replace("<!--structured-data-->", () => `<script type="application/ld+json">${structuredData}</script>`);
  await writeFile(file, document);
  console.log(`Prerendered ${path}`);
}
