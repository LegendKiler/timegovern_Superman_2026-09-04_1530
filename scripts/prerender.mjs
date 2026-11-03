#!/usr/bin/env node
// scripts/prerender.mjs  (A2a — static routes + blog)
// Static-renders SPA routes from sitemap-{blog,core,calculators,country-codes}.xml
// to real HTML files in dist/ via Playwright.
//
//   node scripts/prerender.mjs --slug privacy                 # single static route
//   node scripts/prerender.mjs --slug blog/what-is-sleep-debt # single blog route
//   node scripts/prerender.mjs --all                          # everything in scope
//   node scripts/prerender.mjs --all --force --workers 6      # re-render all, 6 workers
//
// Precondition: dist/ must be current (npm run build).

import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const ROOT = process.cwd()
const DIST = resolve(ROOT, 'dist')
const INDEX_HTML = resolve(DIST, 'index.html')
const BASE = 'https://timegovern.com'

const opt = {
  slug: null, all: false, force: false,
  port: 4173, settleMs: 800, navTimeoutMs: 15000, h1TimeoutMs: 5000,
  minBodyChars: 100, workers: 4,
}
const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if      (a === '--all')     opt.all = true
  else if (a === '--force')   opt.force = true
  else if (a === '--slug')    opt.slug = args[++i]
  else if (a === '--port')    opt.port = parseInt(args[++i], 10)
  else if (a === '--workers') opt.workers = Math.max(1, Math.min(16, parseInt(args[++i], 10)))
  else { console.error(`Unknown arg: ${a}`); process.exit(2) }
}
if (!opt.all && !opt.slug) {
  console.error('Usage: node scripts/prerender.mjs --slug <path> | --all [--force] [--port N] [--workers N]')
  process.exit(2)
}

if (!existsSync(INDEX_HTML)) { console.error(`MISSING ${INDEX_HTML} — run npm run build first`); process.exit(1) }
const shell = readFileSync(INDEX_HTML, 'utf8')
if (!/id="root"/.test(shell)) { console.error('dist/index.html has no <div id="root"> — aborting'); process.exit(1) }

const viteBin = resolve(ROOT, 'node_modules/vite/bin/vite.js')
if (!existsSync(viteBin)) { console.error('MISSING ' + viteBin); process.exit(1) }

// A2a sources — all contain static (non-parameterized) routes
const SITEMAP_SOURCES = [
  'sitemap-blog.xml',
  'sitemap-core.xml',
  'sitemap-calculators.xml',
  'sitemap-country-codes.xml',
]

const SKIP_EXACT = new Set(['/', '/api'])
const SKIP_PREFIXES = ['/embed', '/auth', '/reset', '/my-', '/compare-', '/settings']

function shouldSkip(p) {
  if (SKIP_EXACT.has(p)) return true
  if (p.includes('?') || p.includes('#')) return true
  for (const x of SKIP_PREFIXES) if (p.startsWith(x)) return true
  return false
}

function outPathFor(routePath) {
  const rel = routePath.replace(/^\/+/, '').replace(/\/+$/, '')
  if (!rel) return null
  return resolve(DIST, rel, 'index.html')
}

function loadRoutes() {
  if (opt.slug) {
    let s = opt.slug.replace(/^\/+|\/+$/g, '')
    if (s.startsWith('blog/') || s.includes('/')) return [{ path: '/' + s }]
    const coreXml = resolve(DIST, 'sitemap-core.xml')
    const calcXml = resolve(DIST, 'sitemap-calculators.xml')
    let isTopLevel = false
    for (const p of [coreXml, calcXml]) {
      if (existsSync(p) && readFileSync(p, 'utf8').includes(`<loc>${BASE}/${s}</loc>`)) { isTopLevel = true; break }
    }
    return [{ path: isTopLevel ? '/' + s : '/blog/' + s }]
  }
  const seen = new Set()
  const out = []
  for (const src of SITEMAP_SOURCES) {
    const p = resolve(DIST, src)
    if (!existsSync(p)) { console.warn(`[skip missing] ${src}`); continue }
    const xml = readFileSync(p, 'utf8')
    let added = 0, skipped = 0
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      let u = m[1].replace(BASE, '')
      if (!u.startsWith('/')) u = '/' + u
      if (shouldSkip(u)) { skipped++; continue }
      if (seen.has(u))   { skipped++; continue }
      seen.add(u); out.push({ path: u }); added++
    }
    console.log(`  ${src}: +${added} (skipped ${skipped})`)
  }
  return out
}

const routes = loadRoutes()
const todo = routes.filter(r => opt.force || !existsSync(outPathFor(r.path)))
console.log(`Routes: ${routes.length}   To render: ${todo.length}   Skipping (exists): ${routes.length - todo.length}   Workers: ${opt.workers}`)
if (todo.length === 0) { console.log('RESULT: nothing to do.'); process.exit(0) }

