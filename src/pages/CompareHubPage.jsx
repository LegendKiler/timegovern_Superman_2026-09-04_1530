import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, Sparkles, ArrowRight } from 'lucide-react'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import { METRICS } from '../lib/regionCompare'
import HubExtras from '../components/HubExtras';

export default function CompareHubPage() {
  useEffect(() => {
    document.title = 'Compare Countries - Side-by-Side Statistics | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Compare two countries side-by-side on population, GDP, life expectancy, CO2 emissions, energy use, and water use.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-red-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-orange-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-200">{Object.keys(METRICS).length} metrics</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <ArrowLeftRight className="h-10 w-10 md:h-14 md:w-14 text-orange-300" />
              Compare Countries
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Pick a metric, then compare any two countries side-by-side.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {Object.values(METRICS).map(m => (
            <Link key={m.slug} to={'/compare/' + m.slug} className="rounded-xl border border-border bg-card hover:border-orange-400 p-5 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">{m.label}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Compare by {m.label.toLowerCase()}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Compare Countries'} />
        </div>
      <HubExtras category="reference-hub" />
      </div>
    </>
  )
}
