/**
 * Formspree 제출 내역 → 구글 시트 이관용 CSV 변환기.
 *
 * Formspree 대시보드에서 복사한 표(탭 구분), 내려받은 CSV, 또는 JSON 배열을
 * 받아 `server/beta-form/Code.gs`의 시트 헤더와 같은 순서의 CSV로 바꾼다.
 * 변환 결과를 구글 시트에 올리면 신규 제출과 한 표에서 이어진다.
 *
 *   node scripts/formspree-to-csv.mjs <입력파일> [출력파일]
 *
 * 입력 형식은 확장자가 아니라 내용으로 판단한다.
 * 사용법과 붙여넣기 요령은 scripts/README.md 참고.
 */

import { readFileSync, writeFileSync } from "node:fs";

/**
 * 선택 항목 정의. `server/beta-form/Code.gs`의 FIELDS와 같아야 한다.
 * 시트에는 코드가 아니라 라벨을 적는다.
 *
 * `since`는 그 항목이 폼에 추가된 시점을 뜻한다 — 초기 제출에는 값이 없는
 * 항목이라 비어 있어도 경고하지 않는다.
 */
const FIELDS = [
  {
    key: "role",
    label: "작업 형태",
    required: true,
    options: {
      artist: "개인 웹툰 작가",
      studio: "웹툰 스튜디오",
      assistant: "어시스턴트",
      other: "기타",
    },
  },
  {
    key: "workStatus",
    label: "현재 작업 여부",
    options: {
      active: "현재 작업 중",
      occasional: "가끔 작업함",
      "not-now": "현재는 작업하지 않음",
    },
  },
  {
    key: "clipStudioEdition",
    label: "Clip Studio 제품",
    options: {
      pro: "Clip Studio Paint PRO",
      ex: "Clip Studio Paint EX",
      other: "기타·제품 모름",
      none: "사용하지 않음",
    },
  },
  {
    key: "clipStudioVersion",
    label: "Clip Studio 버전",
    options: {
      1: "Ver. 1",
      2: "Ver. 2",
      3: "Ver. 3",
      4: "Ver. 4",
      5: "Ver. 5",
      unknown: "버전 모름",
      none: "사용하지 않음",
    },
  },
  {
    key: "mannequinExperience",
    label: "3D 인형 사용 경험",
    options: {
      often: "자주 사용함",
      sometimes: "가끔 사용함",
      tried: "사용해 본 적 있음",
      none: "사용 경험 없음",
    },
  },
  {
    key: "source",
    label: "알게 된 경로",
    options: {
      "pd-network": "작가·PD 소개",
      ahart: "에이하트",
      "webtoon-academy": "웹툰 학원",
      bansa: "방사 네이버 카페",
      x: "X(트위터)",
      postype: "포스타입",
      kakao: "카카오 오픈채팅",
      discord: "디스코드",
      tumblbug: "텀블벅",
      bipa: "부산글로벌웹툰센터",
      pinterest: "Pinterest",
      other: "기타",
    },
  },
];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

/** server/beta-form/Code.gs 의 HEADER 와 순서가 같아야 한다. */
const HEADER = [
  "접수시각(KST)",
  "이메일",
  ...FIELDS.map((f) => f.label),
  "수신동의",
  ...UTM_KEYS,
  "유입 페이지",
  "브라우저",
  "비고",
];

/** 입력 열 이름 → 우리 필드. 소문자로 비교한다. */
const FIELD_ALIASES = {
  // 접수시각
  date: "receivedAt",
  submitted: "receivedAt",
  "submitted at": "receivedAt",
  "submission date": "receivedAt",
  created_at: "receivedAt",
  접수시각: "receivedAt",
  "접수시각(kst)": "receivedAt",
  // 이메일
  email: "email",
  "e-mail": "email",
  이메일: "email",
  // 동의
  consent: "consent",
  수신동의: "consent",
  동의: "consent",
  // 선택 항목 — 폼이 보내는 키 이름과 한글 라벨 둘 다 받는다.
  ...Object.fromEntries(
    FIELDS.flatMap((f) => [
      [f.key.toLowerCase(), f.key],
      [f.label.toLowerCase(), f.key],
    ]),
  ),
  ...Object.fromEntries(UTM_KEYS.map((k) => [k, k])),
};

/** 라벨로 붙여 넣은 값을 코드로 되돌리기 위한 역방향 표. */
const CODE_BY_LABEL = new Map(
  FIELDS.map((f) => [
    f.key,
    Object.fromEntries(Object.entries(f.options).map(([code, label]) => [label, code])),
  ]),
);

const MIGRATION_NOTE = "Formspree 이관";

main();

