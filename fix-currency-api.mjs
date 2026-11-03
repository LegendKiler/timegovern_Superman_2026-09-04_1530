import fs from 'fs';

const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

// 1. Fix the Currency dropdown using Unicode escapes (100% encoding safe)
const currencyHtml = `
              <select value={form.currency} onChange={(e) => updateForm('currency', e.target.value)} className="w-full h-11 px-3 border border-border rounded-lg bg-background text-foreground">
                <option value="USD">USD $</option>
                <option value="EUR">EUR \u20AC</option>
                <option value="GBP">GBP \u00A3</option>
                <option value="AUD">AUD $</option>
                <option value="CAD">CAD $</option>
                <option value="NZD">NZD $</option>
                <option value="AED">AED \u062F.\u0625</option>
                <option value="PKR">PKR \u20A8</option>
                <option value="INR">INR \u20B9</option>
                <option value="JPY">JPY \u00A5</option>
                <option value="SGD">SGD $</option>
                <option value="ZAR">ZAR R</option>
              </select>
`;
s = s.replace(
  /<select value=\{form\.currency\}[\s\S]*?<\/select>/,
  currencyHtml.trim()
);

// 2. Update selectLocation to store the simple City Name for the API
const newSelectLocation = `
  const selectLocation = (loc) => {
    // APIs like AgentWeb and OctoTrip work best with simple City Names.
    const apiLocation = loc.city; 
    
    const curMap = {
      'US':'USD','GB':'GBP','EU':'EUR','AU':'AUD','CA':'CAD','JP':'JPY','CN':'CNY','IN':'INR',
      'PK':'PKR','BD':'BDT','AE':'AED','SA':'SAR','QA':'QAR','KW':'KWD','BH':'BHD','OM':'OMR',
      'ZA':'ZAR','NG':'NGN','KE':'KES','EG':'EGP','MA':'MAD','SG':'SGD','MY':'MYR','TH':'THB',
      'ID':'IDR','PH':'PHP','VN':'VND','TR':'TRY','RU':'RUB','BR':'BRL','MX':'MXN','AR':'ARS',
      'CL':'CLP','CO':'COP','PE':'PEN','NZ':'NZD','CH':'CHF','SE':'SEK','NO':'NOK','DK':'DKK',
      'PL':'PLN','CZ':'CZK','HU':'HUF','IL':'ILS','LK':'LKR','NP':'NPR'
    };
    const newCurrency = curMap[loc.countryCode] || 'USD';

    setForm(prev => ({ ...prev, location: apiLocation, currency: newCurrency }));
    setLocationQuery(loc.city + ' (' + (loc.type === 'airport' ? loc.id : 'City') + ')');
    setShowSuggestions(false);
  }
`;
s = s.replace(/const selectLocation = \(loc\) => \{[\s\S]*?setShowSuggestions\(false\)\n  \}/, newSelectLocation.trim());

// 3. Update the error message to guide the user
s = s.replace(
  /setError\('No cars available at ' \+ form\.location \+ ' for those dates\. \(Note: Free APIs often lack inventory in this region\. Try Dubai, London, or Tokyo to see results\)\.'\);/,
  "setError('No cars available at ' + form.location + ' for those dates. Tip: The free AgentWeb API only has inventory for major cities like Dubai, London, Paris, and New York.');"
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ Currency symbols fixed (Unicode safe) and API payload optimized.');
