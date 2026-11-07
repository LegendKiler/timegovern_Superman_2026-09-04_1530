import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = `_backups/${ts}`;
fs.mkdirSync(backupDir, { recursive: true });

const dataPath = 'src/data/ictTools.js';
fs.copyFileSync(dataPath, path.join(backupDir, 'ictTools.js.bak'));
console.log(`Backed up -> ${backupDir}`);

let content;
try {
  content = JSON.parse(fs.readFileSync('ict-content-batch2a.json', 'utf8'));
} catch (e) {
  console.error('JSON PARSE FAILED:', e.message);
  process.exit(1);
}

let data = fs.readFileSync(dataPath, 'utf8');
let inserted = 0;
const skipped = [];

for (const [slug, entry] of Object.entries(content)) {
  const anchor = `{ slug: '${slug}',`;
  const idx = data.indexOf(anchor);
  if (idx === -1) { skipped.push(`${slug} (anchor not found)`); continue; }

  const faqsIdx = data.indexOf('faqs: [', idx);
  if (faqsIdx === -1) { skipped.push(`${slug} (faqs not found)`); continue; }

  const block = data.substring(idx, faqsIdx);
  if (block.includes('intro:')) { skipped.push(`${slug} (already has content)`); continue; }

  const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const how = entry.howToUse.map(s => `      '${esc(s)}',`).join('\n');
  const use = entry.useCases.map(s => `      '${esc(s)}',`).join('\n');
  const inject = `    intro: '${esc(entry.intro)}',\n    howToUse: [\n${how}\n    ],\n    useCases: [\n${use}\n    ],\n    `;

  data = data.substring(0, faqsIdx) + inject + data.substring(faqsIdx);
  inserted++;
  console.log(`  + ${slug}`);
}

fs.writeFileSync(dataPath, data, 'utf8');
console.log(`\nInserted: ${inserted}/${Object.keys(content).length}`);
if (skipped.length) console.log(`Skipped:\n  ${skipped.join('\n  ')}`);
