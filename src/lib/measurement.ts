export type MeasurementChoice = { analytics: boolean; advertising: boolean };
export type MeasurementConfig = { enabled: boolean; ga4Id: string; pixelId: string };
type Tag = (...args: unknown[]) => void;
type Pixel = Tag & { callMethod?: Tag; queue: unknown[][]; push?: Pixel; loaded: boolean; version: string };
type MeasurementWindow = Window & { dataLayer?: unknown[]; gtag?: Tag; fbq?: Pixel; _fbq?: Pixel };

const choiceKey = "standin.measurement.v2";
const lifetime = 180 * 24 * 60 * 60 * 1000;
const publicPaths = new Set(["/", "/guides/rough-to-3d-pose/", "/guides/clip-studio-pose-import/"]);
const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_id"] as const;
const safeValue = /^[a-zA-Z0-9_-]{1,100}$/;

/** Campaign labels only. Never copy arbitrary query parameters or personal identifiers. */
export function campaignUrl(href: string, forPc = false): string {
  const source = new URL(href);
  const result = new URL(forPc ? "/" : source.pathname, source.origin);
  for (const key of campaignKeys) {
    const value = source.searchParams.get(key);
    if (value && safeValue.test(value)) result.searchParams.set(key, value);
  }
  if (forPc) result.hash = "beta";
  return result.href;
}

