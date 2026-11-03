import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const read = p => fs.readFileSync(p, 'utf8');
const L = t => t.split(/\r?\n/);
const dump = (p, from = 1, to = null) => {
  const lines = L(read(p));
  const end = to == null ? lines.length : Math.min(to, lines.length);
  console.log(`\n--- ${rel(p)} [${from}-${end} of ${lines.length}] ---`);
  for (let i = from - 1; i < end; i++) console.log(String(i+1).padStart(4) + '| ' + lines[i]);
};

// 1. SITEMAP: full scan for mangled entries, and clean-dedup check
console.log('=== SITEMAP MANGLED ENTRIES ===');
const sm = L(read(path.join(SRC, 'pages', 'SiteMap.jsx')));
const entryRx = /^\s*\{\s*to:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*\}/;
const mangled = [];
const cleanSet = new Set();
sm.forEach((line, i) => {
  const m = line.match(entryRx);
  if (!m) return;
  const [, to, label] = m;
  const lw = label.split(/\s+/);
  const shortL = lw.filter(w => w.length <= 2).length;
  const labelSuspect = lw.length > 3 && shortL / lw.length > 0.5;
  const segs = to.split(/[\/\-]/).filter(Boolean);
  const veryShort = segs.filter(s => s.length <= 1).length;
  const slugSuspect = segs.length > 3 && veryShort / segs.length > 0.2;
  if (labelSuspect || slugSuspect) {
    mangled.push({ line: i + 1, to, label });
  } else {
    cleanSet.add(to.replace(/-/g, '').toLowerCase());
  }
});
console.log(`Total mangled: ${mangled.length}`);
mangled.forEach(m => {
  const clean = m.to.replace(/-/g, '').toLowerCase();
  console.log(`  L${m.line}: ${m.to}  |  "${m.label}"  |  clean-also-exists=${cleanSet.has(clean)}`);
});

// 2. LEGAL TEMPLATE (one file, whole)
dump(path.join(SRC, 'pages', 'legal', 'PrivacyPolicy.jsx'));

// 3. EMBEDPAGE (whole)
dump(path.join(SRC, 'pages', 'EmbedPage.jsx'));

// 4. Calculators — whole files
for (const name of ['SlopeCalculatorPage','LogarithmCalculatorPage','PercentErrorCalculatorPage','ExponentRootCalculatorPage']) {
  dump(path.join(SRC, 'pages', name + '.jsx'));
}

console.log('\nRESULT: DIAG_PHASE4 complete.');
