import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function UkPrivacy() {

  useEffect(() => {
    document.title = 'United Kingdom Privacy Policy (UK GDPR) | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">United Kingdom Privacy Policy (UK GDPR)</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. UK GDPR and Data Protection Act 2018</h2>
              <p>Following Brexit, the UK operates under the UK GDPR, which mirrors the EU GDPR, and the Data Protection Act 2018. The ICO (Information Commissioner's Office) is the supervisory authority .</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Legal Basis for Processing</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Consent</li>
                <li>Contract performance</li>
                <li>Legal obligation</li>
                <li>Vital interests</li>
                <li>Public task</li>
                <li>Legitimate interests</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Data Subject Rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Right of access</li>
                <li>Right to rectification</li>
                <li>Right to erasure</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object</li>
                <li>Rights related to automated decision-making</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. International Data Transfers</h2>
              <p>The UK has its own adequacy decisions for international transfers, separate from the EU. We ensure appropriate safeguards under the UK GDPR .</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Contact</h2>
              <p>UK Data Protection Officer: <a href="mailto:dpo@timegovern.com" className="text-primary hover:underline">dpo@timegovern.com</a></p>
              <p className="mt-1">Complaints: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="the United Kingdom" />
    </div>
  )
}
