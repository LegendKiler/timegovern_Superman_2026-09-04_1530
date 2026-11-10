import fs from 'node:fs';
import path from 'node:path';

const PAGES = 'src/pages';
const NL = (s) => (s.includes('\r\n') ? '\r\n' : '\n');
const q = (s) => JSON.stringify(s);

const PATCHES = {
  'SuicidesTodayPage.jsx': {
    explainer: { title: "About the WHO estimate", body: "The 726,000 annual figure is a World Health Organization modelled estimate, not a direct count. Many countries underreport suicide due to stigma and, in some jurisdictions, criminalisation, which leads officials to misclassify deaths. The WHO publishes a range alongside the point estimate, and the true global total is likely higher than the median figure." },
    faq: { q: "Is this figure exact?", a: "No — it is a modelled estimate. Underreporting is common, so the true number of suicide deaths is likely higher than the WHO point estimate." }
  },
  'FlightsTodayPage.jsx': {
    explainer: { title: "How the daily flight estimate is built", body: "The roughly 100,000 daily flights figure comes from industry trackers such as FlightRadar24 and IATA's annual passenger and cargo statistics. It covers scheduled commercial passenger and cargo flights worldwide, but excludes private aviation, military flights, and non-scheduled charters. Daily totals swing with season — Northern summer peaks push counts 10-15% above the annual mean." },
    faq: { q: "Does this include private jets?", a: "No. The count reflects scheduled commercial passenger and cargo flights. Private jets, military aircraft, and charter flights are excluded." }
  },
  'MarriagesTodayPage.jsx': {
    explainer: { title: "About the global marriage estimate", body: "The roughly 5.5 million annual marriages figure aggregates national civil registration data reported to the UN and compiled by sources such as OECD and the World Bank. Coverage varies — some countries publish promptly, others lag by 1-2 years, and a few do not maintain centralised registration. Seasonal patterns matter too: summer months and year-end holidays peak in many countries." },
    faq: { q: "Why does the daily count fluctuate?", a: "It follows a global average, but real marriages cluster in summer months and around major holidays. Religious calendars shift the seasonal pattern by region." }
  },
  'CancerDeathsTodayPage.jsx': {
    explainer: { title: "About the WHO cancer mortality figure", body: "The roughly 10 million annual cancer deaths figure comes from the WHO Global Health Estimates and IARC's GLOBOCAN database. It combines all cancer types and both sexes. Country-level totals vary widely: high-income nations report more complete mortality data, while lower-income nations rely more on modelling because civil registration of cause of death is incomplete." },
    faq: { q: "Does this include all cancer types?", a: "Yes — the figure aggregates every cancer type, including lung, breast, colorectal, prostate, liver, and stomach, across both sexes and all age groups." }
  },
  'CarsProducedTodayPage.jsx': {
    explainer: { title: "About the OICA production figure", body: "The roughly 80 million passenger cars built per year figure comes from OICA, the international organisation of motor vehicle manufacturers. It covers passenger cars only — light trucks, commercial vehicles, and buses are reported separately. Production is concentrated in China (roughly 30%), the EU, Japan, and North America." },
    faq: { q: "Does this include electric vehicles?", a: "Yes. Battery-electric and plug-in hybrid vehicles are counted in the passenger-car total. EVs accounted for roughly 18% of global car production in 2024." }
  },
  'DivorcesTodayPage.jsx': {
    explainer: { title: "About the global divorce estimate", body: "The roughly 2.2 million annual divorces figure aggregates national family court and civil registration data. Reporting is uneven: many countries publish annual totals with a 1-2 year lag, some publish rates per 1,000 population rather than absolute counts, and a few do not centralise the data. Cross-national comparisons are approximate, but the global total is stable year on year." },
    faq: { q: "Why is this data sometimes a year out of date?", a: "Civil registration systems publish annual totals months or years after the fact. The global figure is compiled from the most recent complete data, typically 12-24 months behind the current year." }
  },
  'PlasticBottlesProducedTodayPage.jsx': {
    explainer: { title: "About the bottle production figure", body: "The roughly 480 billion plastic bottles produced per year figure comes from industry packaging data and environmental research compiled by Euromonitor, Statista, and the Ellen MacArthur Foundation. It covers beverage, water, household cleaner, and personal-care containers. Virgin plastic dominates: less than 10% of all plastic ever produced has been recycled." },
    faq: { q: "Does this include recycled bottles?", a: "It counts total production. Recycled bottles are still produced and counted. What is not counted is waste — actual disposal and littering rates are separate and harder to measure." }
  },
  'DiabetesDeathsTodayPage.jsx': {
    explainer: { title: "About the WHO diabetes mortality figure", body: "The roughly 1.5 million direct diabetes deaths figure comes from the WHO Global Health Estimates, which classify the underlying cause of death. Another 2.2 million deaths are attributed to high blood glucose as a contributing factor — these are typically recorded under cardiovascular disease, kidney failure, or infection as the immediate cause." },
    faq: { q: "What counts as a diabetes death?", a: "A death is counted as diabetes-related if diabetes is listed as the underlying cause on the death certificate. Many diabetes deaths are recorded under cardiovascular or kidney disease instead." }
  }
};

let ok = 0, skip = 0, guard = 0, miss = 0;

for (const [file, patch] of Object.entries(PATCHES)) {
  const p = path.join(PAGES, file);
  if (!fs.existsSync(p)) { console.log(`MISS  ${file}`); miss++; continue; }

  let src = fs.readFileSync(p, 'utf8');
  const nl = NL(src);

  if (src.includes(patch.explainer.title)) { console.log(`SKIP  ${file}`); skip++; continue; }

  const eMatch = src.match(/(\r?\n)(\s*)\]\r?\n\r?\nconst FAQS\b/);
  if (!eMatch) { console.log(`GUARD ${file} EXPLAINERS anchor`); guard++; continue; }
  const eIdx = eMatch.index;
  const beforeE = src.slice(0, eIdx);
  const eBlock = (!/,\s*$/.test(beforeE) ? ',' : '') + `${nl}  { title: ${q(patch.explainer.title)}, body: ${q(patch.explainer.body)} }`;
  src = src.slice(0, eIdx) + eBlock + src.slice(eIdx);

  const fMatch = src.match(/(\r?\n)(\s*)\]\r?\n\r?\nconst RELATED\b/);
  if (!fMatch) { console.log(`GUARD ${file} FAQS anchor`); guard++; continue; }
  const fIdx = fMatch.index;
  const beforeF = src.slice(0, fIdx);
  const fBlock = (!/,\s*$/.test(beforeF) ? ',' : '') + `${nl}  { q: ${q(patch.faq.q)}, a: ${q(patch.faq.a)} }`;
  src = src.slice(0, fIdx) + fBlock + src.slice(fIdx);

  fs.writeFileSync(p, src);
  console.log(`OK    ${file}`);
  ok++;
}

console.log(`\nDone. ok=${ok} skip=${skip} guard=${guard} miss=${miss}`);