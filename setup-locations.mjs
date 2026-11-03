import fs from 'fs';

async function run() {
  // 1. GENERATE GLOBAL LOCATIONS DATA
  console.log('Downloading standard global airport database...');
  const res = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
  const data = await res.json();
  
  const locations = [];
  const seen = new Set();
  
  for (const key in data) {
    const a = data[key];
    // Only include airports with IATA codes and a city name
    if (!a.iata || !a.city) continue;
    
    const iata = a.iata.toUpperCase();
    if (seen.has(iata)) continue;
    
    const cc = a.country.toUpperCase();
    // Convert 2-letter country code to emoji flag
    const flag = cc.length === 2 ? String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0))) : '🌍';

    locations.push({
      id: iata,
      city: a.city,
      name: a.name,
      country: a.country,
      countryCode: cc,
      lat: a.lat,
      lng: a.lon,
      type: 'airport',
      flag
    });
    seen.add(iata);
  }
  
  locations.sort((a, b) => a.city.localeCompare(b.city));
  
  // Write the new data file
  const fileContent = `// Auto-generated global location database (${locations.length} locations)\nexport const WORLD_LOCATIONS = ${JSON.stringify(locations, null, 2)};\n\nexport function searchLocations(query, limit = 10) {\n  if (!query) return WORLD_LOCATIONS.slice(0, limit);\n  const q = query.toLowerCase();\n  return WORLD_LOCATIONS.filter(\n    (l) => l.city.toLowerCase().includes(q) || \n           l.country.toLowerCase().includes(q) || \n           l.id.toLowerCase().includes(q) ||\n           l.name.toLowerCase().includes(q)\n  ).slice(0, limit);\n}\n`;
  
  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/locations.js', fileContent);
  console.log(`✅ Generated src/data/locations.js with ${locations.length} global locations.`);

  // 2. PATCH CarBooking.jsx
  console.log('Patching CarBooking.jsx to use the new global data...');
  const file = 'src/components/CarBooking.jsx';
  let s = fs.readFileSync(file, 'utf8');

  // Add the import
  if (!s.includes("from '../data/locations'")) {
    s = s.replace("import { useUser } from '../context/UserContext'", "import { useUser } from '../context/UserContext'\nimport { searchLocations } from '../data/locations'");
  }

  // Remove the massive hardcoded WORLD_LOCATIONS array
  s = s.replace(/const WORLD_LOCATIONS = \[[\s\S]*?\]\n/, '');

  // Replace the filtering logic with the new search function
  s = s.replace(
    /const filteredLocations = locationQuery.length > 0[\s\S]*?: WORLD_LOCATIONS\.slice\(0, 10\)/,
    "const filteredLocations = searchLocations(locationQuery, 10);"
  );

  // Update the UI to show "City (IATA)" instead of just the city name
  s = s.replace(
    /{loc\.name}\n                        <\/div>/,
    "{loc.city} ({loc.id})\n                        </div>"
  );
  
  // Update selectLocation to set the form value to the IATA code
  s = s.replace(
    /const selectLocation = \(loc\) => \{[\s\S]*?setShowSuggestions\(false\)\n  \}/,
    "const selectLocation = (loc) => {\n    updateForm('location', loc.id); setLocationQuery(`${loc.city} (${loc.id})`); setShowSuggestions(false)\n  }"
  );

  fs.writeFileSync(file, s, 'utf8');
  console.log('✅ CarBooking.jsx patched successfully.');
}

run().catch(console.error);
