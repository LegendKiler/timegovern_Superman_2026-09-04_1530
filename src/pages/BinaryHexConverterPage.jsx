import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import BinaryHexConverter from '../components/calculators/BinaryHexConverter'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How do I convert binary to hex?", a: "Group the binary digits in sets of four from the right. Each group of four bits maps to one hex digit (0000 = 0, 1111 = F). Pad the leftmost group with zeros if needed." },
  { q: "How do I convert hex to binary?", a: "Replace each hex digit with its four-bit binary equivalent. A = 1010, F = 1111, so 0xAF = 1010 1111." },
  { q: "What is hexadecimal?", a: "Hexadecimal is base 16, using digits 0-9 and letters A-F (A = 10, F = 15). It is common in programming because 4 binary bits map cleanly to 1 hex digit." },
  { q: "What does the 0x prefix mean?", a: "0x is a common prefix indicating a hexadecimal literal in most programming languages. 0b means binary, 0o means octal. This converter accepts and strips them automatically." },
  { q: "Why do programmers use hex?", a: "Two hex digits represent exactly one byte (8 bits). This makes hex compact and readable for memory addresses, color codes (#RRGGBB) and byte-level data." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Binary Hex Converter', description: 'Free binary to hex converter. Convert between binary, octal, decimal, and hexadecimal instantly. Accepts 0b, 0o, and 0x prefixes. Works offline, no signup needed.', applicationCategory: 'DeveloperApplication', operatingSystem: 'Web', url: 'https://timegovern.com/binary-hex-converter', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function BinaryHexConverterPage() {
  useEffect(() => {
    document.title = 'Binary Hex Converter - Decimal, Octal, Hex | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Free binary to hex converter. Convert between binary, octal, decimal, and hexadecimal instantly. Accepts 0b, 0o, and 0x prefixes. Works offline, no signup needed.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Binary / Hex Converter</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Convert between binary, octal, decimal and hexadecimal. Accepts 0b, 0o, 0x prefixes.</p>
          </div>
        </div>

        <BinaryHexConverter />

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
            <Link to="/roman-numeral-converter" className="block rounded-xl border border-border bg-card hover:border-slate-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Roman Numeral Converter</h3><p className="text-xs text-muted-foreground">Arabic to Roman</p></Link>
            <Link to="/percentage-calculator" className="block rounded-xl border border-border bg-card hover:border-slate-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Percentage Calculator</h3><p className="text-xs text-muted-foreground">Percent of a number</p></Link>
            <Link to="/average-calculator" className="block rounded-xl border border-border bg-card hover:border-slate-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Average Calculator</h3><p className="text-xs text-muted-foreground">Mean, median, mode</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-slate-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Binary Hex Converter'} />
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