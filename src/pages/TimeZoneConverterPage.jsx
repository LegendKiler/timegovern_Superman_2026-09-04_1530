import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCountryCities, pickTimeZone, isValidTimeZone } from '../lib/geoApi';
import '../styles/time-tools.css';
import HubExtras from '../components/HubExtras';

const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const QUICK_COUNTRIES = [
  { iso2: 'br', label: 'Brazil' }, { iso2: 'us', label: 'United States' },
  { iso2: 'gb', label: 'United Kingdom' }, { iso2: 'jp', label: 'Japan' },
  { iso2: 'au', label: 'Australia' }, { iso2: 'in', label: 'India' },
  { iso2: 'de', label: 'Germany' }, { iso2: 'fr', label: 'France' },
  { iso2: 'ca', label: 'Canada' }, { iso2: 'mx', label: 'Mexico' }
];

function getOffsetMs(date, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const m = {}; dtf.formatToParts(date).forEach(p => m[p.type] = p.value);
  return Date.UTC(+m.year, +m.month - 1, +m.day, +m.hour % 24, +m.minute, +m.second) - date.getTime();
}
function zonedWallTimeToUtc(dateStr, timeStr, timeZone) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const target = Date.UTC(y, mo - 1, d, hh, mm, 0, 0);
  let utc = target;
  for (let i = 0; i < 2; i++) utc = target - getOffsetMs(new Date(utc), timeZone);
  return new Date(utc);
}
function formatInZone(date, timeZone, opts = {}) {
  try { return new Intl.DateTimeFormat(undefined, { timeZone, ...opts }).format(date); }
  catch { return '-'; }
}
function todayInZone(tz) { return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
function nowHHMMInZone(tz) { return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); }

export default function TimeZoneConverterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const country = (searchParams.get('country') || '').toLowerCase();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromZone, setFromZone] = useState('UTC');
  const [toZone, setToZone] = useState(LOCAL_TZ);
  const [dateStr, setDateStr] = useState(() => todayInZone(LOCAL_TZ));
  const [timeStr, setTimeStr] = useState(() => nowHHMMInZone(LOCAL_TZ));

  useEffect(() => {
    if (!country) { setCities([]); setError(null); setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true); setError(null); setCities([]);
    fetchCountryCities(country, { signal: controller.signal })
      .then((list) => {
        setCities(list);
        const tzs = list.map(pickTimeZone).filter(isValidTimeZone);
        if (tzs.length) { setFromZone(tzs[0]); setDateStr(todayInZone(tzs[0])); setTimeStr(nowHHMMInZone(tzs[0])); }
      })
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [country]);

  const fromOptions = useMemo(() => [...new Set(cities.map(pickTimeZone).filter(isValidTimeZone))], [cities]);
  const toOptions = useMemo(() => [...new Set([LOCAL_TZ, ...fromOptions].filter(isValidTimeZone))], [fromOptions]);

  useEffect(() => { if (toZone && !toOptions.includes(toZone)) setToZone(LOCAL_TZ); }, [toOptions, toZone]);

  const result = useMemo(() => {
    if (!fromZone || !toZone || !dateStr || !timeStr) return null;
    if (!isValidTimeZone(fromZone) || !isValidTimeZone(toZone)) return null;
    try {
      const utc = zonedWallTimeToUtc(dateStr, timeStr, fromZone);
      if (isNaN(utc.getTime())) return null;
      const fmt = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
      return { fromLabel: formatInZone(utc, fromZone, fmt), toLabel: formatInZone(utc, toZone, fmt) };
    } catch { return null; }
  }, [fromZone, toZone, dateStr, timeStr]);

  function setCountry(iso2) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const v = (iso2 || '').trim().toLowerCase();
      if (v) next.set('country', v); else next.delete('country');
      return next;
    }, { replace: true });
  }

  return (
    <div className="tz-converter">
      <h1>Time Zone Converter</h1>
      <section className="country-picker">
        <label>Country (ISO-2): <input value={country} onChange={e => setCountry(e.target.value)} placeholder="br" maxLength={2} style={{ width: '4ch', textTransform: 'lowercase' }} /></label>
        <div className="quick-picks">
          {QUICK_COUNTRIES.map(c => (
            <button key={c.iso2} type="button" onClick={() => setCountry(c.iso2)} className={c.iso2 === country ? 'active' : ''}>{c.label}</button>
          ))}
        </div>
      </section>
      {loading && <p>Loading cities for "{country}"...</p>}
      {error && <p className="error">Failed to load "{country}": {error}</p>}
      <section className="converter-grid">
        <div className="from">
          <h2>From</h2>
          <label>Zone: <select value={fromZone} onChange={e => setFromZone(e.target.value)}>
            {fromZone && !fromOptions.includes(fromZone) && <option value={fromZone}>{fromZone}</option>}
            {fromOptions.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select></label>
          <label>Date: <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} /></label>
          <label>Time: <input type="time" value={timeStr} onChange={e => setTimeStr(e.target.value)} /></label>
        </div>
        <div className="to">
          <h2>To</h2>
          <label>Zone: <select value={toZone} onChange={e => setToZone(e.target.value)}>
            {toOptions.map(tz => <option key={tz} value={tz}>{tz === LOCAL_TZ ? tz + ' (your time)' : tz}</option>)}
          </select></label>
        </div>
      </section>
      {result ? (
        <section className="result">
          <p><strong>{result.fromLabel}</strong> in <code>{fromZone}</code></p>
          <p>= <strong>{result.toLabel}</strong> in <code>{toZone}</code></p>
        </section>
      ) : (
        <p className="hint">Pick a zone, date and time to see the conversion.</p>
      )}
    <HubExtras category="reference-hub" />
      </div>
  );
}