console.log(`Starting vite preview on port ${opt.port}…`)
let killing = false
const preview = spawn(process.execPath, [viteBin, 'preview', '--port', String(opt.port), '--strictPort'],
  { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })

let previewBuf = ''
preview.stdout.on('data', d => { previewBuf += d.toString() })
preview.stderr.on('data', d => { previewBuf += d.toString() })
preview.on('exit', code => {
  if (!killing && code !== 0) console.error(`[preview] exited early code=${code}\n${previewBuf.slice(0, 1500)}`)
})

function killPreview() {
  killing = true
  if (!preview.killed) {
    try { preview.kill('SIGTERM') } catch {}
    setTimeout(() => { try { preview.kill('SIGKILL') } catch {} }, 2000)
  }
}
process.on('SIGINT',  () => { killPreview(); process.exit(130) })
process.on('SIGTERM', () => { killPreview(); process.exit(143) })

async function waitForPreview(timeoutMs = 20000) {
  const start = Date.now()
  const url = `http://localhost:${opt.port}/`
  while (Date.now() - start < timeoutMs) {
    try { const r = await fetch(url, { method: 'HEAD' }); if (r.ok || r.status === 404) return true } catch {}
    await new Promise(r => setTimeout(r, 300))
  }
  return false
}

;(async () => {
  let browser = null
  try {
    if (!await waitForPreview()) {
      console.error('Preview failed to start in 20s.\n' + previewBuf.slice(0, 2000))
      killPreview(); process.exit(1)
    }
    console.log('Preview ready.')

    browser = await chromium.launch({ headless: true })
    const queue = [...todo]
    const total = todo.length
    let ok = 0, fail = 0, skip = 0, done = 0
    const failures = []
    const startedAt = Date.now()

    function line(wid, tag, path, extra) {
      const n = String(done + 1).padStart(4)
      console.log(`[w${wid} ${n}/${total}] ${path.padEnd(52)} ${tag} ${extra}`)
    }

    async function worker(ctx, wid) {
      while (true) {
        const item = queue.shift()
        if (!item) return
        const routePath = item.path
        const outFile = outPathFor(routePath)

        if (!opt.force && existsSync(outFile)) { done++; skip++; line(wid, 'SKIP', routePath, ''); continue }
        if (opt.force && existsSync(outFile)) { try { unlinkSync(outFile) } catch {} }

        const page = await ctx.newPage()
        const t0 = Date.now()
        let html = null, bodyText = '', h1Count = 0, err = null
        try {
          await page.goto(`http://localhost:${opt.port}${routePath}`, { waitUntil: 'domcontentloaded', timeout: opt.navTimeoutMs })
          try { await page.waitForSelector('h1', { timeout: opt.h1TimeoutMs }) } catch {}
          await page.waitForTimeout(opt.settleMs)
          bodyText = await page.evaluate(() => document.body.innerText || '')
          h1Count  = await page.evaluate(() => document.querySelectorAll('h1').length)
          html     = await page.content()
        } catch (e) {
          err = e.message
        } finally {
          try { await page.close() } catch {}
        }
        done++
        const dur = Date.now() - t0
        const chars = bodyText.length

        if (err)                         { line(wid, 'FAIL', routePath, `${dur}ms — ${err.split('\n')[0].slice(0,70)}`); failures.push({path: routePath, reason: err}); fail++; continue }
        if (chars < opt.minBodyChars)    { line(wid, 'FAIL', routePath, `${dur}ms blank ${chars}c`);                       failures.push({path: routePath, reason: `blank ${chars}`}); fail++; continue }
        if (!html || html.length < 2000) { line(wid, 'FAIL', routePath, `${dur}ms short ${html?.length||0}B`);             failures.push({path: routePath, reason: 'short'}); fail++; continue }

        mkdirSync(dirname(outFile), { recursive: true })
        writeFileSync(outFile, html, 'utf8')
        line(wid, 'OK  ', routePath, `${dur}ms ${chars}c ${html.length}B h1=${h1Count}${h1Count===0?' [WARN]':''}`)
        ok++
      }
    }

    const contexts = await Promise.all(
      Array.from({ length: opt.workers }, () => browser.newContext({ viewport: { width: 1280, height: 900 } }))
    )
    await Promise.all(contexts.map((c, i) => worker(c, i + 1)))

    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
    console.log(`\nRESULT: ok=${ok} skip=${skip} fail=${fail} total=${total}  elapsed=${elapsed}s`)
    if (failures.length) {
      console.log('Failures:')
      for (const f of failures) console.log(`  - ${f.path}: ${f.reason}`)
    }
    await browser.close(); browser = null
    killPreview()
    process.exit(fail > 0 ? 1 : 0)
  } catch (e) {
    console.error('FATAL:', e.message)
    try { if (browser) await browser.close() } catch {}
    killPreview()
    process.exit(1)
  }
})()