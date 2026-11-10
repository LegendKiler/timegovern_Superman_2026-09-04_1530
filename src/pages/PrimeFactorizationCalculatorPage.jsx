import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import PrimeFactorizationCalculator from '../components/calculators/PrimeFactorizationCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is prime factorization?", a: "Prime factorization breaks a number into the primes that multiply together to make it. 360 = 2 x 2 x 2 x 3 x 3 x 5, written as 2^3 x 3^2 x 5." },
  { q: "What is the Fundamental Theorem of Arithmetic?", a: "Every integer greater than 1 has a unique prime factorization up to ordering. This makes primes the building blocks of all integers." },
  { q: "How do I know if a number is prime?", a: "A prime has exactly two divisors: 1 and itself. The calculator checks this automatically and reports whether your input is prime or composite." },
  { q: "How many divisors does a number have?", a: "If n = p1^a1 x p2^a2 x ... then the number of divisors is (a1+1)(a2+1).... For 360 = 2^3 x 3^2 x 5, that is (3+1)(2+1)(1+1) = 24." },
  { q: "Where is prime factorization used?", a: "Cryptography (RSA encryption), simplifying fractions, finding GCD and LCM, and number theory. Most modern encryption depends on how hard it is to factor large numbers." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Prime Factorization Calculator', description: 'Find the prime factorization of any integer and see all its divisors.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/prime-factorization-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function PrimeFactorizationCalculatorPage() {
  useEffect(() => {
    document.title = 'Prime Factorization Calculator - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Find the prime factorization of any integer and see all its divisors.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-violet-950 via-purple-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Prime Factorization Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Find the prime factorization of any integer and see all its divisors.</p>
          </div>
        </div>

        <PrimeFactorizationCalculator />

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
            <Link to="/gcd-lcm-calculator" className="block rounded-xl border border-border bg-card hover:border-violet-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">GCD / LCM Calculator</h3><p className="text-xs text-muted-foreground">Greatest common divisor</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Prime Factorization Calculator'} />
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