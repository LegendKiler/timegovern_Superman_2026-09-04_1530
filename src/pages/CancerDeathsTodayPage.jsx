import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
import MetricPage from '../components/worldometers/MetricPage'
import { WORLD_RATES } from '../data/worldRates'

const metric = WORLD_RATES.cancerDeaths

const EXPLAINERS = [
  { title: "About this counter", body: "About 10 million people die of cancer worldwide each year - roughly 27,389 per day. This counter ticks through today's deaths at that rate, reset at midnight UTC." },
  { title: "The most common cancers", body: "Lung cancer is the leading cause of cancer death globally (1.8 million/year), followed by colorectal (900K), liver (760K), breast (670K), and stomach (660K). Together these five cause half of all cancer deaths." },
  { title: "Trends", body: "Cancer deaths are rising as populations age and grow, despite falling death rates in high-income countries. Tobacco use remains the single largest preventable cause, responsible for about 22 per cent of cancer deaths." },
  { title: "About the WHO cancer mortality figure", body: "The roughly 10 million annual cancer deaths figure comes from the WHO Global Health Estimates and IARC's GLOBOCAN database. It combines all cancer types and both sexes. Country-level totals vary widely: high-income nations report more complete mortality data, while lower-income nations rely more on modelling because civil registration of cause of death is incomplete." }
]

const FAQS = [
  { q: "How many cancer deaths per day?", a: "About 27,389 worldwide, or roughly 10 million per year." },
  { q: "When does the counter reset?", a: "At midnight UTC. The counter shows today's deaths so far." },
  { q: "What is the deadliest cancer?", a: "Lung cancer kills about 1.8 million people per year, the most of any cancer type." },
  { q: "Where does the data come from?", a: "WHO International Agency for Research on Cancer (IARC), GLOBOCAN 2024 estimates." },
  { q: "Does this include all cancer types?", a: "Yes — the figure aggregates every cancer type, including lung, breast, colorectal, prostate, liver, and stomach, across both sexes and all age groups." }
]

const RELATED = [
  { to: "/smoking-deaths-today", name: "Smoking Deaths", desc: "Smoking deaths today" },
  { to: "/diabetes-deaths-today", name: "Diabetes Deaths", desc: "Diabetes deaths today" },
  { to: "/deaths-clock", name: "Deaths Clock", desc: "All deaths today" },
  { to: "/suicides-today", name: "Suicides Clock", desc: "Suicides today" }
]

export default function CancerDeathsTodayPage() {

  useEffect(() => {
    document.title = 'Cancer Deaths Today | TimeGovern';
    setPageMeta();
  }, []);
  return <MetricPage metric={metric} explainers={EXPLAINERS} faqs={FAQS} related={RELATED} />
}
