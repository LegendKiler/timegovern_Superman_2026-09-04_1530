import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function Disclaimer() {

  useEffect(() => {
    document.title = 'Disclaimer | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Disclaimer</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. General Disclaimer</h2>
              <p>The information contained on timegovern.com is for general informational and educational purposes only. Except to the extent covered by law, we make no representations or warranties expressed or implied as to the accuracy, reliability, or completeness of the information contained therein [citation:6].</p>
              <p className="mt-2">To the extent permitted by law, we exclude all liability for loss or damage of any kind (including indirect or consequential loss or damage) arising from the information on this website or use of such information [citation:6].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. No Professional Advice</h2>
              <p>The information provided on this website is to assist you with undertaking your own enquiries and analysis. You should seek independent professional advice before acting in reliance on the information contained therein [citation:6].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Accuracy of Information</h2>
              <p>While we at all times endeavour to have the most accurate, reliable, and up-to-date information on our website, we do not warrant or make any representations regarding the accuracy or completeness of the information [citation:14]. Time data and astronomical calculations are based on established scientific work but may contain minor variations [citation:6].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Service Availability</h2>
              <p>We will take all reasonable steps to ensure the website is available for access. If access is interrupted, our liability shall be limited to restoring access to the website as soon as is reasonably practicable [citation:6].</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="legal-disclaimer" />
    </div>
  )
}
