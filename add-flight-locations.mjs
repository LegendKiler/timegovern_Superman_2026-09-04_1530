import fs from 'fs';

const file = 'src/pages/FlightsPage.jsx';
let s = fs.readFileSync(file, 'utf8');

// 1. Add imports for the location database and icons
s = s.replace(
  "import { searchFlights } from '../lib/flightSearch'",
  "import { searchFlights } from '../lib/flightSearch'\nimport { searchLocations } from '../data/locations'"
);

// 2. Add state for the autocomplete queries
s = s.replace(
  "const [origin, setOrigin] = useState('LHR')",
  `const [origin, setOrigin] = useState('LHR')
  const [originQuery, setOriginQuery] = useState('London (LHR)')
  const [showOriginDrop, setShowOriginDrop] = useState(false)`
);
s = s.replace(
  "const [destination, setDestination] = useState('JFK')",
  `const [destination, setDestination] = useState('JFK')
  const [destQuery, setDestQuery] = useState('New York (JFK)')
  const [showDestDrop, setShowDestDrop] = useState(false)`
);

// 3. Add the selection handlers
s = s.replace(
  "const handleSearch = async () => {",
  `const selectOrigin = (loc) => {
    setOrigin(loc.id);
    setOriginQuery(\`\${loc.city} (\${loc.id})\`);
    setShowOriginDrop(false);
  };

  const selectDestination = (loc) => {
    setDestination(loc.id);
    setDestQuery(\`\${loc.city} (\${loc.id})\`);
    setShowDestDrop(false);
  };

  const handleSearch = async () => {`
);

// 4. Replace the simple Origin Input with the autocomplete dropdown
const originInputHTML = `
              <div className="relative">
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> From</label>
                <Input 
                  value={originQuery} 
                  onChange={(e) => { setOriginQuery(e.target.value); setShowOriginDrop(true); }} 
                  onFocus={() => setShowOriginDrop(true)}
                  placeholder="City or Airport" 
                  className="h-11" 
                />
                {showOriginDrop && originQuery.length > 1 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {searchLocations(originQuery, 10).filter(l => l.type === 'airport').map((loc, i) => (
                      <button key={i} onClick={() => selectOrigin(loc)} className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-3 border-b border-border last:border-0">
                        <span className="text-xl">{loc.flag}</span>
                        <div>
                          <div className="font-medium text-sm text-foreground">{loc.city} ({loc.id})</div>
                          <div className="text-xs text-muted-foreground">{loc.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
`;

const destInputHTML = `
              <div className="relative">
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> To</label>
                <Input 
                  value={destQuery} 
                  onChange={(e) => { setDestQuery(e.target.value); setShowDestDrop(true); }} 
                  onFocus={() => setShowDestDrop(true)}
                  placeholder="City or Airport" 
                  className="h-11" 
                />
                {showDestDrop && destQuery.length > 1 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {searchLocations(destQuery, 10).filter(l => l.type === 'airport').map((loc, i) => (
                      <button key={i} onClick={() => selectDestination(loc)} className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-3 border-b border-border last:border-0">
                        <span className="text-xl">{loc.flag}</span>
                        <div>
                          <div className="font-medium text-sm text-foreground">{loc.city} ({loc.id})</div>
                          <div className="text-xs text-muted-foreground">{loc.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
`;

// Replace the existing Origin and Destination blocks using a robust regex
s = s.replace(
  /<div>\s*<label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" \/> From<\/label>[\s\S]*?<\/div>/,
  originInputHTML.trim()
);

s = s.replace(
  /<div>\s*<label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" \/> To<\/label>[\s\S]*?<\/div>/,
  destInputHTML.trim()
);

// 5. Add a click-away listener to close the dropdowns when clicking outside
s = s.replace(
  "useEffect(() => {\n    document.title = 'Flights - Live Search Worldwide | TimeGovern'",
  `useEffect(() => {
    const handleClick = () => { setShowOriginDrop(false); setShowDestDrop(false); };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    document.title = 'Flights - Live Search Worldwide | TimeGovern'`
);

// 6. Stop propagation on dropdown clicks so the click-away listener doesn't fire
s = s.replace(
  /onClick=\{\(\) => selectOrigin\(loc\)\}/g,
  "onClick={(e) => { e.stopPropagation(); selectOrigin(loc); }}"
);
s = s.replace(
  /onClick=\{\(\) => selectDestination\(loc\)\}/g,
  "onClick={(e) => { e.stopPropagation(); selectDestination(loc); }}"
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ FlightsPage.jsx updated with a global searchable Airport dropdown!');
