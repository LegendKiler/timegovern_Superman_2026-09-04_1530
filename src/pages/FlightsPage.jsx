import { useEffect, useState, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Plane, Sparkles, Search, Loader2, AlertCircle, ArrowRight, MapPin,
  Calendar, Users, SlidersHorizontal, ShieldCheck, Luggage, RefreshCw,
  X, Heart, TrendingDown, ChevronDown, Clock, Filter
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { setPageMeta } from '../lib/seo'
import { searchFlights, searchMultiDates, searchFlightsOctoTrip, searchFlightsAgentWeb } from '../lib/flightSearch'
import { searchLocations } from '../data/locations'
import HubExtras from '../components/HubExtras';

const AGENTWEB_KEY = 'aw_live_3131a083e0ffe8afaf3c48685ff354c7'
const SAVED_KEY = 'timegovern_saved_searches'

const fmtDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const totalDuration = (flight) => {
  if (!flight) return 0;
  if (flight.legs && Array.isArray(flight.legs)) {
    return flight.legs.reduce((acc, leg) => acc + (leg.duration || 0), 0);
  }
  if (flight.segments && Array.isArray(flight.segments)) {
    return flight.segments.reduce((sum, s) => sum + (s.duration_min || 0), 0);
  }
  return 0;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-40 bg-muted rounded" />
        <div className="h-5 w-20 bg-muted rounded-full" />
      </div>
      <div className="h-4 w-full bg-muted rounded mb-2" />
      <div className="h-4 w-3/4 bg-muted rounded mb-4" />
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="h-3 w-56 bg-muted rounded" />
        <div className="h-8 w-24 bg-muted rounded" />
      </div>
    </div>
  )
}

function TrustRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Secure booking</span>
      <span className="flex items-center gap-1"><Luggage className="h-3 w-3 text-sky-500" /> 1 cabin bag</span>
      <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 text-indigo-500" /> Fare rules apply</span>
    </div>
  )
}

