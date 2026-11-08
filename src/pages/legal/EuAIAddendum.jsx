import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function EuAIAddendum() {

  useEffect(() => {
    document.title = 'EU AI Act Addendum | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">EU AI Act Addendum</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold mb-2">1. EU AI Act Overview</h2>
              <p>The EU AI Act is the world's first comprehensive AI law, establishing a risk-based framework. It entered into force on 1 August 2024, with phased implementation. As of 2026, we comply with all applicable obligations.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. Transparency Obligations (Article 50)</h2>
              <p>In accordance with Article 50, we ensure that users are clearly informed when interacting with AI systems. We label AI-generated content and provide clear disclosure that AI may produce errors.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. AI Literacy (Article 4)</h2>
              <p>We promote AI literacy by providing educational content about how our AI systems work and their limitations.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Risk Classification</h2>
              <p>Our AI systems are classified as minimal risk under the EU AI Act. We do not deploy AI in prohibited (unacceptable risk) categories or high-risk systems that require conformity assessment.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">5. Contact</h2>
              <p>EU Representative: <a href="mailto:eu-ai@timegovern.com" className="text-primary hover:underline">eu-ai@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="ai" context="the EU AI Act" />
    </div>
  )
}
