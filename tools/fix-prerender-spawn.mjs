#!/usr/bin/env node
// tools/fix-prerender-spawn.mjs
// Replaces npx.cmd spawn (EINVAL on Windows Node 20.12+ / CVE-2024-27980)
// with direct node + local vite.js entry point. Cross-platform, idempotent.

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT   = process.cwd()
const SCRIPT = resolve(ROOT, 'scripts/prerender.mjs')

if (!existsSync(SCRIPT)) { console.error(`MISSING ${SCRIPT}`); process.exit(1) }

const viteBin = resolve(ROOT, 'node_modules/vite/bin/vite.js')
if (!existsSync(viteBin)) {
  console.error(`MISSING ${viteBin} — is vite installed?`)
  process.exit(1)
}

const src = readFileSync(SCRIPT, 'utf8')
if (src.includes("node_modules/vite/bin/vite.js")) {
  console.log('RESULT: already patched. No-op.')
  process.exit(0)
}

const ANCHOR_A = "const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'"
const countA = src.split(ANCHOR_A).length - 1
if (countA !== 1) { console.error(`ANCHOR FAIL A: found ${countA} matches for npxCmd line`); process.exit(1) }

const ANCHOR_B = "const preview = spawn(npxCmd, ['vite', 'preview', '--port', String(opt.port), '--strictPort'],"
const countB = src.split(ANCHOR_B).length - 1
if (countB !== 1) { console.error(`ANCHOR FAIL B: found ${countB} matches for spawn line`); process.exit(1) }

const eol = src.includes('\r\n') ? '\r\n' : '\n'

const replacementA = [
  "const viteBin = resolve(ROOT, 'node_modules/vite/bin/vite.js')",
  "if (!existsSync(viteBin)) { console.error('MISSING ' + viteBin); process.exit(1) }",
].join(eol)

const replacementB = "const preview = spawn(process.execPath, [viteBin, 'preview', '--port', String(opt.port), '--strictPort'],"

let next = src.replace(ANCHOR_A, replacementA).replace(ANCHOR_B, replacementB)

if (!next.includes("node_modules/vite/bin/vite.js"))   { console.error('VERIFY FAIL: viteBin not inserted');  process.exit(1) }
if (!next.includes("spawn(process.execPath, [viteBin,")) { console.error('VERIFY FAIL: spawn not replaced'); process.exit(1) }
if (next.includes('npxCmd'))                            { console.error('VERIFY FAIL: npxCmd still referenced'); process.exit(1) }

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const bak = `${SCRIPT}.before-spawn-fix-${stamp}.bak`
copyFileSync(SCRIPT, bak)

writeFileSync(SCRIPT, next, 'utf8')

console.log(`Backup: ${bak}`)
console.log('RESULT: replaced npx.cmd spawn with process.execPath + vite.js (cross-platform).')
console.log('RESULT: added viteBin existence pre-check.')