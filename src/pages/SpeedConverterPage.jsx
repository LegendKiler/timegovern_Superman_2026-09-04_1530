import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import SpeedConverter from '../components/calculators/SpeedConverter'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How do I convert km/h to mph?", a: "Multiply by 0.621371. So 100 km/h = 62.14 mph. To go from mph to km/h, multiply by 1.609344." },
  { q: "What is a knot?", a: "A knot is one nautical mile per hour (1.852 km/h). It is used in aviation and marine navigation because nautical miles map directly to degrees of latitude." },
  { q: "What is the speed of light?", a: "299,792,458 m/s exactly (about 1.08 billion km/h or 186,282 mi/s). Nothing with mass can reach this speed." },
  { q: "How do I convert m/s to km/h?", a: "Multiply by 3.6. So 10 m/s = 36 km/h. To go the other way, divide by 3.6." },
  { q: "What is a typical highway speed limit?", a: "Varies widely. US: 65-80 mph (105-130 km/h). Germany Autobahn: often no limit. UK: 70 mph. Japan: 100 km/h. Australia: 100-110 km/h." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Speed Converter', description: 'Convert between km/h, mph, m/s, knots and feet per second.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/speed-converter', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function SpeedConverterPage() {
  useEffect(() => {
    document.title = 'Speed Converter - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Convert between km/h, mph, m/s, knots and feet per second.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-amber-950 via-yellow-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Speed Converter</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Convert between km/h, mph, m/s, knots and feet per second.</p>
          </div>
        </div>

        <SpeedConverter />

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Card key={i}><CardContent className="p-5"><h3 className="font-bold mb-2 text-sm">{f.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p></CardContent></Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Related tools</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Link to="/length-converter" className="block rounded-xl border border-border bg-card hover:border-amber-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Length Converter</h3><p className="text-xs text-muted-foreground">m, ft, mi, km</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Speed Converter'} />
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-center">
          <Link to="/math-tools" className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            See all math tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      
      <CalculatorExtras category="unit-conversion" />
</div>
    </>
  )
}