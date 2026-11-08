import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function UkAIAddendum() {

  useEffect(() => {
    document.title = 'UK AI Addendum | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">UK AI Addendum</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold mb-2">1. UK Regulatory Framework</h2>
              <p>The UK takes a principles-based approach to AI regulation, which is sector-specific rather than a single comprehensive law. Relevant regulators include the ICO, FCA, CMA, and Ofcom.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. AI & Data Protection</h2>
              <p>We comply with the UK GDPR and Data Protection Act 2018 when processing personal data through AI systems. We ensure that AI processing is lawful, fair, and transparent.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. Transparency & Explainability</h2>
              <p>We provide meaningful explanations of AI decisions that affect users, in accordance with ICO guidance on AI and data protection.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Contact</h2>
              <p>UK Data Protection Officer: <a href="mailto:dpo-uk@timegovern.com" className="text-primary hover:underline">dpo-uk@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="ai" context="the UK AI framework" />
    </div>
  )
}
