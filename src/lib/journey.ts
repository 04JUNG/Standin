// First-party analytics: fixed event fields only, no form contents, raw URLs or session replay.
export const JOURNEY_VERSION = "2026-11-09";
const COOKIE = "standin_journey";
const REVOKE = "standin.journey.revoke.v1";
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const PATHS = new Set(["/", "/ja/", "/guides/rough-to-3d-pose/", "/guides/clip-studio-pose-import/", '/blog/', '/blog/introducing-standin/', '/blog/standin-clip-studio-guide/', '/blog/bvh-vs-fbx/']);
const sections = ["hero", "input", "process", "result", "features", "guides", "beta", "faq", "footer"];
export const blogSections: Record<string, readonly string[]> = {
  '/blog/': ['blog-list', 'footer'],
  '/blog/introducing-standin/': ['article-intro', 'why', 'workflow', 'example', 'fit', 'limits', 'next', 'article-sources', 'article-related', 'footer'],
  '/blog/standin-clip-studio-guide/': ['article-intro', 'prepare', 'input', 'select', 'save', 'import-fbx', 'import-bvh', 'adjust', 'check', 'article-sources', 'article-related', 'footer'],
  '/blog/bvh-vs-fbx/': ['article-intro', 'basics', 'comparison', 'choose-bvh', 'choose-fbx', 'standin-choice', 'misconceptions', 'next', 'article-sources', 'article-related', 'footer'],
};
/** Fixed source categories only. Never retain referring URLs, queries, or search terms. */
export function journeySource(href: string, referrer = ''): string {
  const url = new URL(href);
  const source = url.searchParams.get('utm_source')?.toLowerCase();
  if (source) return ['instagram', 'google', 'naver', 'daum', 'bing', 'yahoo', 'x', 'youtube', 'facebook'].includes(source) ? source : 'other';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    const domain = (name: string) => host === name || host.endsWith('.' + name);
    if (domain('standinpose.com')) return 'internal';
    if (domain('google.com') || domain('google.co.kr') || domain('google.co.jp')) return 'google';
    if (domain('naver.com')) return 'naver';
    if (domain('daum.net')) return 'daum';
    if (domain('bing.com')) return 'bing';
    if (domain('yahoo.com') || domain('yahoo.co.jp')) return 'yahoo';
    if (domain('instagram.com')) return 'instagram';
    if (domain('facebook.com') || domain('fb.com')) return 'facebook';
    if (domain('x.com') || domain('twitter.com') || domain('t.co')) return 'x';
    if (domain('youtube.com') || domain('youtu.be')) return 'youtube';
    return 'referral';
  } catch { return 'direct'; }
}
export function articleDepth(top: number, bottom: number, viewport: number) {
  return Math.min(100, Math.max(0, Math.floor((viewport - top) / Math.max(1, bottom - top) * 100)));
}
type Event = { id: string; page: string; sequence: number; name: string; at: string; path: string; section: string; target: string; creative: string; source: string; device: string; elapsedMs: number; depth: number };

