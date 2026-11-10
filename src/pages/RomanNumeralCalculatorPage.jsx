import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import RomanNumeralCalculator from '../components/calculators/RomanNumeralCalculator'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What are the Roman numeral symbols?", a: "I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Values are combined additively, except when a smaller symbol precedes a larger one — then it is subtracted (IV = 4, IX = 9, XL = 40, etc)." },
  { q: "What is the largest Roman numeral?", a: "Standard Roman numerals only go up to 3999 (MMMCMXCIX). The Romans had no symbol for zero, and larger numbers used a vinculum — a bar over the numeral to multiply it by 1000." },
  { q: "Why is 4 IV and not IIII?", a: "Subtractive notation is the standard form: IV (4), IX (9), XL (40), XC (90), CD (400), CM (900). Clock faces traditionally use IIII instead of IV, but that is decorative." },
  { q: "How does the calculator validate?", a: "For Roman to number, the calculator parses the symbols, then converts the result back to Roman numerals. If the round-trip does not match, the input was not canonical." },
  { q: "Are Roman numerals still used?", a: "Yes — in book chapters, film copyright dates, monarch names (Elizabeth II), Super Bowl numbering, and clock faces. They remain a standard part of Western cultural literacy." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Roman Numeral Converter', description: 'Convert between Arabic numbers and Roman numerals. Supports values 1 to 3999 with canonical validation.', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', url: 'https://timegovern.com/roman-numeral-converter', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function RomanNumeralCalculatorPage() {
  useEffect(() => {
    document.title = 'Roman Numeral Converter - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', "Convert between Arabic numbers and Roman numerals. Supports values 1 to 3999 with canonical validation.")
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br slate-950 via-zinc-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Roman Numeral Converter</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Convert between Arabic numbers and Roman numerals. Supports values 1 to 3999 with canonical validation.</p>
          </div>
        </div>

        <RomanNumeralCalculator />

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
            <Link to="/percentage-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Percentage Calculator</h3><p className="text-xs text-muted-foreground">Percent of a number</p></Link>
            <Link to="/average-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Average Calculator</h3><p className="text-xs text-muted-foreground">Mean, median, mode</p></Link>
            <Link to="/standard-deviation-calculator" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Standard Deviation</h3><p className="text-xs text-muted-foreground">Data spread calculator</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Roman Numeral Converter'} />
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-center">
          <Link to="/math-tools" className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            See all math tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      
      <CalculatorExtras category="unit-conversion" />
</div>
    </>
  )
}
