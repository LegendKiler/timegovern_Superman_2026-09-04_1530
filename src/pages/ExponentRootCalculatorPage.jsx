import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ExponentRootCalculator from '../components/calculators/ExponentRootCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is an exponent?", a: "An exponent tells you how many times to multiply a base by itself. 2^10 = 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 = 1024." },
  { q: "What is the difference between power and root?", a: "Powers multiply a base by itself (x^y). Roots undo powers - the nth root of x is the number that, raised to n, gives x. Square root and power 1/2 are the same." },
  { q: "Why is the even root of a negative number undefined?", a: "Because no real number squared (or raised to any even power) produces a negative. Real even roots of negatives do not exist - they require complex numbers." },
  { q: "What is e^x?", a: "e is approximately 2.71828, the base of natural logarithms. e^x appears everywhere in calculus, compound interest, population growth, and differential equations." },
  { q: "What happens when I raise to a fractional exponent?", a: "x^(m/n) = the nth root of x, raised to m. So 8^(2/3) = (cube root of 8)^2 = 2^2 = 4." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Exponent and Root Calculator', description: 'Calculate powers, nth roots, square roots, cube roots and e^x in one tool.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/exponent-root-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function ExponentRootCalculatorPage() {
  useEffect(() => {
    document.title = 'Exponent and Root Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Calculate powers, nth roots, square roots, cube roots and e^x in one tool.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-amber-950 via-red-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Exponent and Root Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate powers, nth roots, square roots, cube roots and e^x in one tool.</p>
          </div>
        </div>

        <ExponentRootCalculator />

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
            <Link to="/logarithm-calculator" className="block rounded-xl border border-border bg-card hover:border-amber-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Logarithm Calculator</h3><p className="text-xs text-muted-foreground">Any base, ln, log10</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Exponent and Root Calculator'} />
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