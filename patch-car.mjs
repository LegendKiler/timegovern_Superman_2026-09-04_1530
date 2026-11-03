const fs = require('fs');
const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

// 1) Send a more specific location to OctoTrip
// Replace the request body's location field with a country-qualified string.
s = s.replace(
  /location: form\.location,/g,
  "location: form.location.includes(',') ? form.location : `${form.location}, ${WORLD_LOCATIONS.find(l => l.name === form.location)?.country || ''}`.replace(/, $/, ''),"
);

// 2) Better error handling for location_not_found
// After parsing the response, if OctoTrip returned an error, show it instead of "No cars".
s = s.replace(
  /if \(data\.error\) throw new Error\(data\.error\.message \|\| 'Search failed'\)/g,
  "if (data.error) throw new Error(data.error.message || 'Search failed');\n      if (data.result?.error === 'location_not_found') throw new Error('OctoTrip could not find a pickup location for \"' + form.location + '\". Try adding a country (e.g. Lahore, Pakistan) or an airport code.');"
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ CarBooking.jsx patched: location is now country-qualified, and location_not_found errors are shown.');
