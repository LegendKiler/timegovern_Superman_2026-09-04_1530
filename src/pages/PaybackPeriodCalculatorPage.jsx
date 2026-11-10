import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import PaybackPeriodCalculator from '../components/calculators/PaybackPeriodCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is payback period?", a: "Payback period is how long it takes for an investment's cash flows to repay the initial cost. A 3-year payback means you recover your money in 3 years." },
  { q: "What is the difference between simple and discounted payback?", a: "Simple payback ignores the time value of money. Discounted payback discounts each future cash flow back to present value, giving a more accurate picture." },
  { q: "Is a shorter payback always better?", a: "Usually, but not always. Payback ignores cash flows after the payback period. A project with a 5-year payback may be better than a 2-year one if it generates much higher cash flows afterward." },
  { q: "What is a good payback period?", a: "Depends on the industry and risk. Utilities often accept 10+ years. Tech startups want under 2 years. Most businesses target 3-5 years for capital investments." },
  { q: "Does payback period account for risk?", a: "Not directly. It's a simple liquidity measure. For risk-adjusted analysis, use NPV or IRR instead. Payback is a quick sanity check, not a full investment decision tool." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Payback Period Calculator', description: 'Calculate simple and discounted payback period for any investment.', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: 'https://timegovern.com/payback-period-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function PaybackPeriodCalculatorPage() {
  useEffect(() => {
    document.title = 'Payback Period Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Calculate simple and discounted payback period for any investment.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-cyan-950 via-blue-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Payback Period Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate simple and discounted payback period for any investment.</p>
          </div>
        </div>

        <PaybackPeriodCalculator />

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
            <Link to="/cagr-calculator" className="block rounded-xl border border-border bg-card hover:border-cyan-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">CAGR Calculator</h3><p className="text-xs text-muted-foreground">Compound annual growth</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Payback Period Calculator'} />
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-center">
          <Link to="/money-tools" className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            See all money tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      
      <CalculatorExtras category="finance" />
</div>
    </>
  )
}