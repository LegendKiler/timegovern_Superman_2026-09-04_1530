import fs from 'fs';

async function run() {
  console.log('Downloading global airports database...');
  const airportsRes = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
  const airportsData = await airportsRes.json();

  const locations = [];
  const seenCities = new Set();

  for (const key in airportsData) {
    const a = airportsData[key];
    if (!a.iata || !a.city) continue;
    
    const cc = a.country ? a.country.toUpperCase() : '';
    const flag = cc.length === 2 ? String.fromCodePoint(...[...cc].map(x => 127397 + x.charCodeAt(0))) : '🌍';
    
    // 1. Add the Airport
    locations.push({
      id: a.iata.toUpperCase(), 
      city: a.city, 
      name: a.name,
      country: a.country, 
      countryCode: cc,
      lat: a.lat, 
      lng: a.lon, 
      type: 'airport', 
      flag
    });

    // 2. Add the City (only once per city)
    const cityKey = `${a.city.toLowerCase()}-${cc}`;
    if (!seenCities.has(cityKey)) {
      locations.push({
        id: `${a.city.replace(/\s+/g, '')}City`, 
        city: a.city, 
        name: a.city + ' (All locations)',
        country: a.country, 
        countryCode: cc,
        lat: a.lat, 
        lng: a.lon, 
        type: 'city', 
        flag
      });
      seenCities.add(cityKey);
    }
  }

  locations.sort((a, b) => a.city.localeCompare(b.city));

  const fileContent = `// Auto-generated world location database (${locations.length} entries)\nexport const WORLD_LOCATIONS = ${JSON.stringify(locations, null, 2)};\n\nexport function searchLocations(query, limit = 15) {\n  if (!query) return WORLD_LOCATIONS.slice(0, limit);\n  const q = query.toLowerCase();\n  return WORLD_LOCATIONS.filter(\n    (l) => l.city.toLowerCase().includes(q) || \n           l.country.toLowerCase().includes(q) || \n           l.id.toLowerCase().includes(q) ||\n           l.name.toLowerCase().includes(q)\n  ).slice(0, limit);\n}\n`;

  fs.writeFileSync('src/data/locations.js', fileContent);
  console.log(`✅ Generated src/data/locations.js with ${locations.length} locations (Cities + Airports).`);

  // --- PATCH CarBooking.jsx ---
  const file = 'src/components/CarBooking.jsx';
  let s = fs.readFileSync(file, 'utf8');

  // 1. Fix the Dropdown Arrow (Make the whole wrapper clickable)
  s = s.replace(
    /<div className="relative">\n                <Input/,
    '<div className="relative cursor-pointer" onClick={() => setShowSuggestions(true)}>\n                <Input'
  );

  // 2. Update selectLocation to set the API location properly
  const newSelectLocation = `
  const selectLocation = (loc) => {
    // If it's an airport, use "City, Country". If it's a city, use "City, Country"
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
    setLocationQuery(loc.city + ' (' + (loc.type === 'airport' ? loc.id : 'City') + ')');
    setShowSuggestions(false);
  }
  `;
  s = s.replace(/const selectLocation = \(loc\) => \{[\s\S]*?setShowSuggestions\(false\)\n  \}/, newSelectLocation.trim());

  // 3. Fix the UI rendering of the dropdown items
  s = s.replace(
    /\{loc\.type === 'airport' \? <Plane className="h-3 w-3 text-primary" \/> : <Building2 className="h-3 w-3 text-muted-foreground" \/>\}\n                          \{loc\.name\}/,
    "{loc.type === 'airport' ? <Plane className=\"h-3 w-3 text-sky-500\" /> : <Building2 className=\"h-3 w-3 text-emerald-500\" />}\n                          {loc.city} ({loc.type === 'airport' ? loc.id : 'City'}) <span className=\"text-xs text-muted-foreground ml-1\">{loc.type === 'airport' ? loc.name : 'All locations'}</span>"
  );

  // 4. Ensure the search function sends the right data and handles empty results
  s = s.replace(
    /if \(results\.length === 0\) \{\n        setError\('No cars available at "' \+ form\.location \+ '" for those dates from either AgentWeb or OctoTrip\.'\);/,
    "if (results.length === 0) {\n        setError('No cars available at ' + form.location + ' for those dates. Try a major city like Dubai or London.');"
  );

  fs.writeFileSync(file, s, 'utf8');
  console.log('✅ CarBooking.jsx patched: Dropdown fixed, Cities added, API payload updated.');
}

run().catch(console.error);
