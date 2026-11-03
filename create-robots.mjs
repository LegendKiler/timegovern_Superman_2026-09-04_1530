import fs from 'fs';

const robots = `User-agent: *
Allow: /
Disallow: /search
Disallow: /booking/
Disallow: /api/

Sitemap: https://timegovern.com/sitemap.xml
Sitemap: https://timegovern.com/sitemap-flights.xml
Sitemap: https://timegovern.com/sitemap-cars.xml
Sitemap: https://timegovern.com/sitemap-blog.xml
Sitemap: https://timegovern.com/sitemap-core.xml
Sitemap: https://timegovern.com/sitemap-calculators.xml
Sitemap: https://timegovern.com/sitemap-country-codes.xml
`;

fs.writeFileSync('public/robots.txt', robots);
console.log('✅ public/robots.txt created with sitemap directives.');
