// 브랜드 소셜 이미지(SVG → PNG) 생성 스크립트.
//
// 실행: 프로젝트 루트에서
//   npm i -D @resvg/resvg-js
//   node brand/twitter/gen-social.mjs
//
// Pretendard가 시스템에 설치돼 있지 않으면 Malgun Gothic으로 대체 렌더링된다.
// (SVG 소스의 font-family는 Pretendard 우선 → 편집/재수출 시 브랜드 폰트 유지)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));

const jobs = [
  { in: "profile.svg", out: "profile.png", width: 400 }, // 트위터 프로필 400×400
  { in: "header.svg", out: "header.png", width: 1500 }, // 트위터 헤더 1500×500
];

for (const job of jobs) {
  const svg = readFileSync(join(here, job.in), "utf8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: job.width },
    font: { loadSystemFonts: true, defaultFontFamily: "Malgun Gothic" },
    background: "#152238",
  });
  const png = resvg.render().asPng();
  writeFileSync(join(here, job.out), png);
  console.log(`✓ ${job.out} (${png.length.toLocaleString()} bytes)`);
}
