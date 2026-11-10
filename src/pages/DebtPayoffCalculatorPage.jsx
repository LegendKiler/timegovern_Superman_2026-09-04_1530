import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import DebtPayoffCalculator from '../components/calculators/DebtPayoffCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How long will it take to pay off my credit card?", a: "It depends on your balance, APR and monthly payment. This calculator solves for the exact number of months using compounding. Higher payments dramatically shorten payoff time." },
  { q: "What is the minimum payment trap?", a: "Credit card minimums are usually 1 to 3 percent of the balance. At that rate, most of the payment goes to interest and the balance barely falls. Paying above the minimum is the fastest way out." },
  { q: "Does APR matter that much?", a: "Yes. At 20 percent APR versus 10 percent APR, the same balance and payment takes roughly twice as long to pay off. Interest is the primary cost of carrying debt." },
  { q: "Should I pay off debt or invest?", a: "If your debt APR exceeds expected investment returns after tax, paying debt is mathematically better. Psychologically, many people prefer debt-free first." },
  { q: "What happens if my payment only covers interest?", a: "The balance never falls. This calculator flags that case explicitly. You must pay above the monthly interest charge to make progress." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Debt Payoff Calculator', description: 'Free debt payoff calculator. See how many months it takes to pay off a credit card or loan from balance, APR, and monthly payment. Includes total interest paid. No signup.', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', url: 'https://timegovern.com/debt-payoff-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function DebtPayoffCalculatorPage() {
  useEffect(() => {
    document.title = 'Debt Payoff Calculator | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Free debt payoff calculator. See how many months it takes to pay off a credit card or loan from balance, APR, and monthly payment. Includes total interest paid. No signup.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Debt Payoff Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate how long it takes to pay off a credit card or loan given balance, APR and monthly payment.</p>
          </div>
        </div>

        <DebtPayoffCalculator />

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
            <Link to="/credit-card-payoff-calculator" className="block rounded-xl border border-border bg-card hover:border-rose-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Credit Card Payoff</h3><p className="text-xs text-muted-foreground">Minimum payment payoff</p></Link>
            <Link to="/amortization-calculator" className="block rounded-xl border border-border bg-card hover:border-rose-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Amortization Calculator</h3><p className="text-xs text-muted-foreground">Full payment schedule</p></Link>
            <Link to="/down-payment-calculator" className="block rounded-xl border border-border bg-card hover:border-rose-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Down Payment Calculator</h3><p className="text-xs text-muted-foreground">Mortgage down payment</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-rose-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Debt Payoff Calculator'} />
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