import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"

import { LegalExtras } from '../../components/LegalExtras'

export default function GlobalPrivacyPolicy() {

  useEffect(() => {
    document.title = 'Global Privacy Policy | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Global Privacy Policy</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
              <p>TimeGovern ("we," "our," "us") respects your privacy and is committed to protecting your personal information. This Global Privacy Policy explains our practices for collecting, using, storing, and sharing your data when you visit timegovern.com.</p>
              <p className="mt-2">This policy applies globally. Users in specific regions may have additional rights as detailed in our <Link to="/global-privacy" className="text-primary hover:underline">Regional Addendums</Link>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
              <p>We collect the following categories of data:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Data you provide directly:</strong> name, email address, messages sent via contact forms.</li>
                <li><strong>Data collected automatically:</strong> IP address, browser type, device identifiers, pages visited.</li>
                <li><strong>Data from third parties:</strong> analytics providers, advertising networks.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. How We Use Your Data</h2>
              <p>We process your personal data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide and improve our services (e.g., time conversion, calendars).</li>
                <li>To respond to your inquiries and support requests.</li>
                <li>To send you newsletters and updates (with your consent).</li>
                <li>To analyze site usage and improve user experience.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Sharing Your Data</h2>
              <p>We do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Service providers who help us operate our website (e.g., hosting, analytics).</li>
                <li>Business partners, if you consent.</li>
                <li>Legal authorities, if required by law.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Data Retention</h2>
              <p>We retain your personal data only as long as necessary for the purposes described in this policy, or as required by law.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access the personal information we hold about you.</li>
                <li>Request corrections to inaccurate data.</li>
                <li>Request deletion of your data.</li>
                <li>Withdraw consent to processing at any time.</li>
                <li>Lodge a complaint with your local supervisory authority.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">7. Contact Us</h2>
              <p>If you have any questions about this policy, contact us at: <a href="mailto:privacy@timegovern.com" className="text-primary hover:underline">privacy@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="every jurisdiction we operate in" />
    </div>
  )
}
