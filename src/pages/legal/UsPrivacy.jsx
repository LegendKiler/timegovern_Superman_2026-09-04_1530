import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Globe2, FileCheck } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function UsPrivacy() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">US Privacy Policy (CCPA/CPRA)</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. California Privacy Rights Act (CPRA)</h2>
              <p>This section applies to California residents as defined under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA). We collect, use, and share personal information as described below [citation:13].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Categories of Personal Information Collected</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identifiers: name, email address, IP address, device identifiers</li>
                <li>Commercial information: products or services purchased</li>
                <li>Internet activity: browsing history, interactions with our website</li>
                <li>Geolocation data: approximate location based on IP</li>
                <li>Inferences: preferences and behavior patterns</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Right to know what personal information we collect</li>
                <li>Right to delete your personal information</li>
                <li>Right to opt-out of sale or sharing</li>
                <li>Right to correct inaccurate personal information</li>
                <li>Right to limit use of sensitive personal information</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>
              <p className="mt-2">We honor the Global Privacy Control (GPC) signal as a valid opt-out of sale or sharing [citation:3].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. "Do Not Sell or Share My Personal Information"</h2>
              <p>You may exercise your right to opt-out of the sale or sharing of personal information through our Privacy Settings page or by contacting us at <a href="mailto:privacy@timegovern.com" className="text-primary hover:underline">privacy@timegovern.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Data Retention</h2>
              <p>We retain personal information only as long as necessary for the purposes described in this policy, or as required by law.</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="the United States" />
    </div>
  )
}
