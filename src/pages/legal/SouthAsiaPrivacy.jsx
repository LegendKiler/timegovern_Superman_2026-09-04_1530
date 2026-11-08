import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function SouthAsiaPrivacy() {
  const countries = [
    { name: "India", law: "DPDP Act 2023", regulator: "Data Protection Board of India", key: ["Consent-based", "Data Fiduciary obligations", "Significant Data Fiduciary", "Penalties up to ₹250 crore"] },
    { name: "Pakistan", law: "Data Protection Bill (Pending)", regulator: "Ministry of IT & Telecom", key: ["PECA 2016 (Cybercrime)", "Sensitive data protections", "Consent requirement"] },
    { name: "Bangladesh", law: "Personal Data Protection Act 2022", regulator: "Data Protection Authority", key: ["Consent-based", "Sensitive data rules", "Cross-border transfer restrictions"] },
    { name: "Sri Lanka", law: "PDPA 2022", regulator: "Data Protection Authority of Sri Lanka", key: ["Consent-based", "Data subject rights", "Cross-border transfers"] },
    { name: "Nepal", law: "Personal Data Protection Bill", regulator: "Ministry of Communications", key: ["Consent-based", "Data localisation", "Penalties for violations"] },
    { name: "Bhutan", law: "Data Protection Act (Proposed)", regulator: "Ministry of Information", key: ["Consent-based", "Data classification"] },
  ]

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <h1 className="text-2xl font-semibold">South Asia Privacy Laws</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">South Asian countries are rapidly developing data protection frameworks. This page outlines the current status of data protection legislation across the region as of 2026 .</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {countries.map((country) => (
          <Card key={country.name} className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg">{country.name}</h3>
              <p className="text-sm text-primary font-medium mb-2">{country.law}</p>
              <p className="text-xs text-muted-foreground mb-2">Regulator: {country.regulator}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {country.key.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <LegalExtras category="privacy" context="South Asia" />
    </div>
  )
}
