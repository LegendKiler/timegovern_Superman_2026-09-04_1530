import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import QuadraticCalculator from '../components/calculators/QuadraticCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is a quadratic equation?", a: "A quadratic equation has the form Ax^2 + Bx + C = 0 where A is not zero. It graphs as a parabola." },
  { q: "What is the quadratic formula?", a: "x = (-B +/- sqrt(B^2 - 4AC)) / (2A). It gives both roots of any quadratic equation." },
  { q: "What does the discriminant tell me?", a: "The discriminant B^2 - 4AC tells you the nature of the roots. Positive: two distinct real roots. Zero: one repeated real root. Negative: two complex conjugate roots." },
  { q: "How do I find the vertex?", a: "The vertex of the parabola is at x = -B / (2A). Plug that x back into the equation to get the y-coordinate of the vertex." },
  { q: "What if A is zero?", a: "If A is zero, the equation is linear (Bx + C = 0), not quadratic. This calculator requires A to be non-zero." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Quadratic Calculator', description: 'Solve quadratic equations Ax^2 + Bx + C = 0 with real or complex roots. Shows discriminant and vertex.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/quadratic-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function QuadraticCalculatorPage() {
  useEffect(() => {
    document.title = 'Quadratic Calculator - Solve Ax^2 + Bx + C = 0 | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Solve quadratic equations Ax^2 + Bx + C = 0 with real or complex roots. Shows discriminant and vertex.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Quadratic Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Solve quadratic equations Ax^2 + Bx + C = 0. Real and complex roots, discriminant, vertex.</p>
          </div>
        </div>

        <QuadraticCalculator />

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
            <Link to="/slope-calculator" className="block rounded-xl border border-border bg-card hover:border-cyan-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Slope Calculator</h3><p className="text-xs text-muted-foreground">Slope between two points</p></Link>
            <Link to="/triangle-calculator" className="block rounded-xl border border-border bg-card hover:border-cyan-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Triangle Calculator</h3><p className="text-xs text-muted-foreground">SSS, SAS, right triangles</p></Link>
            <Link to="/average-calculator" className="block rounded-xl border border-border bg-card hover:border-cyan-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Average Calculator</h3><p className="text-xs text-muted-foreground">Mean, median, mode</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-cyan-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Quadratic Calculator'} />
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