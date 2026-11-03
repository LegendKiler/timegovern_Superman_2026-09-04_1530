import fs from 'fs';

const file = 'src/pages/FlightMap.jsx';
let s = fs.readFileSync(file, 'utf8');

// Find the existing data-fetching useEffect and replace it.
// We look for the fetch call and replace the entire effect body.
const newFetchEffect = `
  useEffect(() => {
    const fetchLiveFlights = async () => {
      try {
        // ADSB.lol: free, keyless live aircraft positions.
        // This example fetches aircraft within 250nm of a central point.
        // You can change the lat/lon/radius to focus on a specific region.
        const lat = 51.47; // London Heathrow approx
        const lon = -0.45;
        const radius = 250; // nautical miles

        const res = await fetch(
          \`https://api.adsb.lol/v2/lat/\${lat}/lon/\${lon}/dist/\${radius}\`
        );
        if (!res.ok) throw new Error('ADSB.lol HTTP ' + res.status);

        const data = await res.json();
        const aircraft = data.ac || [];

        // Map ADSB.lol aircraft objects to Leaflet marker positions
        const flights = aircraft
          .filter(a => a.lat != null && a.lon != null)
          .map(a => ({
            id: a.hex,
            callsign: a.flight?.trim() || 'Unknown',
            lat: a.lat,
            lon: a.lon,
            altitude: a.alt_baro,
            speed: a.gs,
          }));

        setFlights(flights);
      } catch (err) {
        console.error('Failed to fetch live flights:', err);
        setError('Could not load live flight data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFlights();
    // Refresh every 10 seconds (ADSB.lol is a live feed)
    const interval = setInterval(fetchLiveFlights, 10000);
    return () => clearInterval(interval);
  }, []);
`;

// Replace the existing useEffect that contains the old fetch call.
// This is a simplified replacement; adjust the regex if your file structure differs.
s = s.replace(
  /useEffect\(\(\) => \{[\s\S]*?fetch\([\s\S]*?\)[\s\S]*?\}, \[\]\);/,
  newFetchEffect.trim()
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ FlightMap.jsx patched: Data source replaced with free, keyless ADSB.lol API.');
