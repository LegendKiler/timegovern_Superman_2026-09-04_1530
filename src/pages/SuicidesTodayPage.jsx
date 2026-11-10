import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
import MetricPage from '../components/worldometers/MetricPage'
import { WORLD_RATES } from '../data/worldRates'

const metric = WORLD_RATES.suicides

const EXPLAINERS = [
  { title: "About this counter", body: "About 726,000 people die by suicide each year worldwide - roughly 1,988 per day. This counter ticks through today's deaths at that rate, reset at midnight UTC." },
  { title: "If you need help", body: "If you are in crisis, please contact a local crisis line. In the US: 988 (Suicide & Crisis Lifeline). UK: 116 123 (Samaritans). International: findahelpline.com. You are not alone." },
  { title: "Where rates are highest", body: "Suicide rates are highest in Eastern Europe (Russia, Belarus, Ukraine) and parts of South Asia. Men die by suicide at roughly 2-3 times the rate of women, though women attempt more often." },
  { title: "About the WHO estimate", body: "The 726,000 annual figure is a World Health Organization modelled estimate, not a direct count. Many countries underreport suicide due to stigma and, in some jurisdictions, criminalisation, which leads officials to misclassify deaths. The WHO publishes a range alongside the point estimate, and the true global total is likely higher than the median figure." }
]

const FAQS = [
  { q: "How many suicides happen per day?", a: "About 1,988 worldwide, or roughly 726,000 per year." },
  { q: "When does the counter reset?", a: "At midnight UTC. The counter shows today's deaths so far." },
  { q: "Where can I get help?", a: "Contact a crisis line: US 988, UK 116 123, or findahelpline.com for other countries." },
  { q: "Where does the data come from?", a: "WHO Global Health Estimates, 2024 update." },
  { q: "Is this figure exact?", a: "No — it is a modelled estimate. Underreporting is common, so the true number of suicide deaths is likely higher than the WHO point estimate." }
]

const RELATED = [
  { to: "/deaths-clock", name: "Deaths Clock", desc: "All deaths today" },
  { to: "/cancer-deaths-today", name: "Cancer Deaths", desc: "Cancer deaths today" },
  { to: "/diabetes-deaths-today", name: "Diabetes Deaths", desc: "Diabetes deaths today" },
  { to: "/road-traffic-deaths-today", name: "Road Deaths", desc: "Road deaths today" }
]

export default function SuicidesTodayPage() {

  useEffect(() => {
    document.title = 'Suicides Today | TimeGovern';
    setPageMeta();
  }, []);
  return <MetricPage metric={metric} explainers={EXPLAINERS} faqs={FAQS} related={RELATED} />
}
