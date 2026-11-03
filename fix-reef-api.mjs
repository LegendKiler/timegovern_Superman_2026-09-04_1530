import fs from 'fs';

// 1. UPDATE VITE.CONFIG.JS TO ADD REEFAPI PROXY
const viteConfigPath = 'vite.config.js';
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
if (!viteConfig.includes("'/api/reef'")) {
  viteConfig = viteConfig.replace(
    /server:\s*\{\s*proxy:\s*\{/,
    `server: {
    proxy: {
      '/api/reef': {
        target: 'https://api.reefapi.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\\/api\\/reef/, ''),
      },`
  );
  fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
  console.log('✅ Vite config updated with ReefAPI proxy.');
}

// 2. UPDATE CARBOOKING.JSX
const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

// --- A. Insert the correct ReefAPI search function ---
const reefHelper = `
// ============================================================
// REEFAPI CAR SEARCH (Real Global Inventory)
// ============================================================
async function searchCarsReefAPI(form, apiKey) {
  // Step 1: Autocomplete to get place_id, city_id, country_id
  const autoRes = await fetch('/api/reef/car-rental/v1/cars/autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ query: form.location }),
  });
  if (!autoRes.ok) throw new Error('ReefAPI autocomplete HTTP ' + autoRes.status);
  const autoData = await autoRes.json();
  
  // ReefAPI wraps the response in a 'data' object. Handle both common shapes.
  const places = autoData.data?.results || autoData.data || autoData.results || autoData;
  const place = Array.isArray(places) ? places[0] : places;

  if (!place || !place.place_id) {
    throw new Error('Location not found by ReefAPI');
  }

  // Step 2: Search cars using the resolved IDs
  const searchRes = await fetch('/api/reef/car-rental/v1/cars/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({
      place_id: place.place_id,
      city_id: place.city_id,
      country_id: place.country_id,
      pickup_date: form.pickupDate,
      dropoff_date: form.dropoffDate,
      pickup_time: form.pickupTime,
      dropoff_time: form.dropoffTime,
      driver_age: parseInt(form.age),
      currency: form.currency,
    }),
  });
  if (!searchRes.ok) throw new Error('ReefAPI search HTTP ' + searchRes.status);
  const searchData = await searchRes.json();
  
  const offers = searchData.data?.offers || searchData.offers || [];
  return offers.map(o => ({
    name: o.vehicle?.name || 'Rental car',
    vendor: o.supplier?.name || 'Unknown',
    price: o.price?.amount || 0,
    currency: o.price?.currency || form.currency,
    category: o.vehicle?.category || 'Vehicle',
    transmission: o.vehicle?.transmission || 'Automatic',
    passengers: o.vehicle?.seats || 5,
    bags: o.vehicle?.bags || 2,
    air_con: o.vehicle?.air_conditioning !== false,
    fuel_policy: o.vehicle?.fuel_type || 'Full-Full',
    mileage: o.mileage || 'Limited',
    image_url: o.vehicle?.image || '',
    booking_url: o.book_url || '#',
    free_cancellation: o.free_cancellation || false,
    sipp: o.vehicle?.acriss || 'CAR',
    rental_days: o.price?.rental_days || 1,
    price_per_day: o.price?.daily || null,
  }));
}
`;

// Replace any existing ReefAPI helper (in case it was added before)
s = s.replace(/\/\/ ============================================================[\s\S]*?REEFAPI CAR SEARCH[\s\S]*?\n}\n/, '');
s = s.replace(
  /export default function CarBooking\(\) \{/,
  reefHelper + '\n\nexport default function CarBooking() {'
);

// --- B. Replace the search logic to make ReefAPI primary ---
const newSearchLogic = `
  const searchCars = async () => {
    if (!form.location) return setError('Please enter a pickup location');
    if (!form.pickupDate || !form.dropoffDate) return setError('Please select pickup and dropoff dates');
    if (new Date(form.dropoffDate) <= new Date(form.pickupDate)) return setError('Dropoff date must be after pickup date');

    setLoading(true);
    setError('');
    setCars([]);
    setPriceFilter('all');

    const cleanLocation = form.location.split(',')[0].trim(); // Send "Dubai", not "Dubai, UAE"
    let apiSuccess = false;

    // ---- 1. REEFAPI (Primary - Real Global Inventory) ----
    try {
      const REEF_KEY = 'ak_live_I_VJiCt2Rc96nZle4h10DAYIRr_3Qu_r';
      const reefResults = await searchCarsReefAPI({ ...form, location: cleanLocation }, REEF_KEY);
      if (reefResults.length > 0) {
        setCars(reefResults);
        setLoading(false);
        apiSuccess = true;
      }
    } catch (e) {
      console.warn('ReefAPI failed:', e.message);
    }

    // ---- 2. OctoTrip (Fallback) ----
    if (!apiSuccess) {
      try {
        const res = await fetch('/api/octotrip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
          body: JSON.stringify({
            jsonrpc: '2.0', id: Date.now(), method: 'tools/call',
            params: { name: 'search', arguments: {
              location: cleanLocation, pickup_date: form.pickupDate, dropoff_date: form.dropoffDate,
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
              apiSuccess = true;
            }
          }
        }
      } catch (e) { console.warn('OctoTrip failed:', e.message); }
    }

    // ---- 3. AgentWeb (Secondary Fallback) ----
    if (!apiSuccess) {
      try {
        const agentResults = await searchCarsAgentWeb({ ...form, location: cleanLocation }, 'aw_live_3131a083e0ffe8afaf3c48685ff354c7');
        if (agentResults.length > 0) {
          setCars(agentResults);
          setLoading(false);
          apiSuccess = true;
        }
      } catch (e) { console.warn('AgentWeb failed:', e.message); }
    }

    // ---- All failed ----
    if (!apiSuccess) {
      setError('No vehicles found at ' + form.location + ' for those dates across all providers. Try a major hub like Dubai, London, or Istanbul.');
    }
    setLoading(false);
  };
`;

// Replace the existing searchCars function
const startToken = 'const searchCars = async () => {';
const endToken = 'const handleSaveBooking = async (car) => {';
const startIndex = s.indexOf(startToken);
const endIndex = s.indexOf(endToken);

if (startIndex !== -1 && endIndex !== -1) {
  s = s.slice(0, startIndex) + newSearchLogic.trim() + '\n\n  ' + s.slice(endIndex);
}

fs.writeFileSync(file, s, 'utf8');
console.log('✅ CarBooking.jsx updated: ReefAPI is now the primary provider with your real key.');
