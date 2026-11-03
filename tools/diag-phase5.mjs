import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const read = p => fs.readFileSync(p, 'utf8');
const L = t => t.split(/\r?\n/);
const dump = p => {
  const lines = L(read(p));
  console.log('\n=== ' + rel(p) + ' (' + lines.length + ' lines, full) ===');
  lines.forEach((l, i) => console.log(String(i+1).padStart(4) + '| ' + l));
};
const grep = p => {
  const lines = L(read(p));
  console.log('\n=== ' + rel(p) + ' (' + lines.length + ' lines, render path) ===');
  const rx = /useState|useEffect|setResult|setError|result|Result|NaN|undefined|toFixed|parseFloat|isNaN|Math\.(log|sqrt|pow|exp|abs)|<h1|<h2|<form|onSubmit|onClick|onChange|value=|disabled=/;
  lines.forEach((l, i) => { if (rx.test(l)) console.log(String(i+1).padStart(4) + '| ' + l); });
};

dump(path.join(SRC, 'pages', 'legal', 'PrivacyPolicy.jsx'));
dump(path.join(SRC, 'pages', 'EmbedPage.jsx'));

for (const name of ['SlopeCalculatorPage','LogarithmCalculatorPage','PercentErrorCalculatorPage','ExponentRootCalculatorPage']) {
  const p = path.join(SRC, 'pages', name + '.jsx');
  if (fs.existsSync(p)) grep(p); else console.log('\n(missing: ' + name + '.jsx)');
}

console.log('\nRESULT: DIAG_PHASE5 complete.');
