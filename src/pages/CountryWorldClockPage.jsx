import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COUNTRY_PROFILES as countryProfiles } from '../data/countryProfiles';

const flagEmoji = (iso2 = '') =>
  iso2.length === 2
    ? String.fromCodePoint(
        ...[...iso2.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
      )
    : '\uD83C\uDF0D';

const safeTime = (tz, now) => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(now);
  } catch { return '--:--:--'; }
};

const safeDate = (tz, now) => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, weekday: 'short', day: '2-digit', month: 'short',
    }).format(now);
  } catch { return ''; }
};

const dayOffset = (tz, now) => {
  try {
    const p = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(now);
    const get = (t) => +p.find((x) => x.type === t)?.value;
    const target = Date.UTC(get('year'), get('month') - 1, get('day'));
    const l = new Date();
    const localDay = Date.UTC(l.getFullYear(), l.getMonth(), l.getDate());
    return Math.round((target - localDay) / 86400000);
  } catch { return 0; }
};

function CityCard({ city, now, fallbackTz }) {
  const tz = city.timezone || city.tz || fallbackTz || 'UTC';
  const offset = dayOffset(tz, now);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate font-semibold text-slate-900" title={city.name}>{city.name}</h3>
        {offset !== 0 && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
            {offset > 0 ? '+' : ''}{offset}d
          </span>
        )}
      </div>
      <div className="mt-3 font-mono text-2xl tabular-nums text-slate-900">{safeTime(tz, now)}</div>
      <div className="mt-1 truncate text-xs text-slate-500" title={tz}>{safeDate(tz, now)} - {tz}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
      <div className="h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-4 h-7 w-1/2 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
    </div>
  );
}

export default function CountryWorldClockPage() {
  const { iso2 } = useParams();
  const code = (iso2 || '').toLowerCase();
  const profile = useMemo(() => {
    if (!countryProfiles) return {};
    if (Array.isArray(countryProfiles)) {
      return countryProfiles.find((p) => (p.iso2 || p.code || '').toLowerCase() === code) || {};
    }
    return countryProfiles[code] || countryProfiles[code.toUpperCase()] || {};
  }, [code]);
  const countryName = profile.name || code.toUpperCase() || 'Country';
  const fallbackTz = profile.timezones?.[0] || 'UTC';
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setCities([]);
    fetch(`https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/country/${code}.json`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.cities || data.data || [];
        setCities(list.slice(0, 100));
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [code]);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    return s ? cities.filter((c) => c.name?.toLowerCase().includes(s)) : cities;
  }, [cities, query]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/world-clock" className="hover:text-slate-700">World Clock</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{countryName}</span>
      </nav>
      <header className="mb-8 flex flex-wrap items-center gap-4">
        <span className="text-5xl leading-none">{flagEmoji(code)}</span>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{countryName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs uppercase">{code.toUpperCase()}</span>
            {profile.capital && <> - Capital: {profile.capital}</>}
            {profile.population && <> - Pop: {Intl.NumberFormat().format(profile.population)}</>}
          </p>
        </div>
      </header>
      {!loading && !error && cities.length > 0 && (
        <div className="mb-4">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter cities..." className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      )}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load cities for <b>{countryName}</b>. ({error})
          <button onClick={() => window.location.reload()} className="ml-2 font-medium underline">Retry</button>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slate-500">
          {cities.length === 0 ? `No cities found for ${countryName}.` : 'No cities match your filter.'}
        </p>
      )}
      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="mb-3 text-xs text-slate-500">Showing {filtered.length} of {cities.length} cities - live</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((city, i) => (
              <CityCard key={`${city.name}-${i}`} city={city} now={now} fallbackTz={fallbackTz} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
