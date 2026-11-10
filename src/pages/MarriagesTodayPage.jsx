import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
import MetricPage from '../components/worldometers/MetricPage'
import { WORLD_RATES } from '../data/worldRates'

const metric = WORLD_RATES.marriages

const EXPLAINERS = [
  { title: "About this counter", body: "Roughly 5.2 million marriages happen worldwide each year, working out to about 14,240 per day. This counter ticks through today's marriages at that rate, reset at midnight UTC." },
  { title: "Where marriages happen most", body: "India, China, the United States, and Indonesia together account for more than half of all marriages globally. Marriage rates per capita are highest in sub-Saharan Africa and parts of South Asia." },
  { title: "Marriage is declining", body: "Global marriage rates have fallen in every region except a few fast-urbanizing countries. In high-income countries, the average age of first marriage is now around 30, up from 23 in 1970." },
  { title: "About the global marriage estimate", body: "The roughly 5.5 million annual marriages figure aggregates national civil registration data reported to the UN and compiled by sources such as OECD and the World Bank. Coverage varies — some countries publish promptly, others lag by 1-2 years, and a few do not maintain centralised registration. Seasonal patterns matter too: summer months and year-end holidays peak in many countries." }
]

const FAQS = [
  { q: "How many marriages happen per day?", a: "About 14,240 worldwide, or roughly 5.2 million per year." },
  { q: "When does the counter reset?", a: "At midnight UTC. The counter shows marriages so far today." },
  { q: "Are these official counts?", a: "They are modeled estimates from UN World Marriage Data, which compiles national civil registries and survey data." },
  { q: "Where does the data come from?", a: "UN Department of Economic and Social Affairs, World Marriage Data 2024." },
  { q: "Why does the daily count fluctuate?", a: "It follows a global average, but real marriages cluster in summer months and around major holidays. Religious calendars shift the seasonal pattern by region." }
]

const RELATED = [
  { to: "/divorces-today", name: "Divorces Clock", desc: "Divorces today" },
  { to: "/world-population-clock", name: "World Population", desc: "Live population" },
  { to: "/births-clock", name: "Births Clock", desc: "Births today" },
  { to: "/deaths-clock", name: "Deaths Clock", desc: "Deaths today" }
]

export default function MarriagesTodayPage() {

  useEffect(() => {
    document.title = 'Marriages Today | TimeGovern';
    setPageMeta();
  }, []);
  return <MetricPage metric={metric} explainers={EXPLAINERS} faqs={FAQS} related={RELATED} />
}
