import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function ChinaAIAddendum() {

  useEffect(() => {
    document.title = 'China AI Addendum | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">China AI Addendum</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold mb-2">1. Regulatory Framework</h2>
              <p>China regulates AI through multiple measures including the Generative AI Measures, Algorithm Recommendation Provisions, and Deep Synthesis Provisions.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. Mandatory Content Labeling</h2>
              <p>In accordance with the Generative AI Measures, all AI-generated content must be clearly labeled. We ensure all AI-generated text, images, and summaries on our site are appropriately marked.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. Algorithm Registration</h2>
              <p>We comply with the Algorithm Recommendation Provisions by registering our algorithms with the Cyberspace Administration of China (CAC) where required.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Data Governance</h2>
              <p>We ensure that AI processing complies with the Personal Information Protection Law (PIPL) and the Data Security Law (DSL).</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">5. Contact</h2>
              <p>China Representative: <a href="mailto:cn-ai@timegovern.com" className="text-primary hover:underline">cn-ai@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="ai" context="China’s AI regulations" />
    </div>
  )
}
