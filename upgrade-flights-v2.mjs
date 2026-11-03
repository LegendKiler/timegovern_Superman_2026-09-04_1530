import fs from 'fs';

// ─── 1. UPGRADE search.py (Children & Infants) ──────────────────────
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
        output.append({
            'price': flight.price,
            'airlines': flight.airlines,
            'type': flight.type,
            'segments': segments,
            'stops': len(segments) - 1,
        })
    return output

if __name__ == '__main__':
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
    app.run(port=5000, host='0.0.0.0', debug=False)
`;
fs.writeFileSync('flights-skill/bridge.py', bridgePy, 'utf8');

// ─── 3. FULL REWRITE FlightsPage.jsx ───────────────────────────────
const newPage = `import { useEffect, useState, useMemo } from 'react'
import { Plane, Sparkles, Search, Loader2, AlertCircle, ArrowRight, MapPin, Calendar, Users, SlidersHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { setPageMeta } from '../lib/seo'
import { searchFlights } from '../lib/flightSearch'

export default function FlightsPage() {
  const [origin, setOrigin] = useState('LHR')
  const [destination, setDestination] = useState('JFK')
  const [tripType, setTripType] = useState('round-trip')
  const [date, setDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] })
  const [returnDate, setReturnDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 37); return d.toISOString().split('T')[0] })
  
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabin, setCabin] = useState('economy')
  
  const [loading, setLoading] = useState(false)
  const [flights, setFlights] = useState([])
  const [error, setError] = useState('')

  // Sorting & Filtering State
  const [sortBy, setSortBy] = useState('price')
  const [directOnly, setDirectOnly] = useState(false)

  useEffect(() => {
    document.title = 'Flights - Live Search Worldwide | TimeGovern'
    setPageMeta()
  }, [])

  const handleSearch = async () => {
    if (!origin || !destination || !date) return setError('Please fill in all fields')
    setLoading(true); setError(''); setFlights([])
    try {
      const results = await searchFlights({ 
        origin: origin.toUpperCase(), destination: destination.toUpperCase(), date, 
        returnDate: tripType === 'round-trip' ? returnDate : null,
        adults, children, infants, cabin, tripType
      })
      if (results.length === 0) setError('No flights found.')
      else setFlights(results)
    } catch (err) {
      setError('Cannot reach the flight server. Make sure "python bridge.py" is running.')
    } finally {
      setLoading(false)
    }
  }

  // Sort and Filter Logic
  const processedFlights = useMemo(() => {
    let result = [...flights]
    if (directOnly) result = result.filter(f => f.stops === 0)
    
    result.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'fastest') {
        const aDur = a.segments.reduce((sum, s) => sum + s.duration_min, 0)
        const bDur = b.segments.reduce((sum, s) => sum + s.duration_min, 0)
        return aDur - bDur
      }
      if (sortBy === 'stops') return a.stops - b.stops
      return 0
    })
    return result
  }, [flights, sortBy, directOnly])

  const getBookingLink = () => {
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
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} className="w-4 h-4" />
                <span className="text-sm font-medium">Round-trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} className="w-4 h-4" />
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-semibold mb-1">Adults</label>
                  <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                    {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold mb-1">Children</label>
                  <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold mb-1">Infants</label>
                  <select value={infants} onChange={(e) => setInfants(Number(e.target.value))} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1">Cabin</label>
                <select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {flights.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="w-full md:w-64 space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm">Direct flights only</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results List */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{processedFlights.length} results</h2>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1 bg-background">
                  <option value="price">Cheapest</option>
                  <option value="fastest">Fastest</option>
                  <option value="stops">Fewest Stops</option>
                </select>
              </div>

              {processedFlights.map((flight, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold">{flight.airlines.join(' + ')}</span>
                        <span className={'text-xs px-2 py-0.5 rounded-full ' + (flight.stops === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                          {flight.stops === 0 ? 'Direct' : flight.stops + ' stop' + (flight.stops > 1 ? 's' : '')}
                        </span>
                      </div>
                      {flight.segments.map((seg, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm mb-2">
                          <div className="w-16 font-mono font-medium">{seg.departure.time}</div>
                          <div className="flex-1 flex items-center gap-2 text-muted-foreground">
                            <span className="font-semibold text-foreground">{seg.from.code}</span>
                            <div className="h-px bg-border flex-1 relative">
                              <Plane className="h-3 w-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground bg-card" />
                            </div>
                            <span className="font-semibold text-foreground">{seg.to.code}</span>
                          </div>
                          <div className="w-16 font-mono font-medium text-right">{seg.arrival.time}</div>
                          <div className="w-20 text-xs text-muted-foreground text-right">{Math.floor(seg.duration_min / 60)}h {seg.duration_min % 60}m</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-right flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-3xl font-black text-primary">{'$' + flight.price}</div>
                      <div className="text-xs text-muted-foreground mb-3">per person</div>
                      <a href={getBookingLink()} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
                          Select Flight
                        </Button>
                      </a>
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

console.log('✅ All files upgraded with Advanced UI, Children/Infants, and Sorting/Filtering!');
