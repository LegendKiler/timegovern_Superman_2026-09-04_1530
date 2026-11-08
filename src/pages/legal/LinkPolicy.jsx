import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function LinkPolicy() {

  useEffect(() => {
    document.title = 'Link Policy | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Link Policy</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. External Links</h2>
              <p>TimeGovern may include links to third-party websites for user convenience [citation:6]. Use of these links does not mean that TimeGovern endorses the website, nor that we are in partnership with the third party. We are not responsible for the content contained on those websites. You acknowledge that you enter any third-party website at your own risk [citation:6].</p>
              <p className="mt-2">We strongly advise users to read the terms of service and privacy policies of any third-party websites they visit [citation:10].</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. Linking to TimeGovern</h2>
              <p>You are welcome to link to our website provided that:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>You do not imply endorsement or partnership without written consent</li>
                <li>The link does not misrepresent your relationship with us</li>
                <li>You do not frame or embed our content without permission</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. Intellectual Property</h2>
              <p>All content on TimeGovern, including but not limited to text, graphics, logos, images, and software, is the exclusive property of TimeGovern and is protected by Australian copyright, trademark, and other laws [citation:10][citation:13]. You may not distribute or commercially exploit the content without express written permission [citation:14].</p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="legal-links" />
    </div>
  )
}
