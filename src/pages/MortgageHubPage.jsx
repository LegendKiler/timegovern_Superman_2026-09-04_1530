import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
import { Link } from 'react-router-dom'
import { Home, ArrowRight, TrendingUp, Building2, Globe, Calculator, Sparkles, Shield, Zap, CheckCircle2, Star } from 'lucide-react'

const COUNTRIES = [
  { code: 'EU', flag: '🇪🇺', name: 'Europe', desc: '14 countries — France, Germany, Spain, Italy, Netherlands, Switzerland, and more', count: 14, href: '/mortgage/europe', gradient: 'from-blue-600 to-indigo-600', featured: true },
  { code: 'AU', flag: '🇦🇺', name: 'Australia', desc: 'Home loans, offset, stamp duty, LMI, novated lease', count: 10, href: '/mortgage/australia', gradient: 'from-emerald-500 to-teal-500', featured: true },
  { code: 'US', flag: '🇺🇸', name: 'United States', desc: 'Amortization, bi-weekly, FHA, VA, PMI, refinance', count: 8, href: '/mortgage/usa', gradient: 'from-blue-500 to-indigo-500' },
  { code: 'UK', flag: '🇬🇧', name: 'United Kingdom', desc: 'Repayment, overpayment, stamp duty, remortgage', count: 6, href: '/mortgage/uk', gradient: 'from-red-500 to-rose-500' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', desc: 'CMHC, bi-weekly accelerated, land transfer tax', count: 6, href: '/mortgage/canada', gradient: 'from-red-500 to-pink-500' },
  { code: 'IN', flag: '🇮🇳', name: 'India', desc: 'Home loan EMI, prepayment, balance transfer', count: 6, href: '/mortgage/india', gradient: 'from-orange-500 to-amber-500' },
  { code: 'AP', flag: '🌏', name: 'Asia-Pacific', desc: 'Japan, Singapore, Malaysia, Indonesia, Pakistan', count: 5, href: '/mortgage/asia-pacific', gradient: 'from-red-500 to-orange-500', featured: true },
]

const FEATURED = [
  { name: 'Home Loan Repayment', href: '/mortgage/australia/home-loan-repayment', desc: 'Calculate monthly repayments and total interest', icon: Home },
  { name: 'Offset Account', href: '/mortgage/australia/offset-account', desc: 'See how much interest you save with an offset', icon: TrendingUp },
  { name: 'Stamp Duty', href: '/mortgage/australia/stamp-duty', desc: 'All 8 states and territories', icon: Building2 },
  { name: 'LMI Calculator', href: '/mortgage/australia/lmi', desc: 'Lenders Mortgage Insurance premium', icon: Shield },
  { name: 'Novated Lease', href: '/mortgage/australia/novated-lease', desc: 'Pre-tax car lease with FBT and ECM', icon: Calculator },
  { name: 'Borrowing Power', href: '/mortgage/australia/borrowing-power', desc: 'How much you can borrow', icon: Zap },
]

export default function MortgageHubPage() {

  useEffect(() => {
    document.title = 'Mortgage Hub | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-7xl">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl mb-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950"></div>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(16,185,129,0.6) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(20,184,166,0.6) 0%, transparent 50%)' }}></div>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        <div className="relative z-10 p-8 md:p-14 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <Home className="h-3.5 w-3.5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Mortgage & Property Tools</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-[1.05]">
            Mortgage<br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Calculators</span>
          </h1>
          <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed mb-8">
            Free mortgage calculators for Australia, USA, UK, Canada, and India. Home loans, offset accounts, stamp duty, LMI, novated leases, and more — all with country-specific formulas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><Globe className="h-4 w-4 text-emerald-300" /><span className="text-2xl md:text-3xl font-black">5</span></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Countries</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><Calculator className="h-4 w-4 text-teal-300" /><span className="text-2xl md:text-3xl font-black">33</span></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Calculators</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="h-4 w-4 text-cyan-300" /><span className="text-2xl md:text-3xl font-black">Free</span></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Forever</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><Star className="h-4 w-4 text-amber-300" /><span className="text-2xl md:text-3xl font-black">Live</span></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* COUNTRY SELECTOR */}
      <section className="mb-12">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Choose your country</h2>
            <p className="text-sm text-muted-foreground mt-1">Each calculator uses local tax rules, currency, and terminology.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COUNTRIES.map(c => (
            <Link key={c.code} to={c.href} className="group relative">
              <div className={'absolute -inset-0.5 bg-gradient-to-r ' + c.gradient + ' rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500'}></div>
              <div className="relative h-full p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all overflow-hidden">
                <div className={'h-1.5 -m-6 mb-4 bg-gradient-to-r ' + c.gradient}></div>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl leading-none">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-lg">{c.name}</h3>
                      {c.featured && <span className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full">Featured</span>}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs font-bold text-muted-foreground">{c.count} calculators</span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">Browse <ArrowRight className="h-3 w-3" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED — AUSTRALIA */}
      <section className="mb-12">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/20">
              <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Australian mortgage tools</h2>
              <p className="text-sm text-muted-foreground mt-1">Built for Australian home buyers and investors.</p>
            </div>
          </div>
          <Link to="/mortgage/australia" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View all 10 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED.map((f, i) => {
            const Icon = f.icon
            return (
              <Link key={i} to={f.href} className="group p-5 rounded-2xl border-2 border-border bg-card hover:border-emerald-500/60 hover:shadow-xl transition-all">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg w-fit mb-4">
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-base mb-1">{f.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">Open calculator <ArrowRight className="h-3 w-3" /></div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WHY USE */}
      <section className="mb-12">
        <div className="p-6 md:p-10 rounded-3xl border-2 border-border bg-gradient-to-br from-muted/30 to-muted/10">
          <h2 className="text-2xl font-black tracking-tight mb-6">Why use TimeGovern mortgage tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-card border border-border">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-3" />
              <h3 className="font-bold mb-1">Country-accurate formulas</h3>
              <p className="text-xs text-muted-foreground">Australian P&I, US bi-weekly, UK overpayment, Canadian semi-annual — all calculated correctly.</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border">
              <Zap className="h-6 w-6 text-amber-500 mb-3" />
              <h3 className="font-bold mb-1">Live results as you type</h3>
              <p className="text-xs text-muted-foreground">Every field updates instantly. No submit button, no waiting.</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border">
              <Shield className="h-6 w-6 text-blue-500 mb-3" />
              <h3 className="font-bold mb-1">100% free, no signup</h3>
              <p className="text-xs text-muted-foreground">All tools are free forever. No account required, no emails, no tracking.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section className="hub-extras">
        <h2>How to use this hub</h2>
        <p>Mortgage decisions turn on four inputs: loan amount, interest rate, term, and down payment. The calculators here let you vary each one and see the effect on monthly payment, total interest, and payoff time. Start with the main loan calculator for a first estimate, then refine with the amortization or down-payment tools as you narrow down a specific property.</p>
      </section>
    </div>
  )
}