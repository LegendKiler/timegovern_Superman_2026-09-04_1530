import fs from 'node:fs';
import path from 'node:path';

const NL = (s) => (s.includes('\r\n') ? '\r\n' : '\n');
const PAGES = 'src/pages';

const CATEGORY = {
  '/scientific-notation-converter': 'math',
  '/matrix-calculator': 'math',
  '/logarithm-calculator': 'math',
  '/permutation-combination-calculator': 'math',
  '/gcd-lcm-calculator': 'math',
  '/percent-error-calculator': 'math',
  '/probability-calculator': 'math',
  '/quadratic-calculator': 'math',
  '/significant-figures-calculator': 'math',
  '/exponent-root-calculator': 'math',
  '/prime-factorization-calculator': 'math',
  '/area-calculator': 'math',
  '/volume-calculator': 'math',
  '/slope-calculator': 'math',
  '/markup-calculator': 'finance',
  '/break-even-calculator': 'finance',
  '/payback-period-calculator': 'finance',
  '/future-value-calculator': 'finance',
  '/present-value-calculator': 'finance',
  '/debt-payoff-calculator': 'finance',
  '/cagr-calculator': 'finance',
  '/down-payment-calculator': 'finance',
  '/protein-calculator': 'health',
  '/pace-calculator': 'health',
  '/bac-calculator': 'health',
  '/macro-calculator': 'health',
  '/tdee-calculator': 'health',
  '/speed-converter': 'unit-conversion',
  '/temperature-converter': 'unit-conversion',
  '/weight-converter': 'unit-conversion',
  '/data-storage-converter': 'unit-conversion',
  '/length-converter': 'unit-conversion',
  '/binary-hex-converter': 'unit-conversion',
  '/roman-numeral-converter': 'unit-conversion',
};

const FILE_OVERRIDE = {
  '/cagr-calculator': 'CAGRCalculatorPage.jsx',
  '/roman-numeral-converter': 'RomanNumeralCalculatorPage.jsx',
};

const kebabToPascal = (s) =>
  s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const findFile = (route) => {
  if (FILE_OVERRIDE[route]) {
    const p = path.join(PAGES, FILE_OVERRIDE[route]);
    return fs.existsSync(p) ? p : null;
  }
  const pascal = kebabToPascal(route.replace(/^\//, ''));
  for (const c of [`${pascal}Page.jsx`, `${pascal}.jsx`]) {
    const p = path.join(PAGES, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

let ok = 0, skip = 0, guard = 0, miss = 0;

for (const [route, category] of Object.entries(CATEGORY)) {
  const file = findFile(route);
  if (!file) { console.log(`MISS  ${route}`); miss++; continue; }

  let src = fs.readFileSync(file, 'utf8');
  if (/<CalculatorExtras/.test(src)) { console.log(`SKIP  ${path.basename(file)}`); skip++; continue; }

  const anchor = src.lastIndexOf('</div>');
  if (anchor === -1) { console.log(`NOPE  ${path.basename(file)} no </div>`); guard++; continue; }

  const posPct = (anchor / src.length) * 100;
  if (posPct < 70) { console.log(`GUARD ${path.basename(file)} lastAnchor at ${posPct.toFixed(0)}%`); guard++; continue; }
  if (src.indexOf('export default', anchor) !== -1) { console.log(`GUARD ${path.basename(file)} export after anchor`); guard++; continue; }
  const tail = src.slice(anchor + 6);
  if (/^\s*(export\s+)?(default\s+)?function\s+\w+/m.test(tail)) {
    console.log(`GUARD ${path.basename(file)} helper function after outer wrapper`);
    guard++;
    continue;
  }

  const nl = NL(src);
  const lines = src.split(/\r?\n/);
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+[\w{*'"]/.test(lines[i])) lastImport = i;
  }
  if (lastImport === -1) { console.log(`NOPE  ${path.basename(file)} no imports`); guard++; continue; }
  lines.splice(lastImport + 1, 0, `import CalculatorExtras from '../components/CalculatorExtras.jsx';`);
  src = lines.join(nl);

  const finalAnchor = src.lastIndexOf('</div>');
  const tag = `${nl}      <CalculatorExtras category="${category}" />`;
  src = src.slice(0, finalAnchor) + tag + nl + src.slice(finalAnchor);

  fs.writeFileSync(file, src);
  console.log(`OK    ${path.basename(file)} [${category}]`);
  ok++;
}

console.log(`\nDone. ok=${ok} skip=${skip} guard=${guard} miss=${miss}`);