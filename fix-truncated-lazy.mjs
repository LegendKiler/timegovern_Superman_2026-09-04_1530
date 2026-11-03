import fs from 'fs';

const appPath = 'src/App.jsx';
let lines = fs.readFileSync(appPath, 'utf8').split('\n');

let fixed = 0;

// 1. Fix ANY truncated line of the form:  const X = lazy((
//    Completes it to:  const X = lazy(() => import('./pages/X'))
lines = lines.map((line) => {
  const m = line.match(/^(\s*)const\s+(\w+)\s*=\s*lazy\(\($/);
  if (!m) return line;
  const indent = m[1];
  const name = m[2];
  const completed = `${indent}const ${name} = lazy(() => import('./pages/${name}'))`;
  console.log(`🔧 Fixed truncated line → ${completed}`);
  fixed++;
  return completed;
});

// 2. Dedupe: keep only the first declaration of each lazy page
const seen = new Set();
lines = lines.filter((line) => {
  const m = line.match(/^\s*const\s+(\w+)\s*=\s*lazy\(/);
  if (!m) return true;
  if (seen.has(m[1])) {
    console.log(`🧹 Removed duplicate: ${line.trim()}`);
    return false;
  }
  seen.add(m[1]);
  return true;
});

fs.writeFileSync(appPath, lines.join('\n'), 'utf8');

// 3. Print the relevant window for confirmation
const after = fs.readFileSync(appPath, 'utf8').split('\n');
console.log('');
console.log(`✅ Fixed ${fixed} truncated line(s).`);
console.log('');
console.log('Lines 183–190 now look like:');
after.slice(182, 190).forEach((l, i) => console.log(`  ${183 + i}: ${l}`));
