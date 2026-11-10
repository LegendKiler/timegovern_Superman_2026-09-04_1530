import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Sparkles, ArrowRight, Heart, Target, TrendingUp, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ProteinCalculator from '../components/calculators/ProteinCalculator'
import ShareButtons from '../components/ShareButtons'
import SaveCalculation from '../components/SaveCalculation'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How much protein do I need?", a: "Sedentary adults need 0.8 g/kg. Active adults 1.2-1.6 g/kg. Strength training 1.6-2.2 g/kg. Older adults 1.0-1.2 g/kg to preserve muscle." },
  { q: "Can I eat too much protein?", a: "Healthy adults can safely eat up to 2.5 g/kg without kidney issues. Very high intake may displace other nutrients and cause digestive discomfort." },
  { q: "Is plant protein as good as animal protein?", a: "Plant proteins are complete when combined (rice + beans). Plant sources are slightly less bioavailable, so vegans may need 10-20% more total protein." },
  { q: "Does protein timing matter?", a: "Total daily protein matters most. Spreading it across 3-4 meals (25-40 g each) may maximise muscle protein synthesis." },
  { q: "When should older adults increase protein?", a: "After age 60, muscle protein synthesis becomes less efficient. Increasing to 1.0-1.2 g/kg helps preserve muscle mass against age-related loss." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Protein Calculator', description: 'Find your daily protein target based on body weight, activity level, and training goal.', applicationCategory: 'HealthApplication', operatingSystem: 'Web', url: 'https://timegovern.com/protein-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function ProteinCalculatorPage() {
  useEffect(() => {
    document.title = 'Protein Calculator - Free & Private | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Find your daily protein target based on body weight, activity level, and training goal.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - Private - No signup</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">Protein Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Find your daily protein target based on body weight, activity level, and training goal.</p>
          </div>
        </div>

        <ProteinCalculator />

        <div className="flex justify-end">
          <SaveCalculation type="calculation" title="Protein Calculator" inputs={{ tracked: 'health' }} results={{ calculated: true }} />
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
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Protein Calculator'} />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Medical disclaimer:</strong> This calculator provides estimates for informational purposes only. It is not medical advice. Consult a qualified healthcare professional for personalised guidance.
        </div>
      
      <CalculatorExtras category="health" />
</div>
    </>
  )
}
