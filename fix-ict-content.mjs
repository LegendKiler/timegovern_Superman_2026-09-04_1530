import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = `_backups/${ts}`;
fs.mkdirSync(backupDir, { recursive: true });

const files = ['src/pages/IctToolPage.jsx', 'src/data/ictTools.js'];
for (const f of files) {
  if (!fs.existsSync(f)) { console.error(`MISSING ${f}`); process.exit(1); }
  fs.copyFileSync(f, path.join(backupDir, path.basename(f) + '.bak'));
  console.log(`Backed up ${f}`);
}

const jsxPath = 'src/pages/IctToolPage.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const jsxOld = '      {/* FAQs */}';
const jsxNew = `      {/* Long-form content — improves content depth for AdSense compliance */}
      {(tool.intro || tool.howToUse || tool.useCases) && (
        <section className="mb-10 space-y-6">
          {tool.intro && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{tool.intro}</p>
          )}
          {tool.howToUse && tool.howToUse.length > 0 && (
            <div>
              <h2 className="text-xl font-black tracking-tight mb-3">How to use it</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside ml-2">
                {tool.howToUse.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
          {tool.useCases && tool.useCases.length > 0 && (
            <div>
              <h2 className="text-xl font-black tracking-tight mb-3">Common use cases</h2>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                {tool.useCases.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* FAQs */}`;

if (!jsx.includes(jsxOld)) {
  console.error('JSX: target string not found — aborting.');
  process.exit(1);
}
jsx = jsx.replace(jsxOld, jsxNew);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('JSX: content section added');

const dataPath = 'src/data/ictTools.js';
let data = fs.readFileSync(dataPath, 'utf8');

const b64Old = `  { slug: 'base64', name: 'Base64 Encoder / Decoder', category: 'encoding',
    description: 'Encode text to Base64 or decode Base64 back to text.',
    faqs: [`;

const b64New = `  { slug: 'base64', name: 'Base64 Encoder / Decoder', category: 'encoding',
    description: 'Encode text to Base64 or decode Base64 back to text.',
    intro: 'Base64 is a binary-to-text encoding scheme that represents binary data as a string of printable ASCII characters. It was originally designed to transmit binary attachments like images and executables through text-only channels such as email (SMTP) and older network protocols that only supported 7-bit ASCII. Modern developers still use Base64 every day — it powers inline images in CSS and HTML, JSON Web Tokens (JWTs), Basic Auth headers, and many data URL schemes. The encoding maps every three bytes of input to four ASCII characters, using the 64-character set A–Z, a–z, 0–9, +, and /. Padding with = ensures the output length is always a multiple of four. Because it enlarges the payload by roughly 33%, Base64 is meant for transport and embedding, not storage.',
    howToUse: [
      'Paste the text you want to encode, or the Base64 string you want to decode, into the input box.',
      'Choose the Encode or Decode mode from the tab row above the input.',
      'Click Run Tool — the result appears in the output panel below.',
      'Click Copy to copy the result to your clipboard, ready for pasting into JWT debuggers, Authorization headers, or CSS files.',
    ],
    useCases: [
      'Embedding small images directly inside CSS or HTML with data URLs, avoiding a separate HTTP request.',
      'Inspecting and constructing JSON Web Tokens while debugging authentication flows.',
      'Encoding HTTP Basic Auth credentials (username:password) for testing API endpoints.',
      'Sending binary payloads through log aggregation systems that only accept printable text.',
    ],
    faqs: [`;

if (!data.includes(b64Old)) {
  console.error('base64: target entry not found — aborting.');
  process.exit(1);
}
data = data.replace(b64Old, b64New);
fs.writeFileSync(dataPath, data, 'utf8');
console.log('base64: intro/howToUse/useCases added');

console.log(`\nBackups: ${backupDir}`);
