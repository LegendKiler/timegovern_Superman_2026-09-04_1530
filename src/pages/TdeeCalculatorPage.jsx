import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Sparkles, ArrowRight, Heart, Target, TrendingUp, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import TdeeCalculator from '../components/calculators/TdeeCalculator'
import ShareButtons from '../components/ShareButtons'
import SaveCalculation from '../components/SaveCalculation'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "What is TDEE?", a: "Total Daily Energy Expenditure is the total calories you burn per day: BMR (basal metabolism) times an activity multiplier that reflects how much you move." },
  { q: "How is TDEE different from BMR?", a: "BMR is the calories you would burn at complete rest. TDEE adds exercise, walking, digestion, and everything else you do. TDEE is always higher than BMR." },
  { q: "How accurate is TDEE?", a: "Within roughly 5-10% for most adults. Individual metabolism varies. Use TDEE as a starting point and adjust based on actual weight change over 2-3 weeks." },
  { q: "What activity multiplier should I pick?", a: "Be honest. Most people overestimate. If you sit at a desk and lift 3x/week, that is Light (1.375). If you are on your feet all day plus training, that is High (1.725)." },
  { q: "How do I lose weight using TDEE?", a: "Eat 15-25% below TDEE for a sustainable deficit. A 500 kcal daily deficit produces roughly 0.5 kg (1 lb) of fat loss per week." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'TDEE Calculator', description: 'Estimate your Total Daily Energy Expenditure - the calories you burn per day including activity.', applicationCategory: 'HealthApplication', operatingSystem: 'Web', url: 'https://timegovern.com/tdee-calculator', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function TdeeCalculatorPage() {
  useEffect(() => {
    document.title = 'TDEE Calculator - Free & Private | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Estimate your Total Daily Energy Expenditure - the calories you burn per day including activity.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-red-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - Private - No signup</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">TDEE Calculator</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Estimate your Total Daily Energy Expenditure - the calories you burn per day including activity.</p>
          </div>
        </div>

        <TdeeCalculator />

        <div className="flex justify-end">
          <SaveCalculation type="calculation" title="TDEE Calculator" inputs={{ tracked: 'health' }} results={{ calculated: true }} />
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
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'TDEE Calculator'} />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Medical disclaimer:</strong> This calculator provides estimates for informational purposes only. It is not medical advice. Consult a qualified healthcare professional for personalised guidance.
        </div>
      
      <CalculatorExtras category="health" />
</div>
    </>
  )
}
