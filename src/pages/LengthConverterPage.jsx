import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import LengthConverter from '../components/calculators/LengthConverter'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How many centimeters are in an inch?", a: "Exactly 2.54 cm. This conversion has been exact since 1959 when the international yard and pound agreement standardized the inch." },
  { q: "How do I convert miles to kilometers?", a: "Multiply miles by 1.609344. So 5 miles = 8.0467 km. To go the other way, divide by 1.609344 (or multiply by 0.621371)." },
  { q: "What is a nautical mile?", a: "A nautical mile is 1852 meters exactly. It is based on one minute of latitude and used in aviation and marine navigation because it maps directly to degrees on a globe." },
  { q: "What is the difference between a mile and a statute mile?", a: "A statute mile is the standard US/UK mile (5280 feet). Nautical miles are different (about 1.15 statute miles). Statute mile distinguishes it from nautical or historical miles." },
  { q: "Why do some countries use feet and others use meters?", a: "Most countries adopted the metric system in the 19th and 20th centuries. The US, UK (partially), and a few others still use imperial units for everyday measurements like height and distance." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Length Converter', description: 'Convert between meters, feet, inches, miles, kilometers and more.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/length-converter', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function LengthConverterPage() {
  useEffect(() => {
    document.title = 'Length Converter - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Convert between meters, feet, inches, miles, kilometers and more.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-blue-950 via-cyan-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Length Converter</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Convert between meters, feet, inches, miles, kilometers and more.</p>
          </div>
        </div>

        <LengthConverter />

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
            <Link to="/speed-converter" className="block rounded-xl border border-border bg-card hover:border-blue-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Speed Converter</h3><p className="text-xs text-muted-foreground">km/h, mph, knots</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Length Converter'} />
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