/** SDKs may inspect the address themselves; do not load on unknown query payloads. */
export function isMeasurementPage(href: string): boolean {
  const url = new URL(href);
  if (!publicPaths.has(url.pathname)) return false;
  if (url.hash && !/^#[a-zA-Z0-9_-]{1,80}$/.test(url.hash)) return false;
  return [...url.searchParams].every(([key, value]) =>
    campaignKeys.includes(key as typeof campaignKeys[number]) ? safeValue.test(value)
      : key === "fbclid" && /^[a-zA-Z0-9_-]{1,500}$/.test(value));
}

export function createMeasurement(config: MeasurementConfig, browser?: Window) {
  const win = browser as MeasurementWindow | undefined;
  const ga4Id = /^G-[A-Z0-9]+$/.test(config.ga4Id) ? config.ga4Id : "";
  const pixelId = /^\d{5,30}$/.test(config.pixelId) ? config.pixelId : "";
  const available = Boolean(config.enabled && win && (ga4Id || pixelId) && isMeasurementPage(win.location.href));
  let choice: MeasurementChoice = { analytics: false, advertising: false };
  let gaStarted = false;
  let pixelStarted = false;
  let started = false;

  function readChoice(): MeasurementChoice | null {
    if (!available || !win) return null;
    try {
      const saved = JSON.parse(win.localStorage.getItem(choiceKey) ?? "null");
      return saved?.version === 2 && saved.expiresAt > Date.now() &&
        typeof saved.analytics === "boolean" && typeof saved.advertising === "boolean"
        ? { analytics: saved.analytics, advertising: saved.advertising } : null;
    } catch { return null; }
  }

  function loadScript(id: string, src: string) {
    if (!win || win.document.getElementById(id)) return;
    const script = win.document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    win.document.head.appendChild(script);
  }

  function startProviders() {
    if (!available || !win) return;
    if (choice.analytics && ga4Id && !gaStarted) {
      gaStarted = true;
      win.dataLayer = win.dataLayer ?? [];
      // Google's bootstrap expects an Arguments object in dataLayer.
      // eslint-disable-next-line prefer-rest-params
      win.gtag = win.gtag ?? function (..._args: unknown[]) { win.dataLayer!.push(arguments); };
      win.gtag("consent", "default", {
        analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      });
      win.gtag("js", new Date());
      let referrer = "";
      try { referrer = new URL(win.document.referrer).origin + "/"; } catch { /* no referrer */ }
      win.gtag("config", ga4Id, {
        send_page_view: false, page_location: campaignUrl(win.location.href), page_referrer: referrer,
        allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_domain: "none", cookie_prefix: "standin", cookie_expires: lifetime / 1000,
      });
      win.gtag("event", "page_view", { send_to: ga4Id });
      loadScript("standin-ga4", `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
    }
    if (choice.advertising && pixelId && !pixelStarted) {
      pixelStarted = true;
      if (!win.fbq) {
        const pixel = function (...args: unknown[]) {
          if (pixel.callMethod) pixel.callMethod(...args);
          else pixel.queue.push(args);
        } as Pixel;
        pixel.queue = [];
        pixel.push = pixel;
        pixel.loaded = true;
        pixel.version = "2.0";
        win.fbq = pixel;
        win._fbq = pixel;
      }
      win.fbq("consent", "grant");
      win.fbq("set", "autoConfig", false, pixelId);
      win.fbq("init", pixelId);
      win.fbq("trackSingle", pixelId, "PageView");
      loadScript("standin-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
    }
  }

  function clearCookies(previous: MeasurementChoice) {
    if (!win) return;
    const domains = ["", win.location.hostname, "standinpose.com", "www.standinpose.com"];
    for (const cookie of win.document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      const analyticsCookie = previous.analytics && !choice.analytics && /^standin_ga(?:_|$)/.test(name);
      const advertisingCookie = previous.advertising && !choice.advertising && /^_fb[pc]$/.test(name);
      if (!analyticsCookie && !advertisingCookie) continue;
      for (const domain of domains) {
        win.document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }

  function applyChoice(next: MeasurementChoice, persist: boolean) {
    if (!available || !win) return;
    const previous = choice;
    const withdrawing = (choice.analytics && !next.analytics) || (choice.advertising && !next.advertising);
    choice = { analytics: Boolean(next.analytics && ga4Id), advertising: Boolean(next.advertising && pixelId) };
    try { if (persist) win.localStorage.setItem(choiceKey, JSON.stringify({ ...choice, version: 2, expiresAt: Date.now() + lifetime })); }
    catch { /* Storage can be blocked; the current-page choice still applies. */ }
    if (withdrawing) {
      // Block queued and subsequent events, then unload the providers on a fresh document.
      if (ga4Id) (win as unknown as Record<string, unknown>)[`ga-disable-${ga4Id}`] = true;
      if (win.fbq) { if (Array.isArray(win.fbq.queue)) win.fbq.queue.length = 0; win.fbq("consent", "revoke"); }
      clearCookies(previous);
      win.location.reload();
      return;
    }
    startProviders();
  }

  function track(event: "download_click" | "pc_link_copy", params: Record<string, string> = {}) {
    if (!available || !win) return;
    try {
      if (choice.analytics && gaStarted) win.gtag?.("event", event, { ...params, send_to: ga4Id, transport_type: "beacon" });
      if (choice.advertising && pixelStarted) {
        const names = { download_click: "DownloadClick", pc_link_copy: "PcLinkCopy" };
        win.fbq?.("trackSingleCustom", pixelId, names[event], params);
      }
    } catch { /* Measurement must never prevent a download or navigation. */ }
  }

  return {
    available, hasAnalytics: Boolean(ga4Id), hasAdvertising: Boolean(pixelId),
    start() {
      if (started) return readChoice();
      started = true;
      const saved = readChoice();
      if (saved) { choice = saved; startProviders(); }
      if (available && win) win.addEventListener("storage", (event) => {
        if (event.key !== choiceKey && event.key !== null) return;
        const next = readChoice() ?? { analytics: false, advertising: false };
        // Propagate withdrawal to an already-open tab without rewriting storage.
        if ((choice.analytics && !next.analytics) || (choice.advertising && !next.advertising)) applyChoice(next, false);
      });
      return saved;
    },
    saveChoice(next: MeasurementChoice) { applyChoice(next, true); },
    download(fileName: string) {
      if (/^Standin_[\w.+-]+_x64-setup\.exe$/i.test(fileName)) track("download_click", { platform: "windows", file_extension: "exe" });
      else if (/^Standin_[\w.+-]+_(universal|aarch64|x64)\.dmg$/i.test(fileName)) track("download_click", { platform: "macos", file_extension: "dmg" });
    },
    pcLinkCopy() { track("pc_link_copy"); },
  };
}
