import fs from 'fs';

const appPath = 'src/App.jsx';
const backupPath = 'src/App.jsx.bak-pre-lazy-fix';

// Safety backup
fs.copyFileSync(appPath, backupPath);
console.log(`✅ Backup saved: ${backupPath}`);

let lines = fs.readFileSync(appPath, 'utf8').split('\n');
let fixed = 0;

lines = lines.map((line) => {
  // Only touch lines that START with "const X = lazy"
  const m = line.match(/^(\s*)const\s+(\w+)\s*=\s*lazy\b/);
  if (!m) return line;

  const indent = m[1];
  const name = m[2];
  const trimmed = line.trimEnd();

  // A complete line must contain "=>" and end with "))" 
  if (line.includes('=>') && trimmed.endsWith('))')) {
    return line; // Already valid
  }

  // Otherwise rebuild the full statement
  const completed = `${indent}const ${name} = lazy(() => import('./pages/${name}'))`;
  console.log(`🔧 FIXED: ${JSON.stringify(line)}`);
  console.log(`      →  ${completed}`);
  fixed++;
  return completed;
});

// Dedupe any duplicate lazy declarations (keep first occurrence)
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

// Verify
const after = fs.readFileSync(appPath, 'utf8').split('\n');
console.log('');
console.log(`✅ Fixed ${fixed} line(s). Lines 183–190 now look like:`);
after.slice(182, 190).forEach((l, i) => console.log(`  ${183 + i}: ${l}`));

// Sanity check: look for any remaining broken "lazy(" lines
const broken = after.filter(l => /\blazy\(/.test(l) && !l.includes('=>'));
if (broken.length === 0) {
  console.log('');
  console.log('✅ No remaining broken lazy() lines.');
} else {
  console.log('');
  console.log('⚠️  Still broken lines:');
  broken.forEach(l => console.log(`   ${l}`));
}
