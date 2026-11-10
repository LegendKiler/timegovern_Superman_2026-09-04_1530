import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import SlopeCalculator from '../components/calculators/SlopeCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is slope?", a: "Slope measures how steep a line is. It is the ratio of vertical change (rise) to horizontal change (run) between two points on the line. Slope m = (y2 - y1) / (x2 - x1)." },
  { q: "What does a negative slope mean?", a: "A negative slope means the line goes down from left to right. As x increases, y decreases. A positive slope goes up from left to right." },
  { q: "What is a vertical line's slope?", a: "A vertical line (constant x) has undefined slope because division by zero occurs. A horizontal line (constant y) has slope 0." },
  { q: "What is the slope-intercept form?", a: "y = mx + b, where m is the slope and b is the y-intercept (where the line crosses the y-axis). This calculator outputs both m and b." },
  { q: "How do I convert standard form to slope?", a: "Given Ax + By = C, slope m = -A / B and y-intercept b = C / B. If B = 0, the line is vertical." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Slope Calculator', description: 'Calculate the slope, y-intercept, angle and distance between two points, or convert Ax + By = C to slope form.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/slope-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function SlopeCalculatorPage() {
  useEffect(() => {
    document.title = 'Slope Calculator - Two Points or Ax + By = C | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Calculate the slope, y-intercept, angle and distance between two points, or convert Ax + By = C to slope form.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-red-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Slope Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Find the slope between two points, or convert Ax + By = C into slope-intercept form.</p>
          </div>
        </div>

        <SlopeCalculator />

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
            <Link to="/quadratic-calculator" className="block rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Quadratic Calculator</h3><p className="text-xs text-muted-foreground">Solve Ax^2 + Bx + C</p></Link>
            <Link to="/triangle-calculator" className="block rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Triangle Calculator</h3><p className="text-xs text-muted-foreground">SSS, SAS, right triangles</p></Link>
            <Link to="/area-calculator" className="block rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Area Calculator</h3><p className="text-xs text-muted-foreground">Rectangles, circles, triangles</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Slope Calculator'} />
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