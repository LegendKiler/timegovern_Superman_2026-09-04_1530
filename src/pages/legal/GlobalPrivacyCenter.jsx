import { useEffect } from 'react';
import { setPageMeta } from '../../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { ShieldCheck, FileText, Scale, Cpu, Globe2 } from "lucide-react"

const regions = [
  { to: "/privacy", label: "Global Privacy Policy", icon: ShieldCheck, desc: "Core policy for all users" },
  { to: "/global-ai", label: "Global AI Policy", icon: Cpu, desc: "Responsible AI usage" },
  { to: "/us-privacy-national", label: "United States", icon: FileText, desc: "FTC + State Laws" },
  { to: "/gdpr-privacy", label: "European Union", icon: ShieldCheck, desc: "EU Data Protection" },
  { to: "/uk-privacy", label: "United Kingdom", icon: ShieldCheck, desc: "UK Data Protection" },
  { to: "/australia-privacy", label: "Australia", icon: ShieldCheck, desc: "Privacy Act 1988" },
]

import { LegalExtras } from '../../components/LegalExtras'

export default function GlobalPrivacyCenter() {

  useEffect(() => {
    document.title = 'Global Privacy Center | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <h1 className="flex items-center gap-2 text-2xl">
            <Scale className="h-6 w-6" /> Global Privacy & AI Center
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            TimeGovern operates worldwide and complies with data protection and AI regulations across all regions. Select your region below to view relevant legal policies.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region) => (
          <Link to={region.to} key={region.to} className="block">
            <Card className="h-full bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-primary/10">
                    <region.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{region.label}</h3>
                    <p className="text-sm text-muted-foreground">{region.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <LegalExtras category="privacy" context="your region" />
    </div>
  )
}
