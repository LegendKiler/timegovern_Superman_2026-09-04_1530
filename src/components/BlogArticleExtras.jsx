// src/components/BlogArticleExtras.jsx
// Reusable per-category expansion section injected at the bottom of country tax blog articles.

const CONTENT = {
  tax: {
    heading: 'How this guide fits together',
    body: 'This overview pairs with our country-specific salary calculator, which applies these brackets to actual income figures and shows the effective tax rate at any salary level. The calculator also accounts for the standard deduction and any pre-tax contributions that reduce taxable income before the brackets apply. Understanding the marginal structure is the key to reading a payslip correctly \u2014 the top marginal rate never applies to your entire income, only to the portion of income that falls within the highest bracket. For a detailed comparison against neighboring countries, cross-reference with our regional tax comparison pages, which show effective rates at common salary levels across multiple jurisdictions. All figures on this page are refreshed against the current official rate schedule and updated whenever the national tax authority publishes a change.'
  },
  takeHome: {
    heading: 'From gross to net: what actually leaves your pay',
    body: 'Take-home pay differs from gross salary by three categories of deductions: income tax, which is progressive; social security contributions, which are fixed percentages with wage ceilings; and any elective deductions like pension top-ups or insurance premiums. Each country applies these in a different order \u2014 some calculate income tax on gross salary, others on salary after social contributions, and the order changes the final number significantly. Our salary calculator handles both orders automatically, so the net figure it produces matches what appears on a real payslip. Keep in mind that tax residency status, dependent allowances, and marital status all shift the effective rate. The calculator lets you adjust these variables to see the range of outcomes. This guide explains the deductions themselves; the calculator shows what they mean for your specific salary.'
  },
  social: {
    heading: 'Why social contributions matter more than they look',
    body: 'Social contributions are often overlooked next to income tax, but they frequently represent fifteen to thirty percent of gross salary in countries with strong welfare systems \u2014 sometimes more than income tax itself. Unlike income tax, contributions are typically flat percentages (not progressive) with a wage ceiling, meaning that above the ceiling your effective contribution rate drops. Each program funds a specific benefit: pension, health insurance, unemployment insurance, workers compensation, and family allowances. The mix varies dramatically by country \u2014 some fund healthcare through general taxation and require only pension contributions, while others bundle everything into a single payroll line. Understanding the breakdown matters for cross-border employment, salary negotiation, and comparing job offers across countries. This guide explains the underlying program structure.'
  },
}

export function BlogArticleExtras({ category }) {
  const c = CONTENT[category]
  if (!c) return null
  return (
    <section className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-2xl font-black mt-8 mb-3">{c.heading}</h2>
      <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
    </section>
  )
}
