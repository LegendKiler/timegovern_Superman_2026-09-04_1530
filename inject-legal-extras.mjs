import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = `_backups/${ts}/legal3`;
fs.mkdirSync(backupDir, { recursive: true });

const FILES = {
  'AdvertisingPolicy.jsx':   { cat: 'legal-advertising' },
  'AfricaPrivacy.jsx':       { cat: 'privacy', ctx: 'Africa' },
  'AsiaPacificPrivacy.jsx':  { cat: 'privacy', ctx: 'the Asia-Pacific region' },
  'AustraliaAddendum.jsx':   { cat: 'privacy', ctx: 'Australia' },
  'AustraliaAIAddendum.jsx': { cat: 'ai',      ctx: 'Australia\u2019s AI framework' },
  'ChinaAIAddendum.jsx':     { cat: 'ai',      ctx: 'China\u2019s AI regulations' },
  'Disclaimer.jsx':          { cat: 'legal-disclaimer' },
  'EuAIAddendum.jsx':        { cat: 'ai',      ctx: 'the EU AI Act' },
  'GdprPrivacy.jsx':         { cat: 'privacy', ctx: 'the EU' },
  'GlobalAIPolicy.jsx':      { cat: 'ai',      ctx: 'international AI governance' },
  'GlobalPrivacyCenter.jsx': { cat: 'privacy', ctx: 'your region', map: true },
  'GlobalPrivacyPolicy.jsx': { cat: 'privacy', ctx: 'every jurisdiction we operate in' },
  'IndiaPrivacy.jsx':        { cat: 'privacy', ctx: 'India' },
  'LatinAmericaPrivacy.jsx': { cat: 'privacy', ctx: 'Latin America' },
  'LinkPolicy.jsx':          { cat: 'legal-links' },
  'MiddleEastPrivacy.jsx':   { cat: 'privacy', ctx: 'the Middle East' },
  'PrivacySettings.jsx':     { cat: 'privacy', ctx: 'your region' },
  'SingaporePrivacy.jsx':    { cat: 'privacy', ctx: 'Singapore' },
  'SouthAsiaPrivacy.jsx':    { cat: 'privacy', ctx: 'South Asia', map: true },
  'UkAIAddendum.jsx':        { cat: 'ai',      ctx: 'the UK AI framework' },
  'UkPrivacy.jsx':           { cat: 'privacy', ctx: 'the United Kingdom' },
  'UsAIAddendum.jsx':        { cat: 'ai',      ctx: 'US AI regulation' },
  'UsPrivacy.jsx':           { cat: 'privacy', ctx: 'the United States' },
  'UsPrivacyNational.jsx':   { cat: 'privacy', ctx: 'US federal law' },
  'UsPrivacyState.jsx':      { cat: 'privacy', ctx: 'your US state' },
};

const exportAnchor = '\nexport default function ';
const importLine = "\nimport { LegalExtras } from '../../components/LegalExtras'\n";

let injected = 0, skipped = [];

for (const [filename, cfg] of Object.entries(FILES)) {
  const filePath = path.join('src/pages/legal', filename);
  if (!fs.existsSync(filePath)) { skipped.push(`${filename}: not found`); continue; }

  let content = fs.readFileSync(filePath, 'utf8');
  fs.copyFileSync(filePath, path.join(backupDir, filename + '.bak'));

  if (content.includes('LegalExtras')) { skipped.push(`${filename}: already injected`); continue; }

  const exportIdx = content.indexOf(exportAnchor);
  if (exportIdx === -1) { skipped.push(`${filename}: no export anchor`); continue; }

  const ctxAttr = cfg.ctx ? ` context="${cfg.ctx}"` : '';
  const el = `<LegalExtras category="${cfg.cat}"${ctxAttr} />`;

  // Detect newline style
  const nl = content.includes('\r\n') ? '\r\n' : '\n';

  let newContent = null;
  if (cfg.map) {
    const anchor = `))}${nl}      </div>${nl}    </div>`;
    if (content.includes(anchor)) {
      newContent = content.replace(anchor, `))}${nl}      </div>${nl}      ${el}${nl}    </div>`);
    }
  } else {
    const anchor = `        </CardContent>${nl}      </Card>${nl}    </div>`;
    if (content.includes(anchor)) {
      newContent = content.replace(anchor, `        </CardContent>${nl}      </Card>${nl}      ${el}${nl}    </div>`);
    }
  }

  if (newContent === null) { skipped.push(`${filename}: no matching anchor (nl=${nl === '\r\n' ? 'CRLF' : 'LF'})`); continue; }

  const exportIdx2 = newContent.indexOf(exportAnchor);
  newContent = newContent.substring(0, exportIdx2) + importLine + newContent.substring(exportIdx2);

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`  + ${filename} (${cfg.cat})`);
  injected++;
}

console.log(`\nInjected: ${injected}/${Object.keys(FILES).length}`);
if (skipped.length) console.log('Skipped:\n  ' + skipped.join('\n  '));
console.log(`\nBackups: ${backupDir}`);
