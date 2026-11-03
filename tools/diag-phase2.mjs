// tools/diag-phase2.mjs — READ ONLY.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC  = path.join(ROOT, 'src');
const rel  = p => path.relative(ROOT, p).replace(/\\/g, '/');
const read = p => fs.readFileSync(p, 'utf8');
const lines = t => t.split(/\r?\n/);
const dump = (p, max = 400) => {
  const L = lines(read(p));
  console.log('\n--- ' + rel(p) + ' (' + L.length + ' lines) ---');
  L.slice(0, max).forEach((l, i) => console.log(String(i + 1).padStart(4) + '| ' + l));
  if (L.length > max) console.log('... ' + (L.length - max) + ' more lines (say "tail" if you need them)');
};
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && !e.name.startsWith('.')) walk(p, acc); }
    else acc.push(p);
  }
  return acc;
}

const appPath = path.join(SRC, 'App.jsx');
const app = read(appPath);
console.log('=== CALCULATOR PAGE SOURCES ===');
for (const name of ['SlopeCalculatorPage', 'LogarithmCalculatorPage', 'PercentErrorCalculatorPage', 'ExponentRootCalculatorPage']) {
  const m = app.match(new RegExp('import\\s+' + name + "\\s+from\\s+['\"]([^'\"]+)['\"]"));
  if (!m) { console.log('\n(import not found for ' + name + ')'); continue; }
  const spec = m[1];
  let full = spec.startsWith('@/') ? path.join(SRC, spec.slice(2))
           : path.resolve(path.dirname(appPath), spec);
  if (!fs.existsSync(full) && fs.existsSync(full + '.jsx')) full += '.jsx';
  console.log('\n=== ' + name + '  <-  ' + spec + '  ->  ' + rel(full) + ' ===');
  if (fs.existsSync(full)) dump(full); else console.log('(file missing at resolved path)');
}

dump(path.join(SRC, 'lib', 'seo.js'));
dump(path.join(ROOT, 'vite.config.js'));

for (const d of ['functions', 'api', 'netlify/functions']) {
  const p = path.join(ROOT, d);
  if (fs.existsSync(p)) { console.log('\n=== ' + d + '/ ==='); for (const f of walk(p)) console.log('  ' + rel(f)); }
}

const srcFiles = walk(SRC).filter(f => /\.(jsx|js|mjs)$/.test(f));
const grep = (rx, label) => {
  console.log('\n=== ' + label + ' ==='); let n = 0;
  for (const f of srcFiles) lines(read(f)).forEach((l, i) => {
    if (rx.test(l)) { console.log(rel(f) + ':' + (i + 1) + ': ' + l.trim().slice(0, 200)); n++; }
  });
  if (!n) console.log('(none in src/)');
};
grep(/\/api\/geo/, '/api/geo call sites');
grep(/embed\/clock|EmbedClock/i, 'embed clock references');

const smPath = path.join(SRC, 'pages', 'SiteMap.jsx');
if (fs.existsSync(smPath)) {
  console.log('\n=== SiteMap.jsx (href/slug/to=/map lines) ===');
  lines(read(smPath)).forEach((l, i) => {
    if (/href|slug|to=|\.map\(|replace|split|join/.test(l)) console.log(String(i + 1).padStart(4) + '| ' + l.trim().slice(0, 200));
  });
}

const ref = path.join(SRC, 'pages', 'mortgage', 'HomeLoanRepaymentPage.jsx');
if (fs.existsSync(ref)) {
  console.log('\n=== reference: HomeLoanRepaymentPage.jsx (setPageMeta context) ===');
  const L = lines(read(ref));
  L.forEach((l, i) => {
    if (/setPageMeta|useEffect/.test(l)) {
      for (let k = Math.max(0, i - 2); k <= Math.min(L.length - 1, i + 6); k++) {
        console.log(String(k + 1).padStart(4) + '| ' + L[k]);
      }
      console.log('   ---');
    }
  });
}

console.log('\nRESULT: DIAG_PHASE2 complete — paste everything back.');
