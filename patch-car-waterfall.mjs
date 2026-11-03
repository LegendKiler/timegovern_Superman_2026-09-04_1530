const fs = require('fs');
const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

// 1. Replace the error display block with the new, polished UI
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
                <button onClick={() => { setError(''); setForm(prev => ({ ...prev, location: 'Dubai' })); }} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">Try Dubai</button>
                <button onClick={() => { setError(''); setForm(prev => ({ ...prev, location: 'London' })); }} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">Try London</button>
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

// 2. Add the two new fallback functions before the main component
const newFallbacks = `
// ============================================================
// BOOSTEDTRAVEL CAR SEARCH (Fallback #3)
// ============================================================
async function searchCarsBoosted(form) {
  const response = await fetch('/api/boosted/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: form.location,
      pickup_date: form.pickupDate,
      dropoff_date: form.dropoffDate,
      driver_age: parseInt(form.age),
    }),
  });
  if (!response.ok) throw new Error('BoostedTravel HTTP ' + response.status);
  const data = await response.json();
  return (data.results || []).map(c => ({
    name: c.vehicle || c.name || 'Rental car',
    vendor: c.supplier || 'Unknown',
    price: c.price || 0,
    currency: c.currency || form.currency,
    category: c.category || 'Vehicle',
    transmission: c.transmission || 'Automatic',
    passengers: c.passengers || 5,
    bags: c.bags || 2,
    air_con: true,
    fuel_policy: c.fuel_policy || 'Full-Full',
    mileage: c.mileage || 'Limited',
    image_url: c.image_url || '',
    booking_url: c.booking_url || '#',
    free_cancellation: c.free_cancellation || false,
    sipp: c.sipp || 'CAR',
    rental_days: c.rental_days || 1,
    price_per_day: c.price_per_day || null,
  }));
}

// ============================================================
// LETSFG CAR SEARCH (Fallback #4) — local, no API key
// ============================================================
async function searchCarsLetsFG(form) {
  const response = await fetch('/api/letsfg/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: form.location,
      pickup_date: form.pickupDate,
      dropoff_date: form.dropoffDate,
    }),
  });
  if (!response.ok) throw new Error('LetsFG HTTP ' + response.status);
  const data = await response.json();
  return (data.results || []).map(c => ({
    name: c.vehicle || 'Rental car',
    vendor: c.supplier || 'Unknown',
    price: c.price || 0,
    currency: c.currency || form.currency,
    category: c.category || 'Vehicle',
    transmission: c.transmission || 'Automatic',
    passengers: c.passengers || 5,
    bags: c.bags || 2,
    air_con: true,
    fuel_policy: 'Full-Full',
    mileage: 'Limited',
    image_url: c.image_url || '',
    booking_url: c.booking_url || '#',
    free_cancellation: false,
    sipp: 'CAR',
    rental_days: c.rental_days || 1,
    price_per_day: null,
  }));
}
`;

// Insert before the main component
s = s.replace(
  /export default function CarBooking\(\) \{/,
  newFallbacks + '\n\nexport default function CarBooking() {'
);

// 3. Replace the searchCars function to include all 4 providers
const newSearchLogic = `
  const searchCars = async () => {
    if (!form.location) return setError('Please enter a pickup location');
    if (!form.pickupDate || !form.dropoffDate) return setError('Please select pickup and dropoff dates');
    if (new Date(form.dropoffDate) <= new Date(form.pickupDate)) return setError('Dropoff date must be after pickup date');

    setLoading(true);
    setError('');
    setCars([]);
    setPriceFilter('all');

    // ---- 1. Try OctoTrip (Free, no key) ----
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
          if (results.length > 0) { setCars(results); setLoading(false); return; }
        }
      }
    } catch (e) { console.warn('OctoTrip failed:', e.message); }

    // ---- 2. Try AgentWeb ----
    try {
      const agentResults = await searchCarsAgentWeb(form, 'aw_live_3131a083e0ffe8afaf3c48685ff354c7');
      if (agentResults.length > 0) { setCars(agentResults); setLoading(false); return; }
    } catch (e) { console.warn('AgentWeb failed:', e.message); }

    // ---- 3. Try BoostedTravel ----
    try {
      const boostedResults = await searchCarsBoosted(form);
      if (boostedResults.length > 0) { setCars(boostedResults); setLoading(false); return; }
    } catch (e) { console.warn('BoostedTravel failed:', e.message); }

    // ---- 4. Try LetsFG (local, no key) ----
    try {
      const letsfgResults = await searchCarsLetsFG(form);
      if (letsfgResults.length > 0) { setCars(letsfgResults); setLoading(false); return; }
    } catch (e) { console.warn('LetsFG failed:', e.message); }

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
console.log('✅ Car booking updated: 4-provider waterfall + polished error UI.');
