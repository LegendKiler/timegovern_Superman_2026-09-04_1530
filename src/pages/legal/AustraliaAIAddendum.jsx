import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function AustraliaAIAddendum() {

  useEffect(() => {
    document.title = 'Australia AI Addendum | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Australia AI Addendum</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold mb-2">1. Australian AI Regulatory Landscape</h2>
              <p>Australia is developing an AI regulatory framework. As of 2026, the government is consulting on a risk-based approach with voluntary AI Ethics Principles (2019) and proposed mandatory guardrails for high-risk AI.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. AI Ethics Principles</h2>
              <p>We align our AI systems with Australia's 8 AI Ethics Principles, including human-centered values, transparency, fairness, and accountability.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. Privacy Act Compliance</h2>
              <p>We ensure that AI processing complies with the Australian Privacy Principles (APPs) under the Privacy Act 1988.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Consumer Protection</h2>
              <p>We comply with the Australian Consumer Law (ACL) provisions prohibiting misleading or deceptive conduct in relation to AI systems.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">5. Contact</h2>
              <p>Australian AI Officer: <a href="mailto:ai-au@timegovern.com" className="text-primary hover:underline">ai-au@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="ai" context="Australia’s AI framework" />
    </div>
  )
}
