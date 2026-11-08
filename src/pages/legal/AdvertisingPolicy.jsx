import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function AdvertisingPolicy() {

  useEffect(() => {
    document.title = 'Advertising Policy | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Advertising Policy</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Advertising on TimeGovern</h2>
              <p>TimeGovern may include advertisements for third-party goods and/or services. Inclusion of these advertisements does not mean that we endorse the website, nor that we are in partnership with the third party [citation:6]. We are not responsible for the accuracy of the representations made in the advertisements. You acknowledge that if you choose to order products or services through a third-party website, you do so at your own risk [citation:6].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Consumer Guarantees Compliance</h2>
              <p>In accordance with the Australian Consumer Law and ACCC guidance, TimeGovern will not:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Misrepresent consumer rights to refunds or returns [citation:4]</li>
                <li>Impose blanket "no refund" conditions on products or services [citation:9]</li>
                <li>Place restrictions on consumers' right to a remedy under consumer guarantees [citation:4]</li>
              </ul>
              <p className="mt-2">Advertisers must comply with all applicable Australian Consumer Law requirements [citation:4][citation:13].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Advertising Content</h2>
              <p>All advertising must be clearly distinguishable from editorial content. Advertisers are responsible for ensuring their content is accurate, not misleading, and complies with the Australian Consumer Law [citation:4].</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="legal-advertising" />
    </div>
  )
}