function main() {
  const [inputPath, outputPath = "formspree-legacy.csv"] = process.argv.slice(2);
  if (!inputPath) {
    console.error("사용법: node scripts/formspree-to-csv.mjs <입력파일> [출력파일]");
    process.exit(1);
  }

  const raw = readFileSync(inputPath, "utf8").replace(/^﻿/, "");
  const rows = parse(raw);
  if (rows.length === 0) {
    console.error("읽어낸 제출 기록이 없다. 입력 파일의 형식을 확인해라.");
    process.exit(1);
  }

  const records = rows.map(normalize);
  const problems = records.filter((r) => r.problems.length > 0);

  const csv = [HEADER, ...records.map((r) => r.row)]
    .map((cells) => cells.map(escapeCsv).join(","))
    .join("\r\n");

  // 구글 시트·엑셀이 한글을 깨뜨리지 않도록 BOM을 붙인다.
  writeFileSync(outputPath, "﻿" + csv + "\r\n", "utf8");

  console.log(`${records.length}건 변환 → ${outputPath}`);
  if (problems.length > 0) {
    console.warn(`\n확인이 필요한 ${problems.length}건:`);
    for (const { row, problems: list } of problems) {
      console.warn(`  ${row[1] || "(이메일 없음)"} — ${list.join(", ")}`);
    }
    console.warn("\n시트에 올리기 전에 해당 행을 직접 확인해라.");
  }
}

// ── 파싱 ──────────────────────────────────────────────────────────────────

/** 내용을 보고 JSON / 구분자 표 중 하나로 읽는다. 결과는 객체 배열. */
function parse(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const data = JSON.parse(trimmed);
    const list = Array.isArray(data) ? data : (data.submissions ?? [data]);
    return list.map((item) => mapKeys(item));
  }

  const lines = splitLines(trimmed);
  if (lines.length < 2) return [];

  // 표를 복사하면 탭으로 붙는다. 탭이 없으면 CSV로 본다.
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const header = splitRow(lines[0], delimiter);
  return lines.slice(1).map((line) => {
    const cells = splitRow(line, delimiter);
    const item = {};
    header.forEach((name, i) => {
      item[name] = cells[i] ?? "";
    });
    return mapKeys(item);
  });
}

/** 입력 열 이름을 우리 필드명으로 바꾼다. 모르는 열은 원래 이름으로 남긴다. */
function mapKeys(item) {
  const mapped = {};
  for (const [key, value] of Object.entries(item)) {
    const alias = FIELD_ALIASES[String(key).trim().toLowerCase()];
    mapped[alias ?? key] = value;
  }
  return mapped;
}

function splitLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** 따옴표로 감싼 셀 안의 구분자를 지키며 한 줄을 자른다. */
function splitRow(line, delimiter) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += ch;
    }
  }
  cells.push(cell.trim());
  return cells;
}

// ── 정규화 ────────────────────────────────────────────────────────────────

function normalize(item) {
  const problems = [];

  const email = String(item.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push("이메일 형식");

  const receivedAt = normalizeDate(item.receivedAt);
  if (!receivedAt) problems.push("접수시각 없음");

  const answers = FIELDS.map((field) => {
    const raw = String(item[field.key] ?? "").trim();
    if (!raw) {
      // 나중에 추가된 항목은 초기 제출에 없는 게 정상이라 필수만 경고한다.
      if (field.required) problems.push(`${field.label} 없음`);
      return "";
    }
    const label = toLabel(field, raw);
    if (!label) {
      problems.push(`${field.label} 값 불명(${raw})`);
      return raw; // 모르는 값도 버리지 않고 원문을 남긴다.
    }
    return label;
  });

  return {
    problems,
    row: [
      receivedAt,
      email,
      ...answers,
      normalizeConsent(item.consent),
      ...UTM_KEYS.map((key) => String(item[key] ?? "").trim()),
      "", // 유입 페이지 — Formspree에는 없던 값
      "", // 브라우저 — 위와 같음
      MIGRATION_NOTE,
    ],
  };
}

/** 코드든 한글 라벨이든 라벨로 맞춘다. 정의에 없으면 빈 문자열. */
function toLabel(field, raw) {
  if (field.options[raw]) return field.options[raw];
  if (CODE_BY_LABEL.get(field.key)[raw]) return raw;
  return "";
}

function normalizeConsent(value) {
  const v = String(value ?? "").trim().toLowerCase();
  const yes = ["true", "1", "y", "yes", "on", "동의", "체크", "예"];
  return yes.includes(v) ? "Y" : "N";
}

/**
 * 접수시각을 `yyyy-MM-dd HH:mm:ss` (KST)로 맞춘다.
 *
 * 타임존 표기가 있으면 KST로 변환하고, 없으면 이미 KST로 보고 숫자를 그대로
 * 쓴다 — 표기 없는 값을 임의로 옮기면 원본보다 부정확해진다.
 * 읽지 못한 값은 원문을 그대로 남겨 사람이 확인하게 한다.
 */
function normalizeDate(value) {
  const s = String(value ?? "").trim();
  if (!s) return "";

  const naive = s.match(
    /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})[T ]+(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (naive) {
    const [, y, mo, d, h, mi, sec] = naive;
    return `${y}-${pad(mo)}-${pad(d)} ${pad(h)}:${mi}:${sec ?? "00"}`;
  }

  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return s;

  // 타임존 표기가 없으면 파싱된 벽시계 숫자를 그대로 쓴다(= 이미 KST로 간주).
  if (!/(z|[+-]\d{2}:?\d{2}|utc|gmt)$/i.test(s)) {
    return (
      `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ` +
      `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`
    );
  }

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(parsed)
    .replace("T", " ");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// ── 출력 ──────────────────────────────────────────────────────────────────

function escapeCsv(value) {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
