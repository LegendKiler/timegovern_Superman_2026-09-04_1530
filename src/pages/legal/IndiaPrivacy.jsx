import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Bell, Database } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function IndiaPrivacy() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">India DPDP Privacy Notice</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Overview</h2>
              <p>This Privacy Notice is provided in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the DPDP Rules, 2025 [citation:4]. This Notice applies to all personal data we collect, process, and store.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identity Data: name, email address, mobile number</li>
                <li>Technical Data: IP address, device ID, browser type, cookies</li>
                <li>Usage Data: session identifiers, clickstream data, app logs</li>
                <li>Contact Data: postal address (if provided)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Purposes of Processing</h2>
              <p>We process personal data to operate and secure our website, provide an efficient browsing experience, respond to user queries, and send marketing messages only with explicit consent [citation:4].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Your Rights as Data Principal</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Right to access information about your personal data</li>
                <li>Right to correction and erasure</li>
                <li>Right to grievance redressal</li>
                <li>Right to nominate another person to exercise rights on your behalf</li>
                <li>Right to withdraw consent at any time</li>
              </ul>
              <p className="mt-2">To exercise these rights, contact our Grievance Officer at <a href="mailto:grievance@timegovern.com" className="text-primary hover:underline">grievance@timegovern.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Grievance Officer</h2>
              <p>Name: Privacy Team<br/>Email: <a href="mailto:grievance@timegovern.com" className="text-primary hover:underline">grievance@timegovern.com</a><br/>Phone: +61 3 1234 5678<br/>Response time: within 15 working days [citation:14].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">6. Cookies and Consent</h2>
              <p>We use cookies and tracking technologies with your consent. Consent must be free, specific, informed, and unambiguous. You can withdraw consent at any time through our Privacy Settings page [citation:4].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">7. Data Retention</h2>
              <p>We retain personal data only as long as necessary for the purposes for which it was collected, in accordance with the DPDP Act [citation:4].</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="India" />
    </div>
  )
}
