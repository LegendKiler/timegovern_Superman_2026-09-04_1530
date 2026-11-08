import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LegalExtras } from '../../components/LegalExtras'

export default function UsPrivacyState() {
  const states = [
    { name: "California (CCPA/CPRA)", rights: ["Know", "Delete", "Correct", "Opt-out of sale", "Limit sensitive data", "Non-discrimination"], privateAction: true },
    { name: "Colorado (CPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-out of targeted ads", "Opt-out of profiling"], privateAction: false },
    { name: "Virginia (VCDPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-out of targeted ads", "Consent for sensitive data"], privateAction: false },
    { name: "Connecticut (CTDPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-out of targeted ads", "Opt-out of profiling"], privateAction: false },
    { name: "Utah (UCPA)", rights: ["Know", "Access", "Delete", "Opt-out of sale/targeted ads"], privateAction: false },
    { name: "Texas (TDPSA)", rights: ["Know", "Access", "Delete", "Correct", "Consent for sensitive data"], privateAction: false },
    { name: "Montana (MCDPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-in for ads targeting minors"], privateAction: false },
    { name: "Oregon (OCPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-in for minors targeted ads"], privateAction: false },
    { name: "New Jersey (NJDPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-out of profiling"], privateAction: false },
    { name: "Nebraska (NDPA)", rights: ["Know", "Access", "Delete", "Correct", "DPIA for minors"], privateAction: false },
    { name: "Rhode Island (RIDTPPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-out of targeted ads"], privateAction: false },
    { name: "Tennessee (TIPA)", rights: ["Know", "Access", "Delete", "Correct", "Disclose consumer rights"], privateAction: false },
    { name: "Minnesota (MCDPA)", rights: ["Know", "Access", "Delete", "Correct", "Social media warnings for teens"], privateAction: false },
    { name: "Kentucky (KCDPA)", rights: ["Know", "Access", "Delete", "Correct", "Opt-out of targeted ads"], privateAction: false },
    { name: "Maryland (MODPA)", rights: ["Know", "Access", "Delete", "Correct", "Cannot sell sensitive data", "Prohibits targeted ads to minors"], privateAction: false },
  ]

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <h1 className="text-2xl font-semibold">US State-by-State Privacy Laws</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">The United States does not have a single federal privacy law. Instead, 19+ states have enacted comprehensive privacy laws. This page outlines the key protections in each state as of 2026 .</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {states.map((state) => (
          <Card key={state.name} className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">{state.name}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {state.rights.map((right) => <li key={right}>{right}</li>)}
              </ul>
              {state.privateAction && <p className="mt-2 text-xs text-primary">✅ Private Right of Action</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">New laws effective July 1, 2026 or later: Arkansas (APIPA – minors protections), Vermont (VDPA), Alabama (APDPA – effective May 2027), Oklahoma (OKCDPA – effective Jan 2027) .</p>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="your US state" />
    </div>
  )
}
