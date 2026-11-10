import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ProbabilityCalculator from '../components/calculators/ProbabilityCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is the union of two events?", a: "P(A union B) is the probability that at least one of A or B happens. It is P(A) + P(B) - P(A intersection B) so overlap is not counted twice." },
  { q: "What is the intersection of two events?", a: "P(A intersection B) is the probability that both A and B happen. If A and B are independent, P(A intersection B) = P(A) x P(B)." },
  { q: "What is conditional probability?", a: "P(A|B) is the probability of A given that B has already occurred. Formula: P(A|B) = P(A intersection B) / P(B). Basis for Bayes theorem." },
  { q: "What does independent mean?", a: "Two events are independent if knowing one happened does not change the probability of the other. Formally, P(A intersection B) = P(A) x P(B)." },
  { q: "What is the complement rule?", a: "P(not A) = 1 - P(A). The probability that A does not happen is one minus the probability that it does." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Probability Calculator', description: 'Calculate union, intersection, conditional probability and check for independence.', applicationCategory: 'EducationalApplication', operatingSystem: 'Web', url: 'https://timegovern.com/probability-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function ProbabilityCalculatorPage() {
  useEffect(() => {
    document.title = 'Probability Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Calculate union, intersection, conditional probability and check for independence.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-pink-950 via-rose-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Probability Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Calculate union, intersection, conditional probability and check for independence.</p>
          </div>
        </div>

        <ProbabilityCalculator />

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
            <Link to="/permutation-combination-calculator" className="block rounded-xl border border-border bg-card hover:border-pink-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Permutation and Combination</h3><p className="text-xs text-muted-foreground">nPr, nCr, factorials</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Probability Calculator'} />
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