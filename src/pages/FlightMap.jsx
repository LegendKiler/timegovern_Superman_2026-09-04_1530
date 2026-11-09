import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { setPageMeta } from '../lib/seo';
import HubExtras from '../components/HubExtras';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom plane icon
const planeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function FlightMap() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default London
  const [mapZoom, setMapZoom] = useState(6);

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
          `https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${radius}`
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

  const handleSearch = (e) => {
    e.preventDefault();
    const hex = e.target.elements.hex.value.toUpperCase().trim();
    if (!hex) return;
    
    const found = planes.find(p => p.hex.toUpperCase() === hex);
    if (found) {
      setMapCenter([found.lat, found.lon]);
      setMapZoom(9);
    } else {
      alert(`Aircraft ${hex} not found in the current live data.`);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ marginBottom: '20px', background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
          Live World Flight Map
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
          Watch aircraft move in real time. Filter by ICAO24 hex code.
        </p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            name="hex"
            placeholder="ICAO24 hex (e.g., 896448)" 
            style={{ flex: 1, minWidth: '250px', padding: '12px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: 'white' }}
          />
          <button type="submit" style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Find Aircraft
          </button>
        </form>
      </div>

      <div style={{ height: '600px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
        {loading && planes.length === 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '1.2rem' }}>
            Connecting to live flight network...
          </div>
        )}
        
        {error && (
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: '6px', zIndex: 1000, fontWeight: 'bold' }}>
            {error}
          </div>
        )}
        
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
  url="https://tiles.openfreemap.org/styles/dark"
  attribution='&copy; <a href="https://openfreemap.org/">OpenFreeMap</a>'
/>
          {planes.map((plane) => (
            <Marker key={plane.hex} position={[plane.lat, plane.lon]} icon={planeIcon}>
              <Popup>
                <div style={{ color: '#000', fontFamily: 'sans-serif' }}>
                  <strong>Flight: {plane.flight ? plane.flight.trim() : 'Unknown'}</strong><br/>
                  Hex Code: {plane.hex}<br/>
                  Altitude: {plane.alt_baro || 'N/A'} ft<br/>
                  Speed: {plane.gs || 'N/A'} kts
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Real-time positions</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Aircraft positions update every few seconds from the community ADS-B network.</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Worldwide coverage</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Millions of aircraft transmissions received daily across 250+ countries.</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Coverage varies</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Some regions may show fewer aircraft depending on receiver density.</p>
        </div>
      </div>

    <HubExtras category="travel" />
      </div>
  );
}