import fs from 'fs';

async function run() {
  // 1. Fix Country Names in locations.js
  console.log('Fixing full country names...');
  const airportRes = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
  const airportsData = await airportRes.json();
  
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const locations = [];
  const seenCities = new Set();

  for (const key in airportsData) {
    const a = airportsData[key];
    if (!a.iata || !a.city) continue;
    
    const cc = a.country ? a.country.toUpperCase() : '';
    const flag = cc.length === 2 ? String.fromCodePoint(...[...cc].map(x => 127397 + x.charCodeAt(0))) : '🌍';
    // Convert 'PK' to 'Pakistan'
    const countryName = cc.length === 2 ? regionNames.of(cc) : a.country;
    
    locations.push({
      id: a.iata.toUpperCase(), city: a.city, name: a.name,
      country: countryName, countryCode: cc,
      lat: a.lat, lng: a.lon, type: 'airport', flag
    });

    const cityKey = `${a.city.toLowerCase()}-${cc}`;
    if (!seenCities.has(cityKey)) {
      locations.push({
        id: `${a.city.replace(/\s+/g, '')}City`, city: a.city, name: a.city + ' (All locations)',
        country: countryName, countryCode: cc,
        lat: a.lat, lng: a.lon, type: 'city', flag
      });
      seenCities.add(cityKey);
    }
  }

  locations.sort((a, b) => a.city.localeCompare(b.city));
  const fileContent = `// Auto-generated world location database (${locations.length} entries)\nexport const WORLD_LOCATIONS = ${JSON.stringify(locations, null, 2)};\n\nexport function searchLocations(query, limit = 15) {\n  if (!query) return WORLD_LOCATIONS.slice(0, limit);\n  const q = query.toLowerCase();\n  return WORLD_LOCATIONS.filter(\n    (l) => l.city.toLowerCase().includes(q) || \n           l.country.toLowerCase().includes(q) || \n           l.id.toLowerCase().includes(q) ||\n           l.name.toLowerCase().includes(q)\n  ).slice(0, limit);\n}\n`;
  fs.writeFileSync('src/data/locations.js', fileContent);
  console.log(`✅ Database updated with full country names.`);

  // 2. Fix the Error Message in CarBooking.jsx
  const file = 'src/components/CarBooking.jsx';
  let s = fs.readFileSync(file, 'utf8');

  s = s.replace(
    /setError\('No cars available at ' \+ form\.location \+ ' for those dates\. Try a major city like Dubai or London\.'\);/,
    "setError('No cars available at ' + form.location + ' for those dates. (Note: Free APIs often lack inventory in this region. Try Dubai, London, or Tokyo to see results).');"
  );

  fs.writeFileSync(file, s, 'utf8');
  console.log('✅ Error message updated.');
}
run().catch(console.error);
