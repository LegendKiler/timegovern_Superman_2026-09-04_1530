import fs from 'node:fs';
import path from 'node:path';

const PAGES = 'src/pages';

const PATCHES = {
  'FinanceToolsHub.jsx': {
    heading: 'How to use this hub',
    body: "This hub gathers every finance calculator on TimeGovern — loans, mortgages, investments, retirement, and debt payoff — into one place. Each tool links to a full calculator with worked examples, so you can move from a quick estimate to a detailed scenario without leaving the site. Start with the calculator closest to your question and refine from there.",
  },
  'MortgageHubPage.jsx': {
    heading: 'How to use this hub',
    body: "Mortgage decisions turn on four inputs: loan amount, interest rate, term, and down payment. The calculators here let you vary each one and see the effect on monthly payment, total interest, and payoff time. Start with the main loan calculator for a first estimate, then refine with the amortization or down-payment tools as you narrow down a specific property.",
  },
};

let ok = 0, skip = 0, guard = 0, miss = 0;

for (const [file, patch] of Object.entries(PATCHES)) {
  const p = path.join(PAGES, file);
  if (!fs.existsSync(p)) { console.log(`MISS  ${file}`); miss++; continue; }

  let src = fs.readFileSync(p, 'utf8');

  if (src.includes('className="hub-extras"')) { console.log(`SKIP  ${file}`); skip++; continue; }

  const anchor = src.lastIndexOf('</div>');
  if (anchor === -1) { console.log(`NOPE  ${file}`); guard++; continue; }

  const posPct = (anchor / src.length) * 100;
  if (posPct < 70) { console.log(`GUARD ${file} anchor at ${posPct.toFixed(0)}%`); guard++; continue; }
  if (src.indexOf('export default', anchor) !== -1) { console.log(`GUARD ${file} export after anchor`); guard++; continue; }

  const section =
    '\n      <section className="hub-extras">' +
    '\n        <h2>' + patch.heading + '</h2>' +
    '\n        <p>' + patch.body + '</p>' +
    '\n      </section>\n    ';

  src = src.slice(0, anchor) + section + src.slice(anchor);
  fs.writeFileSync(p, src);
  console.log(`OK    ${file}`);
  ok++;
}

console.log(`\nDone. ok=${ok} skip=${skip} guard=${guard} miss=${miss}`);