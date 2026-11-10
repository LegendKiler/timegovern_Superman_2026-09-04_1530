import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import TemperatureConverter from '../components/calculators/TemperatureConverter'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How do I convert Celsius to Fahrenheit?", a: "Multiply by 9/5, then add 32. So 25°C = 25 x 1.8 + 32 = 77°F. To go the other way, subtract 32 then multiply by 5/9." },
  { q: "What is absolute zero?", a: "Absolute zero is -273.15°C, 0 K, -459.67°F or 0°R. At this temperature, particles have minimum possible thermal energy. It is physically impossible to go below." },
  { q: "Why is Kelvin not written in degrees?", a: "Kelvin is an absolute scale, not a relative one like Celsius or Fahrenheit. The correct notation is '300 K', not '300 °K'." },
  { q: "What is the difference between Celsius and Centigrade?", a: "They are the same thing. Centigrade was the older name; Celsius is the SI standard. Both use 0°C for freezing and 100°C for boiling water at sea level." },
  { q: "Where is Rankine used?", a: "Rankine is the Fahrenheit version of absolute temperature. It is used in some US engineering fields, especially thermodynamics problems involving Fahrenheit data." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Temperature Converter', description: 'Convert between Celsius, Fahrenheit, Kelvin and Rankine instantly.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/temperature-converter', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function TemperatureConverterPage() {
  useEffect(() => {
    document.title = 'Temperature Converter - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Convert between Celsius, Fahrenheit, Kelvin and Rankine instantly.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-red-950 via-orange-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Temperature Converter</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Convert between Celsius, Fahrenheit, Kelvin and Rankine instantly.</p>
          </div>
        </div>

        <TemperatureConverter />

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
            <Link to="/weight-converter" className="block rounded-xl border border-border bg-card hover:border-red-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Weight Converter</h3><p className="text-xs text-muted-foreground">kg, lb, oz, stone</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Temperature Converter'} />
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