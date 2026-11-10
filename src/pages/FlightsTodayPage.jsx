import { useEffect } from "react"

import MetricPage from '../components/worldometers/MetricPage'
import { setPageMeta } from '../lib/seo'
import { WORLD_RATES } from '../data/worldRates'

const metric = WORLD_RATES.flights

const EXPLAINERS = [
  { title: "About this counter", body: "About 100,000 commercial flights take off each day worldwide - roughly 37 million per year. This counter ticks through today's departures at that rate, reset at midnight UTC." },
  { title: "Where flights go", body: "The United States alone operates about 45,000 daily flights. Europe handles around 30,000. Asia-Pacific is the fastest-growing region, with China, India, and Indonesia adding the most new routes." },
  { title: "How many people fly", body: "Airlines carried about 4.9 billion passengers in 2024, the highest on record. A single wide-body jet can carry 300-500 passengers per flight, and average load factor is around 84 per cent." },
  { title: "How the daily flight estimate is built", body: "The roughly 100,000 daily flights figure comes from industry trackers such as FlightRadar24 and IATA's annual passenger and cargo statistics. It covers scheduled commercial passenger and cargo flights worldwide, but excludes private aviation, military flights, and non-scheduled charters. Daily totals swing with season — Northern summer peaks push counts 10-15% above the annual mean." }
]

const FAQS = [
  { q: "How many flights per day?", a: "About 100,000 commercial flights globally, or roughly 37 million per year." },
  { q: "When does the counter reset?", a: "At midnight UTC. The counter shows today's flights so far." },
  { q: "Does this include private jets?", a: "No - the count is scheduled commercial airline departures. Private and cargo flights are separate." },
  { q: "Where does the data come from?", a: "International Civil Aviation Organization (ICAO) Annual Report 2024." },
  { q: "Does this include private jets?", a: "No. The count reflects scheduled commercial passenger and cargo flights. Private jets, military aircraft, and charter flights are excluded." }
]

const RELATED = [
  { to: "/cars-produced-today", name: "Cars Produced", desc: "Cars today" },
  { to: "/money-spent-online-today", name: "Money Spent Online", desc: "E-commerce today" },
  { to: "/emails-sent-today", name: "Emails Sent Clock", desc: "Emails today" },
  { to: "/world-population-clock", name: "World Population", desc: "Live population" }
]

export default function FlightsTodayPage() {
  useEffect(() => { setPageMeta() }, [])
  return <MetricPage metric={metric} explainers={EXPLAINERS} faqs={FAQS} related={RELATED} />
}
