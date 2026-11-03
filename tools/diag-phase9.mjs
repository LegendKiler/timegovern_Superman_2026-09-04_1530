import fs from 'node:fs';
import path from 'node:path';
const SRC = path.join(process.cwd(), 'src');
const app = fs.readFileSync(path.join(SRC, 'App.jsx'), 'utf8');

const routeMap = {};
const routeLines = [];
app.split(/\r?\n/).forEach((l, i) => {
  const m = l.match(/<Route\s+path=["']([^"']+)["'][^>]*element=\{<(\w+)/);
  if (m) { const [, p, comp] = m; routeMap[comp] = p; routeLines.push({ line: i+1, path: p, comp }); }
});

const legalComps = [
  'AdvertisingPolicy','AfricaPrivacy','AsiaPacificPrivacy','AustraliaAddendum','AustraliaAIAddendum',
  'ChinaAIAddendum','Disclaimer','EuAIAddendum','GdprPrivacy','GlobalAIPolicy','GlobalPrivacyCenter',
  'GlobalPrivacyPolicy','IndiaPrivacy','LatinAmericaPrivacy','LinkPolicy','MiddleEastPrivacy',
  'PrivacySettings','SingaporePrivacy','SouthAsiaPrivacy','TermsConditions','UkAIAddendum','UkPrivacy',
  'UsAIAddendum','UsPrivacy','UsPrivacyNational','UsPrivacyState'
];

console.log('=== ROUTE MAP for legal pages ===');
for (const c of legalComps) {
  const p = routeMap[c];
  console.log((p ? 'ROUTED ' : 'ORPHAN ') + c + (p ? '  ?  ' + p : ''));
}

console.log('\n=== All routes matching /legal, /privacy, /terms, /disclaimer, /advertising, /link-policy ===');
routeLines.filter(r => /\/legal\/|\/privacy|\/terms|\/disclaimer|\/advertising|\/link-policy/i.test(r.path))
  .forEach(r => console.log(r.path + '  ?  ' + r.comp));

console.log('\nRESULT: DIAG_PHASE9 complete.');
