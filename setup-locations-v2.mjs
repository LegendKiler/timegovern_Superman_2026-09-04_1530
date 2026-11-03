import fs from 'fs';

async function run() {
  console.log('Downloading global cities and airports (this may take 5 seconds)...');
  
  // 1. Fetch Cities and Airports
  const citiesRes = await fetch('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json');
  const cities = await citiesRes.json();
  const airportsRes = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
  const airportsData = await airportsRes.json();

  const locations = [];
  const seen = new Set();

  // Add Cities (Population > 50,000)
  for (const c of cities) {
    if (c.population && parseInt(c.population) > 50000) {
      const key = `${c.city.toLowerCase()}-${c.iso2}`;
      if (!seen.has(key)) {
        const cc = c.iso2 ? c.iso2.toUpperCase() : '';
        const flag = cc.length === 2 ? String.fromCodePoint(...[...cc].map(x => 127397 + x.charCodeAt(0))) : '🌍';
        locations.push({
          id: c.city, city: c.city, name: c.city + ' City',
          country: c.country, countryCode: cc,
          lat: parseFloat(c.lat), lng: parseFloat(c.lng),
          type: 'city', flag
        });
        seen.add(key);
      }
    }
  }

  // Add Airports
  for (const key in airportsData) {
    const a = airportsData[key];
    if (!a.iata || !a.city) continue;
    const iata = a.iata.toUpperCase();
    if (seen.has(iata)) continue;
    
    const cc = a.country ? a.country.toUpperCase() : '';
    const flag = cc.length === 2 ? String.fromCodePoint(...[...cc].map(x => 127397 + x.charCodeAt(0))) : '🌍';
    
    locations.push({
      id: iata, city: a.city, name: a.name,
      country: a.country, countryCode: cc,
      lat: a.lat, lng: a.lon, type: 'airport', flag
    });
    seen.add(iata);
  }

  locations.sort((a, b) => a.city.localeCompare(b.city));

  const fileContent = `// Auto-generated world location database (${locations.length} entries)\nexport const WORLD_LOCATIONS = ${JSON.stringify(locations, null, 2)};\n\nexport function searchLocations(query, limit = 15) {\n  if (!query) return WORLD_LOCATIONS.slice(0, limit);\n  const q = query.toLowerCase();\n  return WORLD_LOCATIONS.filter(\n    (l) => l.city.toLowerCase().includes(q) || \n           l.country.toLowerCase().includes(q) || \n           l.id.toLowerCase().includes(q) ||\n           l.name.toLowerCase().includes(q)\n  ).slice(0, limit);\n}\n`;

  fs.writeFileSync('src/data/locations.js', fileContent);
  console.log(`✅ Generated src/data/locations.js with ${locations.length} locations.`);

  // 2. Patch CarBooking.jsx
  const file = 'src/components/CarBooking.jsx';
  let s = fs.readFileSync(file, 'utf8');

  // Comprehensive Currency Map
  const currencyMap = `{
    'US':'USD','GB':'GBP','EU':'EUR','AU':'AUD','CA':'CAD','JP':'JPY','CN':'CNY','IN':'INR',
    'PK':'PKR','BD':'BDT','AE':'AED','SA':'SAR','QA':'QAR','KW':'KWD','BH':'BHD','OM':'OMR',
    'ZA':'ZAR','NG':'NGN','KE':'KES','EG':'EGP','MA':'MAD','SG':'SGD','MY':'MYR','TH':'THB',
    'ID':'IDR','PH':'PHP','VN':'VND','TR':'TRY','RU':'RUB','BR':'BRL','MX':'MXN','AR':'ARS',
    'CL':'CLP','CO':'COP','PE':'PEN','NZ':'NZD','CH':'CHF','SE':'SEK','NO':'NOK','DK':'DKK',
    'PL':'PLN','CZ':'CZK','HU':'HUF','IL':'ILS','LK':'LKR','NP':'NPR'
  }`;

  // Update selectLocation to set currency
  const newSelectLocation = `
  const selectLocation = (loc) => {
    const locString = loc.city + ', ' + loc.country;
    const curMap = ${currencyMap};
    const newCurrency = curMap[loc.countryCode] || 'USD';

    setForm(prev => ({ ...prev, location: locString, currency: newCurrency }));
    setLocationQuery(loc.city + ' (' + loc.id + ')');
    setShowSuggestions(false);
  }
  `;
  s = s.replace(/const selectLocation = \(loc\) => \{[\s\S]*?setShowSuggestions\(false\)\n  \}/, newSelectLocation.trim());

  // Update default state to be empty (will be filled by geolocation)
  s = s.replace(/location: 'Sydney',[\s\S]*?currency: 'AUD',/, "location: '',\n    pickupDate: tomorrow.toISOString().split('T')[0],\n    dropoffDate: nextWeek.toISOString().split('T')[0],\n    pickupTime: '10:00', dropoffTime: '10:00',\n    age: 30, currency: 'USD',");

  // Update the UI dropdown to show City vs Airport
  s = s.replace(
    /\{loc\.type === 'airport' \? <Plane className="h-3 w-3 text-primary" \/> : <Building2 className="h-3 w-3 text-muted-foreground" \/>\}\n                          \{loc\.name\}/,
    "{loc.type === 'airport' ? <Plane className=\"h-3 w-3 text-sky-500\" /> : <Building2 className=\"h-3 w-3 text-emerald-500\" />}\n                          {loc.city} ({loc.id}) <span className=\"text-xs text-muted-foreground ml-1\">{loc.type === 'airport' ? 'Airport' : 'City'}</span>"
  );

  // Update the auto-detect logic to use the new currency map
  s = s.replace(
    /const curMap = \{[^}]+\};\n    if \(curMap\[userLocation\.country_code\]\) updateForm\('currency', curMap\[userLocation\.country_code\]\);/,
    `const curMap = ${currencyMap};\n    if (curMap[userLocation.country_code]) updateForm('currency', curMap[userLocation.country_code]);`
  );

  fs.writeFileSync(file, s, 'utf8');
  console.log('✅ CarBooking.jsx patched with World Cities, Airports, and Currency mapping.');
}

run().catch(console.error);
