import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function AsiaPacificPrivacy() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader><h1 className="text-2xl font-semibold">Asia Pacific Privacy Laws</h1></CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold">China (PIPL)</h2>
              <p>Personal Information Protection Law 2021. Consent-based, data minimisation, data subject rights, CIP as regulator.</p>
            </section>
            <section>
              <h2 className="font-semibold">Japan (APPI)</h2>
              <p>Act on Protection of Personal Information. Consent-based, PPC as regulator, cross-border transfer rules.</p>
            </section>
            <section>
              <h2 className="font-semibold">South Korea (PIPA)</h2>
              <p>Personal Information Protection Act. Strict consent requirements, PIPC as regulator.</p>
            </section>
            <section>
              <h2 className="font-semibold">Singapore (PDPA)</h2>
              <p>Personal Data Protection Act 2012. PDPC as regulator, DPO required, consent-based.</p>
            </section>
            <section>
              <h2 className="font-semibold">Australia (Privacy Act)</h2>
              <p>Australian Privacy Principles, OAIC as regulator, Privacy Act Reform 2024 in progress.</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="the Asia-Pacific region" />
    </div>
  )
}
