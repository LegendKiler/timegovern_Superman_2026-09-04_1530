import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Sparkles, ArrowRight, ExternalLink } from 'lucide-react'
import CarBooking from '../components/CarBooking'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import HubExtras from '../components/HubExtras';

export default function CarsPage() {
  useEffect(() => {
    document.title = 'Car Rental - Search and Book Worldwide | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Search and book rental cars worldwide. Compare prices across providers, save bookings, and download vouchers.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 max-w-6xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-cyan-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Compare - Book - Save</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <Car className="h-10 w-10 md:h-14 md:w-14 text-emerald-300" />
              Car Rental
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Search rental cars worldwide. Compare prices across providers, save bookings, and download vouchers.
            </p>
          </div>
        </div>

        <CarBooking />

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Related tools</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <Link to="/flights" className="block rounded-xl border border-border bg-card hover:border-sky-400 p-5 transition-colors group">
              <Car className="h-5 w-5 text-sky-500 mb-2" />
              <h3 className="font-bold mb-1">Flights</h3>
              <p className="text-xs text-muted-foreground">Search any route worldwide.</p>
            </Link>
            <Link to="/my-bookings" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors group">
              <Car className="h-5 w-5 text-indigo-500 mb-2" />
              <h3 className="font-bold mb-1">My Bookings</h3>
              <p className="text-xs text-muted-foreground">All your saved flights and cars.</p>
            </Link>
            <Link to="/flight-map" className="block rounded-xl border border-border bg-card hover:border-emerald-400 p-5 transition-colors group">
              <Car className="h-5 w-5 text-emerald-500 mb-2" />
              <h3 className="font-bold mb-1">Live Flight Map</h3>
              <p className="text-xs text-muted-foreground">Track flights in real time.</p>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title="Car Rental - TimeGovern" />
        </div>
      <HubExtras category="travel" />
      </div>
    </>
  )
}