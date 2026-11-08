import { useEffect, useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Globe, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import { REGION_BY_SLUG, REGION_SLUGS, METRICS, getCountriesInRegion, regionAggregate } from '../lib/regionCompare'
import { REGION_CONTENT } from '../data/regionContent'

export default function RegionDetailPage() {
  const { slug } = useParams()
  const regionName = REGION_BY_SLUG[slug]
  const content = REGION_CONTENT[slug]

  const countries = useMemo(() => regionName ? getCountriesInRegion(regionName) : [], [regionName])
  const aggregates = useMemo(() => {
    if (!regionName) return null
    const out = {}
    for (const mslug of Object.keys(METRICS)) out[mslug] = regionAggregate(regionName, mslug)
    return out
  }, [regionName])

  useEffect(() => {
    if (!regionName) return
    document.title = regionName + ' - Population, GDP, CO2, Energy & More | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', regionName + ' statistics - population, GDP, life expectancy, CO2 emissions, energy use, and water use for all ' + countries.length + ' countries in ' + regionName + '.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [regionName, countries.length])

  if (!regionName) return <Navigate to="/region" replace />

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/region" className="hover:underline">Regions</Link>
          <span className="mx-1">/</span>
          <span>{regionName}</span>
        </nav>

        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">{countries.length} countries</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <Globe className="h-10 w-10 md:h-14 md:w-14 text-indigo-300" />
              {regionName}
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Combined statistics for all {countries.length} countries in {regionName}.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {Object.entries(METRICS).map(([mslug, m]) => (
            <Card key={mslug}><CardContent className="p-5">
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className="text-2xl font-black tabular-nums">{m.formatShort(aggregates[mslug].value)}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{aggregates[mslug].count} countries with data</div>
            </CardContent></Card>
          ))}
        </div>

        {content && (
          <section className="space-y-5">
            <p className="text-base text-muted-foreground leading-relaxed">{content.intro}</p>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Regional highlights</h2>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                {content.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Economic and demographic context</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.context}</p>
            </div>
          </section>
        )}

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Countries in {regionName}</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {countries.map(c => (
              <Link key={c.code} to={'/population/' + c.code.toLowerCase()} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card hover:border-indigo-400 p-3 transition-colors">
                <span className="font-semibold text-sm truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">{c.code}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Data: World Bank, UN, IEA, FAO. Aggregates computed from country-level values.
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : regionName} />
        </div>
      </div>
    </>
  )
}
