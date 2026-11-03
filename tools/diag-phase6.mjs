import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const read = p => fs.readFileSync(p, 'utf8');
const L = t => t.split(/\r?\n/);
const dumpFull = p => {
  const lines = L(read(p));
  console.log('\n=== ' + rel(p) + ' (' + lines.length + ' lines, full) ===');
  lines.forEach((l, i) => console.log(String(i+1).padStart(4) + '| ' + l));
};
const resolveSpec = (spec, fromFile) => {
  let full = spec.startsWith('@/') ? path.join(SRC, spec.slice(2)) : path.resolve(path.dirname(fromFile), spec);
  for (const ext of ['', '.jsx', '.tsx', '.js', '.ts', '/index.jsx', '/index.tsx']) {
    if (fs.existsSync(full + ext) && fs.statSync(full + ext).isFile()) return full + ext;
  }
  return null;
};

const SKIP = /^(react|react-dom|react-router-dom|@\/components\/ui|@\/lib|@\/utils|@\/hooks)/;

for (const name of ['SlopeCalculatorPage','LogarithmCalculatorPage','PercentErrorCalculatorPage','ExponentRootCalculatorPage']) {
  const p = path.join(SRC, 'pages', name + '.jsx');
  console.log('\n\n########## ' + name + ' ##########');
  dumpFull(p);
  for (const line of L(read(p))) {
    const m = line.match(/^import\s+([A-Za-z_$][\w$]*)(?:\s*,\s*\{[^}]*\})?\s+from\s+['"]([^'"]+)['"]/);
    if (!m) continue;
    const [, comp, spec] = m;
    if (SKIP.test(spec) || spec === 'react') continue;
    const full = resolveSpec(spec, p);
    if (!full) { console.log('>>> UNRESOLVED: ' + comp + ' <- ' + spec); continue; }
    console.log('\n>>> ' + comp + '  <-  ' + spec + '  ->  ' + rel(full));
    const cLines = L(read(full));
    console.log('    (' + cLines.length + ' lines)');
    const rx = /useState|setResult|setValue|result|Result|Math\.|toFixed|parseFloat|parseInt|isNaN|Number\(|undefined|NaN|\.value\b|null/;
    cLines.forEach((l, i) => { if (rx.test(l)) console.log('    ' + String(i+1).padStart(4) + '| ' + l); });
  }
}

console.log('\n\n########## LEGAL FILE TITLES ##########');
const legalDir = path.join(SRC, 'pages', 'legal');
for (const f of fs.readdirSync(legalDir).sort()) {
  if (!f.endsWith('.jsx')) continue;
  const lines = L(read(path.join(legalDir, f)));
  console.log('\n' + f + ':');
  let found = false;
  lines.forEach((l, i) => {
    if (/<CardTitle|<h1|>\s*[A-Z][^<]{3,80}\s*<\/CardTitle>/i.test(l)) {
      console.log('  ' + String(i+1).padStart(4) + '| ' + l.trim().slice(0, 200));
      found = true;
    }
  });
  if (!found) console.log('  (no CardTitle / h1 line matched ? needs manual inspect)');
}

console.log('\nRESULT: DIAG_PHASE6 complete.');
