import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import PresentValueCalculator from '../components/calculators/PresentValueCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is present value?", a: "Present value is what a future sum of money is worth today, given a discount rate. A $100,000 payment 20 years from now at 7% is worth about $25,842 today." },
  { q: "Why discount future cash flows?", a: "Because money today can earn interest. A dollar in the future is worth less than a dollar today. Discounting converts future amounts into today's equivalent." },
  { q: "What discount rate should I use?", a: "For safe comparisons, use a Treasury bond rate. For a business project, use your cost of capital. For personal finance, use your expected investment return." },
  { q: "What is the relationship between PV and interest rates?", a: "Higher rates mean lower present value. When rates rise, future cash flows are worth less today. When rates fall, they are worth more." },
  { q: "How is NPV related to PV?", a: "Net Present Value = PV of future cash flows minus initial investment. If NPV is positive, the investment creates value. If negative, it destroys value." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Present Value Calculator', description: 'Discount future cash flows to find what they are worth today.', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', url: 'https://timegovern.com/present-value-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function PresentValueCalculatorPage() {
  useEffect(() => {
    document.title = 'Present Value Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Discount future cash flows to find what they are worth today.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-rose-950 via-pink-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Present Value Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Discount future cash flows to find what they are worth today.</p>
          </div>
        </div>

        <PresentValueCalculator />

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
            <Link to="/future-value-calculator" className="block rounded-xl border border-border bg-card hover:border-rose-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Future Value Calculator</h3><p className="text-xs text-muted-foreground">Compound growth</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Present Value Calculator'} />
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