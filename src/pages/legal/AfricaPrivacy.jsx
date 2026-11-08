import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function AfricaPrivacy() {
  const countries = [
    { name: "South Africa", law: "POPIA (Protection of Personal Information Act)", regulator: "Information Regulator", key: ["Mandatory DPO", "High penalties (10 million ZAR)", "AI content rules"] },
    { name: "Nigeria", law: "NDPA 2023", regulator: "Nigeria Data Protection Commission", key: ["Annual compliance audits", "Data localisation", "Cross-border transfer rules"] },
    { name: "Kenya", law: "DPA 2019", regulator: "ODPC", key: ["Data processor registration", "Algorithmic decision rules", "Enforcement actions"] },
    { name: "Egypt", law: "PDP Law 151/2020", regulator: "Data Protection Centre", key: ["Marketing consent rules", "Licensing requirements", "Data transfer rules"] },
    { name: "Ghana", law: "Data Protection Act 2012", regulator: "Data Protection Commission", key: ["Registration required", "Compliance audits"] },
    { name: "Rwanda", law: "Law No. 058/2021", regulator: "National Cyber Security Authority", key: ["Data protection compliance", "AI governance"] },
  ]

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Africa Privacy Laws</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">45+ African countries have enacted data protection laws by end-2025, with 39 countries having fully operational regulators .</p>
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

      <Card className="mt-6">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">New laws enacted in 2025 include Djibouti, Gambia, and Algeria. Regulators became operational in Malawi, Togo, and Republic of the Congo .</p>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="Africa" />
    </div>
  )
}
