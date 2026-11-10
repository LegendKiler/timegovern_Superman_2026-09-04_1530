import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import BreakEvenCalculator from '../components/calculators/BreakEvenCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is the break-even point?", a: "The break-even point is the sales level where total revenue equals total costs. Below it you lose money, above it you profit. It is expressed in units or revenue." },
  { q: "What is contribution margin?", a: "Contribution margin is price minus variable cost per unit. It is how much each sale contributes toward covering fixed costs. Once fixed costs are covered, further sales become profit." },
  { q: "How do fixed and variable costs differ?", a: "Fixed costs don't change with production (rent, salaries). Variable costs scale with each unit made (materials, packaging). Break-even is where total sales cover both." },
  { q: "What if variable cost exceeds price?", a: "Then every unit sold loses money and you can never break even. The calculator flags this case. You must either raise price or cut variable cost." },
  { q: "How do I lower my break-even point?", a: "Raise price, cut variable cost per unit, or reduce fixed costs. Small improvements in any of the three compound. A 10% price increase can lower break-even by 20-30%." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Break-Even Calculator', description: 'Find the units and revenue needed to cover your fixed and variable costs.', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: 'https://timegovern.com/break-even-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function BreakEvenCalculatorPage() {
  useEffect(() => {
    document.title = 'Break-Even Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Find the units and revenue needed to cover your fixed and variable costs.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-orange-950 via-amber-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Break-Even Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Find the units and revenue needed to cover your fixed and variable costs.</p>
          </div>
        </div>

        <BreakEvenCalculator />

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
            <Link to="/markup-calculator" className="block rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Markup Calculator</h3><p className="text-xs text-muted-foreground">Cost to price</p></Link>
            <Link to="/money-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Money Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Break-Even Calculator'} />
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