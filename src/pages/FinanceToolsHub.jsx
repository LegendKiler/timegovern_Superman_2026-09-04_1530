import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, TrendingUp, PiggyBank, Calculator, Sparkles, ArrowRight, Car, CreditCard, LineChart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'

const TOOLS = [
  { to: '/compound-interest-calculator', name: 'Compound Interest Calculator', desc: 'See how investments grow over time with monthly or annual compounding.', icon: TrendingUp, color: 'emerald' },
  { to: '/loan-calculator', name: 'Loan Calculator', desc: 'Monthly payments, total interest, and amortisation for any loan.', icon: DollarSign, color: 'blue' },
  { to: '/auto-loan-calculator', name: 'Auto Loan Calculator', desc: 'Monthly car payments, total interest, and total cost.', icon: Car, color: 'blue' },
  { to: '/credit-card-payoff-calculator', name: 'Credit Card Payoff', desc: 'How long to pay off a balance and how much interest.', icon: CreditCard, color: 'rose' },
  { to: '/retirement-calculator', name: 'Retirement Calculator', desc: 'Estimate nest egg and monthly retirement income.', icon: PiggyBank, color: 'emerald' },
  { to: '/investment-calculator', name: 'Investment Calculator', desc: 'Future value with monthly contributions.', icon: LineChart, color: 'violet' },
]

const FAQ = [
  { q: 'What are finance tools?', a: 'Free finance calculators for everyday money decisions - compound interest, loan repayments, and more. All run in your browser with no signup.' },
  { q: 'Are these finance calculators free?', a: 'Yes, completely free. No credit card, no trial, no limits.' },
  { q: 'Is my financial data private?', a: 'Yes. Every calculation runs in your browser. Nothing is uploaded, stored, or shared.' },
  { q: 'Are these financial advice?', a: 'No. They are informational tools. For personal financial decisions, consult a licensed financial adviser.' },
  { q: 'Which finance tool should I start with?', a: 'If you want to understand long-term growth, start with the Compound Interest Calculator. For borrowing costs, use the Loan Calculator.' },
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const COLLECTION_SCHEMA = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Finance Tools & Calculators', description: 'Free finance tools - compound interest, loan, and more.', url: 'https://timegovern.com/finance-tools' }

export default function FinanceToolsHub() {
  useEffect(() => {
    document.title = 'Finance Tools & Calculators - Free & Private | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Free finance tools - compound interest, loan calculators, and more. All in one place, no signup, 100% private.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_SCHEMA) }} />

      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">{TOOLS.length} tools - Free - Private</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <DollarSign className="h-10 w-10 md:h-14 md:w-14 text-emerald-300" />
              Finance Tools
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Free calculators for compound interest, loans, and everyday money decisions.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">The finance tools</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {TOOLS.map((t) => {
              const Icon = t.icon
              return (
                <Link key={t.to} to={t.to} className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={'p-2.5 rounded-xl bg-' + t.color + '-500/10 border border-' + t.color + '-500/30 shrink-0'}>
                      <Icon className={'h-5 w-5 text-' + t.color + '-500'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black mb-1 text-sm">{t.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{t.desc}</p>
                      <div className="text-[11px] font-bold text-emerald-500 inline-flex items-center gap-1">Open tool <ArrowRight className="h-3 w-3" /></div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Why finance tools matter</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Small differences in interest rates, compounding frequency, and loan terms add up to thousands over time. These calculators make those numbers visible before you commit.</p>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (<Card key={i}><CardContent className="p-5"><h3 className="font-bold mb-2">{f.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p></CardContent></Card>))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Finance Tools'} />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Disclaimer:</strong> These tools are for informational purposes only and are not financial advice. Consult a licensed adviser for personal financial decisions.
        </div>
      
      <section className="hub-extras">
        <h2>How to use this hub</h2>
        <p>This hub gathers every finance calculator on TimeGovern — loans, mortgages, investments, retirement, and debt payoff — into one place. Each tool links to a full calculator with worked examples, so you can move from a quick estimate to a detailed scenario without leaving the site. Start with the calculator closest to your question and refine from there.</p>
      </section>
    </div>
    </>
  )
}