import { spawn } from "node:child_process";
import { chromium } from "playwright";
const ROOT = "C:\\Users\\Superman\\Documents\\timegovern_Superman_2026-09-04_1530";
const PORT = 4173;
const BASE = "http://localhost:" + PORT;
async function waitForServer(url, maxMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try { const r = await fetch(url); if (r.ok) return true; } catch {}
    await new Promise(r => setTimeout(r, 400));
  }
  return false;
}
async function main() {
  const server = spawn("npx.cmd", ["vite", "preview", "--port", String(PORT)], { stdio: "pipe", shell: true, cwd: ROOT });
  if (!(await waitForServer(BASE))) { server.kill(); throw new Error("no server"); }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => pageErrors.push(e.message + '\n' + (e.stack || '').slice(0, 500)));
  for (const path of ['/significant-figures-calculator', '/percent-error-calculator']) {
    consoleErrors.length = 0;
    pageErrors.length = 0;
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    console.log('\n=== ' + path + ' ===');
    console.log('pageerrors:', pageErrors.length);
    for (const e of pageErrors) console.log('  ' + e);
    console.log('consoleErrors:', consoleErrors.length);
    for (const e of consoleErrors.slice(0, 5)) console.log('  ' + e.slice(0, 300));
    // check what's actually on page
    const body = await page.locator('body').innerText();
    console.log('body length:', body.length);
    // search for the label
    const hasPercentLabel = /Percent error/i.test(body);
    const hasSigLabel = /Significant figures/i.test(body);
    console.log('has "Percent error":', hasPercentLabel);
    console.log('has "Significant figures":', hasSigLabel);
    // count input fields
    const inputCount = await page.locator('input').count();
    console.log('input count:', inputCount);
    // first 1000 chars of body
    console.log('body first 1000:', body.slice(0, 1000).replace(/\n/g, ' | '));
  }
  await browser.close();
  server.kill();
}
main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
