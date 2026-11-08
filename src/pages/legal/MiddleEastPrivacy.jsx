import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function MiddleEastPrivacy() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader><h1 className="text-2xl font-semibold">Middle East Privacy Laws</h1></CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold">UAE</h2>
              <p>Federal Decree-Law No. 45/2021 on Data Protection; Dubai Law No. 5/2020 (DIFC). Consent-based, DPO requirement, cross-border transfer rules.</p>
            </section>
            <section>
              <h2 className="font-semibold">Saudi Arabia</h2>
              <p>PDPL (Personal Data Protection Law) 2021. Consent-based, data localisation requirements, SDAIA as regulator.</p>
            </section>
            <section>
              <h2 className="font-semibold">Qatar</h2>
              <p>Law No. 13/2016 on Personal Data Protection. Consent-based, sensitive data protections.</p>
            </section>
            <section>
              <h2 className="font-semibold">Israel</h2>
              <p>Privacy Protection Law 1981 (amended). Consent-based, DPO requirements for large entities.</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="the Middle East" />
    </div>
  )
}