/** Credit elapsed time only until the idle boundary, never hidden/background intervals. */
export function activeElapsed(previous: number, now: number, lastActivity: number, visible: boolean) {
  return visible ? Math.max(0, Math.min(now, lastActivity + 60_000) - previous) : 0;
}
export function createJourney(win?: Window, endpoint = "https://api.standinpose.com/v1/web-analytics") {
  let allowed = false, token = "", page = "", sequence = 0, generation = 0;
  let queue: Event[] = [], flushing = false, retryAt = 0, timer = 0;
  let section = "page", last = 0, activity = 0, elapsed = 0, depth = 0, sentDepth = 0, ticks = 0;
  let focused = false, handoff: string | null = null, handoffUntil = 0;
  const subscribers = new Set<() => void>();
  let pendingMemory: string[] = [];
  const notify = () => subscribers.forEach(fn => fn());
  const cookie = () => win?.document.cookie.split(";").map(v => v.trim()).find(v => v.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1) ?? "";
  function clearCookie() { if (win) win.document.cookie = COOKIE + "=; Max-Age=0; Path=/; SameSite=Lax; Secure"; }
  async function post(path: string, body: unknown, keepalive = false) {
    if (!win) throw Error("unavailable");
    return win.fetch(endpoint + path, { method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer", signal: AbortSignal.timeout(10_000), headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive });
  }
  function pending(): string[] {
    try { const v = JSON.parse(win?.localStorage.getItem(REVOKE) ?? "[]"); return [...new Set([...pendingMemory, ...(Array.isArray(v) ? v.filter(s => typeof s === "string" && TOKEN.test(s)) : [])])].slice(-4); } catch { return pendingMemory; }
  }
  function savePending(values: string[]) { pendingMemory = values; try { if (values.length) win?.localStorage.setItem(REVOKE, JSON.stringify(values)); else win?.localStorage.removeItem(REVOKE); } catch { /* retry can only last for this document */ } }
  async function erase(value: string) {
    try { if ((await post("/revoke", { token: value }, true)).ok) { savePending(pending().filter(t => t !== value)); return true; } } catch { /* retry on next load */ }
    return false;
  }
  async function retryRevocations() { for (const value of pending()) await erase(value); }
  function emit(name: string, target = "none", milliseconds = 0) {
    if (!allowed || !token || !win) return;
    const url = new URL(win.location.href);
    const creative = url.searchParams.get("utm_content");
    queue.push({ id: win.crypto.randomUUID(), page, sequence: ++sequence, name, at: new Date().toISOString(), path: url.pathname, section, target,
      creative: creative === "meta-poster-a" || creative === "meta-hook-a" ? creative : "other",
      source: journeySource(url.href, win.document.referrer),
      device: win.matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop", elapsedMs: Math.round(milliseconds), depth });
    queue = queue.slice(-120);
  }
  async function flush(keepalive = false) {
    if (!allowed || !token || flushing || !queue.length || Date.now() < retryAt) return;
    const batch = queue.slice(0, 30), current = generation;
    flushing = true;
    try {
      const response = await post("/events", { token, events: batch }, keepalive);
      if (generation !== current) return;
      if (response.ok || response.status === 400 || response.status === 413) {
        const sent = new Set(batch.map(e => e.id)); queue = queue.filter(e => !sent.has(e.id));
      } else if (response.status === 403) { stop(); clearCookie(); }
      else retryAt = Date.now() + 60_000;
    } catch { retryAt = Date.now() + 60_000; } finally { flushing = false; }
  }
  function currentSection() {
    if (!win) return "page";
    let best = "page", area = 0;
    for (const key of blogSections[win.location.pathname] ?? sections) {
      const element = win.document.getElementById(key === "footer" ? "site-footer" : key);
      if (!element) continue;
      const r = element.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.bottom, win.innerHeight) - Math.max(r.top, 0));
      if (visible > area) { area = visible; best = key; }
    }
    return best;
  }
  function engagement() { if (elapsed > 0) { emit("section_engagement", "none", elapsed); elapsed = 0; } }
  function tick() {
    if (!win || !allowed || !token) return;
    const now = win.performance.now();
    elapsed += activeElapsed(last, now, activity, focused && win.document.visibilityState === "visible"); last = now;
    if (!focused || win.document.visibilityState !== 'visible') return;
    const next = currentSection();
    if (next !== section) { engagement(); section = next; emit("section_view"); }
    const height = win.document.documentElement.scrollHeight - win.innerHeight;
    const article = win.document.getElementById('blog-content')?.getBoundingClientRect();
    depth = Math.min(100, Math.max(depth, article ? articleDepth(article.top, article.bottom, win.innerHeight) : height > 0 ? Math.floor(win.scrollY / height * 100) : 100));
    if (Math.floor(depth / 25) > sentDepth) { sentDepth = Math.floor(depth / 25); emit("scroll_depth"); }
    if (++ticks % 10 === 0) { engagement(); void flush(); }
  }
  const onActivity = () => { tick(); if (win) activity = win.performance.now(); };
  const onFocus = () => { tick(); focused = true; onActivity(); void prepareLink(); };
  const onBlur = () => { tick(); focused = false; engagement(); void flush(true); };
  const onVisibility = () => {
    if (!win) return;
    // visibilitychange runs after the state changed; never credit the preceding hidden interval.
    if (win.document.visibilityState === "hidden") { engagement(); emit("page_hidden"); void flush(true); }
    last = win.performance.now(); focused = win.document.hasFocus(); activity = last;
  };
  const onExit = () => { tick(); engagement(); emit("page_exit"); void flush(true); };
  const onClick = (event: globalThis.Event) => {
    if (!win || !(event.target instanceof Element)) return;
    onActivity();
    const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.hasAttribute("data-journey-explicit")) return;
    try {
      const url = new URL(anchor.href, win.location.href);
      if (url.origin !== win.location.origin && url.origin !== new URL(win.location.href).origin) return;
      const target = url.pathname === win.location.pathname && url.hash && blogSections[url.pathname]?.includes(url.hash.slice(1)) ? 'toc'
        : url.hash === "#beta" ? "beta" : url.pathname.startsWith('/blog/') ? 'blog' : url.pathname.startsWith("/guides/") ? "guide" : url.pathname === "/feedback/" ? "feedback" : null;
      if (target) { emit("cta_click", target); void flush(true); }
    } catch { /* ignore non-navigation controls */ }
  };
  function listen(add: boolean) {
    if (!win) return;
    const action = add ? "addEventListener" : "removeEventListener";
    win[action]("scroll", onActivity, { passive: true }); win[action]("pointerdown", onActivity); win[action]("keydown", onActivity);
    win[action]("focus", onFocus); win[action]("blur", onBlur); win[action]("pagehide", onExit); win[action]("click", onClick);
    win.document[action]("visibilitychange", onVisibility);
  }
  function stop() {
    allowed = false; generation++; queue = []; handoff = null; handoffUntil = 0;
    if (timer) win?.clearInterval(timer); timer = 0; listen(false); notify();
  }
  async function prepareLink() {
    if (!allowed || !token || handoffUntil > Date.now() + 60_000) return;
    const current = generation;
    try {
      const r = await post("/handoff", { token }); if (!r.ok) return;
      const value = await r.json();
      if (current !== generation || !allowed || !TOKEN.test(value.token)) return;
      handoff = "standin://journey?token=" + value.token; handoffUntil = Date.now() + 29 * 60_000; notify();
    } catch { /* keep the campaign-only fallback */ }
  }
  async function setAllowed(next: boolean) {
    if (!win || !PATHS.has(win.location.pathname)) return true;
    if (!next) {
      const previous = token || cookie(); stop(); token = ""; clearCookie();
      if (!TOKEN.test(previous)) { await retryRevocations(); return pending().length === 0; }
      savePending([...new Set([...pending(), previous])]); return erase(previous);
    }
    if (allowed) return true;
    allowed = true; const current = ++generation;
    await retryRevocations();
    if (generation !== current || !allowed) return false;
    if (pending().length) { stop(); return false; }
    try {
      token = cookie();
      if (!TOKEN.test(token)) {
        const r = await post("/visitors", { consent: true, version: JOURNEY_VERSION }); if (!r.ok) throw Error("unavailable");
        const value = await r.json(); if (!TOKEN.test(value.token)) throw Error("invalid");
        if (generation !== current || !allowed) { savePending([...pending(), value.token]); await erase(value.token); return false; }
        token = value.token;
        win.document.cookie = COOKIE + "=" + token + "; Max-Age=7776000; Path=/; SameSite=Lax; Secure";
      }
      if (generation !== current || !allowed) return false;
      page = win.crypto.randomUUID(); sequence = 0; section = 'page'; depth = 0; sentDepth = 0; elapsed = 0; ticks = 0;
      last = activity = win.performance.now(); focused = win.document.hasFocus();
      emit("page_view");
      if (focused && win.document.visibilityState === 'visible') { section = currentSection(); emit('section_view'); }
      listen(true); timer = win.setInterval(tick, 1000); void flush(); void prepareLink();
      return true;
    } catch { stop(); return false; }
  }
  return { setAllowed, retryRevocations,
    link: () => handoffUntil > Date.now() ? handoff : null,
    subscribe(fn: () => void) { subscribers.add(fn); return () => { subscribers.delete(fn); }; },
    prepareLink,
    event(name: "download_click" | "pc_link_copy" | "app_open_click", target: string) { tick(); engagement(); emit(name, target); void flush(true); },
  };
}
