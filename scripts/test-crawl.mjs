// scripts/test-crawl.mjs — full-site crawler, one load per URL, 9 checks.
// Source of truth: union of all sitemap <loc> and App.jsx declared routes.
// Edge cases on dynamic params: valid / garbage / UPPER / empty.
// Full report -> backups/crawl-<stamp>.{json,txt}. Console = 5-line summary only.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = "C:\\Users\\Superman\\Documents\\timegovern_Superman_2026-09-04_1530";
const PORT = 4175;
const BASE = "http://localhost:" + PORT;
const POOL = 4;

// ---- sitemap + routes -> URL list ----
function readSitemapLocs(dir) {
  const idxP = join(dir, "sitemap-index.xml");
  const urls = [];
  if (!existsSync(idxP)) return urls;
  const idx = readFileSync(idxP, "utf8");
  const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  for (const c of children) {
    const p = join(dir, c.replace(/^https?:\/\/[^/]+\//, ""));
    if (!existsSync(p)) continue;
    const xml = readFileSync(p, "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.push(m[1].trim().replace(/^https?:\/\/[^/]+/, "").split("?")[0].split("#")[0] || "/");
    }
  }
  return [...new Set(urls)];
}
function discoverRoutes() {
  const src = readFileSync(join(ROOT, "src/App.jsx"), "utf8");
  const out = [];
  for (const m of src.matchAll(/<Route\s+path=["']([^"']+)["']/g)) {
    const p = m[1];
    if (p === "*" || p.includes("*")) continue;
    out.push(p);
  }
  return [...new Set(out)];
}
function routeToRegex(p) {
  const esc = p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/:[a-zA-Z][a-zA-Z0-9]*/g, "[^/]+");
  return new RegExp("^" + esc + "/?$");
}
const SAMPLE_VAL = {
  ":code": "us", ":iso2": "us", ":iso3": "usa", ":slug": "europe", ":year": "2024",
  ":metric": "gdp", ":pair": "us-vs-cn", ":country": "us", ":city": "new-york",
  ":month": "january", ":day": "1", ":a": "us", ":b": "cn", ":aCode": "us",
  ":bCode": "cn", ":date": "2026-01-01", ":from": "us", ":to": "cn", ":id": "1",
  ":index": "0", ":path": "", ":type": "clock", ":c2": "us", ":city2": "london",
};
function edgeCasesFor(route) {
  const params = [...route.matchAll(/:([a-zA-Z][a-zA-Z0-9]*)/g)].map(m => m[0]);
  if (params.length === 0) return [];
  const variants = [
    { tag: "valid", val: (k) => SAMPLE_VAL[k] || "x" },
    { tag: "garbage", val: () => "zz" },
    { tag: "upper", val: (k) => (SAMPLE_VAL[k] || "x").toUpperCase() },
    { tag: "empty", val: () => "" },
  ];
  return variants.map(v => {
    let u = route;
    for (const p of params) u = u.split(p).join(v.val(p));
    return { tag: v.tag, url: u.replace(/\/+/g, "/") || "/" };
  });
}

async function waitForServer(url, ms = 30000) {
  const t = Date.now();
  while (Date.now() - t < ms) {
    try { if ((await fetch(url)).ok) return true; } catch {}
    await new Promise(r => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  const routes = discoverRoutes();
  const sitemapUrls = readSitemapLocs(join(ROOT, "public"));
  const union = [...new Set([...sitemapUrls, ...routes.filter(r => !r.includes(":")).map(r => r || "/")])];
  // dynamic routes -> valid-substituted URL + edge cases
  const dynValid = routes.filter(r => r.includes(":"))
    .map(r => { let u = r; for (const p of r.matchAll(/:([a-zA-Z][a-zA-Z0-9]*)/g)) u = u.split(p[0]).join(SAMPLE_VAL[p[0]] || "x"); return u; });
  const edgeUrls = [];
  for (const r of routes.filter(r => r.includes(":"))) for (const e of edgeCasesFor(r)) edgeUrls.push(e.url);
  const regexes = routes.map(r => ({ r, re: routeToRegex(r) }));
const rawUrls = [...new Set([...union, ...dynValid, ...edgeUrls])].filter(u => u && u !== "/x");
// Shape-sample: group by route pattern, cap each shape at PER_SHAPE (first/middle/last).
const PER_SHAPE = 3;
function shapeOf(u) {
  for (const r of regexes) if (r.re.test(u.split("?")[0].split("#")[0] || "/")) return r.r;
  return u.split("/").slice(0, 2).join("/") || "/";
}
const buckets = new Map();
for (const u of rawUrls) { const s = shapeOf(u); if (!buckets.has(s)) buckets.set(s, []); buckets.get(s).push(u); }
const sampled = [];
for (const [, list] of buckets) {
  if (list.length <= PER_SHAPE) { sampled.push(...list); continue; }
  sampled.push(list[0], list[Math.floor(list.length/2)], list[list.length-1]);
}
const allUrls = [...new Set(sampled)];
console.log("shapes " + buckets.size + "  sampled " + allUrls.length + " of " + rawUrls.length + " raw URLs (cap " + PER_SHAPE + "/shape)");

  console.log("discovered " + allUrls.length + " URLs (sitemap " + sitemapUrls.length + ", app routes " + routes.length + ", edges " + edgeUrls.length + ")");

  const server = spawn("npx.cmd", ["vite", "preview", "--port", String(PORT)], { stdio: "pipe", shell: true, cwd: ROOT });
  if (!(await waitForServer(BASE))) { server.kill(); throw new Error("server did not start"); }

  const browser = await chromium.launch({ headless: true });
  const findings = [];
  let pass = 0, warn = 0, fail = 0;
  const failCats = { status: [], console: [], pageerror: [], netfail: [], blank: [], h1: [], title: [], canonical: [], nan: [], link: [], jsonld: [] };
    const isDeclared = (p) => regexes.some(x => x.re.test((p || "/").split("?")[0].split("#")[0] || "/"));

  async function visit(page, url) {
    const errs = { console: [], pageerror: [], netfail: [] };
    const onConsole = m => { if (m.type() === "error") errs.console.push(m.text().slice(0, 200)); };
    const onPageErr = e => errs.pageerror.push((e.message || String(e)).slice(0, 200));
    const onResp = r => { const s = r.status(); if (s >= 400 && r.url().startsWith(BASE)) errs.netfail.push(s + " " + r.url().slice(BASE.length).slice(0, 120)); };
    page.on("console", onConsole); page.on("pageerror", onPageErr); page.on("response", onResp);
    let status = 0, body = "", h1s = [], title = "", canon = "", badLd = 0, links = [];
    try {
      const resp = await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 20000 });
      status = resp ? resp.status() : 0;
      await page.waitForTimeout(1200);
      const meta = await page.evaluate(() => {
        const t = document.title || "";
        const h1 = Array.from(document.querySelectorAll("h1")).map(e => e.textContent.trim()).filter(Boolean);
        const c = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
        const body = document.body ? document.body.innerText : "";
        let badLd = 0;
        for (const s of document.querySelectorAll('script[type="application/ld+json"]')) { try { JSON.parse(s.textContent); } catch { badLd++; } }
        const as = Array.from(document.querySelectorAll("a[href]")).map(a => a.getAttribute("href") || "");
        return { t, h1, c, body, badLd, as };
      });
      title = meta.t; h1s = meta.h1; canon = meta.c; body = meta.body; badLd = meta.badLd; links = meta.as;
    } catch (e) { errs.pageerror.push("goto: " + (e.message || "").slice(0, 120)); }
    page.off("console", onConsole); page.off("pageerror", onPageErr); page.off("response", onResp);

    const issues = [];
    if (status >= 400) issues.push({ cat: "status", msg: status + " " + url });
    for (const e of errs.console) issues.push({ cat: "console", msg: url + " :: " + e });
    for (const e of errs.pageerror) issues.push({ cat: "pageerror", msg: url + " :: " + e });
    for (const e of errs.netfail) issues.push({ cat: "netfail", msg: url + " :: " + e });
    if (body.length < 60) issues.push({ cat: "blank", msg: url + " bodyLen " + body.length });
    if (h1s.length === 0) issues.push({ cat: "h1", msg: url });
    if (!title) issues.push({ cat: "title", msg: url });
    if (!canon) issues.push({ cat: "canonical", msg: url });
    const nanMatch = body.match(/\b(NaN|undefined|Infinity)\b/);
    if (nanMatch) issues.push({ cat: "nan", msg: url + " contains " + nanMatch[1] });
    if (badLd > 0) issues.push({ cat: "jsonld", msg: url + " bad=" + badLd });
    for (const h of links) {
      const x = (h || "").trim();
      if (!x || x === "#" || x.startsWith("javascript:") || x.startsWith("mailto:") || x.startsWith("tel:") || /^https?:\/\//i.test(x)) continue;
      if (x.startsWith("/") && !isDeclared(x)) issues.push({ cat: "link", msg: url + " -> " + x });
    }
    return issues;
  }

  // parallel pool
  let i = 0;
  const contexts = await Promise.all(Array.from({ length: POOL }, () => browser.newContext()));
  const pages = await Promise.all(contexts.map(c => c.newPage()));
  await Promise.all(pages.map(async (page) => {
    while (true) {
      const idx = i++;
      if (idx >= allUrls.length) return;
      const issues = await visit(page, allUrls[idx]);
      if (issues.length === 0) { pass++; continue; }
      const hasFail = issues.some(x => ["status", "console", "pageerror", "netfail", "blank", "h1", "title"].includes(x.cat));
      if (hasFail) fail++; else warn++;
      for (const x of issues) { findings.push({ url: allUrls[idx], ...x }); failCats[x.cat].push(x.msg); }
    }
  }));
  for (const c of contexts) await c.close();
  await browser.close();
  server.kill();

  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
  mkdirSync(join(ROOT, "backups"), { recursive: true });
  const jp = join(ROOT, "backups", "crawl-" + stamp + ".json");
  const tp = join(ROOT, "backups", "crawl-" + stamp + ".txt");
  writeFileSync(jp, JSON.stringify({ stamp, total: allUrls.length, pass, warn, fail, findings }, null, 2), "utf8");
  writeFileSync(tp, ["Crawl " + stamp, "total " + allUrls.length + " pass " + pass + " warn " + warn + " fail " + fail, ...findings.map(f => "[" + f.cat + "] " + f.msg)].join("\n"), "utf8");

  const cats = Object.entries(failCats).filter(([, v]) => v.length).map(([k, v]) => k + "(" + v.length + ")").join(" ");
  console.log("PASS " + pass + "  WARN " + warn + "  FAIL " + fail);
  console.log("FAIL cats: " + (cats || "none"));
  console.log("Report: " + jp);
}
main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
