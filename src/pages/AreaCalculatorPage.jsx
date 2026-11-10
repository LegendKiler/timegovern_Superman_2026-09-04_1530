import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import AreaCalculator from '../components/calculators/AreaCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is area?", a: "Area is the amount of two-dimensional space a shape covers, measured in square units (m2, ft2, etc.). It is calculated by multiplying two length dimensions." },
  { q: "How do I calculate the area of a circle?", a: "Area = pi x r^2, where r is the radius. For a circle with radius 3 m, the area is about 28.27 m2." },
  { q: "How do I calculate the area of a triangle?", a: "Area = 0.5 x base x height. The height is the perpendicular distance from the base to the opposite vertex - not the slanted side length." },
  { q: "What is the difference between area and perimeter?", a: "Area measures the surface inside a shape (square units). Perimeter measures the distance around the shape (linear units). They use different formulas." },
  { q: "How do I calculate the area of a trapezoid?", a: "Area = 0.5 x (a + b) x h, where a and b are the two parallel sides and h is the perpendicular distance between them." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Area Calculator', description: 'Calculate the area of rectangles, squares, circles, triangles, trapezoids and parallelograms with unit conversion.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/area-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function AreaCalculatorPage() {
  useEffect(() => {
    document.title = 'Area Calculator - Rectangle, Circle, Triangle | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', "Calculate the area of rectangles, squares, circles, triangles, trapezoids and parallelograms with unit conversion.")
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Area Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate the area of rectangles, squares, circles, triangles, trapezoids and parallelograms. Unit conversion included.</p>
          </div>
        </div>

        <AreaCalculator />

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
            <Link to="/volume-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Volume Calculator</h3><p className="text-xs text-muted-foreground">Cube, cylinder, sphere, cone</p></Link>
            <Link to="/triangle-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Triangle Calculator</h3><p className="text-xs text-muted-foreground">SSS, SAS, right triangles</p></Link>
            <Link to="/percentage-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Percentage Calculator</h3><p className="text-xs text-muted-foreground">Percent of a number</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Area Calculator'} />
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