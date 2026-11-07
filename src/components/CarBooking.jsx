import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { downloadCarVoucher } from './CarBookingPdf'
import CalendarExport from './CalendarExport'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { searchLocations } from '../data/locations'
import { getDefaultCityForCountry, getAirportsForCountry, countryFlag } from '../data/airports'
import { Car, MapPin, Calendar, Users, Search, Loader2, AlertCircle, ExternalLink, Download, Fuel, Gauge, Users2, Briefcase, Snowflake, CheckCircle2, Sparkles, Zap, Star, ChevronDown, Plane, Building2, TrendingDown, TrendingUp, DollarSign, Award, Heart } from 'lucide-react'

// ============================================================
// LOCATION DATABASE (unchanged)
// ============================================================

// ============================================================
// PRICE TIER COLOR SYSTEM
// ============================================================
function getPriceTier(price, allPrices) {
  if (!price || allPrices.length === 0) return {
    tier: 'standard', label: 'Standard', gradient: 'from-slate-500 to-slate-600',
    icon: DollarSign, badge: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  const sorted = [...allPrices].sort((a, b) => a - b)
  const p25 = sorted[Math.floor(sorted.length * 0.25)] || 0
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0
  const p75 = sorted[Math.floor(sorted.length * 0.75)] || 0
  if (price <= p25) return { tier: 'budget', label: 'Budget Pick', gradient: 'from-emerald-500 to-teal-500', icon: TrendingDown, badge: 'bg-emerald-500 text-white' }
  if (price <= p50) return { tier: 'good', label: 'Great Value', gradient: 'from-cyan-500 to-blue-500', icon: Award, badge: 'bg-cyan-500 text-white' }
  if (price <= p75) return { tier: 'premium', label: 'Premium', gradient: 'from-amber-500 to-orange-500', icon: DollarSign, badge: 'bg-amber-500 text-white' }
  return { tier: 'luxury', label: 'Luxury', gradient: 'from-rose-500 to-pink-500', icon: TrendingUp, badge: 'bg-rose-500 text-white' }
}

async function parseSSE(response) {
  const text = await response.text()
  if (text.trim().startsWith('{') && !text.includes('\ndata: ')) return JSON.parse(text)
  const lines = text.split('\n')
  let lastData = null
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const payload = line.slice(6).trim()
      if (payload && payload !== '[DONE]') { try { lastData = JSON.parse(payload) } catch {} }
    }
  }
  if (lastData) return lastData
  throw new Error('Invalid response format')
}

// Format number with thousands separator
const fmtNum = (n) => n?.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'


// ============================================================
// REEFAPI CAR SEARCH (Real Global Inventory)
// ============================================================
async function searchCarsReefAPI(form, apiKey) {
  // Step 1: Autocomplete to get place_id, city_id, country_id
  const autoRes = await fetch('/api/reef/car-rental/v1/cars/autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ query: form.location }),
  });
  if (!autoRes.ok) throw new Error('ReefAPI autocomplete HTTP ' + autoRes.status);
  const autoData = await autoRes.json();
  
  // ReefAPI wraps the response in a 'data' object. Handle both common shapes.
  const places = autoData.data?.results || autoData.data || autoData.results || autoData;
  const place = Array.isArray(places) ? places[0] : places;

  if (!place || !place.place_id) {
    throw new Error('Location not found by ReefAPI');
  }

  // Step 2: Search cars using the resolved IDs
  const searchRes = await fetch('/api/reef/car-rental/v1/cars/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({
      place_id: place.place_id,
      city_id: place.city_id,
      country_id: place.country_id,
      pickup_date: form.pickupDate,
      dropoff_date: form.dropoffDate,
      pickup_time: form.pickupTime,
      dropoff_time: form.dropoffTime,
      driver_age: parseInt(form.age),
      currency: form.currency,
    }),
  });
  if (!searchRes.ok) throw new Error('ReefAPI search HTTP ' + searchRes.status);
  const searchData = await searchRes.json();
  
  const offers = searchData.data?.offers || searchData.offers || [];
  return offers.map(o => ({
    name: o.vehicle?.name || 'Rental car',
    vendor: o.supplier?.name || 'Unknown',
    price: o.price?.amount || 0,
    currency: o.price?.currency || form.currency,
    category: o.vehicle?.category || 'Vehicle',
    transmission: o.vehicle?.transmission || 'Automatic',
    passengers: o.vehicle?.seats || 5,
    bags: o.vehicle?.bags || 2,
    air_con: o.vehicle?.air_conditioning !== false,
    fuel_policy: o.vehicle?.fuel_type || 'Full-Full',
    mileage: o.mileage || 'Limited',
    image_url: o.vehicle?.image || '',
    booking_url: o.book_url || '#',
    free_cancellation: o.free_cancellation || false,
    sipp: o.vehicle?.acriss || 'CAR',
    rental_days: o.price?.rental_days || 1,
    price_per_day: o.price?.daily || null,
  }));
}


