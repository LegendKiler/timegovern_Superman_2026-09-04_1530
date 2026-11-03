import fs from 'fs';
import path from 'path';

const appPath = 'src/App.jsx';
const routePagePath = 'src/pages/FlightRoutePage.jsx';

// 0. Verify FlightRoutePage.jsx exists
if (!fs.existsSync(routePagePath)) {
  console.log('❌ ' + routePagePath + ' does not exist. Re-run the create-route-page.mjs script first.');
  process.exit(1);
}

let lines = fs.readFileSync(appPath, 'utf8').split('\n');

// 1. Strip every existing FlightRoutePage declaration/import — but keep the JSX route
const beforeCount = lines.length;
lines = lines.filter(line => {
  const isJSX = line.includes('<FlightRoutePage');
  const isDecl = line.includes('FlightRoutePage') && !isJSX;
  return !isDecl;
});
console.log(`🧹 Removed ${beforeCount - lines.length} stale FlightRoutePage line(s).`);

// 2. Find FlightsPage declaration and insert FlightRoutePage right after it
let anchorIdx = lines.findIndex(l => /const\s+FlightsPage\s*=/.test(l));
if (anchorIdx === -1) {
  // Fallback: use the last top-level import
  anchorIdx = lines.reduce((acc, l, i) => (/^import\s/.test(l) ? i : acc), -1);
}
if (anchorIdx === -1) {
  console.log('❌ Could not find any import or FlightsPage declaration to anchor to.');
  process.exit(1);
}

const anchorLine = lines[anchorIdx];
const indentMatch = anchorLine.match(/^(\s*)/);
const indent = indentMatch ? indentMatch[1] : '';
const cleanDecl = `${indent}const FlightRoutePage = lazy(() => import('./pages/FlightRoutePage'))`;
lines.splice(anchorIdx + 1, 0, cleanDecl);
console.log(`✅ Inserted clean declaration at line ${anchorIdx + 2}:`);
console.log('   ' + cleanDecl);

// 3. Ensure the JSX route is present
const joined = lines.join('\n');
if (!joined.includes('<FlightRoutePage')) {
  // Append a route right after the FlightsPage route, or before the closing </Routes>
  const routeRe = /(<Route\s+path="\/flights"[^\n]*\/>)/;
  if (routeRe.test(joined)) {
    const patched = joined.replace(
      routeRe,
      `$1\n        <Route path="/flights/:origin/:destination" element={<FlightRoutePage />} />`
    );
    lines = patched.split('\n');
    console.log('✅ Added missing route JSX.');
  } else {
    console.log('⚠️ Could not find the /flights route to anchor the new route. You may need to add it manually.');
  }
}

fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log('');
console.log('✅ App.jsx saved cleanly. Now run: npm run dev');
