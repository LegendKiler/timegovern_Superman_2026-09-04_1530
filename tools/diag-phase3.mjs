import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SRC  = path.join(ROOT, 'src');
const rel  = p => path.relative(ROOT, p).replace(/\\/g, '/');
const read = p => fs.readFileSync(p, 'utf8');
const L    = t => t.split(/\r?\n/);
const dump = (p, from = 1, to = null) => {
  const lines = L(read(p));
  const end = to == null ? lines.length : Math.min(to, lines.length);
  console.log('\n--- ' + rel(p) + ' [' + from + '-' + end + ' of ' + lines.length + '] ---');
  for (let i = from - 1; i < end; i++) console.log(String(i + 1).padStart(5) + '| ' + lines[i]);
};
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}

console.log('=== App.jsx: calculator name references ===');
L(read(path.join(SRC, 'App.jsx'))).forEach((l, i) => {
  if (/Slope|Logarithm|PercentError|ExponentRoot/i.test(l)) console.log(String(i + 1).padStart(5) + '| ' + l);
});

console.log('\n=== App.jsx: embed route definitions ===');
L(read(path.join(SRC, 'App.jsx'))).forEach((l, i) => {
  if (/embed/i.test(l)) console.log(String(i + 1).padStart(5) + '| ' + l);
});

console.log('\n=== useGeo.js (full) ===');
dump(path.join(SRC, 'hooks', 'useGeo.js'));

console.log('\n=== functions/api/country.js (full) ===');
dump(path.join(ROOT, 'functions', 'api', 'country.js'));

console.log('\n=== SiteMap.jsx: split/join/replace/animate hints ===');
L(read(path.join(SRC, 'pages', 'SiteMap.jsx'))).forEach((l, i) => {
  if (/\.split\(|\.join\(|\.replace\(|charAt|fromCharCode|stagger|SplitText|letter/i.test(l))
    console.log(String(i + 1).padStart(5) + '| ' + l.slice(0, 200));
});

console.log('\n=== SiteMap.jsx: lines 1-40 ===');
dump(path.join(SRC, 'pages', 'SiteMap.jsx'), 1, 40);

console.log('\n=== SiteMap.jsx: lines 5540-5590 ===');
dump(path.join(SRC, 'pages', 'SiteMap.jsx'), 5540, 5590);

console.log('\n=== legal/privacy/terms page candidates (h1 check) ===');
for (const p of walk(path.join(SRC, 'pages'))) {
  if (/legal|privacy|terms|cookie|disclaimer/i.test(path.basename(p)) && /\.jsx$/i.test(p)) {
    console.log('  ' + rel(p) + '  hasH1=' + /<h1\b/i.test(read(p)));
  }
}

console.log('\nRESULT: DIAG_PHASE3 complete.');
