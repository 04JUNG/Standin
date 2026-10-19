import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

// Explicit authoring command; normal builds use the checked-in, reviewable copies.
const source = resolve(process.argv[2] ?? "../Standin-master-docs/오픈베타_영업_준비/약관_정책");
const root = new URL("../", import.meta.url);
const date = "2026-10-19";
const documents = [
  ["01_", "terms", "이용약관"],
  ["02_", "privacy", "개인정보처리방침"],
  ["03_", "content-license", "콘텐츠 라이선스 약관"],
  ["04_", "beta", "오픈베타 운영정책"],
];
const files = await readdir(source);
await mkdir(new URL("src/content/legal/", root), { recursive: true });
for (const [prefix, slug, label] of documents) {
  const name = files.find((file) => file.startsWith(prefix) && file.endsWith(".md"));
  if (!name) throw new Error(`Missing source: ${prefix}`);
  const original = await readFile(resolve(source, name), "utf8");
  if (!original.includes(`공개일: ${date} / 시행일: ${date}`)) throw new Error(`Confirm publication/effective dates: ${name}`);
  let body = original.replace(/\r\n/g, "\n").split("\n")
    .filter((line) => !/^(# |문서 ID:|최종 수정일:|공개일:|>)/.test(line))
    .join("\n").replace(/\n{3,}/g, "\n\n").trim();
  // Editorial/implementation instructions stay in master-docs. Missing material
  // disclosures stay visible in this local review copy, never silently invented.
  body = body.split("\n\n").filter((paragraph) => ![
    "이 표에 없는 이름·전화번호", "GitHub 다운로드·업데이트 요청 및 Discord 운영 알림은 실제 흐름을 확인해",
    "위 두 번째 행은 게시 전",
  ].some((prefix) => paragraph.startsWith(prefix))).join("\n\n");
  body = body
    .replace(" [확정 필요: 연장·조기 종료 등 일정 변경의 구체적인 고지 기준]", "")
    .replace(" [확정 필요: 일정 변경의 구체적인 고지 기준. 이용약관 제12조와 함께 확정]", "")
    .replace("15B에 따라 예정 일정을 유지하며", "현재 예정 일정이며")
    .replace(" [확정 필요: 최종 시작·종료 일시].", "")
    .replace("- 지원 환경: [확정 필요: 실제 지원 Windows·macOS 버전 및 하드웨어 조건]", "- 지원 환경: 설치 파일 제공 시 다운로드 안내에서 지원 운영체제와 하드웨어 조건을 안내합니다.")
    .replace("현재 초안은 “정식 출시 후 1개월 무료” 등을 확정된 혜택으로 약속하지 않습니다. ", "")
    .replace("로컬 코드에서 다시 검색은 미지원이며", "다시 검색은 미지원이며")
    .replace(" [확정 필요: 실제 배포 기능·차감 방식 일치 여부]", "")
    .replace(" [확정 필요: 실제 배포 설정 및 대기·시간 초과 처리 안내 일치 여부]", "")
    .replace("[확정 필요: 실제 취소 기능과 안내 기준. 현재 코드의 오래된 미완료 작업 정리는 자동 복원하지 않음]", "오래된 미완료 작업 정리 시 차감 횟수가 자동 복원되지 않음. 처리가 완료되지 않은 작업은 고객지원에 문의")
    .replace("별도로 동의한 이용자에게 소식 발송(14A)", "별도로 동의한 이용자에게 소식 발송")
    .replace("2026-10-19 답변 17에 따라 제공자 미정. 선정 후 계약 법인·국가·기간 확인. 직접 다운로드에 초대 메일은 필요 없음. 문의용 Gmail과 같은 발송 시스템이라고 가정하지 않음", "[확정 필요: 발송 제공자·계약 법인·처리 국가·보관기간]");
  await writeFile(new URL(`src/content/legal/${slug}.md`, root), `${body}\n`);
  const downloads = new URL(`public/legal/${slug}/`, root);
  await mkdir(downloads, { recursive: true });
  const note = body.includes("[확정 필요") ? "검토용 미리보기 — 아직 적용되지 않은 보관·동의 정책과 확인이 필요한 항목이 포함되어 있습니다. 현재 앱 동작을 보장하는 최종 개인정보처리방침이 아닙니다.\n\n" : "";
  await writeFile(new URL(`${slug}-${date}.txt`, downloads), `${label} | Standin\n게시일: ${date} / 적용일: ${date} / 버전: ${date}\n\n${note}${body}\n`);
  const dir = new URL(`legal/${slug}/`, root);
  await mkdir(dir, { recursive: true });
  // All documents are excluded from indexing until the release review is done.
  const template = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${label} | Standin</title>
    <meta name="description" content="Standin ${label}" />
    <link rel="canonical" href="https://www.standinpose.com/legal/${slug}/" />
    <meta property="og:url" content="https://www.standinpose.com/legal/${slug}/" />
    <meta property="og:title" content="${label} | Standin" />
    <meta property="og:description" content="Standin ${label}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="Standin" />
    <meta property="og:image" content="https://www.standinpose.com/standin-social-card.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://www.standinpose.com/standin-social-card.png" />
    <!--structured-data-->
    <link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/legal.tsx"></script>
  </body>
</html>
`;
  await writeFile(new URL("index.html", dir), template);
  console.log(`Prepared ${slug} from ${name}`);
}
