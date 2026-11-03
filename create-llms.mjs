import fs from 'fs';

const llms = `# TimeGovern
> Fast answers for money, time & code.

TimeGovern is a free tool hub for flights, car rentals, time zones, calculators, and world data.

## Key Sections
- Flights: /flights — live flight search from Google Flights
- Flight Routes: /flights/{origin}/{destination} — programmatic route pages
- Cars: /cars — car rental comparison via ReefAPI
- World Clock: /world-clock — live times for 15,000+ cities
- Time Zones: /time-zone-converter — convert times across zones

## Data Sources
- Flights: Google Flights (via fast-flights), OctoTrip, AgentWeb
- Cars: ReefAPI, OctoTrip, AgentWeb
- Weather: Open-Meteo
- Cities/Airports: mwgg/Airports, global dataset

## Contact
- Website: https://timegovern.com
- Support: /support
`;

fs.writeFileSync('public/llms.txt', llms);
console.log('✅ public/llms.txt created for AI crawlers.');
