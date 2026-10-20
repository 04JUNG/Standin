import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

async function loadTs(path) {
  const code = ts.transpileModule(await readFile(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}
const { parseRelease } = await loadTs("../src/lib/releases.ts");
const survey = await loadTs("../src/data/feedbackSurvey.ts");
const schema = await readFile(new URL("../server/open-beta-feedback/Schema.gs", import.meta.url), "utf8");
const receiver = await readFile(new URL("../server/open-beta-feedback/Code.gs", import.meta.url), "utf8");
const prefix = "https://github.com/04JUNG/Standin-client/releases/download/v1/";
const asset = (name, url = prefix + name) => ({ name, browser_download_url: url, size: 1234 });
const release = { draft: false, prerelease: false, tag_name: "v1", assets: [
  asset("Standin_1_x64-setup.exe"), asset("Standin_1_aarch64.dmg"), asset("Standin_1_x64.dmg"),
  asset("Standin_1_x64-setup.exe.sig"), asset("Standin_1_aarch64.app.tar.gz"),
  asset("Standin Updater QA_1_x64-setup.exe"),
] };
test("latest release exposes real installers, including both Mac architectures", () => {
  assert.equal(parseRelease(release).assets.length, 3);
  assert.equal(parseRelease({ ...release, assets: [asset("Standin_1_universal.dmg")] }).assets.length, 1);
});
test("draft, staging, prerelease and foreign assets cannot become download buttons", () => {
  for (const change of [{ draft: true }, { prerelease: true }, { tag_name: "staging-dev.304" },
    { assets: [asset("Standin_1_x64-setup.exe", "https://example.com/test.exe")] }, { assets: [] }]) {
    assert.throws(() => parseRelease({ ...release, ...change }));
  }
});

function runtime() {
  const rows = [];
  let locked = false;
  let appendFails = false;
  const removed = [];
  const headers = vm.runInNewContext(`${schema}\nHEADERS`);
  const sheet = {
    getLastRow: () => rows.length + 1,
    getRange: (row, column) => ({
      getValues: () => row === 1 ? [headers] : rows.map((item) => [item[0]]),
      createTextFinder: (id) => ({ matchEntireCell: () => ({ findNext: () => {
        const index = rows.findIndex((item) => item[1] === id);
        return index >= 0 ? { getRow: () => index + 2 } : null;
      } }) }),
      getValue: () => rows[row - 2][column - 1],
    }),
    appendRow: (row) => { assert.equal(locked, true); if (appendFails) throw new Error("NETWORK"); rows.push(row); },
    deleteRow: (row) => rows.splice(row - 2, 1),
  };
  const properties = { FEEDBACK_SHEET_ID: "new-sheet", FEEDBACK_UPLOAD_FOLDER_ID: "new-folder" };
  const context = vm.createContext({
    Date, JSON, console,
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => properties[key] }) },
    Utilities: { base64Decode: (data) => [...Buffer.from(data, "base64")], newBlob: (bytes, type, name) => ({ bytes, type, name }) },
    LockService: { getScriptLock: () => ({ tryLock: () => { locked = true; return true; }, waitLock: () => { locked = true; }, releaseLock: () => { locked = false; } }) },
    SpreadsheetApp: { openById: (id) => { assert.equal(id, "new-sheet"); return { getSheetByName: () => sheet }; } },
    DriveApp: { getFolderById: (id) => { assert.equal(id, "new-folder"); return {
      createFile: (blob) => ({ getId: () => blob.name, getUrl: () => "https://drive.google.com/file/d/" + blob.name }),
      getFiles: () => ({ hasNext: () => false }),
    }; } },
    Drive: { Files: { remove: (id) => removed.push(id) } },
  });
  vm.runInContext(schema + receiver, context);
  return { context, rows, properties, removed, failAppend: () => { appendFails = true; }, post: (payload) => context.doPost({ postData: { contents: JSON.stringify(payload) } }) };
}
function payload(mode = "complete") {
  return { formType: "open-beta-feedback", surveyVersion: survey.SURVEY_VERSION, requestId: "12345678-1234-4321-9234-123456789012",
    mode, answers: Object.fromEntries(survey.getQuestions(mode).map((q) => [q.id, q.options?.[0] ?? ""])),
    email: "", reward: false, consent: true, files: [] };
}
const png = { type: "image/png", data: Buffer.from([137,80,78,71,13,10,26,10,0]).toString("base64") };
test("both survey branches save without email or attachments; unused answers are dropped", () => {
  for (const mode of ["complete", "dropoff"]) {
    const r = runtime(), p = payload(mode);
    p.answers[mode === "complete" ? "issue_detail" : "image_quality"] = "unrelated";
    assert.equal(r.post(p).ok, true);
    assert.equal(r.rows.length, 1);
    assert.equal(r.rows[0].length, r.context.HEADERS.length);
    assert.ok(!r.rows[0].includes("unrelated"));
  }
});
test("required choices, consent, version, email, and reward requirements are enforced on server", () => {
  for (const change of [{ consent: false }, { surveyVersion: "old" }, { mode: "invalid" }, { email: "bad" }, { reward: true }, { answers: {} }]) {
    const r = runtime();
    assert.equal(r.post({ ...payload(), ...change }).ok, false);
    assert.equal(r.rows.length, 0);
  }
  const r = runtime(), p = payload(); p.answers.os = "not a real option";
  assert.equal(r.post(p).ok, false);
});
test("retries deduplicate under the write lock; spreadsheet formulas remain literal", () => {
  const r = runtime(), p = payload(); p.answers.priority = '=IMPORTXML("https://example.com", "//a")';
  assert.equal(r.post(p).ok, true);
  assert.equal(r.post(p).duplicate, true);
  assert.equal(r.rows.length, 1);
  assert.ok(r.rows[0].includes("'" + p.answers.priority));
});
test("missing dedicated spreadsheet never falls back to preregistration storage", () => {
  const r = runtime(); delete r.properties.FEEDBACK_SHEET_ID;
  assert.equal(r.post(payload()).ok, false); assert.equal(r.rows.length, 0);
});
test("attachment MIME spoofing and excessive attachments are rejected before writes", () => {
  for (const files of [[{ ...png, type: "image/jpeg" }], [png, png, png], [{ ...png, data: "bad!" }]]) {
    const r = runtime(); assert.equal(r.post({ ...payload(), files }).ok, false); assert.equal(r.rows.length, 0);
  }
});
test("failed writes clean up uploaded files and do not report success", () => {
  const r = runtime(); r.failAppend();
  assert.equal(r.post({ ...payload(), files: [png] }).ok, false);
  assert.equal(r.removed.length, 1);
});
test("event dates are evaluated in Korea; participation is separate from survey submission", () => {
  const r = runtime(), p = { ...payload(), reward: true };
  assert.equal(r.context.rewardAccepted_(p, new Date("2026-10-20T14:59:59Z")), false);
  assert.equal(r.context.rewardAccepted_(p, new Date("2026-10-20T15:00:00Z")), true);
  assert.equal(r.context.rewardAccepted_(p, new Date("2026-11-11T15:00:00Z")), false);
});
test("retention removes expired response rows while preserving newer records", () => {
  const r = runtime(); r.post(payload());
  r.rows[0][0] = new Date(Date.now() - 91 * 86400000);
  r.post({ ...payload(), requestId: "22345678-1234-4321-9234-123456789012" });
  r.context.deleteExpiredFeedback();
  assert.equal(r.rows.length, 1);
  assert.equal(r.rows[0][1], "22345678-1234-4321-9234-123456789012");
});
