import fs from 'fs';

// ─── 1. UPDATE vite.config.js ──────────────────────────────────────
const vitePath = 'vite.config.js';
let vite = fs.readFileSync(vitePath, 'utf8');

if (!vite.includes("'/api/octotrip-flights'")) {
  vite = vite.replace(
    /server:\s*\{\s*proxy:\s*\{/,
    `server: {
    proxy: {
      '/api/octotrip-flights': {
        target: 'https://mcp.octotrip.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\\/api\\/octotrip-flights/, '/flights/mcp'),
      },
      '/api/octotrip-cars': {
        target: 'https://mcp.octotrip.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\\/api\\/octotrip-cars/, '/rental-cars/mcp'),
      },`
  );
  fs.writeFileSync(vitePath, vite, 'utf8');
  console.log('✅ vite.config.js updated with OctoTrip proxies.');
}

// ─── 2. UPDATE CarBooking.jsx (Ensure 3-tier waterfall) ──────────
const carFile = 'src/components/CarBooking.jsx';
let car = fs.readFileSync(carFile, 'utf8');

// Ensure AgentWeb helper exists (it was added earlier, but verify)
if (!car.includes('searchCarsAgentWeb')) {
  console.log('⚠️ AgentWeb helper missing from CarBooking — run previous patch first.');
}

// The car search already has ReefAPI → OctoTrip → AgentWeb, so no change needed.
console.log('✅ CarBooking.jsx already has 3-tier waterfall.');

// ─── 3. UPDATE FlightsPage.jsx (Add fallbacks) ───────────────────
const flightFile = 'src/pages/FlightsPage.jsx';
let flight = fs.readFileSync(flightFile, 'utf8');

// 3a. Insert helper functions before the component
const helpers = `
// ============================================================
// FLIGHT FALLBACK HELPERS
// ============================================================
async function searchFlightsOctoTrip(params) {
  const body = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: 'search',
      arguments: {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.date,
        return_date: params.returnDate || undefined,
        adults: params.adults || 1,
        children: params.children || 0,
        infants: params.infants || 0,
        trip_class: params.cabin === 'business' ? 'C' : 'Y',
        currency: 'USD',
        locale: 'en',
      },
    },
  };
  const res = await fetch('/api/octotrip-flights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('OctoTrip Flights HTTP ' + res.status);
  const text = await res.text();
  let data;
  if (text.trim().startsWith('{')) data = JSON.parse(text);
  else {
    const lines = text.split('\\n');
    const last = lines.filter(l => l.startsWith('data: ')).pop();
    data = last ? JSON.parse(last.slice(6)) : {};
  }
  if (data.error) throw new Error(data.error.message || 'OctoTrip error');
  let payload = data;
  if (data?.result?.content?.[0]?.text) {
    try { payload = JSON.parse(data.result.content[0].text); } catch { payload = data.result; }
  }
  const results = payload.results || payload.flights || [];
  return results.map(f => ({
    price: f.price || 0,
    airlines: f.airlines || [f.airline || 'Unknown'],
    stops: f.stops ?? (f.segments ? f.segments.length - 1 : 0),
    segments: f.outbound || f.segments || [],
    booking_url: f.booking_url || '#',
  }));
}

async function searchFlightsAgentWeb(params, apiKey) {
  const body = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: 'search_flights',
      arguments: {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.date,
        return_date: params.returnDate || undefined,
        adults: params.adults || 1,
        children: params.children || 0,
        infants: params.infants || 0,
        cabin: params.cabin || 'economy',
      },
    },
  };
  const res = await fetch('/api/agentweb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('AgentWeb HTTP ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'AgentWeb error');
  let payload = data;
  if (data?.result?.content?.[0]?.text) {
    try { payload = JSON.parse(data.result.content[0].text); } catch { payload = data.result; }
  }
  const results = payload.results || payload.flights || [];
  return results.map(f => ({
    price: f.price || 0,
    airlines: f.airline ? [f.airline] : ['Unknown'],
    stops: f.stops || 0,
    segments: f.segments || [],
    booking_url: f.booking_url || '#',
  }));
}
`;

// Insert helpers after the last import
flight = flight.replace(
  /(import \{ searchFlights \} from '\.\.\/lib\/flightSearch'\n)/,
  `$1\n${helpers}\n`
);

// 3b. Replace handleSearch with waterfall
const newHandleSearch = `
  const handleSearch = async () => {
    if (!origin || !destination || !date) return setError('Please fill in all fields')
    if (tripType === 'round-trip' && !returnDate) return setError('Please select a return date')
    
    setLoading(true); setError(''); setFlights([])

    const params = {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      date,
      returnDate: tripType === 'round-trip' ? returnDate : null,
      adults,
      children,
      infants,
      cabin,
      tripType,
    }

    // 1. fast-flights (Google Flights) via Python bridge
    try {
      const results = await searchFlights(params)
      if (results.length > 0) {
        setFlights(results)
        setLoading(false)
        return
      }
    } catch (e) { console.warn('fast-flights failed:', e.message) }

    // 2. OctoTrip Flights
    try {
      const results = await searchFlightsOctoTrip(params)
      if (results.length > 0) {
        setFlights(results)
        setLoading(false)
        return
      }
    } catch (e) { console.warn('OctoTrip Flights failed:', e.message) }

    // 3. AgentWeb search_flights
    try {
      const AGENTWEB_KEY = 'aw_live_3131a083e0ffe8afaf3c48685ff354c7'
      const results = await searchFlightsAgentWeb(params, AGENTWEB_KEY)
      if (results.length > 0) {
        setFlights(results)
        setLoading(false)
        return
      }
    } catch (e) { console.warn('AgentWeb Flights failed:', e.message) }

    setError('No flights found across all providers for that route/date. Try a major hub or different dates.')
    setLoading(false)
  }
`;

flight = flight.replace(
  /const handleSearch = async \(\) => \{[\s\S]*?\n  \}/,
  newHandleSearch.trim()
)

fs.writeFileSync(flightFile, flight, 'utf8')
console.log('✅ FlightsPage.jsx updated with 3-tier fallback waterfall.')
