import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Lock, UserCheck } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function GdprPrivacy() {

  useEffect(() => {
    document.title = 'EU GDPR Privacy Policy | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">EU GDPR Privacy Policy</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Data Controller</h2>
              <p>TimeGovern is the data controller for personal data collected through this website. Contact: <a href="mailto:privacy@timegovern.com" className="text-primary hover:underline">privacy@timegovern.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Legal Basis for Processing</h2>
              <p>We process personal data on the following legal bases [citation:2]:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Consent: for newsletter subscriptions and marketing</li>
                <li>Contract: to provide our services and tools</li>
                <li>Legitimate interest: to improve our services and ensure security</li>
                <li>Legal obligation: to comply with applicable laws</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Data Subject Rights</h2>
              <p>Under GDPR, you have the right to [citation:12]:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access your personal data</li>
                <li>Rectification of inaccurate data</li>
                <li>Erasure ("right to be forgotten")</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-2">To exercise these rights, contact us at <a href="mailto:privacy@timegovern.com" className="text-primary hover:underline">privacy@timegovern.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Cookies and Consent</h2>
              <p>We use cookies and similar tracking technologies. Non-essential cookies are only loaded after you provide explicit consent through our cookie banner. You can withdraw consent at any time through our Privacy Settings [citation:2][citation:7].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. International Data Transfers</h2>
              <p>Where we transfer personal data outside the EU/EEA, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">6. Data Protection Officer</h2>
              <p>We have appointed a Data Protection Officer who can be contacted at <a href="mailto:dpo@timegovern.com" className="text-primary hover:underline">dpo@timegovern.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">7. Complaints</h2>
              <p>You have the right to lodge a complaint with your local supervisory authority. In Australia, contact the OAIC at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">oaic.gov.au</a>.</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="the EU" />
    </div>
  )
}