function AutocompleteInput({ label, value, query, setQuery, onSelect, placeholder, dropOpen, setDropOpen }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [setDropOpen])

  const results = query.length > 1 ? searchLocations(query, 10).filter(l => l.type === 'airport') : []

  return (
    <div className="relative" ref={ref}>
      <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
        <MapPin className="h-4 w-4 text-primary" /> {label}
      </label>
      <Input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setDropOpen(true) }}
        onFocus={() => setDropOpen(true)}
        placeholder={placeholder}
        className="h-11"
      />
      {dropOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
          {results.map((loc, i) => (
            <button
              key={i}
              onClick={() => { onSelect(loc); setDropOpen(false) }}
              className="w-full text-left px-3 py-2.5 hover:bg-muted flex items-center gap-3 border-b border-border last:border-0"
            >
              <span className="text-xl">{loc.flag}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm text-foreground truncate">{loc.city} ({loc.id})</div>
                <div className="text-xs text-muted-foreground truncate">{loc.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FlightsPage() {
  const [searchParams] = useSearchParams()

  const [origin, setOrigin] = useState(searchParams.get('from')?.toUpperCase() || 'LHR')
  const [originQuery, setOriginQuery] = useState('London (LHR)')
  const [showOriginDrop, setShowOriginDrop] = useState(false)

  const [destination, setDestination] = useState(searchParams.get('to')?.toUpperCase() || 'JFK')
  const [destQuery, setDestQuery] = useState('New York (JFK)')
  const [showDestDrop, setShowDestDrop] = useState(false)

  const [tripType, setTripType] = useState('round-trip')
  const [date, setDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] })
  const [returnDate, setReturnDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 37); return d.toISOString().split('T')[0] })

  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabin, setCabin] = useState('economy')

  const [loading, setLoading] = useState(false)
  const [limitMessage, setLimitMessage] = useState(null);
  const [flights, setFlights] = useState([])
  const [error, setError] = useState('')

  const [sortBy, setSortBy] = useState('best')
  const [filterAirlines, setFilterAirlines] = useState([])
  const [filterDeparture, setFilterDeparture] = useState('any')
  const [filterStops, setFilterStops] = useState('any')
  const [maxDuration, setMaxDuration] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [priceStrip, setPriceStrip] = useState([])
  const [stripLoading, setStripLoading] = useState(false)

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    document.title = 'Flights - Live Search Worldwide | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Live flight prices from Google Flights worldwide. Filter by airline, time, and stops. No signup.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
    // Check if current search is saved
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
      const exists = saved.some(s => s.origin === origin && s.destination === destination && s.date === date && s.tripType === tripType)
      setIsSaved(exists)
    } catch {}
  }, [])

  const handleSearch = async () => {
    
    // STRICT VALIDATION: Block fake/invalid IATA codes
    const validIATA = /^[A-Z]{3}$/;
    if (!validIATA.test(origin.toUpperCase()) || origin.toUpperCase() === 'XXX') {
      return setError('Invalid origin airport code. Please select a valid city from the dropdown.');
    }
    if (!validIATA.test(destination.toUpperCase()) || destination.toUpperCase() === 'XXX') {
      return setError('Invalid destination airport code. Please select a valid city from the dropdown.');
    }
    if (origin.toUpperCase() === destination.toUpperCase()) {
      return setError('Origin and destination cannot be the same.');
    }

    if (!origin || !destination || !date) return setError('Please fill in all fields')
    if (tripType === 'round-trip' && !returnDate) return setError('Please select a return date')
    // Validate 3-letter IATA codes
    const isValidIATA = (code) => /^[A-Z]{3}$/.test(code) && code !== 'XXX';
    if (!isValidIATA(origin.toUpperCase())) return setError('Please select a valid origin airport (3-letter code).');
    if (!isValidIATA(destination.toUpperCase())) return setError('Please select a valid destination airport (3-letter code).');
    if (origin.toUpperCase() === destination.toUpperCase()) return setError('Origin and destination cannot be the same.');

    setLoading(true); setError(''); setFlights([]); setFilterAirlines([]); setMaxDuration(0)

    const params = {
      origin: origin.toUpperCase(), destination: destination.toUpperCase(),
      date, returnDate: tripType === 'round-trip' ? returnDate : null,
      adults, children, infants, cabin, tripType,
    }

    try {
      const results = await searchFlights(params)
      if (results.length > 0) { setFlights(results); setLoading(false); triggerPriceStrip(); return }
    } catch (e) { console.warn('fast-flights failed:', e.message) }

    try {
      const results = await searchFlightsOctoTrip(params)
      if (results.length > 0) { setFlights(results); setLoading(false); triggerPriceStrip(); return }
    } catch (e) { console.warn('OctoTrip failed:', e.message) }

    try {
      const results = await searchFlightsAgentWeb(params, AGENTWEB_KEY)
      if (results.length > 0) { setFlights(results); setLoading(false); triggerPriceStrip(); return }
    } catch (e) { console.warn('AgentWeb failed:', e.message) }

    setError('No flights found across all providers. Try a major hub or nearby dates.')
    setLoading(false)
  }

  const triggerPriceStrip = async () => {
    setStripLoading(true)
    try {
      const strip = await searchMultiDates({
        origin: origin.toUpperCase(), destination: destination.toUpperCase(),
        centerDate: date, daysAround: 3, adults, cabin,
      })
      setPriceStrip(strip)
    } catch (e) { console.warn('Price strip failed:', e.message); setPriceStrip([]) }
    finally { setStripLoading(false) }
  }

  const handleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
      if (isSaved) {
        const filtered = saved.filter(s => !(s.origin === origin && s.destination === destination && s.date === date && s.tripType === tripType))
        localStorage.setItem(SAVED_KEY, JSON.stringify(filtered))
        setIsSaved(false)
      } else {
        saved.push({ origin, destination, tripType, date, returnDate, adults, children, infants, cabin, savedAt: Date.now() })
        localStorage.setItem(SAVED_KEY, JSON.stringify(saved.slice(-20)))
        setIsSaved(true)
      }
    } catch {}
  }

  const availableAirlines = useMemo(() => {
    const set = new Set()
    flights.forEach(f => f.airlines?.forEach(a => set.add(a)))
    return Array.from(set).sort()
  }, [flights])

  const durationBounds = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 0 }
    const durations = (flights || []).map(totalDuration)
    return { min: Math.min(...durations), max: Math.max(...durations) }
  }, [flights])

  const processedFlights = useMemo(() => {
    let result = [...flights]
    if (filterAirlines.length > 0) {
      result = result.filter(f => f.airlines?.some(a => filterAirlines.includes(a)))
    }
    if (filterDeparture !== 'any') {
      result = result.filter(f => {
        const depTime = f.segments?.[0]?.departure?.time || '00:00'
        const hour = parseInt(depTime.split(':')[0])
        if (filterDeparture === 'morning') return hour >= 5 && hour < 12
        if (filterDeparture === 'afternoon') return hour >= 12 && hour < 18
        if (filterDeparture === 'evening') return hour >= 18 || hour < 5
        return true
      })
    }
    if (filterStops !== 'any') {
      const maxStops = filterStops === 'direct' ? 0 : filterStops === '1' ? 1 : 99
      result = result.filter(f => (f.stops || 0) <= maxStops)
    }
    if (maxDuration > 0) {
      result = result.filter(f => totalDuration(f) <= maxDuration)
    }

    const prices = result.map(f => f.price).filter(p => typeof p === 'number')
    const durations = result.map(totalDuration)
    const minP = Math.min(...prices), maxP = Math.max(...prices)
    const minD = Math.min(...durations), maxD = Math.max(...durations)
    const rank = (v, min, max) => max === min ? 0 : (v - min) / (max - min)

    result.sort((a, b) => {
      if (sortBy === 'cheapest') return a.price - b.price
      if (sortBy === 'fastest') return totalDuration(a) - totalDuration(b)
      if (sortBy === 'stops') return (a.stops || 0) - (b.stops || 0)
      // best: 60% price + 40% duration
      const scoreA = rank(a.price, minP, maxP) * 0.6 + rank(totalDuration(a), minD, maxD) * 0.4
      const scoreB = rank(b.price, minP, maxP) * 0.6 + rank(totalDuration(b), minD, maxD) * 0.4
      return scoreA - scoreB
    })
    return result
  }, [flights, sortBy, filterAirlines, filterDeparture, filterStops, maxDuration])

  const bookingLink = () => {
    const q = tripType === 'round-trip'
      ? `Flights from ${origin} to ${destination} on ${date} through ${returnDate}`
      : `Flights from ${origin} to ${destination} on ${date}`
    return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`
  }

  const filtersContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Stops</h3>
        <div className="space-y-2">
          {[
            { v: 'any', l: 'Any number of stops' },
            { v: 'direct', l: 'Direct only' },
            { v: '1', l: 'Up to 1 stop' },
          ].map(o => (
            <label key={o.v} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={filterStops === o.v} onChange={() => setFilterStops(o.v)} className="w-4 h-4" />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Departure time</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { v: 'any', l: 'Any' },
            { v: 'morning', l: 'Morning' },
            { v: 'afternoon', l: 'Afternoon' },
            { v: 'evening', l: 'Evening' },
          ].map(o => (
            <button
              key={o.v}
              onClick={() => setFilterDeparture(o.v)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                filterDeparture === o.v ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {availableAirlines.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Plane className="h-4 w-4" /> Airlines</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableAirlines.map(a => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterAirlines.includes(a)}
                  onChange={(e) => {
                    if (e.target.checked) setFilterAirlines([...filterAirlines, a])
                    else setFilterAirlines(filterAirlines.filter(x => x !== a))
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{a}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {durationBounds.max > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Max duration</h3>
          <input
            type="range"
            min={durationBounds.min}
            max={durationBounds.max}
            value={maxDuration || durationBounds.max}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground mt-1">
            Up to {Math.floor((maxDuration || durationBounds.max) / 60)}h {((maxDuration || durationBounds.max) % 60)}m
          </div>
        </div>
      )}

      {(filterAirlines.length > 0 || filterDeparture !== 'any' || filterStops !== 'any' || maxDuration > 0) && (
        <button
          onClick={() => { setFilterAirlines([]); setFilterDeparture('any'); setFilterStops('any'); setMaxDuration(0) }}
          className="w-full text-xs text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-blue-950 to-indigo-950" />
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-sky-200">Live Google Flights · Real Prices</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 flex items-center gap-4">
            <Plane className="h-10 w-10 md:h-14 md:w-14 text-sky-300" />
            Flights
          </h1>
          <p className="text-white/70 max-w-2xl text-base md:text-lg">
            Search live flight prices worldwide. Filter by airline, time, and stops. Book directly with confidence.
          </p>
        </div>
      </div>

      {/* Search Card */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} className="w-4 h-4" />
                <span className="text-sm font-medium">Round-trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} className="w-4 h-4" />
                <span className="text-sm font-medium">One-way</span>
              </label>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isSaved ? 'Saved' : 'Save search'}
            </button>
          </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isSaved ? 'Saved' : 'Save search'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <AutocompleteInput
              label="From" value={origin} query={originQuery} setQuery={setOriginQuery}
              onSelect={(loc) => { setOrigin(loc.id); setOriginQuery(`${loc.city} (${loc.id})`) }}
              placeholder="City or airport" dropOpen={showOriginDrop} setDropOpen={setShowOriginDrop}
            />
            <AutocompleteInput
              label="To" value={destination} query={destQuery} setQuery={setDestQuery}
              onSelect={(loc) => { setDestination(loc.id); setDestQuery(`${loc.city} (${loc.id})`) }}
              placeholder="City or airport" dropOpen={showDestDrop} setDropOpen={setShowDestDrop}
            />
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
                {loading ? 'Searching…' : 'Search'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold mb-1 flex items-center gap-1"><Users className="h-3 w-3" /> Adults</label>
              <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1">Children (2–11)</label>
              <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1">Infants</label>
              <select value={infants} onChange={(e) => setInfants(Number(e.target.value))} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
                {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1">Cabin</label>
              <select value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full h-10 px-2 border border-border rounded-lg bg-background">
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
                <div>
                  <p className="text-sm text-amber-800 dark:text-amber-300">{error}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[-3, -1, 1, 3].map(offset => {
                      const d = new Date(date); d.setDate(d.getDate() + offset)
                      const iso = d.toISOString().split('T')[0]
                      return (
                        <button key={offset} onClick={() => { setDate(iso); setTimeout(handleSearch, 100) }}
                          className="text-xs px-3 py-1 rounded-full bg-amber-600 text-white hover:bg-amber-700">
                          Try {fmtDate(iso)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price calendar strip */}
      {(stripLoading || priceStrip.length > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-500" /> Cheapest fares nearby
              </h3>
              {stripLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-2 min-w-max">
                {priceStrip.map((d, i) => {
                  const cheapest = Math.min(...priceStrip.filter(x => x.price).map(x => x.price))
                  const isCheapest = d.price && d.price === cheapest
                  const isSelected = d.date === date
                  return (
                    <button
                      key={i}
                      onClick={() => { setDate(d.date); setTimeout(handleSearch, 100) }}
                      className={`min-w-[90px] p-2.5 rounded-lg border text-center transition ${
                        isSelected ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-[10px] font-semibold uppercase text-muted-foreground">{fmtDate(d.date)}</div>
                      <div className={`text-sm font-bold ${isCheapest ? 'text-emerald-600' : ''}`}>
                        {d.price ? `$${d.price}` : '—'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results with filters */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hidden md:block md:col-span-1">
            <Card><CardContent className="p-5"><div className="h-40 animate-pulse bg-muted rounded" /></CardContent></Card>
          </div>
          <div className="md:col-span-3 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {!loading && flights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-5">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                {filtersContent}
              </CardContent>
            </Card>
          </div>

          {/* Mobile filter button */}
          <div className="md:hidden">
            <Button variant="outline" onClick={() => setFiltersOpen(true)} className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>

          {/* Results */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{processedFlights.length} of {flights.length} flights</h2>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background">
                  <option value="best">Best</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                  <option value="stops">Fewest stops</option>
                </select>
            </div>

            {processedFlights.length === 0 && (
              <Card><CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No flights match your filters. Try clearing them.</p>
              </CardContent></Card>
            )}

            {processedFlights.map((flight, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-lg font-bold">{(flight.airlines || []).join(' + ')}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          flight.stops === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      {(flight.segments || []).map((seg, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm mb-2">
                          <div className="w-16 font-mono font-medium text-foreground">{seg.departure.time}</div>
                          <div className="flex-1 flex items-center gap-2 text-muted-foreground min-w-0">
                            <span className="font-semibold text-foreground">{seg.from.code}</span>
                            <div className="h-px bg-border flex-1 relative">
                              <Plane className="h-3 w-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground bg-card" />
                            </div>
                            <span className="font-semibold text-foreground">{seg.to.code}</span>
                          </div>
                          <div className="w-16 font-mono font-medium text-right text-foreground">{seg.arrival.time}</div>
                          <div className="w-20 text-xs text-muted-foreground text-right whitespace-nowrap">
                            {Math.floor(seg.duration_min / 60)}h {seg.duration_min % 60}m
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-border">
                        <TrustRow />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 md:border-l md:border-border md:pl-5">
                      <div className="text-right">
                        <div className="text-3xl font-black text-primary">${flight.price}</div>
                        <div className="text-[10px] text-muted-foreground">total incl. taxes</div>
                      </div>
                      <a href={flight.booking_url || bookingLink()} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
                          Select flight
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

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {filtersContent}
            <Button onClick={() => setFiltersOpen(false)} className="w-full mt-4">Apply</Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && flights.length === 0 && !error && (
        <Card><CardContent className="p-12 text-center">
          <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Ready to fly?</h3>
          <p className="text-muted-foreground mb-4">Search for flights above to compare live prices from multiple airlines.</p>
        </CardContent></Card>
      )}
    <HubExtras category="travel" />
      </div>
  )
}
