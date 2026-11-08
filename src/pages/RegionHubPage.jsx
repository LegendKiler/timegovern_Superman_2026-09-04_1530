import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import { REGION_ORDER_LIST, REGION_SLUGS, getCountriesInRegion, regionAggregate } from '../lib/regionCompare'

export default function RegionHubPage() {
  useEffect(() => {
    document.title = 'World Regions - All ' + REGION_ORDER_LIST.length + ' Regions | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Explore world statistics by region - population, GDP, life expectancy, CO2 emissions, energy use, and water use for every region.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">{REGION_ORDER_LIST.length} regions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <Globe className="h-10 w-10 md:h-14 md:w-14 text-indigo-300" />
              World Regions
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Explore population, GDP, life expectancy, CO2, energy, and water data for every region of the world.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {REGION_ORDER_LIST.map(r => {
            const countries = getCountriesInRegion(r)
            const pop = regionAggregate(r, 'population')
            return (
              <Link key={r} to={'/region/' + REGION_SLUGS[r]} className="rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">{r}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{countries.length} countries</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                </div>
                <p className="text-sm font-semibold tabular-nums mt-3">{pop.value.toLocaleString('en-US')} people</p>
              </Link>
            )
          })}
        </div>

        <section className="space-y-5">
          <p className="text-base text-muted-foreground leading-relaxed">
            The world’s countries are conventionally grouped into regions that share geographic, cultural, and economic characteristics. These groupings are used by organizations like the World Bank, United Nations, and IMF to organize global statistics and enable meaningful comparisons. Each region has its own population dynamics, economic structure, and environmental footprint, and understanding regional differences is essential for evaluating global trends in population growth, economic development, energy consumption, and climate change.
          </p>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-3">What you can explore</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
              <li>Population totals and distribution across each region’s constituent countries</li>
              <li>Economic aggregates including GDP and GDP per capita comparisons</li>
              <li>Environmental metrics like CO2 emissions, energy use, and water consumption</li>
              <li>Health outcomes through life expectancy data weighted by population</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-3">How the data is organized</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every region page aggregates country-level statistics from authoritative sources — the World Bank for population and GDP, the International Energy Agency for energy data, the FAO for water use, and the Global Carbon Project for CO2 emissions. Sums are computed across all countries in a region that report the relevant metric, while averages like life expectancy are weighted by population so that more populous countries carry proportionally more influence. This produces consistent regional figures that can be compared directly against each other and against global totals.
            </p>
          </div>
        </section>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'World Regions'} />
        </div>
      </div>
    </>
  )
}
