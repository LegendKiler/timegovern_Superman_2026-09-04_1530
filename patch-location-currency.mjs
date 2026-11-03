const fs = require('fs');
const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

// 1. Update selectLocation to pass the city string AND change the currency
const newSelectLocation = `
  const selectLocation = (loc) => {
    const locString = loc.city + ', ' + loc.country;
    
    // Map country codes to currencies
    const currencyMap = {
      'PK': 'PKR', 'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'IN': 'INR', 
      'AE': 'AED', 'AU': 'AUD', 'CA': 'CAD', 'JP': 'JPY', 'CN': 'CNY', 
      'ZA': 'ZAR', 'NZ': 'NZD', 'SG': 'SGD'
    };
    const newCurrency = currencyMap[loc.countryCode] || form.currency;

    setForm(prev => ({
      ...prev,
      location: locString,
      currency: newCurrency
    }));
    
    setLocationQuery(loc.city + ' (' + loc.id + ')');
    setShowSuggestions(false);
  }
`;

s = s.replace(
  /const selectLocation = \(loc\) => \{[\s\S]*?setShowSuggestions\(false\)\n  \}/,
  newSelectLocation.trim()
);

// 2. Fix the auto-detect hook so it doesn't force "Sydney" or AUD
const newAutoDetect = `
  useEffect(() => {
    if (!userLocation?.country_code) return;
    const airports = getAirportsForCountry(userLocation.country_code);
    
    // Only set location if it's currently empty or default 'Sydney'
    if (airports.length > 0 && (!form.location || form.location === 'Sydney')) {
      updateForm('location', airports[0].city + ', ' + airports[0].country);
      setLocationQuery(airports[0].city + ' (' + airports[0].iata + ')');
    }
    
    const curMap = { 'AU': 'AUD', 'NZ': 'NZD', 'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'IN': 'INR', 'PK': 'PKR', 'AE': 'AED', 'SA': 'SAR', 'JP': 'JPY', 'SG': 'SGD', 'ZA': 'ZAR', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR' };
    if (curMap[userLocation.country_code]) updateForm('currency', curMap[userLocation.country_code]);
  }, [userLocation?.country_code]);
`;

s = s.replace(
  /useEffect\(\(\) => \{\n    if \(!userLocation\?\.country_code\) return;[\s\S]*?\}, \[userLocation\?\.country_code\]\);/,
  newAutoDetect.trim()
);

// 3. Update the initial form state so it doesn't default to AUD if we can help it
s = s.replace(
  /location: 'Sydney',[\s\S]*?currency: 'AUD',/,
  "location: '',\n    pickupDate: tomorrow.toISOString().split('T')[0],\n    dropoffDate: nextWeek.toISOString().split('T')[0],\n    pickupTime: '10:00', dropoffTime: '10:00',\n    age: 30, currency: 'USD',"
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ Location and Currency patched successfully!');
