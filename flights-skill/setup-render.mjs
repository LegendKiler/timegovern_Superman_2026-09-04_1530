import fs from 'fs';
import path from 'path';

// ── 1. Ensure flights-skill folder exists ──
const skillDir = 'flights-skill';
if (!fs.existsSync(skillDir)) fs.mkdirSync(skillDir);

// ── 2. Create requirements.txt ──
fs.writeFileSync(path.join(skillDir, 'requirements.txt'), `flask
flask-cors
fast-flights
gunicorn
`, 'utf8');
console.log('✅ flights-skill/requirements.txt created');

// ── 3. Create Procfile (Render uses this to know how to start) ──
fs.writeFileSync(path.join(skillDir, 'Procfile'), `web: gunicorn bridge:app --bind 0.0.0.0:$PORT
`, 'utf8');
console.log('✅ flights-skill/Procfile created');

// ── 4. Create render.yaml (Render Blueprint) ──
fs.writeFileSync(path.join(skillDir, 'render.yaml'), `services:
  - type: web
    name: timegovern-flights
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn bridge:app --bind 0.0.0.0:$PORT
    healthCheckPath: /health
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
`, 'utf8');
console.log('✅ flights-skill/render.yaml created');

// ── 5. Add /health endpoint to bridge.py (if missing) ──
const bridgePath = path.join(skillDir, 'bridge.py');
let bridge = fs.readFileSync(bridgePath, 'utf8');
if (!bridge.includes("/health")) {
  bridge = bridge.replace(
    /@app\.route\('\/rotate', methods=\['POST'\]\)/,
    `@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'timegovern-flights'})

@app.route('/rotate', methods=['POST'])`
  );
  fs.writeFileSync(bridgePath, bridge, 'utf8');
  console.log('✅ /health endpoint added to bridge.py');
} else {
  console.log('ℹ️  /health endpoint already exists in bridge.py');
}

// ── 6. Create GitHub Actions keep-alive workflow ──
const wfDir = '.github/workflows';
if (!fs.existsSync(wfDir)) fs.mkdirSync(wfDir, { recursive: true });

const keepAliveYml = `name: Keep Render Alive
on:
  schedule:
    - cron: '*/14 * * * *' # Every 14 minutes (Render sleeps after 15)
  workflow_dispatch: # Allows manual trigger from GitHub UI

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping TimeGovern Flights
        run: |
          curl -s -o /dev/null -w "HTTP %{http_code}\\n" https://timegovern-flights.onrender.com/health
`;
fs.writeFileSync(path.join(wfDir, 'keep-alive.yml'), keepAliveYml, 'utf8');
console.log('✅ .github/workflows/keep-alive.yml created');

console.log('');
console.log('═══════════════════════════════════════════');
console.log('✅ All Render & Keep-Alive files generated');
console.log('═══════════════════════════════════════════');
console.log('');
console.log('NEXT STEPS:');
console.log('1. Commit and push to GitHub:');
console.log('   git add .');
console.log('   git commit -m "Add Render deployment + keep-alive"');
console.log('   git push');
console.log('');
console.log('2. In Render Dashboard, create a New Web Service:');
console.log('   - Connect your GitHub repo');
console.log('   - Root Directory: flights-skill');
console.log('   - Runtime: Python 3');
console.log('   - Build Command: pip install -r requirements.txt');
console.log('   - Start Command: gunicorn bridge:app --bind 0.0.0.0:$PORT');
console.log('');
console.log('3. Copy your live URL (e.g. https://timegovern-flights.onrender.com)');
console.log('   and update src/lib/flightSearch.js BRIDGE_URL to use it.');
