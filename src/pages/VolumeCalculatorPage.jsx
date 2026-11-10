import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import VolumeCalculator from '../components/calculators/VolumeCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is volume?", a: "Volume is the amount of three-dimensional space an object occupies, measured in cubic units (m3, ft3, etc.). It requires three length dimensions." },
  { q: "How do I calculate the volume of a sphere?", a: "Volume = (4/3) x pi x r^3. For a sphere with radius 3 m, the volume is about 113.1 m3." },
  { q: "How do I calculate the volume of a cylinder?", a: "Volume = pi x r^2 x h, where r is the radius of the circular base and h is the height. For r = 2, h = 5, volume is about 62.83 m3." },
  { q: "How do I calculate the volume of a cone?", a: "Volume = (1/3) x pi x r^2 x h. A cone is one third of the cylinder with the same base and height." },
  { q: "What is the difference between volume and capacity?", a: "Volume is the space an object occupies. Capacity is how much a container can hold. In most everyday calculations, they are used interchangeably with the same units." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Volume Calculator', description: 'Calculate the volume of cubes, rectangular prisms, cylinders, spheres, cones and pyramids.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/volume-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function VolumeCalculatorPage() {
  useEffect(() => {
    document.title = 'Volume Calculator - Cube, Sphere, Cylinder, Cone | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', "Calculate the volume of cubes, rectangular prisms, cylinders, spheres, cones and pyramids.")
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Volume Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate the volume of cubes, rectangular prisms, cylinders, spheres, cones and pyramids.</p>
          </div>
        </div>

        <VolumeCalculator />

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
            <Link to="/area-calculator" className="block rounded-xl border border-border bg-card hover:border-blue-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Area Calculator</h3><p className="text-xs text-muted-foreground">Rectangles, circles, triangles</p></Link>
            <Link to="/triangle-calculator" className="block rounded-xl border border-border bg-card hover:border-blue-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Triangle Calculator</h3><p className="text-xs text-muted-foreground">SSS, SAS, right triangles</p></Link>
            <Link to="/percentage-calculator" className="block rounded-xl border border-border bg-card hover:border-blue-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Percentage Calculator</h3><p className="text-xs text-muted-foreground">Percent of a number</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-blue-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Volume Calculator'} />
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