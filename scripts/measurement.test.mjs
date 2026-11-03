import test from "node:test";
import assert from "node:assert/strict";
import { campaignUrl, createMeasurement, isMeasurementPage } from "../src/lib/measurement.ts";

const config = { enabled: true, ga4Id: "G-TEST123456", pixelId: "123456789012345" };
const none = { analytics: false, advertising: false };
const both = { analytics: true, advertising: true };
function browser(href = "https://www.standinpose.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=open-beta&utm_content=meta-hook-a#beta") {
  const storage = new Map();
  const scripts = [];
  const cookieWrites = [];
  let reloads = 0;
  const listeners = new Map();
  const win = {
    addEventListener: (type, callback) => listeners.set(type, callback),
    location: { href, hostname: new URL(href).hostname, reload() { reloads += 1; } },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      referrer: "https://www.instagram.com/path?email=private@example.com",
      getElementById: (id) => scripts.find((item) => item.id === id),
      createElement: () => ({}), head: { appendChild: (script) => scripts.push(script) },
      get cookie() { return "standin_ga=1; standin_ga_TEST123456=2; _fbp=3; session=4"; },
      set cookie(value) { cookieWrites.push(value); },
    },
  };
  return { win, storage, scripts, cookieWrites, listeners, get reloads() { return reloads; } };
}
const events = (win) => (win.dataLayer ?? []).map((item) => Array.from(item)).filter((item) => item[0] === "event");
function savePreference(state, choice) {
  state.storage.set("standin.measurement.v2", JSON.stringify({ ...choice, version: 2, expiresAt: Date.now() + 10000 }));
}

test("disabled or unconfigured measurement never loads SDKs or records a download", () => {
  for (const overrides of [{ enabled: false }, { ga4Id: "", pixelId: "" }, { ga4Id: "bad", pixelId: "bad" }]) {
    const { win, scripts, storage } = browser();
    const measurement = createMeasurement({ ...config, ...overrides }, win);
    measurement.start(); measurement.saveChoice(both); measurement.download("Standin_1.0_x64-setup.exe");
    assert.equal(measurement.available, false); assert.equal(scripts.length, 0); assert.equal(storage.size, 0);
  }
});

test("new visitors send basic events with every Google storage permission denied and no Meta", () => {
  const { win, scripts, storage, cookieWrites } = browser();
  const measurement = createMeasurement(config, win);
  assert.equal(measurement.start(), null);
  measurement.download("Standin_1.0_x64-setup.exe");
  measurement.pcLinkCopy();
  assert.equal(scripts.length, 1); assert.equal(win.fbq, undefined);
  assert.deepEqual(Array.from(win.dataLayer[0]), ["consent", "default", {
    analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  }]);
  assert.deepEqual(events(win).map((event) => event[1]), ["page_view", "download_click", "pc_link_copy"]);
  assert.equal(storage.size, 0); assert.deepEqual(cookieWrites, []);
});

test("an existing explicit refusal still loads no providers or event queues", () => {
  const state = browser(); savePreference(state, none);
  const measurement = createMeasurement(config, state.win);
  assert.deepEqual(measurement.start(), none);
  measurement.download("Standin_1.0_x64-setup.exe");
  assert.equal(state.scripts.length, 0);
  assert.equal(state.win.dataLayer, undefined); assert.equal(state.win.fbq, undefined);
});

test("blocked preference storage retains a refusal on the current document", () => {
  const state = browser(); const measurement = createMeasurement(config, state.win);
  measurement.start();
  state.win.localStorage.setItem = () => { throw Error("blocked"); };
  measurement.saveChoice(none); measurement.pcLinkCopy();
  assert.equal(state.reloads, 0);
  assert.equal(state.win[`ga-disable-${config.ga4Id}`], true);
  assert.deepEqual(events(state.win).map((event) => event[1]), ["page_view"]);
  measurement.saveChoice({ analytics: true, advertising: false });
  assert.equal(state.win[`ga-disable-${config.ga4Id}`], false);
});

test("rejecting basic statistics blocks further events and stays rejected after reload", () => {
  const state = browser(); const measurement = createMeasurement(config, state.win);
  measurement.start(); measurement.saveChoice(none);
  measurement.pcLinkCopy();
  assert.equal(state.win[`ga-disable-${config.ga4Id}`], true);
  assert.equal(state.reloads, 1);
  assert.deepEqual(events(state.win).map((event) => event[1]), ["page_view"]);
  const fresh = browser(); fresh.storage.set("standin.measurement.v2", state.storage.get("standin.measurement.v2"));
  assert.deepEqual(createMeasurement(config, fresh.win).start(), none);
  assert.equal(fresh.scripts.length, 0);
});

test("analytics-only consent does not start Meta, and repeated initialization counts one page view", () => {
  const { win, scripts } = browser();
  const measurement = createMeasurement(config, win);
  measurement.start(); measurement.saveChoice({ analytics: true, advertising: false });
  measurement.start(); measurement.saveChoice({ analytics: true, advertising: false });
  assert.equal(scripts.length, 1); assert.equal(win.fbq, undefined);
  assert.equal(events(win).filter((event) => event[1] === "page_view").length, 1);
  const settings = win.dataLayer.map((item) => Array.from(item)).find((item) => item[0] === "config")[2];
  assert.equal(settings.page_referrer, "https://www.instagram.com/");
  assert.equal(settings.allow_google_signals, false);
  const updates = win.dataLayer.map((item) => Array.from(item)).filter((item) => item[0] === "consent" && item[1] === "update");
  assert.deepEqual(updates, [["consent", "update", { analytics_storage: "granted" }]]);
});

