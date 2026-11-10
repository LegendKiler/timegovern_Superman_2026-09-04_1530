import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import SignificantFiguresCalculator from '../components/calculators/SignificantFiguresCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What are significant figures?", a: "Significant figures are the digits in a number that carry meaning contributing to its measurement precision. They tell you how confident you can be in a measured value." },
  { q: "Which zeros are significant?", a: "Leading zeros are never significant (0.0025 has 2 sig figs). Captive zeros between non-zeros are always significant (1002 has 4). Trailing zeros after a decimal are significant (2.500 has 4)." },
  { q: "How do I round to significant figures?", a: "Round at the Nth significant digit. 3.14159 to 3 sig figs is 3.14. 1234 to 2 sig figs is 1200 (may need scientific notation to make trailing zeros explicit)." },
  { q: "Why are significant figures important?", a: "They prevent false precision. Reporting 3.14159 when your measurement is only accurate to two decimals misleads readers. Sig figs communicate actual precision." },
  { q: "Do significant figures apply to exact numbers?", a: "No. Counted objects (5 apples) and defined quantities (1 km = 1000 m) are exact and have infinite sig figs. Only measured quantities follow sig-fig rules." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Significant Figures Calculator', description: 'Count significant figures in any number and round to a chosen number of sig figs.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/significant-figures-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function SignificantFiguresCalculatorPage() {
  useEffect(() => {
    document.title = 'Significant Figures Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Count significant figures in any number and round to a chosen number of sig figs.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-emerald-950 via-teal-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Significant Figures Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Count significant figures in any number and round to a chosen number of sig figs.</p>
          </div>
        </div>

        <SignificantFiguresCalculator />

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
            <Link to="/average-calculator" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Average Calculator</h3><p className="text-xs text-muted-foreground">Mean, median, mode</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Significant Figures Calculator'} />
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-center">
          <Link to="/math-tools" className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            See all math tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      
      <CalculatorExtras category="math" />
</div>
    </>
  )
}