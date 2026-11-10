import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import MatrixCalculator from '../components/calculators/MatrixCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is a determinant?", a: "For a 2x2 matrix [a, b; c, d], the determinant is ad - bc. It measures how the matrix scales area and tells you whether the matrix is invertible." },
  { q: "When does a matrix have an inverse?", a: "A matrix has an inverse if and only if its determinant is not zero. Matrices with determinant 0 are called singular and have no inverse." },
  { q: "What is the transpose?", a: "The transpose swaps rows and columns. For [a, b; c, d], the transpose is [a, c; b, d] - the diagonal stays put, the off-diagonal swaps." },
  { q: "How do I multiply 2x2 matrices?", a: "Row times column. (A times B)[1,1] = A[1,1] x B[1,1] + A[1,2] x B[2,1]. Matrix multiplication is not commutative - A times B is not equal to B times A in general." },
  { q: "Where are 2x2 matrices used?", a: "Linear transformations in graphics, solving systems of equations, covariance matrices in statistics, and representing rotations and reflections in 2D geometry." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: '2x2 Matrix Calculator', description: 'Determinant, inverse, transpose, and multiplication for 2x2 matrices.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/matrix-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function MatrixCalculatorPage() {
  useEffect(() => {
    document.title = '2x2 Matrix Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Determinant, inverse, transpose, and multiplication for 2x2 matrices.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-slate-900 via-gray-900 to-black" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">2x2 Matrix Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Determinant, inverse, transpose, and multiplication for 2x2 matrices.</p>
          </div>
        </div>

        <MatrixCalculator />

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
            <Link to="/exponent-root-calculator" className="block rounded-xl border border-border bg-card hover:border-slate-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Exponent and Root Calculator</h3><p className="text-xs text-muted-foreground">Powers, roots, e^x</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : '2x2 Matrix Calculator'} />
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