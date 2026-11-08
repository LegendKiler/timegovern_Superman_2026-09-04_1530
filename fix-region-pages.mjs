import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = `_backups/${ts}`;
fs.mkdirSync(backupDir, { recursive: true });

// Backup
const files = ['src/pages/RegionDetailPage.jsx', 'src/pages/RegionHubPage.jsx'];
for (const f of files) {
  fs.copyFileSync(f, path.join(backupDir, path.basename(f) + '.bak'));
}
console.log(`Backed up -> ${backupDir}`);

// ---- Edit RegionDetailPage.jsx ----
const detailPath = 'src/pages/RegionDetailPage.jsx';
let detail = fs.readFileSync(detailPath, 'utf8');
let detailEdits = 0;

// Edit D1: add import
const detailImportAnchor = "import { REGION_BY_SLUG, REGION_SLUGS, METRICS, getCountriesInRegion, regionAggregate } from '../lib/regionCompare'";
const detailImportNew = detailImportAnchor + "\nimport { REGION_CONTENT } from '../data/regionContent'";
if (!detail.includes(detailImportAnchor)) { console.error('D1: import anchor not found'); process.exit(1); }
detail = detail.replace(detailImportAnchor, detailImportNew);
detailEdits++;

// Edit D2: add content variable
const detailNameAnchor = 'const regionName = REGION_BY_SLUG[slug]';
const detailNameNew = detailNameAnchor + '\n  const content = REGION_CONTENT[slug]';
if (!detail.includes(detailNameAnchor)) { console.error('D2: regionName anchor not found'); process.exit(1); }
detail = detail.replace(detailNameAnchor, detailNameNew);
detailEdits++;

// Edit D3: insert content section before Countries heading
const detailBlockAnchor = `        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Countries in {regionName}</h2>`;

const detailContentBlock = `        {content && (
          <section className="space-y-5">
            <p className="text-base text-muted-foreground leading-relaxed">{content.intro}</p>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Regional highlights</h2>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                {content.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Economic and demographic context</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.context}</p>
            </div>
          </section>
        )}

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Countries in {regionName}</h2>`;

if (!detail.includes(detailBlockAnchor)) { console.error('D3: block anchor not found'); process.exit(1); }
detail = detail.replace(detailBlockAnchor, detailContentBlock);
detailEdits++;

fs.writeFileSync(detailPath, detail, 'utf8');
console.log(`RegionDetailPage.jsx: ${detailEdits} edits applied`);

// ---- Edit RegionHubPage.jsx ----
const hubPath = 'src/pages/RegionHubPage.jsx';
let hub = fs.readFileSync(hubPath, 'utf8');

const hubAnchor = `        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'World Regions'} />`;

const hubContent = `        <section className="space-y-5">
          <p className="text-base text-muted-foreground leading-relaxed">
            The world\u2019s countries are conventionally grouped into regions that share geographic, cultural, and economic characteristics. These groupings are used by organizations like the World Bank, United Nations, and IMF to organize global statistics and enable meaningful comparisons. Each region has its own population dynamics, economic structure, and environmental footprint, and understanding regional differences is essential for evaluating global trends in population growth, economic development, energy consumption, and climate change.
          </p>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-3">What you can explore</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
              <li>Population totals and distribution across each region\u2019s constituent countries</li>
              <li>Economic aggregates including GDP and GDP per capita comparisons</li>
              <li>Environmental metrics like CO2 emissions, energy use, and water consumption</li>
              <li>Health outcomes through life expectancy data weighted by population</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-3">How the data is organized</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every region page aggregates country-level statistics from authoritative sources \u2014 the World Bank for population and GDP, the International Energy Agency for energy data, the FAO for water use, and the Global Carbon Project for CO2 emissions. Sums are computed across all countries in a region that report the relevant metric, while averages like life expectancy are weighted by population so that more populous countries carry proportionally more influence. This produces consistent regional figures that can be compared directly against each other and against global totals.
            </p>
          </div>
        </section>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'World Regions'} />`;

if (!hub.includes(hubAnchor)) { console.error('H1: hub anchor not found'); process.exit(1); }
hub = hub.replace(hubAnchor, hubContent);
fs.writeFileSync(hubPath, hub, 'utf8');
console.log('RegionHubPage.jsx: content section added');

console.log(`\nBackups: ${backupDir}`);
