import fs from 'fs';

const file = 'src/pages/FlightMap.jsx';
let s = fs.readFileSync(file, 'utf8');

// Replace the CARTO TileLayer with OpenFreeMap dark style
s = s.replace(
  /<TileLayer[\s\S]*?url="[^"]*cartocdn[^"]*"[\s\S]*?\/>/,
  `<TileLayer
  url="https://tiles.openfreemap.org/styles/dark"
  attribution='&copy; <a href="https://openfreemap.org/">OpenFreeMap</a>'
/>`
);

// Update the attribution text if it exists separately
s = s.replace(
  /attribution='&copy; <a href="https:\/\/carto.com\/">CARTO<\/a>'/,
  `attribution='&copy; <a href="https://openfreemap.org/">OpenFreeMap</a>'`
);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ FlightMap.jsx patched: CARTO tiles replaced with OpenFreeMap (no API key).');
