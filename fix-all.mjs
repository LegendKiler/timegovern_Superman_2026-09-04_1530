import fs from 'fs';

// 1. UPDATE VITE.CONFIG.JS TO ADD AGENTWEB PROXY
const viteConfigPath = 'vite.config.js';
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
if (!viteConfig.includes("'/api/agentweb'")) {
  viteConfig = viteConfig.replace(
    /server:\s*\{\s*proxy:\s*\{/,
    `server: {
    proxy: {
      '/api/agentweb': {
        target: 'https://mcp.agentweb.us',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\\/api\\/agentweb/, '/mcp'),
      },`
  );
  fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
  console.log('✅ Vite config updated with AgentWeb proxy.');
}

// 2. UPDATE CARBOOKING.JSX
const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

// --- A. Polished Error UI ---
const newErrorUI = `
      {error && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                No vehicles found at {form.location}
              </h3>
              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
                We checked all partner providers — none have inventory here for your dates.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => { setError(''); setForm(prev => ({ ...prev, location: 'Dubai', currency: 'AED' })); }} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">Try Dubai</button>
                <button onClick={() => { setError(''); setForm(prev => ({ ...prev, location: 'London', currency: 'GBP' })); }} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">Try London</button>
                <button onClick={() => setError('')} className="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

s = s.replace(
  /\{error && \(\s*<div className="mt-4 bg-red-50[\s\S]*?<\/div>\s*\)\}/,
  newErrorUI.trim()
);

// --- B. Replace searchCars logic (OctoTrip + AgentWeb Fallback) ---
const newSearchLogic = `
  const searchCars = async () => {
    if (!form.location) return setError('Please enter a pickup location');
    if (!form.pickupDate || !form.dropoffDate) return setError('Please select pickup and dropoff dates');
    if (new Date(form.dropoffDate) <= new Date(form.pickupDate)) return setError('Dropoff date must be after pickup date');

    setLoading(true);
    setError('');
    setCars([]);
    setPriceFilter('all');

    // ---- 1. Try AgentWeb (Primary) ----
    try {
      const agentResults = await searchCarsAgentWeb(form, 'aw_live_3131a083e0ffe8afaf3c48685ff354c7');
      if (agentResults.length > 0) {
        setCars(agentResults);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('AgentWeb failed:', e.message);
    }

    // ---- 2. Try OctoTrip (Fallback) ----
    try {
      const res = await fetch('/api/octotrip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: Date.now(), method: 'tools/call',
          params: { name: 'search', arguments: {
            location: form.location, pickup_date: form.pickupDate, dropoff_date: form.dropoffDate,
            pickup_time: form.pickupTime, dropoff_time: form.dropoffTime,
            age: parseInt(form.age), currency: form.currency, language: 'en',
          }},
        }),
      });
      if (res.ok) {
        const data = await parseSSE(res);
        if (data?.result?.content?.[0]?.text) {
          const payload = JSON.parse(data.result.content[0].text);
          const results = payload.results || payload.cars || [];
          if (results.length > 0) {
            setCars(results);
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('OctoTrip failed:', e.message);
    }

    // ---- All failed ----
    setError('No vehicles found at ' + form.location + ' for those dates across all providers.');
    setLoading(false);
  };
`;

s = s.replace(
  /const searchCars = async \(\) => \{[\s\S]*?\n  \};/,
  newSearchLogic.trim()
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ CarBooking.jsx updated with AgentWeb primary + OctoTrip fallback + polished UI.');
