import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import CAGRCalculator from '../components/calculators/CAGRCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is CAGR?", a: "Compound Annual Growth Rate (CAGR) is the smoothed annual rate that would take an investment from a beginning value to an ending value over a given number of years. It is the geometric mean of yearly growth rates." },
  { q: "Why not use average return?", a: "Average (arithmetic mean) return overstates performance when returns are volatile. If you gain 50 percent then lose 50 percent, the average is 0 percent but you are down 25 percent. CAGR correctly reports the smoothed negative 13.4 percent per year." },
  { q: "What is the CAGR formula?", a: "CAGR = (ending value / beginning value)^(1 / years) - 1. It assumes profits are reinvested and growth is smooth, which real investments rarely are." },
  { q: "What is a good CAGR?", a: "For stocks, long-run averages are around 7 to 10 percent per year. Real estate is often cited as 3 to 5 percent. Anything above 15 percent sustained over many years is exceptional." },
  { q: "Does CAGR account for volatility?", a: "No. CAGR ignores the path - two investments with the same start and end have the same CAGR regardless of how bumpy the ride was. It is a smoothed number." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'CAGR Calculator', description: 'Calculate compound annual growth rate from beginning value, ending value and number of years.', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', url: 'https://timegovern.com/cagr-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function CAGRCalculatorPage() {
  useEffect(() => {
    document.title = 'CAGR Calculator | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Free CAGR calculator. Find compound annual growth rate from beginning value, ending value, and number of years. Compare investments, track portfolio growth, no signup needed.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-green-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">CAGR Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Free CAGR calculator. Find compound annual growth rate from beginning value, ending value, and number of years. Compare investments, track portfolio growth, no signup needed.</p>
          </div>
        </div>

        <CAGRCalculator />

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
            <Link to="/investment-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Investment Calculator</h3><p className="text-xs text-muted-foreground">Compound growth</p></Link>
            <Link to="/retirement-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Retirement Calculator</h3><p className="text-xs text-muted-foreground">Retirement savings</p></Link>
            <Link to="/roi-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">ROI Calculator</h3><p className="text-xs text-muted-foreground">Return on investment</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'CAGR Calculator'} />
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