import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import DownPaymentCalculator from '../components/calculators/DownPaymentCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is a down payment?", a: "The down payment is the portion of a home purchase you pay upfront in cash. The rest is financed with a mortgage. A 20 percent down payment typically avoids private mortgage insurance (PMI)." },
  { q: "How much should I put down?", a: "20 percent is the traditional benchmark and avoids PMI. FHA loans allow as little as 3.5 percent. Some conventional loans allow 3 percent. Less down means a larger loan and more interest paid." },
  { q: "What is PMI?", a: "Private mortgage insurance protects the lender if you default. It is usually required when your down payment is below 20 percent. Cost is typically 0.3 to 1.5 percent of the loan amount per year." },
  { q: "How does the down payment affect monthly payment?", a: "A larger down payment means a smaller loan, which means lower monthly principal and interest. It also means less total interest paid over the life of the loan." },
  { q: "Does a bigger down payment get a better rate?", a: "Often yes. Lenders view lower loan-to-value (LTV) as lower risk. Below 80 percent LTV is a common threshold for better pricing." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Down Payment Calculator', description: 'Calculate down payment amount, loan amount and monthly mortgage payment from home price, down payment percent, rate and term.', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', url: 'https://timegovern.com/down-payment-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function DownPaymentCalculatorPage() {
  useEffect(() => {
    document.title = 'Down Payment Calculator | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Calculate your down payment, loan amount and monthly mortgage payment from home price, rate and term.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Down Payment Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate your down payment, loan amount and monthly mortgage payment from home price, rate and term.</p>
          </div>
        </div>

        <DownPaymentCalculator />

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
            <Link to="/amortization-calculator" className="block rounded-xl border border-border bg-card hover:border-amber-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Amortization Calculator</h3><p className="text-xs text-muted-foreground">Full payment schedule</p></Link>
            <Link to="/debt-payoff-calculator" className="block rounded-xl border border-border bg-card hover:border-amber-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Debt Payoff Calculator</h3><p className="text-xs text-muted-foreground">Credit card payoff</p></Link>
            <Link to="/investment-calculator" className="block rounded-xl border border-border bg-card hover:border-amber-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Investment Calculator</h3><p className="text-xs text-muted-foreground">Compound growth</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-amber-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Down Payment Calculator'} />
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