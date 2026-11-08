import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function UsAIAddendum() {

  useEffect(() => {
    document.title = 'US AI Addendum | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">US AI Addendum</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold mb-2">1. US Regulatory Landscape</h2>
              <p>The United States does not have a single federal AI law. Instead, AI is regulated through a patchwork of executive orders, state laws, and sectoral regulations. Key frameworks include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Executive Orders:</strong> 14110 (Safe, Secure, and Trustworthy AI)</li>
                <li><strong>FTC:</strong> Enforces consumer protection laws on AI (Section 5 prohibits unfair/deceptive practices)</li>
                <li><strong>State Laws:</strong> California (AI transparency), Texas, Illinois, New York</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. State-Level Compliance</h2>
              <p>We comply with AI-specific state laws where applicable. This includes:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>California BOT Act:</strong> Requires bots to disclose they are AI when interacting with consumers</li>
                <li><strong>Illinois AI Video Disclosure Act:</strong> Requires labeling of AI-generated media</li>
                <li><strong>New York AI law:</strong> Prohibits discrimination in hiring algorithms</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. FTC Compliance</h2>
              <p>We comply with FTC guidance on AI, ensuring:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>No deceptive AI claims</li>
                <li>Clear disclosure of AI-generated content</li>
                <li>No algorithmic discrimination</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Contact</h2>
              <p>US Privacy Officer: <a href="mailto:privacy-us@timegovern.com" className="text-primary hover:underline">privacy-us@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="ai" context="US AI regulation" />
    </div>
  )
}
