import fs from 'fs';

const file = 'src/pages/FlightsPage.jsx';
if (!fs.existsSync(file)) {
  console.log('❌ FlightsPage.jsx not found.');
  process.exit(1);
}

let s = fs.readFileSync(file, 'utf8');

// 1. Force default sort to 'best'
s = s.replace(/const \[sortBy, setSortBy\] = useState\('cheapest'\)/, "const [sortBy, setSortBy] = useState('best')");
s = s.replace(/const \[sortBy, setSortBy\] = useState\('price'\)/, "const [sortBy, setSortBy] = useState('best')");

// 2. Ensure the Sort Dropdown exists and has 'best' as the first option
const newSortSelect = `
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background">
                  <option value="best">Best</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                  <option value="stops">Fewest stops</option>
                </select>
`;
s = s.replace(/<select value=\{sortBy\}[\s\S]*?<\/select>/, newSortSelect.trim());

// 3. Inject the Save Search button next to the Trip Type radios
const saveButton = `
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} className="w-4 h-4" />
                <span className="text-sm font-medium">Round-trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} className="w-4 h-4" />
                <span className="text-sm font-medium">One-way</span>
              </label>
            </div>
            <button
              onClick={handleSave}
              className={\`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition \${
                isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-border text-muted-foreground hover:bg-muted'
              }\`}
            >
              <Heart className={\`h-3.5 w-3.5 \${isSaved ? 'fill-rose-500 text-rose-500' : ''}\`} />
              {isSaved ? 'Saved' : 'Save search'}
            </button>
          </div>
`;
// Find the wrapper around the radio buttons and replace it
s = s.replace(/<div className="flex gap-6">[\s\S]*?<\/label>\s*<\/div>/, saveButton.trim());

// 4. Add strict validation in handleSearch
const validationLogic = `
    // Validate 3-letter IATA codes
    const isValidIATA = (code) => /^[A-Z]{3}$/.test(code) && code !== 'XXX';
    if (!isValidIATA(origin.toUpperCase())) return setError('Please select a valid origin airport (3-letter code).');
    if (!isValidIATA(destination.toUpperCase())) return setError('Please select a valid destination airport (3-letter code).');
    if (origin.toUpperCase() === destination.toUpperCase()) return setError('Origin and destination cannot be the same.');

    setLoading(true); setError(''); setFlights([]); setFilterAirlines([]); setMaxDuration(0)
`;
s = s.replace(/setLoading\(true\); setError\(''\); setFlights\(\[\]\); setFilterAirlines\(\[\]\); setMaxDuration\(0\)/, validationLogic.trim());

// 5. Make sure `Heart` is imported
if (!s.includes('Heart,')) {
  s = s.replace("TrendingDown,", "TrendingDown, Heart,");
}

fs.writeFileSync(file, s, 'utf8');
console.log('✅ FlightsPage.jsx patched: Sort defaults to Best, Save Search button restored, Invalid IATA validation added.');
