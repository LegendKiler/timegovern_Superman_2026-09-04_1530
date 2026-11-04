const BRIDGE_URL = 'https://timegovern-flights.onrender.com';

export async function searchFlights({ origin, destination, date, returnDate, adults = 1, children = 0, infants = 0, cabin = 'economy', tripType = 'one-way' }) {
  const res = await fetch(`${BRIDGE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, date, returnDate, adults, children, infants, cabin, tripType }),
  });
  if (!res.ok) throw new Error(`Bridge HTTP ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Search failed');
  return data.flights || [];
}

export async function searchMultiDates({ origin, destination, centerDate, daysAround = 3, adults = 1, cabin = 'economy' }) {
  const res = await fetch(`${BRIDGE_URL}/search-multi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, centerDate, daysAround, adults, cabin }),
  });
  if (!res.ok) throw new Error(`Bridge HTTP ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Multi-date search failed');
  return data.results || [];
}

export async function searchFlightsOctoTrip(params) {
  const body = {
    jsonrpc: '2.0', id: Date.now(), method: 'tools/call',
    params: {
      name: 'search',
      arguments: {
        origin: params.origin, destination: params.destination,
        departure_date: params.date, return_date: params.returnDate || undefined,
        adults: params.adults || 1, children: params.children || 0, infants: params.infants || 0,
        trip_class: params.cabin === 'business' ? 'C' : 'Y',
        currency: 'USD', locale: 'en',
      },
    },
  };
  const res = await fetch('/api/octotrip-flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('OctoTrip Flights HTTP ' + res.status);
  const text = await res.text();
  let data;
  if (text.trim().startsWith('{')) data = JSON.parse(text);
  else {
    const last = text.split('\n').filter(l => l.startsWith('data: ')).pop();
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

export async function searchFlightsAgentWeb(params, apiKey) {
  const body = {
    jsonrpc: '2.0', id: Date.now(), method: 'tools/call',
    params: {
      name: 'search_flights',
      arguments: {
        origin: params.origin, destination: params.destination,
        departure_date: params.date, return_date: params.returnDate || undefined,
        adults: params.adults || 1, children: params.children || 0, infants: params.infants || 0,
        cabin: params.cabin || 'economy',
      },
    },
  };
  const res = await fetch('/api/agentweb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
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
