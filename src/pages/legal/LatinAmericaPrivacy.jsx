import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function LatinAmericaPrivacy() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader><h1 className="text-2xl font-semibold">Latin America Privacy Laws</h1></CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold">Brazil (LGPD)</h2>
              <p>Lei Geral de Proteção de Dados (LGPD) 2020, modelled on GDPR. DPO required, ANPD as regulator, penalties up to 2% of turnover.</p>
            </section>
            <section>
              <h2 className="font-semibold">Mexico</h2>
              <p>LFPDPPP 2010. Consent required, INAI as regulator.</p>
            </section>
            <section>
              <h2 className="font-semibold">Argentina</h2>
              <p>Personal Data Protection Law 25.326. Adequacy status from EU.</p>
            </section>
            <section>
              <h2 className="font-semibold">Chile</h2>
              <p>Law No. 19.628 on Personal Data Protection. Reform bill pending.</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="Latin America" />
    </div>
  )
}
