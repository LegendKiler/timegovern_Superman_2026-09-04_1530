import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const read = p => fs.readFileSync(p, 'utf8');

console.log('=== App.jsx: legal / settings / timers / time-card routes ===');
read(path.join(SRC, 'App.jsx')).split(/\r?\n/).forEach((l, i) => {
  if (/\/(?:legal|privacy|settings|timers|time-card)/i.test(l)) console.log(String(i+1).padStart(5) + '| ' + l);
});

console.log('\n=== Page titles for the 9 affected UNIQUE entries ===');
const affected = [
  'AdvertisingPolicy','AfricaPrivacy','PrivacySettings',
  'ChinaAIAddendum','Disclaimer','EuAIAddendum',
  'AsiaPacificPrivacy','AustraliaAddendum','AustraliaAIAddendum',
];
for (const name of affected) {
  const p = path.join(SRC, 'pages', 'legal', name + '.jsx');
  if (!fs.existsSync(p)) { console.log(name + ': FILE MISSING'); continue; }
  const src = read(p);
  const m = src.match(/<(?:CardTitle|h1)[^>]*>([\s\S]*?)<\/(?:CardTitle|h1)>/);
  const title = m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : 'NOT FOUND';
  console.log(name + '  ?  "' + title + '"');
}

console.log('\n=== Does /settings or /privacy-settings exist as a route? ===');
const appText = read(path.join(SRC, 'App.jsx'));
for (const r of ['/settings', '/privacy-settings', '/legal/privacy-settings', '/legal/eu-ai-addendum', '/legal/eu-ai-act-addendum', '/legal/africa-privacy', '/legal/africa-privacy-laws', '/legal/asia-pacific-privacy', '/legal/asia-pacific-privacy-laws', '/legal/australia-addendum', '/legal/australia-privacy-addendum', '/legal/australia-ai-addendum']) {
  const hit = appText.includes('"' + r + '"') || appText.includes("'" + r + "'");
  console.log('  ' + (hit ? 'EXISTS' : 'ABSENT') + '  ' + r);
}

console.log('\nRESULT: DIAG_PHASE8 complete.');
