import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Bell, UserCheck } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function SingaporePrivacy() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Singapore PDPA Privacy Policy</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Overview</h2>
              <p>This Privacy Policy is provided in accordance with the Personal Data Protection Act 2012 (PDPA) of Singapore [citation:10]. We are committed to safeguarding the personal data of our users.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Data Protection Officer</h2>
              <p>We have designated a Data Protection Officer (DPO) to handle data protection matters. Contact: <a href="mailto:dpo@timegovern.com" className="text-primary hover:underline">dpo@timegovern.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Our Obligations [citation:15]</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Consent Obligation:</strong> We obtain consent before collecting, using, or disclosing personal data</li>
                <li><strong>Notification Obligation:</strong> We notify individuals of the purposes for which we collect data</li>
                <li><strong>Purpose Limitation:</strong> We only collect data for purposes a reasonable person would consider appropriate</li>
                <li><strong>Protection Obligation:</strong> We implement reasonable security arrangements</li>
                <li><strong>Retention Limitation:</strong> We cease to retain personal data when it is no longer needed</li>
                <li><strong>Data Breach Notification:</strong> We notify PDPC and affected individuals of significant breaches</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Withdrawal of Consent</h2>
              <p>You may withdraw your consent at any time by providing reasonable notice. We will inform you of the likely consequences of withdrawal and will cease processing your personal data [citation:10].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Access and Correction</h2>
              <p>You have the right to access and correct your personal data held by us. We will respond to access requests within 30 days as required by the PDPA [citation:10].</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="Singapore" />
    </div>
  )
}