export default function CarBooking() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [downloading, setDownloading] = useState(null)
  const [savedId, setSavedId] = useState(null)
  const [locationQuery, setLocationQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [priceFilter, setPriceFilter] = useState('all')
  const suggestionsRef = useRef(null)
  const { user, saveBooking } = useAuth()
  const { location: userLocation } = useUser()

  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7)

  const [form, setForm] = useState({
    location: '',
    pickupDate: tomorrow.toISOString().split('T')[0],
    dropoffDate: nextWeek.toISOString().split('T')[0],
    pickupTime: '10:00', dropoffTime: '10:00',
    age: 30, currency: 'USD',
  })

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  // Auto-detect country
  useEffect(() => {
    if (!userLocation?.country_code) return
    const airports = getAirportsForCountry(userLocation.country_code)
    if (airports.length > 0 && form.location === 'Sydney') {
      updateForm('location', airports[0].city)
      setLocationQuery(airports[0].city)
    }
    const curMap = { 'AU': 'AUD', 'NZ': 'NZD', 'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'IN': 'INR', 'PK': 'PKR', 'AE': 'AED', 'SA': 'SAR', 'JP': 'JPY', 'SG': 'SGD', 'ZA': 'ZAR', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR' }
    if (curMap[userLocation.country_code]) updateForm('currency', curMap[userLocation.country_code])
  }, [userLocation?.country_code])

  const filteredLocations = searchLocations(locationQuery, 10);

  useEffect(() => {
    const handleClick = (e) => { if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) setShowSuggestions(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLocation = (loc) => {
    const locString = loc.city + ', ' + loc.country;
    const curMap = {
    'US':'USD','GB':'GBP','EU':'EUR','AU':'AUD','CA':'CAD','JP':'JPY','CN':'CNY','IN':'INR',
    'PK':'PKR','BD':'BDT','AE':'AED','SA':'SAR','QA':'QAR','KW':'KWD','BH':'BHD','OM':'OMR',
    'ZA':'ZAR','NG':'NGN','KE':'KES','EG':'EGP','MA':'MAD','SG':'SGD','MY':'MYR','TH':'THB',
    'ID':'IDR','PH':'PHP','VN':'VND','TR':'TRY','RU':'RUB','BR':'BRL','MX':'MXN','AR':'ARS',
    'CL':'CLP','CO':'COP','PE':'PEN','NZ':'NZD','CH':'CHF','SE':'SEK','NO':'NOK','DK':'DKK',
    'PL':'PLN','CZ':'CZK','HU':'HUF','IL':'ILS','LK':'LKR','NP':'NPR'
  };
    const newCurrency = curMap[loc.countryCode] || 'USD';

    setForm(prev => ({ ...prev, location: locString, currency: newCurrency }));
    setLocationQuery(loc.city + ' (' + loc.id + ')');
    setShowSuggestions(false);
  }

  const searchCars = async () => {
    if (!form.location) return setError('Please enter a pickup location');
    if (!form.pickupDate || !form.dropoffDate) return setError('Please select pickup and dropoff dates');
    if (new Date(form.dropoffDate) <= new Date(form.pickupDate)) return setError('Dropoff date must be after pickup date');

    setLoading(true);
    setError('');
    setCars([]);
    setPriceFilter('all');

    const cleanLocation = form.location.split(',')[0].trim(); // Send "Dubai", not "Dubai, UAE"
    let apiSuccess = false;

    // ---- 1. REEFAPI (Primary - Real Global Inventory) ----
    try {
      const REEF_KEY = 'ak_live_I_VJiCt2Rc96nZle4h10DAYIRr_3Qu_r';
      const reefResults = await searchCarsReefAPI({ ...form, location: cleanLocation }, REEF_KEY);
      if (reefResults.length > 0) {
        setCars(reefResults);
        setLoading(false);
        apiSuccess = true;
      }
    } catch (e) {
      console.warn('ReefAPI failed:', e.message);
    }

    // ---- 2. OctoTrip (Fallback) ----
    if (!apiSuccess) {
      try {
        const res = await fetch('/api/octotrip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
          body: JSON.stringify({
            jsonrpc: '2.0', id: Date.now(), method: 'tools/call',
            params: { name: 'search', arguments: {
              location: cleanLocation, pickup_date: form.pickupDate, dropoff_date: form.dropoffDate,
              pickup_time: form.pickupTime, dropoff_time: form.dropoffTime,
              age: parseInt(form.age), currency: form.currency, language: 'en',
            }},
          }),
        });
        if (res.ok) {
          const data = await parseSSE(res);
          if (data?.result?.content?.[0]?.text) {
            const payload = JSON.parse(data.result.content[0].text);
            const results = payload.results || payload.cars || [];
            if (results.length > 0) {
              setCars(results);
              setLoading(false);
              apiSuccess = true;
            }
          }
        }
      } catch (e) { console.warn('OctoTrip failed:', e.message); }
    }

    // ---- 3. AgentWeb (Secondary Fallback) ----
    if (!apiSuccess) {
      try {
        const agentResults = await searchCarsAgentWeb({ ...form, location: cleanLocation }, 'aw_live_3131a083e0ffe8afaf3c48685ff354c7');
        if (agentResults.length > 0) {
          setCars(agentResults);
          setLoading(false);
          apiSuccess = true;
        }
      } catch (e) { console.warn('AgentWeb failed:', e.message); }
    }

    // ---- All failed ----
    if (!apiSuccess) {
      setError('No vehicles found at ' + form.location + ' for those dates across all providers. Try a major hub like Dubai, London, or Istanbul.');
    }
    setLoading(false);
  };

  const handleSaveBooking = async (car) => {
    if (!user) { alert('Please sign in to save bookings'); return }
    const { error } = await saveBooking({
      type: 'car', provider: car.vendor, title: car.name, location: form.location,
      startDate: new Date(form.pickupDate + 'T' + form.pickupTime).toISOString(),
      endDate: new Date(form.dropoffDate + 'T' + form.dropoffTime).toISOString(),
      price: car.price, currency: car.currency || form.currency,
      reference: 'CAR-' + Date.now().toString(36).toUpperCase().slice(-6),
      rawData: { ...car, rentalForm: form },
    })
    if (error) alert('Could not save: ' + error.message)
    else { setSavedId(car.sipp + car.vendor); setTimeout(() => setSavedId(null), 2500) }
  }

  const handleDownloadVoucher = async (car) => {
    setDownloading(car.sipp + car.vendor)
    try { await downloadCarVoucher(car, form) }
    catch (err) { alert('Could not generate voucher: ' + err.message) }
    finally { setDownloading(null) }
  }

  const allPrices = cars.map(c => c.price).filter(p => typeof p === 'number')
  const carsWithTiers = cars.map(c => ({ ...c, _tier: getPriceTier(c.price, allPrices) }))
  const presentTiers = ['all', ...new Set(carsWithTiers.map(c => c._tier.tier))]
  const categories = ['all', ...new Set(cars.map(c => c.category).filter(Boolean))]
  const filteredCars = carsWithTiers
    .filter(c => selectedCategory === 'all' || c.category === selectedCategory)
    .filter(c => priceFilter === 'all' || c._tier.tier === priceFilter)
  const tierOrder = { budget: 0, good: 1, premium: 2, luxury: 3, standard: 4 }
  filteredCars.sort((a, b) => tierOrder[a._tier.tier] - tierOrder[b._tier.tier])

  return (
    <div className="w-full">
      {/* ==================== HERO ==================== */}
      <div className="relative overflow-hidden rounded-2xl mb-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59,130,246,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168,85,247,0.4) 0%, transparent 50%)' }}></div>
        <div className="relative z-10 p-6 md:p-10 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Car className="h-7 w-7 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">Find Your Ride</h2>
              <p className="text-cyan-200 text-xs md:text-sm font-medium">Worldwide car rental comparison</p>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl mt-2 text-xs md:text-sm">
            Real-time prices from trusted vendors in 150+ countries. Colour-coded tiers help you spot the best deal.
          </p>
        </div>
      </div>

      {/* ==================== SEARCH FORM ==================== */}
      <Card className="mb-6 border-0 shadow-xl bg-card/95 backdrop-blur overflow-visible">
        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2 relative" ref={suggestionsRef}>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> Pickup Location
              </label>
              <div className="relative cursor-pointer" onClick={() => setShowSuggestions(true)}>
                <Input
                  value={locationQuery || form.location}
                  onChange={(e) => { setLocationQuery(e.target.value); setShowSuggestions(true); updateForm('location', e.target.value) }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={userLocation?.country_code ? countryFlag(userLocation.country_code) + ' ' + (userLocation.country_name || 'Detected') : 'Search worldwide...'}
                  className="h-11 pr-10"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {showSuggestions && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {filteredLocations.map((loc, i) => (
                    <button key={i} onClick={() => selectLocation(loc)} className="w-full text-left px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 border-b border-border last:border-0">
                      <span className="text-xl">{loc.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-1.5">
                          {loc.type === 'airport' ? <Plane className="h-3 w-3 text-sky-500" /> : <Building2 className="h-3 w-3 text-emerald-500" />}
                          {loc.city} {loc.type === 'airport' ? '(' + loc.id + ')' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {loc.type === 'airport' ? loc.name : 'All locations'} · {loc.country}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Pickup</label>
              <Input type="date" onClick={(e) => e.target.showPicker?.()} value={form.pickupDate} onChange={(e) => updateForm('pickupDate', e.target.value)} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Dropoff</label>
              <Input type="date" onClick={(e) => e.target.showPicker?.()} value={form.dropoffDate} onChange={(e) => updateForm('dropoffDate', e.target.value)} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5">Pickup Time</label>
              <Input type="time" onClick={(e) => e.target.showPicker?.()} value={form.pickupTime} onChange={(e) => updateForm('pickupTime', e.target.value)} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5">Dropoff Time</label>
              <Input type="time" onClick={(e) => e.target.showPicker?.()} value={form.dropoffTime} onChange={(e) => updateForm('dropoffTime', e.target.value)} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> Age</label>
              <Input type="number" min="18" max="99" value={form.age} onChange={(e) => updateForm('age', e.target.value)} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5">Currency</label>
              <select value={form.currency} onChange={(e) => updateForm('currency', e.target.value)} className="w-full h-11 px-3 border border-border rounded-lg bg-background text-foreground">
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="AUD">AUD $</option>
                <option value="CAD">CAD $</option>
                <option value="NZD">NZD $</option>
                <option value="AED">AED د.إ</option>
                <option value="PKR">PKR ₨</option>
                <option value="INR">INR ₹</option>
                <option value="JPY">JPY ¥</option>
                <option value="SGD">SGD $</option>
                <option value="ZAR">ZAR R</option>
              </select>
            </div>
          </div>

          <Button onClick={searchCars} disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:opacity-90 text-white h-12 px-10 shadow-lg font-semibold text-base">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
            {loading ? 'Searching...' : 'Search Cars'}
          </Button>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-muted-foreground self-center">Popular:</span>
            {['Sydney', 'London', 'Tokyo', 'Dubai', 'Mumbai', 'New York', 'Istanbul'].map(city => (
              <button key={city} onClick={() => { updateForm('location', city); setLocationQuery(city) }} className="text-xs bg-muted hover:bg-primary hover:text-white px-3 py-1 rounded-full transition-colors">{city}</button>
            ))}
          </div>

          {error && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                No vehicles found at {form.location}
              </h3>
              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
                We checked all partner providers — none have inventory here for your dates.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => { setError(''); setForm(prev => ({ ...prev, location: 'Dubai', currency: 'AED' })); }} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">Try Dubai</button>
                <button onClick={() => { setError(''); setForm(prev => ({ ...prev, location: 'London', currency: 'GBP' })); }} className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">Try London</button>
                <button onClick={() => setError('')} className="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
        </CardContent>
      </Card>

      {/* ==================== FILTERS ==================== */}
      {cars.length > 0 && (
        <div className="space-y-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={'px-4 py-2 rounded-full text-sm font-medium transition-all ' + (selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' : 'bg-muted hover:bg-muted/70')}>
                {cat === 'all' ? 'All Cars' : cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-medium">Price tier:</span>
            {presentTiers.map(tier => {
              const config = {
                all: { label: 'All Prices', color: 'bg-slate-600', icon: DollarSign },
                budget: { label: 'Budget', color: 'bg-emerald-500', icon: TrendingDown },
                good: { label: 'Great Value', color: 'bg-cyan-500', icon: Award },
                premium: { label: 'Premium', color: 'bg-amber-500', icon: DollarSign },
                luxury: { label: 'Luxury', color: 'bg-rose-500', icon: TrendingUp },
                standard: { label: 'Standard', color: 'bg-slate-500', icon: DollarSign },
              }[tier]
              const Icon = config.icon
              return (
                <button key={tier} onClick={() => setPriceFilter(tier)}
                  className={'px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ' + (priceFilter === tier ? config.color + ' text-white shadow-md' : 'bg-muted hover:bg-muted/70')}>
                  <Icon className="h-3 w-3" /> {config.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ==================== RESULTS ==================== */}
      {filteredCars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCars.map((car, idx) => {
            const tier = car._tier
            const gradient = tier.gradient
            const TierIcon = tier.icon
            const rentalDays = car.rental_days || 4
            return (
              <Card key={idx} className="overflow-hidden border border-border shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group bg-card flex flex-col">
                {/* --- Image Section --- */}
                <div className="relative overflow-hidden bg-muted">
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={car.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.style.display = 'none' }}
                    />
                  ) : null}
                  {!car.image_url && (
                    <div className={'w-full h-48 bg-gradient-to-br ' + gradient + ' flex items-center justify-center text-white'}>
                      <Car className="h-20 w-20 opacity-70" />
                    </div>
                  )}

                  {/* Tier ribbon — clean, top-right */}
                  <div className={'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg bg-gradient-to-r ' + gradient}>
                    <TierIcon className="h-3.5 w-3.5" />
                    {tier.label}
                  </div>

                  {/* Category — top-left */}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {car.category || 'Vehicle'}
                  </div>

                  {/* Free cancel — bottom-left of image */}
                  {car.free_cancellation && (
                    <div className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <CheckCircle2 className="h-3 w-3" /> Free cancellation
                    </div>
                  )}
                </div>

                {/* --- Content Section --- */}
                <CardContent className="p-5 flex-1 flex flex-col">
                  {/* Title + Vendor */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg leading-snug mb-1 line-clamp-2" title={car.name}>
                      {car.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground font-medium">{car.vendor}</p>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">4.5</span>
                      </div>
                    </div>
                  </div>

                  {/* Specs — 3 clean tiles */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl py-3 border border-border">
                      <Users2 className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-bold">{car.passengers || 5}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Seats</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl py-3 border border-border">
                      <Briefcase className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-bold">{car.bags || 2}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Bags</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl py-3 border border-border">
                      <Gauge className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-bold capitalize">{car.transmission?.slice(0, 4) || 'Auto'}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Gear</span>
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {car.air_con && (
                      <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[11px] font-medium px-2 py-1 rounded-md">
                        <Snowflake className="h-3 w-3" /> A/C
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-muted text-muted-foreground text-[11px] font-medium px-2 py-1 rounded-md">
                      <Fuel className="h-3 w-3" /> {car.fuel_policy || 'Full-Full'}
                    </span>
                    {car.mileage === 'Unlimited' && (
                      <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium px-2 py-1 rounded-md">
                        ♾️ Unlimited km
                      </span>
                    )}
                  </div>

                  {/* Price block — clear hierarchy */}
                  <div className="mt-auto">
                    <div className="bg-muted/40 border border-border rounded-xl p-4 mb-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">
                            Total · {rentalDays} days
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-bold text-muted-foreground">{car.currency || 'AUD'}</span>
                            <span className="text-2xl font-black text-foreground tabular-nums">
                              {fmtNum(car.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {car.price_per_day && (
                        <div className="mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
                          <span>Equivalent per day</span>
                          <span className="font-semibold text-foreground">
                            {car.currency || 'AUD'} {fmtNum(car.price_per_day)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <a href={car.booking_url} target="_blank" rel="noopener noreferrer" className="col-span-2">
                        <Button className={'w-full bg-gradient-to-r ' + gradient + ' hover:opacity-90 text-white font-semibold h-11'}>
                          <ExternalLink className="h-4 w-4 mr-2" /> Book Now
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        onClick={() => handleSaveBooking(car)}
                        className="h-10"
                        title="Save to my account"
                      >
                        {savedId === car.sipp + car.vendor ? (
                          <><CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-500" /> Saved</>
                        ) : (
                          <><Heart className="h-4 w-4 mr-1.5" /> Save</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadVoucher(car)}
                        disabled={downloading === car.sipp + car.vendor}
                        className="h-10"
                        title="Download PDF voucher"
                      >
                        {downloading === car.sipp + car.vendor ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <><Download className="h-4 w-4 mr-1.5" /> PDF</>
                        )}
                      </Button>
                      <div className="col-span-2">
                        <CalendarExport
                          title={car.name + ' - ' + car.vendor}
                          description={'Rental at ' + form.location + ' · ' + car.category}
                          location={form.location}
                          startDate={new Date(form.pickupDate + 'T' + form.pickupTime).toISOString()}
                          endDate={new Date(form.dropoffDate + 'T' + form.dropoffTime).toISOString()}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && cars.length === 0 && !error && (
        <Card className="border-dashed border-2 border-border bg-gradient-to-br from-muted/30 to-muted/10">
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 mb-5 shadow-lg">
              <Car className="h-14 w-14 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to hit the road?</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-5">
              Compare cars worldwide — colour-coded prices help you spot the best deal instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full font-semibold">Budget</span>
              <span className="text-xs bg-cyan-500 text-white px-3 py-1.5 rounded-full font-semibold">Great Value</span>
              <span className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-full font-semibold">Premium</span>
              <span className="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-full font-semibold">Luxury</span>
            </div>
          </CardContent>
        </Card>
      )}

      {cars.length > 0 && (
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Results powered by <a href="https://octotrip.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OctoTrip</a>. Tier colours are relative to each search.</p>
        </div>
      )}
    </div>
  )
}
