// Standin 소개 카드뉴스(SVG → PNG) 생성 스크립트.
//
// 실행: 프로젝트 루트에서
//   npm i -D @resvg/resvg-js
//   node brand/cardnews/gen-cards.mjs
//
// 폴더 내 *.svg 를 모두 1080×1080 PNG로 렌더링한다.
// Pretendard 미설치 시 Malgun Gothic으로 대체 렌더링된다.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const svgs = readdirSync(here)
  .filter((f) => f.endsWith(".svg"))
  .sort();

for (const file of svgs) {
  const svg = readFileSync(join(here, file), "utf8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1080 },
    font: { loadSystemFonts: true, defaultFontFamily: "Malgun Gothic" },
  });
  const png = resvg.render().asPng();
  const out = file.replace(/\.svg$/, ".png");
  writeFileSync(join(here, out), png);
  console.log(`✓ ${out} (${png.length.toLocaleString()} bytes)`);
}
