import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = `_backups/${ts}`;
fs.mkdirSync(backupDir, { recursive: true });

const dataPath = 'src/data/ictTools.js';
fs.copyFileSync(dataPath, path.join(backupDir, 'ictTools.js.bak'));
console.log(`Backed up ${dataPath} -> ${backupDir}`);

let data = fs.readFileSync(dataPath, 'utf8');

// --- lorem-ipsum ---
const loremOld = `  { slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'text',
    description: 'Generate placeholder text for designs and mockups.',
    faqs: [`;

const loremNew = `  { slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'text',
    description: 'Generate placeholder text for designs and mockups.',
    intro: 'Lorem ipsum is placeholder text that designers, publishers, and developers have used for over five centuries to preview layouts without the distraction of meaningful content. The text originates from a passage of Cicero\\'s "De finibus bonorum et malorum", written in 45 BC — but the words were scrambled and altered in the 1500s by an anonymous typesetter, and the version we use today is essentially nonsensical. That is precisely the point. When you fill a mockup with real words, reviewers focus on the words instead of the layout, the spacing, the typography, or the visual hierarchy. Lorem ipsum solves this by providing believable letter and word distribution — the rhythm and density of real Latin text — without any semantic meaning. Modern designers use it in Figma files, WordPress themes, HTML prototypes, and email templates so stakeholders evaluate the design, not the copy.',
    howToUse: [
      'Enter the number of paragraphs you need in the input field (default is 3).',
      'Click Run Tool to generate the placeholder text.',
      'Click Copy to place the generated paragraphs on your clipboard.',
      'Paste the text into your design file, HTML template, or CMS draft.',
    ],
    useCases: [
      'Filling Figma, Sketch, or Adobe XD mockups so reviewers evaluate layout rather than copy.',
      'Testing typography, line height, and paragraph spacing in a new CSS or Tailwind theme.',
      'Drafting WordPress, Webflow, or Shopify templates before real marketing copy is finalized.',
      'Standing in for long-form article text while building email newsletter layouts.',
    ],
    faqs: [`;

if (!data.includes(loremOld)) {
  console.error('lorem-ipsum: target entry not found — aborting.');
  process.exit(1);
}
data = data.replace(loremOld, loremNew);
console.log('lorem-ipsum: content added');

// --- regex-tester ---
const regexOld = `  { slug: 'regex-tester', name: 'Regex Tester', category: 'text',
    description: 'Test regular expressions against sample text and see all matches.',
    faqs: [`;

const regexNew = `  { slug: 'regex-tester', name: 'Regex Tester', category: 'text',
    description: 'Test regular expressions against sample text and see all matches.',
    intro: 'A regular expression — regex for short — is a compact language for describing patterns in text. It is the standard tool for validating email addresses, phone numbers, and passwords; for extracting structured data from logs and HTML; and for search-and-replace operations in every modern code editor. Regex syntax is famously dense and unforgiving — a single missing backslash can silently break a pattern, and catastrophic backtracking can freeze an application on adversarial input. That is why a regex tester is essential: it lets you iterate on a pattern against real sample text in your browser, seeing every match as you refine. This tester uses the JavaScript RegExp engine (the same one used in Node.js and every browser), so any pattern that works here will work in your production code. It is entirely client-side — your patterns and test strings never leave your machine, which makes it safe to paste production-adjacent data during debugging.',
    howToUse: [
      'Enter your regular expression pattern in the pattern field (include flags like g, i, or m if needed).',
      'Paste the sample text you want to test against into the input box.',
      'Click Run Tool to see all matches highlighted in the output.',
      'Iterate — tweak the pattern and re-run until the matches match your intent.',
    ],
    useCases: [
      'Validating email address, URL, phone number, and password formats before wiring into form validation code.',
      'Extracting timestamps, IPs, or user IDs from server logs during incident debugging.',
      'Finding all occurrences of a string in a large file when search-and-replace would be too broad.',
      'Constructing capture groups for use in JavaScript replace() or matchAll() calls.',
    ],
    faqs: [`;

if (!data.includes(regexOld)) {
  console.error('regex-tester: target entry not found — aborting.');
  process.exit(1);
}
data = data.replace(regexOld, regexNew);
console.log('regex-tester: content added');

fs.writeFileSync(dataPath, data, 'utf8');
console.log(`\nBackups: ${backupDir}`);
