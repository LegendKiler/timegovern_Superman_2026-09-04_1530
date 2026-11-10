import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Sparkles, ArrowRight, Heart, Target, TrendingUp, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import BacCalculator from '../components/calculators/BacCalculator'
import ShareButtons from '../components/ShareButtons'
import SaveCalculation from '../components/SaveCalculation'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is BAC?", a: "Blood Alcohol Content is the percentage of alcohol in your bloodstream. 0.08% means 0.08 grams of alcohol per 100 mL of blood." },
  { q: "What is the legal limit?", a: "In the US and most of Canada, 0.08% is the adult legal driving limit. In the UK, 0.08% (England/Wales) or 0.05% (Scotland). In much of Europe, 0.05%. In Sweden, Norway, and Japan, 0.02%." },
  { q: "How fast does BAC drop?", a: "Roughly 0.015% per hour for the average adult. Nothing speeds this up - coffee, cold showers, and food do not sober you up." },
  { q: "Does body weight affect BAC?", a: "Yes. Heavier people have more blood volume and reach lower BAC for the same number of drinks. Sex matters too: women generally reach higher BAC because of lower body water fraction." },
  { q: "Is this calculator accurate?", a: "It uses the Widmark formula, which is a population average. Individual BAC varies widely based on food, hydration, liver health, genetics, and medication. Never use a calculator to decide whether to drive." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'BAC Calculator', description: 'Estimate blood alcohol content using the Widmark formula. Educational only - never drive after drinking.', applicationCategory: 'HealthApplication', operatingSystem: 'Web', url: 'https://timegovern.com/bac-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function BacCalculatorPage() {
  useEffect(() => {
    document.title = 'BAC Calculator - Free & Private | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Estimate blood alcohol content using the Widmark formula. Educational only - never drive after drinking.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - Private - No signup</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">BAC Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Estimate blood alcohol content using the Widmark formula. Educational only - never drive after drinking.</p>
          </div>
        </div>

        <BacCalculator />

        <div className="flex justify-end">
          <SaveCalculation type="calculation" title="BAC Calculator" inputs={{ tracked: 'health' }} results={{ calculated: true }} />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Card key={i}><CardContent className="p-5"><h3 className="font-bold mb-2">{f.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p></CardContent></Card>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 mb-5 flex items-center justify-between gap-3"><div className="text-sm"><strong>Looking for more?</strong> See all tools in this category.</div><Link to="/health-tools" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:underline shrink-0">View all <ArrowRight className="h-3 w-3" /></Link></div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Related tools</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Link to="/bmi-calculator" className="block rounded-xl border border-border bg-card hover:border-rose-400 p-5 transition-colors">
              <BookOpen className="h-5 w-5 text-rose-500 mb-2" />
              <h3 className="font-bold mb-1">BMI Calculator</h3>
              <p className="text-xs text-muted-foreground">Body Mass Index with healthy weight range.</p>
            </Link>
            <Link to="/calorie-calculator" className="block rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors">
              <BookOpen className="h-5 w-5 text-orange-500 mb-2" />
              <h3 className="font-bold mb-1">Calorie Calculator</h3>
              <p className="text-xs text-muted-foreground">Daily calorie needs by goal.</p>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'BAC Calculator'} />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Medical disclaimer:</strong> This calculator provides estimates for informational purposes only. It is not medical advice. Consult a qualified healthcare professional for personalised guidance.
        </div>
      
      <CalculatorExtras category="health" />
</div>
    </>
  )
}
