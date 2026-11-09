import fs from 'node:fs';
import path from 'node:path';

const NL = (s) => (s.includes('\r\n') ? '\r\n' : '\n');
const DRY_RUN = process.argv.includes('--dry-run');

const TARGETS = [
  ['src/pages/PremiumPage.jsx',           'marketing'],
  ['src/pages/PricingPage.jsx',           'marketing'],
  ['src/pages/NewsletterPage.jsx',        'marketing'],
  ['src/pages/ForumPage.jsx',             'community'],
  ['src/pages/Contact.jsx',               'community'],
  ['src/pages/TimersPage.jsx',            'reference-hub'],
  ['src/pages/CompareHubPage.jsx',        'reference-hub'],
  ['src/pages/TimeZoneConverterPage.jsx', 'reference-hub'],
  ['src/pages/LifestyleToolsHub.jsx',     'reference-hub'],
  ['src/pages/DeveloperToolsHub.jsx',     'reference-hub'],
  ['src/pages/MathToolsHub.jsx',          'reference-hub'],
  ['src/pages/FlightsPage.jsx',           'travel'],
  ['src/pages/FlightMap.jsx',             'travel'],
  ['src/pages/CarsPage.jsx',              'travel'],
  ['src/pages/About.jsx',                 'about'],
];

const ANCHORS = {
  'src/pages/PremiumPage.jsx':           '</div>',
  'src/pages/PricingPage.jsx':           '</div>',
  'src/pages/NewsletterPage.jsx':        '</div>',
  'src/pages/ForumPage.jsx':             '</div>',
  'src/pages/Contact.jsx':               '</div>',
  'src/pages/TimersPage.jsx':            '</div>',
  'src/pages/CompareHubPage.jsx':        '</div>',
  'src/pages/TimeZoneConverterPage.jsx': '</div>',
  'src/pages/LifestyleToolsHub.jsx':     '</div>',
  'src/pages/DeveloperToolsHub.jsx':     '</div>',
  'src/pages/MathToolsHub.jsx':          '</div>',
  'src/pages/FlightsPage.jsx':           '</div>',
  'src/pages/FlightMap.jsx':             '</div>',
  'src/pages/CarsPage.jsx':              '</div>',
  'src/pages/About.jsx':                 '</div>',
};

let changed = 0, failed = 0, skipped = 0;
for (const [file, category] of TARGETS) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) { console.error('MISSING ' + file); failed++; continue; }
  let src = fs.readFileSync(abs, 'utf8');
  if (src.includes('<HubExtras')) { console.log('skip (already) ' + file); skipped++; continue; }

  const anchor = ANCHORS[file];
  const at = src.lastIndexOf(anchor);
  if (at === -1) { console.error('ANCHOR NOT FOUND ' + file); failed++; continue; }

  // Guard 1 (positional, not syntactic): anchor must be in the last 30% of the file.
  const pct = at / src.length;
  if (pct < 0.7) {
    console.error('ANCHOR TOO EARLY ' + file + ' (' + Math.round(pct * 100) + '%)');
    failed++; continue;
  }

  // Guard 2: no 'export default' after the anchor (would mean a trailing component).
  if (/export\s+default\s+/.test(src.slice(at))) {
    console.error('ANCHOR BEFORE EXPORT ' + file); failed++; continue;
  }

  const nl = NL(src);
  const lineStart = src.lastIndexOf('\n', at) + 1;
  const lineEnd = src.indexOf('\n', at) === -1 ? src.length : src.indexOf('\n', at);
  const anchorLine = src.slice(lineStart, lineEnd).trim();

  if (DRY_RUN) {
    console.log('DRY ' + file + ' -> ' + category + '  [' + Math.round(pct * 100) + '% | anchor line: ' + anchorLine + ']');
    continue;
  }

  src = src.slice(0, at) + '<HubExtras category="' + category + '" />' + nl + '      ' + src.slice(at);

  const lines = src.split(/\r?\n/);
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+[\w{*'"]/.test(lines[i])) lastImport = i;
  }
  const importLine = "import HubExtras from '../components/HubExtras';";
  if (lastImport === -1) lines.unshift(importLine);
  else lines.splice(lastImport + 1, 0, importLine);
  src = lines.join(nl);

  fs.writeFileSync(abs, src, 'utf8');
  console.log('ok ' + file + ' -> ' + category + '  [' + Math.round(pct * 100) + '% | before: ' + anchorLine + ']');
  changed++;
}
console.log('\nDONE changed=' + changed + ' skipped=' + skipped + ' failed=' + failed);
if (failed) process.exit(1);
