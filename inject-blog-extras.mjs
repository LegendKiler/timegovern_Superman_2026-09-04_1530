import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = `_backups/${ts}`;
fs.mkdirSync(backupDir, { recursive: true });

const ARTICLES = {
  'BrazilINSSIRRFPage.jsx': 'social',
  'MexicoISRIMSSPage.jsx': 'social',
  'BrazilTaxBracketsPage.jsx': 'tax',
  'BrazilTakeHomePayPage.jsx': 'takeHome',
  'MexicoTaxBracketsPage.jsx': 'tax',
  'MexicoTakeHomePayPage.jsx': 'takeHome',
  'BangladeshTaxRebatePage.jsx': 'tax',
  'NigeriaPensionPage.jsx': 'social',
  'PakistanFilerPage.jsx': 'tax',
  'BangladeshTaxBracketsPage.jsx': 'tax',
  'BangladeshTakeHomePayPage.jsx': 'takeHome',
  'PakistanTaxBracketsPage.jsx': 'tax',
  'IndiaTakeHomePayPage.jsx': 'takeHome',
  'KenyaTaxBracketsPage.jsx': 'tax',
  'KenyaDeductionsPage.jsx': 'social',
  'KenyaTakeHomePayPage.jsx': 'takeHome',
  'NigeriaTaxBracketsPage.jsx': 'tax',
  'NigeriaTakeHomePayPage.jsx': 'takeHome',
  'PakistanTakeHomePayPage.jsx': 'takeHome',
  'IndiaEPFCessPage.jsx': 'social',
  'IndiaTaxBracketsPage.jsx': 'tax',
  'SouthAfricaUIFPage.jsx': 'social',
  'JapanSocialInsurancePage.jsx': 'social',
};

const importAnchor = '\nexport default function ';
const importLine = "\nimport { BlogArticleExtras } from '../components/BlogArticleExtras'\n";

const shareButtonsAnchor = `        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''}`;

let injected = 0;
const skipped = [];

for (const [filename, category] of Object.entries(ARTICLES)) {
  const filePath = path.join('src/pages', filename);
  if (!fs.existsSync(filePath)) {
    skipped.push(`${filename} (file not found)`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  fs.copyFileSync(filePath, path.join(backupDir, filename + '.bak'));

  if (content.includes('BlogArticleExtras')) {
    skipped.push(`${filename} (already injected)`);
    continue;
  }

  const exportIdx = content.indexOf(importAnchor);
  if (exportIdx === -1) {
    skipped.push(`${filename} (export anchor not found)`);
    continue;
  }

  const shareIdx = content.indexOf(shareButtonsAnchor);
  if (shareIdx === -1) {
    skipped.push(`${filename} (ShareButtons anchor not found)`);
    continue;
  }

  // Insert extras JSX first (higher index), then import (lower index) to keep indices valid
  const extrasJsx = `        <BlogArticleExtras category="${category}" />\n\n`;
  content = content.substring(0, shareIdx) + extrasJsx + content.substring(shareIdx);

  const exportIdx2 = content.indexOf(importAnchor);
  content = content.substring(0, exportIdx2) + importLine + content.substring(exportIdx2);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  + ${filename} (${category})`);
  injected++;
}

console.log(`\nInjected: ${injected}/${Object.keys(ARTICLES).length}`);
if (skipped.length) console.log(`Skipped:\n  ${skipped.join('\n  ')}`);
console.log(`\nBackups: ${backupDir}`);
