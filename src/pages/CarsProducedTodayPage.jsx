import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
import MetricPage from '../components/worldometers/MetricPage'
import { WORLD_RATES } from '../data/worldRates'

const metric = WORLD_RATES.carsProduced

const EXPLAINERS = [
  { title: "About this counter", body: "Global vehicle production ran at about 93 million vehicles in 2023. That is roughly 255,000 vehicles per day. This counter ticks through today's production at that rate, reset at midnight UTC." },
  { title: "Where cars are made", body: "China produces more than 30 per cent of all vehicles globally. Japan, Germany, the United States, South Korea, and India round out the top six. Together they account for over 60 per cent of global output." },
  { title: "The EV shift", body: "Roughly 14 million electric vehicles were sold in 2023 - about 18 per cent of new passenger car sales. China accounts for over 60 per cent of global EV production." },
  { title: "About the OICA production figure", body: "The roughly 80 million passenger cars built per year figure comes from OICA, the international organisation of motor vehicle manufacturers. It covers passenger cars only — light trucks, commercial vehicles, and buses are reported separately. Production is concentrated in China (roughly 30%), the EU, Japan, and North America." }
]

const FAQS = [
  { q: "How many cars are produced per day?", a: "About 255,000 worldwide, or roughly 93 million per year." },
  { q: "When does the counter reset?", a: "At midnight UTC. The counter shows today's production so far." },
  { q: "What counts as a car?", a: "All motor vehicles: passenger cars, light commercial vehicles, trucks, and buses, per OICA definitions." },
  { q: "Where does the data come from?", a: "International Organization of Motor Vehicle Manufacturers (OICA), 2024 statistics." },
  { q: "Does this include electric vehicles?", a: "Yes. Battery-electric and plug-in hybrid vehicles are counted in the passenger-car total. EVs accounted for roughly 18% of global car production in 2024." }
]

const RELATED = [
  { to: "/google-searches-today", name: "Google Searches", desc: "Searches today" },
  { to: "/money-spent-online-today", name: "Money Spent Online", desc: "E-commerce today" },
  { to: "/tvs-sold-today", name: "TVs Sold Clock", desc: "TVs sold today" },
  { to: "/mobile-phones-sold-today", name: "Phones Sold Clock", desc: "Phones sold today" }
]

export default function CarsProducedTodayPage() {

  useEffect(() => {
    document.title = 'Cars Produced Today | TimeGovern';
    setPageMeta();
  }, []);
  return <MetricPage metric={metric} explainers={EXPLAINERS} faqs={FAQS} related={RELATED} />
}
