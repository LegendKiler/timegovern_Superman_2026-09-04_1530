import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import FutureValueCalculator from '../components/calculators/FutureValueCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is future value?", a: "Future value is what an investment will be worth at a future date, given a rate of return and time. $10,000 at 7% for 10 years becomes about $19,671." },
  { q: "What is compounding frequency?", a: "How often interest is added to the balance. More frequent compounding means slightly higher effective return. Monthly beats annual; daily beats monthly." },
  { q: "How do monthly deposits affect future value?", a: "Each deposit compounds from the day it is made. Regular contributions can vastly exceed the effect of the initial lump sum over decades." },
  { q: "What is the Rule of 72?", a: "Divide 72 by the interest rate to get the approximate doubling time. At 8%, money doubles in 9 years. At 6%, in 12 years." },
  { q: "What rate of return should I assume?", a: "Historically the S&P 500 has returned about 10% nominal, 7% real (after inflation) over long periods. Use 5-7% for conservative planning, 8-10% for optimistic." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Future Value Calculator', description: 'Project the future value of a lump sum plus monthly contributions.', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', url: 'https://timegovern.com/future-value-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function FutureValueCalculatorPage() {
  useEffect(() => {
    document.title = 'Future Value Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Project the future value of a lump sum plus monthly contributions.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-violet-950 via-purple-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Future Value Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Project the future value of a lump sum plus monthly contributions.</p>
          </div>
        </div>

        <FutureValueCalculator />

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
            <Link to="/present-value-calculator" className="block rounded-xl border border-border bg-card hover:border-violet-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Present Value Calculator</h3><p className="text-xs text-muted-foreground">Discount future cash</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Future Value Calculator'} />
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