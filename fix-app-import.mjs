import fs from 'fs';

const appPath = 'src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

// Already imported?
if (/import\s+FlightRoutePage\s+from/.test(app) || /const\s+FlightRoutePage\s*=/.test(app)) {
  console.log('✅ Already imported — nothing to do.');
  process.exit(0);
}

// Sanity check: is the JSX there?
if (!app.includes('<FlightRoutePage')) {
  console.log('⚠️  <FlightRoutePage /> is not in App.jsx — nothing to import. Check the route was added.');
  process.exit(1);
}

let fixed = false;

// 1. Try regular import: find how FlightsPage is imported and mirror it
const flightsImportRe = /import\s+FlightsPage\s+from\s+(['"][^'"]+['"])/;
const m = app.match(flightsImportRe);
if (m) {
  const flightsLine = m[0];
  const newLine = flightsLine
    .replace(/FlightsPage/g, 'FlightRoutePage')
    .replace(/pages\/FlightsPage(\.[jt]sx?)?/, 'pages/FlightRoutePage');
  app = app.replace(flightsLine, flightsLine + '\n' + newLine);
  fixed = true;
  console.log('✅ Added import (mirrored from FlightsPage regular import):');
  console.log('   ' + newLine);
}

// 2. Try lazy import
if (!fixed) {
  const lazyRe = /const\s+FlightsPage\s*=\s*(lazy\([^)]+\)|React\.lazy\([^)]+\))/;
  const lm = app.match(lazyRe);
  if (lm) {
    const lazyLine = lm[0];
    const newLine = lazyLine
      .replace(/FlightsPage/g, 'FlightRoutePage')
      .replace(/pages\/FlightsPage(\.[jt]sx?)?/, 'pages/FlightRoutePage');
    app = app.replace(lazyLine, lazyLine + '\n' + newLine);
    fixed = true;
    console.log('✅ Added lazy import (mirrored from FlightsPage lazy import):');
    console.log('   ' + newLine);
  }
}

// 3. Fallback — insert after the last top-level import line
if (!fixed) {
  const importLines = app.match(/^import\s[^\n]+$/gm) || [];
  if (importLines.length > 0) {
    const last = importLines[importLines.length - 1];
    const insert = last + "\nimport FlightRoutePage from './pages/FlightRoutePage'";
    app = app.replace(last, insert);
    fixed = true;
    console.log('✅ Added import as fallback (after last import):');
    console.log("   import FlightRoutePage from './pages/FlightRoutePage'");
  }
}

if (!fixed) {
  console.log('❌ Could not find a place to add the import. Paste the top 30 lines of App.jsx and I will fix it manually.');
  process.exit(1);
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('');
console.log('✅ Done. Now run: npm run dev');
