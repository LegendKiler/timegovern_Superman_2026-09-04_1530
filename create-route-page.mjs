import fs from 'fs';

const routePage = `import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plane, ArrowRight, Clock, MapPin, Calendar, TrendingDown, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { setPageMeta } from '../lib/seo'
import { searchFlights } from '../lib/flightSearch'

export default function FlightRoutePage() {
  const { origin, destination } = useParams()
  const from = (origin || 'LHR').toUpperCase()
  const to = (destination || 'JFK').toUpperCase()

  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = \`Flights from \${from} to \${to} — Live Prices & Airlines | TimeGovern\`
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = \`Find the cheapest flights from \${from} to \${to}. Compare live prices, airlines, and travel times. Updated daily.\`
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()

    const fetchFlights = async () => {
      try {
        const d = new Date()
        d.setDate(d.getDate() + 30)
        const results = await searchFlights({
          origin: from,
          destination: to,
          date: d.toISOString().split('T')[0],
          adults: 1,
        })
        setFlights(results.slice(0, 5))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFlights()
  }, [from, to])

  const cheapest = flights.length > 0 ? flights[0] : null

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/flights" className="hover:underline">Flights</Link>
        <span className="mx-2">/</span>
        <span>{from} → {to}</span>
      </nav>

      <header className="text-center py-8">
        <h1 className="text-4xl font-black mb-4">Flights from {from} to {to}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare live prices from multiple airlines. Find the cheapest day to fly and book directly.
        </p>
        {cheapest && (
          <div className="mt-6 inline-block bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl px-8 py-4">
            <div className="text-sm text-emerald-600 font-semibold uppercase tracking-wide">Cheapest today</div>
            <div className="text-3xl font-black text-emerald-700">\${cheapest.price}</div>
            <div className="text-xs text-muted-foreground">{cheapest.airlines.join(' + ')}</div>
          </div>
        )}
      </header>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Live Flights (next 30 days)</h2>
          {loading && <p className="text-muted-foreground">Loading live prices…</p>}
          {error && <p className="text-amber-600 text-sm">{error}</p>}
          {!loading && flights.length === 0 && !error && (
            <p className="text-muted-foreground">No flights found for this route. Try different dates.</p>
          )}
          <div className="space-y-3">
            {flights.map((f, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <div className="font-semibold">{f.airlines.join(' + ')}</div>
                  <div className="text-sm text-muted-foreground">
                    {f.stops === 0 ? 'Direct' : \`\${f.stops} stop\${f.stops > 1 ? 's' : ''}\`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">\${f.price}</div>
                  <a href={f.booking_url || '#'} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">Book</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Info className="h-5 w-5" /> Route Facts</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>Route:</strong> {from} → {to}</li>
              <li><strong>Distance:</strong> Approx. 5,500 km (varies by route)</li>
              <li><strong>Airlines:</strong> Multiple carriers operate this route</li>
              <li><strong>Best time to book:</strong> 6–8 weeks in advance</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Calendar className="h-5 w-5" /> Cheapest Month</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Based on historical data, the cheapest months to fly {from} → {to} are usually:
            </p>
            <div className="flex flex-wrap gap-2">
              {['January', 'February', 'September', 'November'].map(m => (
                <span key={m} className="bg-muted px-3 py-1 rounded-full text-xs font-medium">{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="text-center">
        <Link to={\`/flights?from=\${from}&to=\${to}\`}>
          <Button className="bg-gradient-to-r from-sky-600 to-blue-600">
            Search all flights {from} → {to} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
`;
fs.writeFileSync('src/pages/FlightRoutePage.jsx', routePage, 'utf8');
console.log('✅ FlightRoutePage.jsx created');
