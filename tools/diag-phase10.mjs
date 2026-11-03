import fs from 'node:fs';
import path from 'node:path';
const SRC = path.join(process.cwd(), 'src');
const app = fs.readFileSync(path.join(SRC, 'App.jsx'), 'utf8');
const sm  = fs.readFileSync(path.join(SRC, 'pages', 'SiteMap.jsx'), 'utf8');

// Static + dynamic route patterns
const routes = [];
app.split(/\r?\n/).forEach(l => {
  const m = l.match(/<Route\s+path=["']([^"']+)["']/);
  if (m) routes.push(m[1]);
});

function matches(pathStr, pattern) {
  const e = pathStr.split('/').filter(Boolean);
  const r = pattern.split('/').filter(Boolean);
  if (e.length !== r.length) return false;
  return r.every((seg, i) => seg.startsWith(':') || seg === e[i]);
}

const entries = [];
sm.split(/\r?\n/).forEach((l, i) => {
  const m = l.match(/^\s*\{\s*to:\s*"([^"]+)"\s*,\s*label:/);
  if (m) entries.push({ line: i+1, to: m[1] });
});

const broken = entries.filter(e => !routes.some(r => matches(e.to, r)));

console.log('Total sitemap entries: ' + entries.length);
console.log('Total route patterns: ' + routes.length);
console.log('Broken entries:       ' + broken.length);

const byPrefix = {};
for (const e of broken) {
  const first = e.to.split('/').filter(Boolean)[0] || '(root)';
  byPrefix['/' + first] = (byPrefix['/' + first] || 0) + 1;
}
console.log('\n=== Broken by first path segment ===');
Object.entries(byPrefix).sort((a,b) => b[1] - a[1]).forEach(([p, n]) => console.log('  ' + p + '  ?  ' + n));

console.log('\n=== /legal/* broken entries ===');
const legalBroken = broken.filter(e => e.to.startsWith('/legal/'));
console.log('Count: ' + legalBroken.length);
legalBroken.slice(0, 40).forEach(e => console.log('  L' + e.line + ': ' + e.to));
if (legalBroken.length > 40) console.log('  ... ' + (legalBroken.length - 40) + ' more');

console.log('\n=== Non-/legal broken entries (first 30) ===');
broken.filter(e => !e.to.startsWith('/legal/')).slice(0, 30).forEach(e => console.log('  L' + e.line + ': ' + e.to));

console.log('\nRESULT: DIAG_PHASE10 complete.');