test("advertising-only consent does not start Google Analytics", () => {
  const state = browser(); savePreference(state, { analytics: false, advertising: true });
  const { win, scripts } = state;
  const measurement = createMeasurement(config, win);
  measurement.start();
  assert.equal(win.dataLayer, undefined); assert.equal(scripts.length, 1);
  assert.ok(win.fbq.queue.some((item) => item[0] === "set" && item[1] === "autoConfig" && item[2] === false));
});

test("only installer clicks count as downloads; PC link copies never count as installs or activation", () => {
  const { win } = browser(); const measurement = createMeasurement(config, win);
  measurement.start(); measurement.saveChoice(both);
  measurement.download("Standin_1.0_x64-setup.exe"); measurement.download("Standin_1.0_universal.dmg");
  measurement.download("private-user-file.zip"); measurement.pcLinkCopy();
  assert.deepEqual(events(win).map((item) => item[1]), ["page_view", "download_click", "download_click", "pc_link_copy"]);
  assert.deepEqual(events(win).filter((item) => item[1] === "download_click").map((item) => item[2].platform), ["windows", "macos"]);
  assert.deepEqual(win.fbq.queue.filter((item) => item[0] === "trackSingleCustom").map((item) => item[2]), ["DownloadClick", "DownloadClick", "PcLinkCopy"]);
  assert.ok(!JSON.stringify(win.dataLayer).includes("private-user"));
});

test("PC link preserves campaign labels but drops click IDs, arbitrary parameters and sensitive values", () => {
  assert.equal(campaignUrl("https://www.standinpose.com/guides/clip-studio-pose-import/?utm_source=instagram&utm_content=meta-hook-b&fbclid=abc&email=x%40example.com#faq", true), "https://www.standinpose.com/?utm_source=instagram&utm_content=meta-hook-b#beta");
  assert.equal(campaignUrl("https://www.standinpose.com/?utm_content=x%40example.com", true), "https://www.standinpose.com/#beta");
});

test("account, survey and arbitrary payload URLs never start either SDK", () => {
  for (const path of ["/signup/", "/feedback/", "/legal/privacy/", "/?email=a%40b.com", "/?utm_source=a%40b.com", "/#user@example.com"]) {
    const href = `https://www.standinpose.com${path}`;
    const { win, scripts } = browser(href); const measurement = createMeasurement(config, win);
    assert.equal(isMeasurementPage(href), false); measurement.start(); measurement.saveChoice(both);
    assert.equal(scripts.length, 0);
  }
});

test("withdrawal blocks queued events, removes only revoked cookies, and reloads without replay", () => {
  const state = browser(); const measurement = createMeasurement(config, state.win);
  measurement.start(); measurement.saveChoice(both);
  measurement.saveChoice({ analytics: true, advertising: false });
  assert.equal(state.win[`ga-disable-${config.ga4Id}`], true);
  assert.deepEqual(state.win.fbq.queue, [["consent", "revoke"]]);
  assert.equal(state.reloads, 1);
  assert.ok(state.cookieWrites.some((item) => item.startsWith("_fbp=")));
  assert.ok(!state.cookieWrites.some((item) => item.startsWith("standin_ga=")));
  assert.ok(!state.cookieWrites.some((item) => item.startsWith("session=")));
});

test("expired, malformed or inaccessible preferences use cookieless analytics without Meta", () => {
  for (const saved of ["{", JSON.stringify({ ...both, version: 2, expiresAt: 0 })]) {
    const { win, storage, scripts } = browser(); storage.set("standin.measurement.v2", saved);
    assert.equal(createMeasurement(config, win).start(), null); assert.equal(scripts.length, 1);
    assert.equal(Array.from(win.dataLayer[0])[2].analytics_storage, "denied"); assert.equal(win.fbq, undefined);
  }
  const { win, scripts } = browser(); win.localStorage.getItem = () => { throw Error("blocked"); };
  assert.equal(createMeasurement(config, win).start(), null); assert.equal(scripts.length, 1);
  assert.equal(Array.from(win.dataLayer[0])[2].analytics_storage, "denied"); assert.equal(win.fbq, undefined);
});

test("a refusal in another tab also stops default cookieless statistics", () => {
  const state = browser(); const measurement = createMeasurement(config, state.win);
  measurement.start(); savePreference(state, none);
  state.listeners.get("storage")({ key: "standin.measurement.v2" });
  measurement.pcLinkCopy();
  assert.equal(state.reloads, 1);
  assert.deepEqual(events(state.win).map((event) => event[1]), ["page_view"]);
});

test("withdrawal in another tab immediately blocks tracking here", () => {
  const state = browser(); const measurement = createMeasurement(config, state.win);
  measurement.start(); measurement.saveChoice(both);
  state.storage.set("standin.measurement.v2", JSON.stringify({ ...none, version: 2, expiresAt: Date.now() + 10000 }));
  state.listeners.get("storage")({ key: "standin.measurement.v2" });
  measurement.download("Standin_1.0_x64-setup.exe");
  assert.equal(state.reloads, 1);
  assert.equal(events(state.win).filter((event) => event[1] === "download_click").length, 0);
  assert.deepEqual(state.win.fbq.queue, [["consent", "revoke"]]);
});

test("measurement failures never break a download action", () => {
  const { win } = browser(); const measurement = createMeasurement(config, win);
  measurement.start(); measurement.saveChoice(both); win.gtag = () => { throw Error("SDK unavailable"); };
  assert.doesNotThrow(() => measurement.download("Standin_1.0_x64-setup.exe"));
});
