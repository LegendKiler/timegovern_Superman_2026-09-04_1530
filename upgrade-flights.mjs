import fs from 'fs';

// ─── 1. UPGRADE search.py ──────────────────────────────────────────
const searchPy = `import json
import sys
from fast_flights import FlightQuery, Passengers, create_query, get_flights

def search_flights(origin, destination, date, return_date=None, adults=1, children=0, infants=0, seat='economy', trip='one-way'):
    _stdout = sys.stdout
    sys.stdout = sys.stderr
    try:
        flights_args = [FlightQuery(date=date, from_airport=origin, to_airport=destination)]
        if trip == 'round-trip' and return_date:
            flights_args.append(FlightQuery(date=return_date, from_airport=destination, to_airport=origin))

        query = create_query(
            flights=flights_args,
            seat=seat,
            trip=trip,
            passengers=Passengers(adults=adults, children=children, infants_in_seat=0, infants_on_lap=infants),
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
        print(json.dumps({'error': 'Usage: python search.py ORIGIN DEST YYYY-MM-DD'}))
        sys.exit(1)
    try:
        flights = search_flights(sys.argv[1].upper(), sys.argv[2].upper(), sys.argv[3])
        print(json.dumps({'success': True, 'count': len(flights), 'flights': flights}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.exit(1)
`;
fs.writeFileSync('flights-skill/search.py', searchPy, 'utf8');

// ─── 2. UPGRADE bridge.py ──────────────────────────────────────────
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
            return_date=data.get('returnDate'),
            adults=int(data.get('adults', 1)),
            children=int(data.get('children', 0)),
            infants=int(data.get('infants', 0)),
            seat=data.get('cabin', 'economy'),
            trip=data.get('tripType', 'one-way')
        )
        return jsonify({'success': True, 'count': len(flights), 'flights': flights})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print('Bridge running on http://localhost:5000')
    app.run(port=5000, host='0.0.0.0', debug=False)
`;
fs.writeFileSync('flights-skill/bridge.py', bridgePy, 'utf8');

// ─── 3. UPGRADE FlightsPage.jsx (FULL UI) ──────────────────────────
const newPage = `import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Sparkles, Search, Loader2, AlertCircle, ArrowRight, MapPin, Calendar, Users, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import { searchFlights } from '../lib/flightSearch'

export default function FlightsPage() {
  const [origin, setOrigin] = useState('LHR')
  const [destination, setDestination] = useState('JFK')
  const [tripType, setTripType] = useState('round-trip')
  const [date, setDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
  })
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 37); return d.toISOString().split('T')[0]
  })
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [cabin, setCabin] = useState('economy')
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
    if (tripType === 'round-trip' && !returnDate) return setError('Please select a return date')
    
    setLoading(true); setError(''); setFlights([])
    try {
      const results = await searchFlights({ 
        origin: origin.toUpperCase(), 
        destination: destination.toUpperCase(), 
        date, 
        returnDate: tripType === 'round-trip' ? returnDate : null,
        adults,
        children,
        cabin,
        tripType
      })
      if (results.length === 0) setError('No flights found for that route/date.')
      else setFlights(results)
    } catch (err) {
      setError('Cannot reach the flight search server. Make sure "python bridge.py" is running. Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate Google Flights Booking Link
  const getBookingLink = (flight) => {
    const q = tripType === 'round-trip' 
      ? \`Flights from \${origin} to \${destination} on \${date} through \${returnDate}\`
      : \`Flights from \${origin} to \${destination} on \${date}\`;
    return \`https://www.google.com/travel/flights?q=\${encodeURIComponent(q)}\`;
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
              Search live flight prices worldwide. No signup. No ads.
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            {/* Trip Type Toggle */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Round-trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">One-way</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> From</label>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="LHR" className="h-11" maxLength={3} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> To</label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="JFK" className="h-11" maxLength={3} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Departure</label>
                <Input type="date" value={date} onClick={(e) => e.target.showPicker?.()} onChange={(e) => setDate(e.target.value)} className="h-11" />
              </div>
              {tripType === 'round-trip' && (
                <div>
                  <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Return</label>
                  <Input type="date" value={returnDate} onClick={(e) => e.target.showPicker?.()} onChange={(e) => setReturnDate(e.target.value)} className="h-11" />
                </div>
              )}
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading} className="w-full h-11 bg-gradient-to-r from-sky-600 to-blue-600 hover:opacity-90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Options Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> Passengers</label>
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full h-11 px-3 border border-border rounded-lg bg-background">
                  {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-primary" /> Cabin</label>
                <select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full h-11 px-3 border border-border rounded-lg bg-background">
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
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
                          <div key={i} className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                            <span className="font-mono font-medium text-foreground">{seg.departure.time}</span> {seg.from.code}
                            <ArrowRight className="h-3 w-3 inline mx-1 text-muted-foreground" />
                            <span className="font-mono font-medium text-foreground">{seg.arrival.time}</span> {seg.to.code}
                            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-md">{Math.floor(seg.duration_min / 60)}h {seg.duration_min % 60}m</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div>
                          <div className="text-2xl font-black text-primary">{'$' + flight.price}</div>
                          <div className="text-xs text-muted-foreground">per adult</div>
                        </div>
                        <a href={getBookingLink(flight)} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm h-9">
                            Book on Google Flights
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
`;
fs.writeFileSync('src/pages/FlightsPage.jsx', newPage, 'utf8');

console.log('✅ All files upgraded successfully!');
console.log('👉 Restart the Python bridge: Ctrl+C, then "python bridge.py"');
