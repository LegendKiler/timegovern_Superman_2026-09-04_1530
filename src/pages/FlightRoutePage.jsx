import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plane, ArrowRight, Clock, MapPin, Calendar, TrendingDown, Info, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { setPageMeta } from '../lib/seo'
import { searchFlights, searchMultiDates } from '../lib/flightSearch'
import { WORLD_LOCATIONS } from '../data/locations'

const findLoc = (iata) => WORLD_LOCATIONS.find(l => l.id === iata && l.type === 'airport')

const fmtMonth = (iso) => new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

export default function FlightRoutePage() {
  const { origin, destination } = useParams()
  const from = (origin || 'LHR').toUpperCase()
  const to = (destination || 'JFK').toUpperCase()

  const fromLoc = useMemo(() => findLoc(from), [from])
  const toLoc = useMemo(() => findLoc(to), [to])

  const [flights, setFlights] = useState([])
  const [monthPrices, setMonthPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fromCity = fromLoc?.city || from
    const toCity = toLoc?.city || to
    document.title = `Flights from ${fromCity} to ${toCity} — Live Prices & Airlines | TimeGovern`
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = `Find the cheapest flights from ${fromCity} (${from}) to ${toCity} (${to}). Compare live prices, airlines, and travel times.`
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [from, to, fromLoc, toLoc])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const d = new Date(); d.setDate(d.getDate() + 30)
        const dateStr = d.toISOString().split('T')[0]
        const results = await searchFlights({ origin: from, destination: to, date: dateStr, adults: 1 })
        setFlights(results)

        // Cheapest month (next 6 months, one date per month)
        const months = []
        for (let i = 1; i <= 6; i++) {
          const md = new Date(); md.setMonth(md.getMonth() + i); md.setDate(15)
          months.push(md.toISOString().split('T')[0])
        }
        try {
          const monthRes = await searchMultiDates({
            origin: from, destination: to, dates: months, adults: 1, cabin: 'economy',
          })
          setMonthPrices(monthRes)
        } catch {}
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [from, to])

  const cheapest = flights.length > 0 ? flights[0] : null
  const airlines = useMemo(() => {
    const set = new Set()
    flights.forEach(f => f.airlines?.forEach(a => set.add(a)))
    return Array.from(set).sort()
  }, [flights])
  const direct = flights.filter(f => f.stops === 0)
  const fastest = flights.length > 0 ? flights.reduce((min, f) => {
    const dur = f.segments.reduce((s, x) => s + (x.duration_min || 0), 0)
    return dur < min.dur ? { dur, f } : min
  }, { dur: Infinity, f: null }) : null
  const cheapestMonth = monthPrices.filter(m => m.price).reduce((min, m) => m.price < (min?.price ?? Infinity) ? m : min, null)

  // FAQPage schema
  const faqs = [
    { q: `How long is the flight from ${from} to ${to}?`, a: fastest ? `The fastest flight from ${from} to ${to} takes approximately ${Math.floor(fastest.dur / 60)}h ${fastest.dur % 60}m.` : 'Flight duration varies by airline and connection.' },
    { q: `Which airlines fly from ${from} to ${to}?`, a: airlines.length > 0 ? `Airlines operating this route include ${airlines.slice(0, 5).join(', ')}${airlines.length > 5 ? ' and more.' : '.'}` : 'Multiple airlines operate this route.' },
    { q: `Are there direct flights from ${from} to ${to}?`, a: direct.length > 0 ? `Yes, ${direct.length} direct flights are available. Book early for best availability.` : 'There are currently no direct flights. Book a connecting flight instead.' },
    { q: `When is the cheapest time to fly from ${from} to ${to}?`, a: cheapestMonth ? `Based on current data, ${fmtMonth(cheapestMonth.date)} is cheapest, starting around \$${cheapestMonth.price}.` : 'Prices vary. Search multiple dates for the best deals.' },
    { q: `How do I find cheap flights from ${from} to ${to}?`, a: 'Book 6-8 weeks in advance, fly mid-week, and use our flexible date search to see the lowest fares.' },
  ]
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/flights" className="hover:underline">Flights</Link>
        <span className="mx-2">/</span>
        <span>{from} → {to}</span>
      </nav>

      <header className="text-center py-6">
        <div className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
          <Plane className="h-3.5 w-3.5" /> Live prices · Updated today
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-3">
          Flights from {fromLoc?.city || from} to {toLoc?.city || to}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {from} ({fromLoc?.name || 'Airport'}) → {to} ({toLoc?.name || 'Airport'})
        </p>
        {cheapest && (
          <div className="mt-6 inline-block bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-2xl px-8 py-4 border border-emerald-200 dark:border-emerald-900">
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Cheapest today</div>
            <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400">${cheapest.price}</div>
            <div className="text-xs text-muted-foreground mt-1">{cheapest.airlines.join(' + ')} · per person, incl. taxes</div>
          </div>
        )}
      </header>

      {/* Cheapest months histogram */}
      {monthPrices.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-500" /> Cheapest months to fly
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {monthPrices.map((m, i) => {
                const isMin = cheapestMonth && m.date === cheapestMonth.date
                return (
                  <div key={i} className={`p-3 rounded-lg border text-center ${isMin ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' : 'border-border'}`}>
                    <div className="text-xs font-semibold text-muted-foreground">{fmtMonth(m.date)}</div>
                    <div className={`text-lg font-black ${isMin ? 'text-emerald-600' : ''}`}>
                      {m.price ? `$${m.price}` : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live flights */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">Live flights (next 30 days)</h2>
          {loading && <p className="text-muted-foreground">Loading live prices…</p>}
          {error && <p className="text-amber-600 text-sm">{error}</p>}
          {!loading && flights.length === 0 && !error && (
            <p className="text-muted-foreground">No flights found for this route right now.</p>
          )}
          <div className="space-y-3">
            {flights.slice(0, 8).map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex-1">
                  <div className="font-semibold">{f.airlines.join(' + ')}</div>
                  <div className="text-sm text-muted-foreground">
                    {f.stops === 0 ? 'Direct' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
                    {f.segments?.[0] && ` · Departs ${f.segments[0].departure.time}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">${f.price}</div>
                  <a href={f.booking_url || `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${from} to ${to}`)}`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">Book</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route facts + airlines */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Info className="h-5 w-5 text-sky-500" /> Route facts</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /><span><strong>Route:</strong> {from} → {to}</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /><span><strong>From:</strong> {fromLoc?.name || fromLoc?.city || from}</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /><span><strong>To:</strong> {toLoc?.name || toLoc?.city || to}</span></li>
              {fastest && <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /><span><strong>Fastest flight:</strong> {Math.floor(fastest.dur / 60)}h {fastest.dur % 60}m</span></li>}
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /><span><strong>Direct flights today:</strong> {direct.length}</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /><span><strong>Best time to book:</strong> 6–8 weeks in advance</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Plane className="h-5 w-5 text-indigo-500" /> Airlines operating</h2>
            {airlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">Multiple airlines operate this route.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {airlines.map(a => (
                  <li key={a} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500" />{a}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-amber-500" /> Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="border border-border rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-sm">{f.q}</summary>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center py-4">
        <Link to={`/flights?from=${from}&to=${to}`}>
          <Button className="bg-gradient-to-r from-sky-600 to-blue-600 h-12 px-8">
            Search all flights {from} → {to} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
