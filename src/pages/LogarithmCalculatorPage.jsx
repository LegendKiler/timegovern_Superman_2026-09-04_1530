import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import LogarithmCalculator from '../components/calculators/LogarithmCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is a logarithm?", a: "A logarithm answers the question: to what power must the base be raised to get this number? log_10(100) = 2 because 10^2 = 100. Logs are the inverse of exponentiation." },
  { q: "What is the difference between ln and log?", a: "ln means natural log with base e (about 2.718). log usually means base 10 in general usage and in many calculators. log2 means base 2 and is common in computer science." },
  { q: "Why can't I take the log of a negative number?", a: "Because no real power of a positive base produces a negative result. Negative inputs are undefined for real logarithms and require complex numbers." },
  { q: "What is the change of base formula?", a: "log_b(x) = ln(x) / ln(b). This calculator uses this formula to compute logs in any base using JavaScript's natural log function." },
  { q: "Where are logarithms used?", a: "Sound (decibels), earthquakes (Richter scale), chemistry (pH), finance (compound growth), and computer science (algorithm complexity, binary search)." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Logarithm Calculator', description: 'Calculate logarithms in any base. Get log_base(x), natural log, log10, and log2 in one tool.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/logarithm-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function LogarithmCalculatorPage() {
  useEffect(() => {
    document.title = 'Logarithm Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Calculate logarithms in any base. Get log_base(x), natural log, log10, and log2 in one tool.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-purple-950 via-pink-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Logarithm Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate logarithms in any base. Get log_base(x), natural log, log10, and log2 in one tool.</p>
          </div>
        </div>

        <LogarithmCalculator />

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
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Logarithm Calculator'} />
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