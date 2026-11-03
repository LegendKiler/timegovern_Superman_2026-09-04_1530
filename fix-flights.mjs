import fs from 'fs';
import { execSync } from 'child_process';

// ─── 1. Fixed search.py (v3 API, clean JSON) ──────────────────────
const searchPy = `import json
import sys
from fast_flights import FlightQuery, Passengers, create_query, get_flights


def search_flights(origin, destination, date, adults=1, seat='economy', trip='one-way'):
    # Redirect stdout to stderr so any library logs don't corrupt JSON
    _stdout = sys.stdout
    sys.stdout = sys.stderr
    try:
        query = create_query(
            flights=[FlightQuery(date=date, from_airport=origin, to_airport=destination)],
            seat=seat, trip=trip,
            passengers=Passengers(adults=adults),
        )
        results = get_flights(query)
    finally:
        sys.stdout = _stdout

    output = []
    for flight in results:
        segments = []
        for seg in (flight.flights or []):
            segments.append({
                'from': {'code': seg.from_airport.code, 'name': seg.from_airport.name},
                'to': {'code': seg.to_airport.code, 'name': seg.to_airport.name},
                'departure': {
                    'date': f"{seg.departure.date[0]}-{seg.departure.date[1]:02d}-{seg.departure.date[2]:02d}",
                    'time': f"{seg.departure.time[0]:02d}:{seg.departure.time[1]:02d}",
                },
                'arrival': {
                    'date': f"{seg.arrival.date[0]}-{seg.arrival.date[1]:02d}-{seg.arrival.date[2]:02d}",
                    'time': f"{seg.arrival.time[0]:02d}:{seg.arrival.time[1]:02d}",
                },
                'duration_min': seg.duration,
                'plane': seg.plane_type,
            })
        carbon = flight.carbon
        output.append({
            'price': flight.price,
            'airlines': flight.airlines,
            'type': flight.type,
            'segments': segments,
            'stops': len(segments) - 1,
            'carbon': {
                'typical': carbon.typical_on_route if carbon else None,
                'this_flight': carbon.emission if carbon else None,
            },
        })
    return output


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(json.dumps({'error': 'Usage: python search.py ORIGIN DEST YYYY-MM-DD [adults]'}))
        sys.exit(1)
    origin = sys.argv[1].upper()
    destination = sys.argv[2].upper()
    date = sys.argv[3]
    adults = int(sys.argv[4]) if len(sys.argv) > 4 else 1
    try:
        flights = search_flights(origin, destination, date, adults=adults)
        print(json.dumps({'success': True, 'count': len(flights), 'flights': flights}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.exit(1)
`;
fs.writeFileSync('flights-skill/search.py', searchPy, 'utf8');
console.log('✅ search.py rewritten for fast-flights v3');

// ─── 2. Flask bridge ─────────────────────────────────────────────
const bridgePy = `from flask import Flask, request, jsonify
from flask_cors import CORS
from search import search_flights

app = Flask(__name__)
CORS(app)


@app.route('/search', methods=['POST'])
def search():
    data = request.json or {}
    try:
        flights = search_flights(
            origin=data.get('origin', 'LHR').upper(),
            destination=data.get('destination', 'JFK').upper(),
            date=data.get('date', '2027-01-15'),
            adults=int(data.get('adults', 1)),
        )
        return jsonify({'success': True, 'count': len(flights), 'flights': flights})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    print('Bridge running on http://localhost:5000')
    app.run(port=5000, host='0.0.0.0', debug=False)
`;
fs.writeFileSync('flights-skill/bridge.py', bridgePy, 'utf8');
console.log('✅ bridge.py created');

// ─── 3. Install Flask into the venv ──────────────────────────────
try {
    console.log('Installing Flask + flask-cors into venv...');
    execSync('.\\venv\\Scripts\\pip install flask flask-cors', { cwd: 'flights-skill', stdio: 'inherit' });
    console.log('✅ Flask installed');
} catch (e) {
    console.log('⚠️  pip install failed — run manually: cd flights-skill; .\\venv\\Scripts\\activate; pip install flask flask-cors');
}

// ─── 4. React helper ─────────────────────────────────────────────
if (!fs.existsSync('src/lib')) fs.mkdirSync('src/lib', { recursive: true });
const helper = `const BRIDGE_URL = 'http://localhost:5000';

export async function searchFlights({ origin, destination, date, adults = 1 }) {
  const res = await fetch(\`\${BRIDGE_URL}/search\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, date, adults }),
  });
  if (!res.ok) throw new Error(\`Bridge HTTP \${res.status}\`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Search failed');
  return data.flights || [];
}
`;
fs.writeFileSync('src/lib/flightSearch.js', helper, 'utf8');
console.log('✅ src/lib/flightSearch.js created');

