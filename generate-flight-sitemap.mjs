import fs from 'fs';

// Top 100 routes (IATA pairs) — expand this list as needed
const routes = [
  ['LHR','JFK'], ['LHR','DXB'], ['LHR','LAX'], ['LHR','ORD'], ['LHR','BOM'],
  ['JFK','LAX'], ['JFK','LHR'], ['JFK','CDG'], ['JFK','DXB'], ['JFK','NRT'],
  ['DXB','LHR'], ['DXB','JFK'], ['DXB','BOM'], ['DXB','DEL'], ['DXB','SIN'],
  ['SIN','LHR'], ['SIN','DXB'], ['SIN','SYD'], ['SIN','HKG'], ['SIN','NRT'],
  ['HKG','LHR'], ['HKG','JFK'], ['HKG','SIN'], ['HKG','TPE'], ['HKG','BKK'],
  ['BKK','LHR'], ['BKK','DXB'], ['BKK','SIN'], ['BKK','HKG'], ['BKK','NRT'],
  ['NRT','LHR'], ['NRT','JFK'], ['NRT','LAX'], ['NRT','SIN'], ['NRT','HKG'],
  ['LAX','LHR'], ['LAX','JFK'], ['LAX','NRT'], ['LAX','SYD'], ['LAX','MEX'],
  ['SYD','LHR'], ['SYD','LAX'], ['SYD','SIN'], ['SYD','AKL'], ['SYD','HKG'],
  ['AKL','SYD'], ['AKL','LAX'], ['AKL','SIN'], ['AKL','HKG'], ['AKL','NRT'],
  ['BOM','LHR'], ['BOM','DXB'], ['BOM','SIN'], ['BOM','BKK'], ['BOM','HKG'],
  ['DEL','LHR'], ['DEL','DXB'], ['DEL','SIN'], ['DEL','BKK'], ['DEL','HKG'],
  ['CDG','JFK'], ['CDG','LHR'], ['CDG','DXB'], ['CDG','SIN'], ['CDG','NRT'],
  ['FRA','JFK'], ['FRA','LHR'], ['FRA','DXB'], ['FRA','SIN'], ['FRA','NRT'],
  ['AMS','JFK'], ['AMS','LHR'], ['AMS','DXB'], ['AMS','SIN'], ['AMS','NRT'],
  ['MAD','JFK'], ['MAD','LHR'], ['MAD','DXB'], ['MAD','SIN'], ['MAD','NRT'],
  ['BCN','JFK'], ['BCN','LHR'], ['BCN','DXB'], ['BCN','SIN'], ['BCN','NRT'],
  ['IST','JFK'], ['IST','LHR'], ['IST','DXB'], ['IST','SIN'], ['IST','NRT'],
  ['SFO','LHR'], ['SFO','JFK'], ['SFO','NRT'], ['SFO','SYD'], ['SFO','HKG'],
  ['SEA','LHR'], ['SEA','JFK'], ['SEA','NRT'], ['SEA','SYD'], ['SEA','HKG'],
];

const BASE = 'https://timegovern.com';
const urls = routes.map(([o, d]) => `  <url>
    <loc>${BASE}/flights/${o.toLowerCase()}/${d.toLowerCase()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync('public/sitemap-flights.xml', sitemap);
console.log(`✅ Created public/sitemap-flights.xml with ${routes.length} route pages.`);
