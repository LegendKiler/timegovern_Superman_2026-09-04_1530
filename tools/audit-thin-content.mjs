import fs from 'fs';
import path from 'path';

const DIST = './dist';
const MIN_WORDS = 300;

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name === 'index.html') files.push(p);
  }
  return files;
}

function stripHtml(html) {
  let s = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, ' ');
  s = s.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, ' ');
  s = s.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const wc = t => t ? t.split(/\s+/).filter(Boolean).length : 0;
const route = f => '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
const title = h => (h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
const h1s = h => (h.match(/<h1[\s>]/gi) || []).length;

const rows = walk(DIST).map(f => {
  const html = fs.readFileSync(f, 'utf8');
  return { route: route(f), words: wc(stripHtml(html)), h1: h1s(html), title: title(html) };
});
rows.sort((a, b) => a.words - b.words);

const csv = ['route,words,h1,title'];
for (const r of rows) csv.push(`"${r.route}",${r.words},${r.h1},"${r.title.replace(/"/g, '""')}"`);
fs.writeFileSync('./_thin-content-audit.csv', csv.join('\n'), 'utf8');

const thin = rows.filter(r => r.words < MIN_WORDS);
const veryThin = rows.filter(r => r.words < 150);
const ok = rows.filter(r => r.words >= MIN_WORDS);

console.log(`Scanned ${rows.length} pages`);
console.log(`  >= ${MIN_WORDS} words: ${ok.length}`);
console.log(`  <  ${MIN_WORDS} words: ${thin.length}`);
console.log(`  <  150 words: ${veryThin.length}`);
console.log(`\nTop 20 thinnest:`);
for (const r of thin.slice(0, 20)) console.log(`  ${String(r.words).padStart(5)}w | h1=${r.h1} | ${r.route}`);
console.log(`\nPages with h1 != 1:`);
for (const r of rows.filter(r => r.h1 !== 1)) console.log(`  h1=${r.h1} | ${r.route}`);
console.log(`\nCSV: _thin-content-audit.csv`);
