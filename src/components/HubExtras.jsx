import React from 'react';

const CONTENT = {
  marketing: {
    heading: 'What you get, and how billing works',
    paras: [
      'TimeGovern is free to use for every calculator, converter, and live data page on the site. Nothing behind a login, no per-query charge, no feature held back to force an upgrade. The paid tiers exist for people who want the data delivered to them rather than looked up by hand.',
      'Paid plans are billed through a third-party payment processor; TimeGovern never sees or stores your card number. Subscriptions renew automatically at the interval shown at checkout until cancelled. You can cancel from your account settings at any time, and access continues to the end of the period you already paid for - there is no early-termination fee and no cancellation phone call.',
      'If a charge looks wrong, contact us before filing a dispute. Refunds are issued for duplicate charges, for billing after a cancellation you completed, and for annual plans cancelled within the first fourteen days. We do not pro-rate partial months on monthly plans, because the price you paid covered a period you already had access to.',
      'Prices are listed in US dollars and exclude any sales tax, VAT, or GST your jurisdiction requires us to collect, which is calculated at checkout based on your billing address. We will give reasonable notice by email before any price change, and a price change never applies retroactively to a period you have already paid for.',
      'If a feature you need is not in any plan, say so - we would rather build the right thing than sell you the wrong tier. Nothing on this site is paywalled to force an upgrade; the calculators and converters stay free regardless of what plan you choose.',
      'Every plan, free or paid, is covered by the same privacy policy and the same terms of service. Upgrading does not change what we collect about you or who we share it with.',
    ],
  },
  community: {
    heading: 'How this page works and how to reach a human',
    paras: [
      'TimeGovern is run by a small team, and the contact routes on this page go to the people who actually maintain the site rather than to a ticket queue that routes back to a help article. That is a deliberate choice, and it means response times are measured in days rather than minutes.',
      'Before writing in, check whether your question is already answered on the page you came from. Calculator inputs, unit definitions, and the formulas behind each tool are documented on the tool page itself, and the methodology notes explain where a number comes from. Data pages that show live figures include the refresh interval and the upstream source in the page footer.',
      'When you do write in, include the URL of the page you are asking about, what you expected to see, and what you saw instead. A screenshot helps if the problem is visual. If you are reporting a calculation that looks wrong, tell us the exact inputs you used - we can reproduce a wrong result from inputs in a way we cannot from a description.',
      'We read bug reports, corrections to data, accessibility problems, and licensing questions. We do not accept paid link placements, sponsored posts, or guest articles, and requests for those are declined without reply. Press enquiries should say so in the subject line so they are routed correctly.',
      'If you are reporting a problem with a specific calculator, include the exact inputs you used and the result you saw. A wrong number we can reproduce is a fix in hours; a description of a wrong number we cannot reproduce may never get investigated. The same applies to accessibility reports - tell us what you were using and what did not work, and we can act on it.',
      'Community features are moderated against the published posting rules. Reports of spam, harassment, or off-topic promotion are reviewed by a moderator, and repeated violations result in removal of the account.',
    ],
  },
  'reference-hub': {
    heading: 'How the tools in this hub fit together',
    paras: [
      'This hub collects the reference tools that share a common job: turning one well-defined input into one well-defined output, with the working shown so you can check it by hand. Each tool is self-contained and runs in your browser - the calculation happens on your device, and the number you enter is not sent anywhere.',
      'The tools are grouped by what you are trying to do rather than by which department would own them. If you are converting between units, every converter in this hub uses the same definition table, so a result from the length converter and a result from the weight converter are consistent with each other. If you are working with time, the time zone converter and the timers share the same timezone database and the same handling of daylight-saving transitions.',
      'Every tool page states its formula, its assumptions, and the rounding it applies. Where a result depends on a convention - whether a week starts on Sunday or Monday, whether a year is 365 or 365.25 days, whether a byte is 1000 or 1024 of the next unit - the convention is written out on the page rather than buried in the code.',
      'Results are meant for planning and estimation. They are not a substitute for a professional calculation where one is required: tax, medical dosage, structural load, and financial advice all have legal or safety consequences that a general-purpose tool cannot carry. Where a tool borders on one of those areas, the page says so.',
      'If a tool is missing, the fastest route is the contact page. Suggestions that come with a worked example of the input and the output you expected get built first.',
    ],
  },
  travel: {
    heading: 'What this page shows, and what it does not',
    paras: [
      'This page is a planning aid, not a booking engine. It shows the shape of the problem - which routes exist, roughly what they cost, how long they take, and where the time zones fall - so you can compare options before you commit. It does not sell tickets, hold inventory, or take payment.',
      'Live pricing is pulled from a third-party flight data provider. When that provider is unavailable or its quota for the day is exhausted, the page shows a status banner rather than a stale or invented fare. A paused price feed is visible on purpose: a number that looks current but is hours old is worse than no number at all, because people make decisions on it.',
      'Fares change continuously and are not guaranteed until ticketed. The price shown reflects what the provider returned at the moment the page loaded, and it can differ from the airline own site because of fare classes, routing, and how the provider caches. Always confirm on the airline or agent before paying.',
      'Time zone information on flight pages is computed from the IANA timezone database and accounts for daylight-saving transitions at both ends of the journey. This matters for overnight and trans-dateline flights, where the arrival time can appear to be earlier than the departure time. The elapsed duration shown is the true flight time, not the difference between the clock times.',
      'Distance and route geometry are great-circle calculations between airport coordinates. Actual track flown will differ because of weather, airspace, and routing, so treat the distance as a lower bound.',
    ],
  },
  about: {
    heading: 'Why TimeGovern exists, and how it is built',
    paras: [
      'TimeGovern started from a small annoyance: the tools people need most often are the ones most likely to be buried under advertising, wrapped in a signup wall, or wrong in a way that is hard to notice. A time zone converter that ignores daylight saving, a unit converter that rounds at the wrong step, a percentage calculator that hides its formula - each one is easy to build badly and hard to check once it is built.',
      'The site is an attempt to do the opposite. Every tool states its formula and its assumptions. Every data page names its source and its refresh interval. Every converter uses a shared definition table so that two pages cannot quietly disagree with each other. Where a result depends on a convention, the convention is written out rather than assumed.',
      'The frontend is a React application built with Vite and deployed to Cloudflare Pages, with pages pre-rendered at build time so that each one arrives as complete HTML rather than an empty shell that fills in after JavaScript runs. The data services are Python running on Render. The whole site is statically served except for the live data endpoints, which is why it stays fast under load and why there is no tracking-heavy middleware between you and the page.',
      'TimeGovern is independently run and funded by display advertising rather than by selling user data or by paywalling individual tools. That is a deliberate trade: it keeps the tools free and the privacy policy short, at the cost of the ads you see. The privacy policy explains exactly what is collected, and the advertising page explains how to opt out of personalisation.',
      'Corrections are welcome and are acted on. If a formula is wrong, a source is stale, or a page is inaccessible with your setup, the contact page reaches the person who can fix it.',
    ],
  },
};

export default function HubExtras({ category = 'reference-hub' }) {
  const block = CONTENT[category] || CONTENT['reference-hub'];
  return (
    <section className="hub-extras">
      <h2>{block.heading}</h2>
      {block.paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </section>
  );
}
