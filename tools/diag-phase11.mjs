import fs from 'node:fs';
import path from 'node:path';
const SRC = path.join(process.cwd(), 'src');
const app = fs.readFileSync(path.join(SRC, 'App.jsx'), 'utf8');
const sm  = fs.readFileSync(path.join(SRC, 'pages', 'SiteMap.jsx'), 'utf8');

const routeList = [];
const compToRoute = {};
app.split(/\r?\n/).forEach(l => {
  const m = l.match(/<Route\s+path=["']([^"']+)["'][^>]*element=\{<(\w+)/);
  if (m) { routeList.push(m[1]); compToRoute[m[2]] = m[1]; }
});

const matches = (pathStr, pattern) => {
  const e = pathStr.split('/').filter(Boolean);
  const r = pattern.split('/').filter(Boolean);
  if (e.length !== r.length) return false;
  return r.every((seg, i) => seg.startsWith(':') || seg === e[i]);
};
const isRouted = p => routeList.some(r => matches(p, r));

// Routes keyed by stripped-hyphen form for fuzzy slug match
const routesByKey = new Map();
for (const r of routeList) {
  if (r.includes(':') || r === '*') continue;
  routesByKey.set(r.replace(/-/g, '').replace(/^\/+/, '').toLowerCase(), r);
}

// Known real titles for legal pages (from Phase 8)
const LEGAL_TITLES = {
  AdvertisingPolicy: 'Advertising Policy', AfricaPrivacy: 'Africa Privacy Laws',
  AsiaPacificPrivacy: 'Asia Pacific Privacy Laws', AustraliaAddendum: 'Australia Privacy Addendum (Privacy Act 1988)',
  AustraliaAIAddendum: 'Australia AI Addendum', ChinaAIAddendum: 'China AI Addendum',
  Disclaimer: 'Disclaimer', EuAIAddendum: 'EU AI Act Addendum',
  GdprPrivacy: 'EU GDPR Privacy Policy', GlobalAIPolicy: 'Global AI Policy',
  GlobalPrivacyCenter: 'Global Privacy Center', GlobalPrivacyPolicy: 'Global Privacy Policy',
  IndiaPrivacy: 'India DPDP Privacy Notice', LatinAmericaPrivacy: 'Latin America Privacy Laws',
  LinkPolicy: 'Link Policy', MiddleEastPrivacy: 'Middle East Privacy Laws',
  PrivacySettings: 'Privacy Settings', SingaporePrivacy: 'Singapore PDPA Privacy Policy',
  SouthAsiaPrivacy: 'South Asia Privacy Laws', TermsConditions: 'Terms & Conditions',
  UkAIAddendum: 'UK AI Addendum', UkPrivacy: 'United Kingdom Privacy Policy (UK GDPR)',
  UsAIAddendum: 'US AI Addendum', UsPrivacy: 'US Privacy Policy (CCPA/CPRA)',
  UsPrivacyNational: 'United States Privacy Policy', UsPrivacyState: 'US State-by-State Privacy Laws'
};
const legalCompFromSlug = slug => {
  // /legal/u-sp-ri-va-cy-na-ti-on-al -> usprivacynational -> UsPrivacyNational
  const stripped = slug.replace(/^\/legal\//, '').replace(/-/g, '').toLowerCase();
  for (const k of Object.keys(LEGAL_TITLES)) {
    if (k.toLowerCase() === stripped) return k;
  }
  // fuzzy: component starts with stripped
  for (const k of Object.keys(LEGAL_TITLES)) {
    if (k.toLowerCase().startsWith(stripped) && Math.abs(k.length - stripped.length) <= 3) return k;
  }
  return null;
};

const entryRx = /^\s*\{\s*to:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*\},?\s*$/;
const rows = [];
sm.split(/\r?\n/).forEach((l, i) => {
  const m = l.match(entryRx);
  if (!m) return;
  const [, to, label] = m;
  if (isRouted(to)) return;
  const stripped = to.replace(/^-?\//, '').replace(/-/g, '').toLowerCase();
  const fromRootKey = routesByKey.get(stripped);

  let action = 'FLAG', realRoute = null, realTitle = null;

  if (to.startsWith('/legal/')) {
    const comp = legalCompFromSlug(to);
    if (comp && compToRoute[comp]) {
      action = 'REPLACE';
      realRoute = compToRoute[comp];
      realTitle = LEGAL_TITLES[comp];
    } else if (comp) {
      action = 'DELETE (orphan)';
    } else {
      action = 'FLAG (no component match)';
    }
  } else if (fromRootKey) {
    action = 'REPLACE';
    realRoute = fromRootKey;
    realTitle = null; // label retained from current entry
  } else if (to.startsWith('/blog/')) {
    action = 'DELETE (404 ? post missing)';
  } else {
    action = 'DELETE (no route)';
  }

  rows.push({ line: i + 1, to, label, action, realRoute, realTitle });
});

const groups = { REPLACE: [], DELETE: [], FLAG: [] };
for (const r of rows) {
  if (r.action.startsWith('REPLACE')) groups.REPLACE.push(r);
  else if (r.action.startsWith('DELETE')) groups.DELETE.push(r);
  else groups.FLAG.push(r);
}

console.log('=== SUMMARY ===');
console.log('REPLACE: ' + groups.REPLACE.length + '  DELETE: ' + groups.DELETE.length + '  FLAG: ' + groups.FLAG.length);

console.log('\n=== REPLACE (' + groups.REPLACE.length + ') ===');
for (const r of groups.REPLACE) {
  const label = r.realTitle || r.label;
  console.log('L' + r.line + ':  ' + r.to + '  ?  { to: "' + r.realRoute + '", label: "' + label + '" }');
}

console.log('\n=== DELETE (' + groups.DELETE.length + ') ===');
for (const r of groups.DELETE) {
  console.log('L' + r.line + ':  ' + r.to + '   [' + r.action + ']   label="' + r.label + '"');
}

console.log('\n=== FLAG (' + groups.FLAG.length + ') ===');
for (const r of groups.FLAG) {
  console.log('L' + r.line + ':  ' + r.to + '   label="' + r.label + '"');
}

console.log('\nRESULT: DIAG_PHASE11 complete.');
