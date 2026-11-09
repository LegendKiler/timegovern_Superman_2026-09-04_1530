import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, Percent, Sigma, Sparkles, ArrowRight, Divide, BarChart3, GraduationCap, Hash } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import HubExtras from '../components/HubExtras';

const TOOLS = [
  { to: '/ratio-calculator', name: 'Ratio Calculator', desc: 'Simplify ratios and solve proportions (A:B = C:D).', icon: Percent, color: 'purple' },
  { to: '/average-calculator', name: 'Average Calculator', desc: 'Mean, median, and mode from any data set.', icon: BarChart3, color: 'indigo' },
  { to: '/scientific-calculator', name: 'Scientific Calculator', desc: 'Trig, log, powers, with DEG/RAD mode toggle.', icon: Calculator, color: 'rose' },
  { to: '/standard-deviation-calculator', name: 'Standard Deviation Calculator', desc: 'Population + sample SD, variance, mean, median from any data set.', icon: BarChart3, color: 'indigo' },
  { to: '/fraction-calculator', name: 'Fraction Calculator', desc: 'Add, subtract, multiply, divide fractions with auto-simplify.', icon: Divide, color: 'purple' },
  { to: '/percentage-calculator', name: 'Percentage Calculator', desc: 'Percent of, increase, decrease, and difference between two numbers.', icon: Percent, color: 'indigo' },
  { to: '/grade-calculator', name: 'Grade Calculator', desc: 'Weighted grades in US GPA, UK class, German, French, Indian, or percentage scales.', icon: GraduationCap, color: 'amber' },
  { to: '/roman-numeral-converter', name: 'Roman Numeral Converter', desc: 'Convert between Arabic numbers and Roman numerals.', icon: Hash, color: 'slate' },
]

const FAQ = [
  { q: 'What are math tools?', a: 'Free math calculators for everyday problems - percentages, fractions, statistics, and more. All run in your browser.' },
  { q: 'Are these math tools free?', a: 'Yes, completely free with no signup required.' },
  { q: 'Which math tool should I start with?', a: 'The Percentage Calculator is the most useful for everyday life - discounts, tips, taxes, and price changes.' },
  { q: 'Do the tools work on mobile?', a: 'Yes. Every tool works on phones, tablets, and desktops.' },
  { q: 'Is my data private?', a: 'Yes. Everything runs in your browser. Nothing is sent to a server.' },
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const COLLECTION_SCHEMA = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Math Tools & Calculators', description: 'Free math tools - percentage, fraction, and more.', url: 'https://timegovern.com/math-tools' }

export default function MathToolsHub() {
  useEffect(() => {
    document.title = 'Math Tools & Calculators - Free & Private | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Free math tools and calculators - percentages, and more. All in one place, no signup, 100% private.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_SCHEMA) }} />

      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">{TOOLS.length} tool - Free - Private</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <Calculator className="h-10 w-10 md:h-14 md:w-14 text-indigo-300" />
              Math Tools
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Free calculators for percentages, fractions, and everyday math problems.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">The math tools</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {TOOLS.map((t) => {
              const Icon = t.icon
              return (
                <Link key={t.to} to={t.to} className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={'p-2.5 rounded-xl bg-' + t.color + '-500/10 border border-' + t.color + '-500/30 shrink-0'}>
                      <Icon className={'h-5 w-5 text-' + t.color + '-500'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black mb-1 text-sm">{t.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{t.desc}</p>
                      <div className="text-[11px] font-bold text-indigo-500 inline-flex items-center gap-1">Open tool <ArrowRight className="h-3 w-3" /></div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (<Card key={i}><CardContent className="p-5"><h3 className="font-bold mb-2">{f.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p></CardContent></Card>))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Math Tools'} />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Note:</strong> These tools are for informational purposes only.
        </div>
      <HubExtras category="reference-hub" />
      </div>
    </>
  )
}