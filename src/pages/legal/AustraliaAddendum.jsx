import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { setPageMeta } from "../../lib/seo"

import { LegalExtras } from '../../components/LegalExtras'

export default function AustraliaAddendum() {
  useEffect(() => {
    document.title = 'Australia Privacy Addendum | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Australia Privacy Addendum - Privacy Act 1988 (Cth) compliance, APPs, OAIC contact details.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            <h1 className="text-2xl font-semibold m-0">Australia Privacy Addendum (Privacy Act 1988)</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-semibold mb-2">1. Australian Privacy Principles (APPs)</h2>
              <p>TimeGovern complies with the 13 Australian Privacy Principles (APPs) set out in the Privacy Act 1988 (Cth). The Office of the Australian Information Commissioner (OAIC) is the supervisory authority.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access your personal information.</li>
                <li>Correct inaccurate information.</li>
                <li>Complain to the OAIC if you believe we have breached the APPs.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. Contact</h2>
              <p>Australian Privacy Officer: <a href="mailto:privacy@timegovern.com" className="text-primary hover:underline">privacy@timegovern.com</a></p>
              <p className="mt-1">OAIC: <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">oaic.gov.au</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="Australia" />
    </div>
  )
}