// ─── 5. Backup + replace FlightsPage.jsx ─────────────────────────
const pagePath = 'src/pages/FlightsPage.jsx';
if (fs.existsSync(pagePath)) {
    fs.copyFileSync(pagePath, pagePath + '.bak');
    console.log('✅ FlightsPage.jsx backed up → FlightsPage.jsx.bak');
}

const newPage = `import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Sparkles, Search, Loader2, AlertCircle, ArrowRight, Clock, MapPin, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import { searchFlights } from '../lib/flightSearch'

export default function FlightsPage() {
  const [origin, setOrigin] = useState('LHR')
  const [destination, setDestination] = useState('JFK')
  const [date, setDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [flights, setFlights] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Flights - Live Search Worldwide | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Live flight prices from Google Flights worldwide. No signup, no ads.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])

  const handleSearch = async () => {
    if (!origin || !destination || !date) return setError('Please fill in all fields')
    setLoading(true); setError(''); setFlights([])
    try {
      const results = await searchFlights({ origin: origin.toUpperCase(), destination: destination.toUpperCase(), date, adults: 1 })
      if (results.length === 0) setError('No flights found for that route/date.')
      else setFlights(results)
    } catch (err) {
      setError('Cannot reach the flight search server. Make sure to run "python bridge.py" in flights-skill. Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-6xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-blue-950 to-indigo-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-sky-200">Live Google Flights · Real Prices</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <Plane className="h-10 w-10 md:h-14 md:w-14 text-sky-300" />
              Flights
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Search live flight prices worldwide with real Google Flights data. No signup. No ads on tool pages.
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> From (IATA)</label>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="LHR" className="h-11" maxLength={3} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> To (IATA)</label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="JFK" className="h-11" maxLength={3} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11" />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading} className="w-full h-11 bg-gradient-to-r from-sky-600 to-blue-600 hover:opacity-90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {flights.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black">{flights.length} Flights Found</h2>
              <span className="text-sm text-muted-foreground">Sorted by price</span>
            </div>
            <div className="grid gap-4">
              {flights.map((flight, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold">{flight.airlines.join(' + ')}</span>
                          <span className={'text-xs px-2 py-0.5 rounded-full ' + (flight.stops === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                            {flight.stops === 0 ? 'Direct' : flight.stops + ' stop' + (flight.stops > 1 ? 's' : '')}
                          </span>
                        </div>
                        {flight.segments.map((seg, i) => (
                          <div key={i} className="text-sm text-muted-foreground mb-1">
                            <span className="font-mono">{seg.departure.time}</span> {seg.from.code}
                            <ArrowRight className="h-3 w-3 inline mx-1" />
                            <span className="font-mono">{seg.arrival.time}</span> {seg.to.code}
                            <span className="ml-2 text-xs">({Math.floor(seg.duration_min / 60)}h {seg.duration_min % 60}m)</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary">{'$' + flight.price}</div>
                        <div className="text-xs text-muted-foreground">per adult</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Related tools</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <Link to="/flight-map" className="block rounded-xl border border-border bg-card hover:border-sky-400 p-5 transition-colors">
              <Plane className="h-5 w-5 text-sky-500 mb-2" /><h3 className="font-bold mb-1">Live Flight Map</h3>
              <p className="text-xs text-muted-foreground">Track flights in real time.</p>
            </Link>
            <Link to="/cars" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors">
              <MapPin className="h-5 w-5 text-emerald-500 mb-2" /><h3 className="font-bold mb-1">Car Rental</h3>
              <p className="text-xs text-muted-foreground">Rent cars worldwide.</p>
            </Link>
            <Link to="/my-bookings" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors">
              <Clock className="h-5 w-5 text-indigo-500 mb-2" /><h3 className="font-bold mb-1">My Bookings</h3>
              <p className="text-xs text-muted-foreground">All your saved flights and cars.</p>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title="Flights - TimeGovern" />
        </div>
      </div>
    </>
  )
}
`;
fs.writeFileSync(pagePath, newPage, 'utf8');
console.log('✅ FlightsPage.jsx replaced (backup saved)');

console.log('');
console.log('═══════════════════════════════════════════════');
console.log('DONE. Now start two terminals:');
console.log('═══════════════════════════════════════════════');
console.log('TERMINAL 1 (bridge):');
console.log('  cd flights-skill');
console.log('  .\\venv\\Scripts\\activate');
console.log('  python bridge.py');
console.log('');
console.log('TERMINAL 2 (React):');
console.log('  npm run dev');
console.log('');
console.log('Then open http://localhost:5173/flights and search LHR -> JFK');
