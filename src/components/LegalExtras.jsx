// src/components/LegalExtras.jsx
// Shared expansion block for legal pages — brings thin privacy/AI/legal pages above
// the 300-word AdSense content threshold. Category determines the shared prose;
// context prop interpolates a jurisdiction-specific intro sentence.

import { Card, CardContent, CardHeader } from "@/components/ui/card"

const CONTENT = {
  privacy: {
    title: 'Your Data Rights in Practice',
    lead: (ctx) => `Your rights under ${ctx} data protection law differ in detail from other jurisdictions, but the fundamentals apply everywhere TimeGovern operates.`,
    paragraphs: [
      'Every privacy framework TimeGovern is subject to — from the EU\u2019s GDPR to Brazil\u2019s LGPD, from India\u2019s DPDP Act to the various US state privacy laws — grants individuals a core set of rights over their personal data. These rights consistently include: the right to know what data is collected about you, the right to access a copy of that data in a portable format, the right to correct inaccurate information, the right to request deletion of your data subject to legal retention obligations, the right to restrict or object to certain processing activities, and the right to withdraw consent at any time for processing that is based on consent.',
      'To exercise any of these rights, email privacy@timegovern.com with a description of what you are requesting and the region you are located in. We will acknowledge receipt within five business days and complete the request within 30 days, or within the shorter timeframe required by your jurisdiction. We may request verification of your identity before acting on a request to prevent unauthorised access to your account data.',
      'TimeGovern uses a limited set of third-party services that may process personal data on our behalf: Google Analytics for aggregated traffic analytics, Google AdSense for advertising (where enabled), Cloudflare for content delivery and DDoS protection, and Sentry for error monitoring. Each of these providers has a published privacy policy and data processing agreement, and none of them receive your name, email address, or account identifiers unless you sign in to a service that requires it. We do not sell your personal data to any third party, and we do not share your data with advertisers for targeting purposes.',
      'We retain personal data only as long as necessary to provide the service you requested or to comply with a legal obligation. Anonymous analytics data may be retained for up to 26 months. Account data is deleted within 30 days of a verified deletion request unless we are legally required to retain it for a longer period. For specific retention timelines tied to your jurisdiction, see the country-specific sections on this page.',
    ]
  },
  ai: {
    title: 'How TimeGovern Approaches AI Governance',
    lead: (ctx) => `This addendum explains our practices under ${ctx}, alongside the broader commitments we make to every user regardless of jurisdiction.`,
    paragraphs: [
      'Artificial intelligence features on TimeGovern — where present — are limited to pattern-based text assistance and content generation for non-sensitive use cases. We do not deploy AI systems in any prohibited category, we do not use AI to make automated decisions with legal or significant effects on individuals, and we do not process biometric, health, or other special category data through AI features. All AI-generated output is clearly labelled, and users are informed when they are interacting with an AI system rather than a human.',
      'Our approach aligns with the emerging consensus among international regulators. The EU AI Act establishes the world\u2019s first comprehensive risk-based framework, categorising AI systems into unacceptable risk (prohibited), high risk (subject to conformity assessment), limited risk (transparency obligations), and minimal risk (unregulated). TimeGovern\u2019s AI features fall under the minimal risk category. The US has adopted a voluntary approach through the NIST AI Risk Management Framework, the UK has opted for a principles-based sector-led model, and Australia has published a Voluntary AI Safety Standard. We align with these frameworks\u2019 core principles: transparency, human oversight, fairness, and technical robustness.',
      'For any questions about our AI practices, or to report a concern about AI-generated content you have encountered on the site, contact ai@timegovern.com. We respond to all AI-related inquiries within five business days. For information about the specific regulatory framework applicable to your jurisdiction, see the country-specific addendum linked above.',
    ]
  },
  'legal-advertising': {
    title: 'How Advertising Supports TimeGovern',
    lead: () => 'TimeGovern is free to use, and this page explains the role advertising plays in keeping it that way.',
    paragraphs: [
      'Every calculator, every reference page, and every article is available without paywall, subscription, or signup. The site is supported by advertising served through Google AdSense for pages that meet our content quality threshold. We do not display ads on pages that fall below 300 words of substantive content, we do not display ads inside interactive tools where they would interfere with usability, and we do not display ads in email newsletters, in the premium tier, or on the embed widget pages that third-party sites frame.',
      'Ad placement is determined by Google\u2019s automated system based on the content of each page. TimeGovern does not select specific advertisers, negotiate direct ad placements, or receive information about individual users from AdSense beyond aggregated performance statistics. We do not accept sponsored content disguised as editorial, we do not publish paid reviews, and we do not allow advertisers to influence the content, ranking, or design of any page on the site.',
      'Users who prefer an ad-free experience can subscribe to TimeGovern Premium, which removes all display advertising across the site and its embed widgets. Ad revenue from the free tier allows us to keep the calculators, guides, and reference pages freely accessible, and premium subscriptions allow us to invest in new tools and content without relying on advertising at all.',
      'If you encounter an ad that is misleading, inappropriate, or interferes with site functionality, report it to support@timegovern.com. We investigate every report and, where warranted, block the advertiser from future campaigns. Every advertiser is subject to Google AdSense\u2019s content policies, which prohibit deceptive, discriminatory, or harmful advertising content.'
    ]
  },
  'legal-links': {
    title: 'Our Linking and Editorial Standards',
    lead: () => 'TimeGovern\u2019s linking practices are governed by the standards described below.',
    paragraphs: [
      'TimeGovern links to external sources for two reasons: to cite the data, research, and official regulations that underpin our content, and to help users navigate to related tools and authoritative resources. Every external link is reviewed before publication by the editorial team, and links are re-verified on a rolling schedule. We do not accept payment for outbound links, we do not run affiliate programmes, and we do not participate in link exchanges. If you find a broken or hijacked external link, please report it to support@timegovern.com.',
      'The data sources behind our calculators and live-statistics pages are listed explicitly on each page. Population, GDP, life expectancy, CO2, energy, and water data originate from the World Bank, UN, IEA, FAO, and the Global Carbon Project. Tax rate data is sourced directly from each national tax authority. Currency rates come from the European Central Bank and a commercial FX feed. Weather and astronomy data sources are listed on the respective tool pages. We refresh data on the schedule published by each source and stamp every page with the last update date.',
      'Our editorial policy is independent of any commercial relationship. Content authors do not receive compensation tied to pageviews, advertising revenue, or user engagement metrics. Reviewers\u2019 scores, comparison rankings, and best-of lists are based solely on the criteria stated in each article. We disclose any relationship that could reasonably be seen as a conflict of interest, including when we link to a TimeGovern product or when a TimeGovern tool appears in a comparison against third-party tools.',
      'If you believe a link on TimeGovern points to misleading, unsafe, or inappropriate content, contact editorial@timegovern.com with the page and the link in question. We review every report within five business days and remove or replace confirmed problematic links.'
    ]
  },
  'legal-disclaimer': {
    title: 'Understanding the Limits of Our Tools',
    lead: () => 'The results our calculators produce are estimates, and this page explains what that means for how you should use them.',
    paragraphs: [
      'TimeGovern provides calculators, converters, and reference tools for informational and educational purposes. The results they produce are estimates based on publicly available data and standard formulas, and they are not a substitute for professional advice. Financial calculators (loan, mortgage, retirement, investment, tax) produce illustrative projections, not financial advice, and not quotes for a financial product. Medical calculators (BMI, body fat, pregnancy, ovulation, BAC) produce estimates based on population averages, not diagnoses, and not treatment recommendations. Legal and tax reference content describes general rules, not your specific situation.',
      'Our calculators use the current tax brackets, standard deduction thresholds, and contribution rates published by the relevant authority at the time of the last update. Tax laws change annually, sometimes more frequently. If a calculation you receive from TimeGovern differs materially from what your payroll or tax software produces, trust the professional software and consult a licensed accountant or financial adviser. The same applies to medical values — always defer to your doctor\u2019s assessment over an online calculator.',
      'While we make every reasonable effort to keep this site available and its data current, TimeGovern is provided on an \u201cas is\u201d and \u201cas available\u201d basis without warranties of any kind. We are not liable for decisions made based on information obtained from the site, for inaccuracies in third-party data, or for interruptions in service. Where legally permitted, our aggregate liability for any claim related to the site is limited to the amount you have paid TimeGovern (if any) in the twelve months preceding the claim.',
      'If you spot an error in a calculator, a rate that appears out of date, or a piece of content that is factually incorrect, report it to support@timegovern.com. Corrections are reviewed within five business days and, when confirmed, published with a correction note visible to all users.'
    ]
  },
}

export function LegalExtras({ category, context }) {
  const c = CONTENT[category]
  if (!c) return null
  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="text-lg font-semibold">{c.title}</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>{c.lead(context || 'your jurisdiction')}</p>
          {c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </CardContent>
    </Card>
  )
}
