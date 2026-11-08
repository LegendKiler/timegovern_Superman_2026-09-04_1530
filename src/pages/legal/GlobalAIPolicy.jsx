import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Shield, Cpu, FileText, Globe2 } from "lucide-react"

import { LegalExtras } from '../../components/LegalExtras'

export default function GlobalAIPolicy() {

  useEffect(() => {
    document.title = 'Global AIPolicy | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <h1 className="flex items-center gap-2 text-2xl">
            <Cpu className="h-6 w-6" /> Global AI Policy
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Effective Date: 1 January 2026</p>
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Our AI Commitments</h2>
              <p>TimeGovern is committed to the responsible development and use of artificial intelligence. We strive to ensure our AI systems are transparent, fair, and safe for all users worldwide.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">2. How We Use AI</h2>
              <p>We use AI in the following ways on timegovern.com:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>News Summarization:</strong> AI helps generate concise summaries of news headlines.</li>
                <li><strong>Personalization:</strong> AI suggests relevant time zones and astronomical events based on usage.</li>
                <li><strong>Content Generation:</strong> AI assists in generating descriptions for some features.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">3. AI Transparency</h2>
              <p>We disclose when users are interacting with AI-generated content. We ensure that AI is not used to make decisions that would have a legal or similarly significant effect on users without appropriate human oversight.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">4. Data Privacy & AI</h2>
              <p>Our AI systems process data in accordance with our <Link to="/privacy" className="text-primary hover:underline">Global Privacy Policy</Link>. We do not train AI models on user personal data without explicit consent.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">5. Regional Addendums</h2>
              <p>Users in specific regions may have additional rights under local AI regulations. Please see our regional addendums for:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><Link to="/ai-eu" className="text-primary hover:underline">EU AI Act Addendum</Link></li>
                <li><Link to="/ai-uk" className="text-primary hover:underline">UK AI Addendum</Link></li>
                <li><Link to="/ai-us" className="text-primary hover:underline">US AI Addendum</Link></li>
                <li><Link to="/ai-china" className="text-primary hover:underline">China AI Addendum</Link></li>
                <li><Link to="/ai-australia" className="text-primary hover:underline">Australia AI Addendum</Link></li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
              <p>For AI policy inquiries, contact: <a href="mailto:ai@timegovern.com" className="text-primary hover:underline">ai@timegovern.com</a></p>
            </section>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="ai" context="international AI governance" />
    </div>
  )
}
