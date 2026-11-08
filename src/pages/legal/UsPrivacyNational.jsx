import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function UsPrivacyNational() {

  useEffect(() => {
    document.title = 'United States Privacy Policy | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">United States Privacy Policy</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Federal Framework</h2>
              <p>The United States does not have a single comprehensive federal privacy law. Instead, it relies on sectoral federal laws and state-level legislation . Key federal laws include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>FTC Act Section 5</strong> – Prohibits unfair or deceptive practices; FTC has de facto authority over consumer privacy</li>
                <li><strong>HIPAA</strong> – Health information privacy</li>
                <li><strong>COPPA</strong> – Children's Online Privacy Protection Act (under 13)</li>
                <li><strong>GLBA</strong> – Financial privacy</li>
                <li><strong>FCRA</strong> – Credit reporting</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. State Privacy Laws</h2>
              <p>As of 2026, 19+ states have enacted comprehensive data privacy laws . The most prominent include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>California (CCPA/CPRA)</strong> – Most comprehensive; rights to know, delete, correct, opt-out</li>
                <li><strong>Colorado (CPA)</strong>, <strong>Virginia (VCDPA)</strong>, <strong>Connecticut (CTDPA)</strong></li>
                <li><strong>Utah (UCPA)</strong> – takes effect Dec 2023</li>
                <li><strong>Texas (TDPSA)</strong>, <strong>Montana</strong>, <strong>Oregon</strong>, <strong>New Jersey</strong></li>
                <li><strong>New laws effective July 1, 2026</strong>: Arkansas, Vermont, and others</li>
              </ul>
              <p className="mt-2">Each state law provides individuals with rights to access, correct, delete, and opt-out of data collection .</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Your Rights</h2>
              <p>Depending on your state, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Know what personal information is collected</li>
                <li>Access and obtain a copy of your data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal information</li>
                <li>Opt-out of sale or sharing of data</li>
                <li>Limit use of sensitive personal information</li>
                <li>Non-discrimination for exercising rights</li>
              </ul>
              <p className="mt-2">Some states (California) provide a private right of action for data breaches, allowing consumers to sue directly .</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Data Breach Notification</h2>
              <p>All 50 states have breach notification laws. We notify affected individuals and state attorneys general within the required timelines (ranging from 24 hours to 60 days depending on state) .</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Contact</h2>
              <p>For privacy inquiries, contact: <a href="mailto:privacy@timegovern.com" className="text-primary hover:underline">privacy@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="US federal law" />
    </div>
  )
}
