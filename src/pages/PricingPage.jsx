import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Star, Zap, Crown } from "lucide-react"
import { Link } from "react-router-dom"
import HubExtras from '../components/HubExtras';

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Star,
    description: "Perfect for casual users exploring time tools worldwide.",
    features: [
      { text: "Live world clocks (6 cities)", included: true },
      { text: "Timezone converter", included: true },
      { text: "Basic calendar with holidays", included: true },
      { text: "Astronomy: sunrise/sunset", included: true },
      { text: "Live flight tracker (basic)", included: true },
      { text: "News & weather (geo-targeted)", included: true },
      { text: "3 saved flight searches", included: true },
      { text: "2 saved widgets", included: true },
      { text: "Basic widget analytics", included: true },
      { text: "Community ads displayed", included: true },
      { text: "Unlimited world clocks", included: false },
      { text: "Calendar sync (Google/Apple/Outlook)", included: false },
      { text: "Email import for flights", included: false },
      { text: "Delay predictions", included: false },
      { text: "Ad-free experience", included: false },
    ],
    cta: "Get Started Free",
    ctaVariant: "outline",
    link: "/auth",
  },
  {
    name: "Pro",
    price: "AU$4.99",
    period: "per month",
    yearlyPrice: "AU$49/year (save 17%)",
    icon: Zap,
    description: "For frequent travelers and remote teams who need more power.",
    popular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlimited saved flights", included: true },
      { text: "Calendar sync (Google/Apple/Outlook)", included: true },
      { text: "Email import for flight bookings", included: true },
      { text: "Push notifications for delays", included: true },
      { text: "TripIt integration", included: true },
      { text: "90-day flight history", included: true },
      { text: "Unlimited saved widgets", included: true },
      { text: "Custom widget colors", included: true },
      { text: "Full widget analytics", included: true },
      { text: "Advanced astronomy data", included: true },
      { text: "Ad-free experience", included: true },
      { text: "Priority email support", included: true },
      { text: "Delay predictions (AI)", included: false },
      { text: "Family sharing (5 members)", included: false },
      { text: "API access", included: false },
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "default",
    link: "/auth",
  },
  {
    name: "Premium",
    price: "AU$9.99",
    period: "per month",
    yearlyPrice: "AU$99/year (save 17%)",
    icon: Crown,
    description: "For power users, families, and businesses who need everything.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "AI delay predictions (25hr ahead)", included: true },
      { text: "Where's My Plane tracker", included: true },
      { text: "Connection Assistant (layovers)", included: true },
      { text: "365-day flight history", included: true },
      { text: "White-label widgets (no branding)", included: true },
      { text: "Custom domain embeds", included: true },
      { text: "Widget analytics + CSV export", included: true },
      { text: "Family sharing (up to 5)", included: true },
      { text: "Airport analytics & terminal maps", included: true },
      { text: "Multi-month calendar PDF", included: true },
      { text: "Custom calendar logo", included: true },
      { text: "Full API access", included: true },
      { text: "Priority 24/7 support", included: true },
      { text: "Early access to new features", included: true },
    ],
    cta: "Go Premium",
    ctaVariant: "default",
    link: "/auth",
  },
]

export default function PricingPage() {

  useEffect(() => {
    document.title = 'Pricing | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Plan
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock the full power of TimeGovern. From casual time checks to global flight tracking, we have a plan for you.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular
                ? 'border-primary border-2 shadow-2xl scale-105 z-10'
                : 'border-border shadow-lg'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                MOST POPULAR
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 w-fit">
                <plan.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-3">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">/ {plan.period}</span>
              </div>
              {plan.yearlyPrice && (
                <p className="text-xs text-green-600 font-medium mt-1">{plan.yearlyPrice}</p>
              )}
              <p className="text-sm text-muted-foreground mt-3">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to={plan.link} className="w-full">
                <Button variant={plan.ctaVariant} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ / Trust */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-border">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Why Upgrade?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1">ðŸŒ Global Coverage</p>
              <p className="text-muted-foreground">Track flights and time zones across 250+ countries</p>
            </div>
            <div>
              <p className="font-semibold mb-1">ðŸ”’ Secure & Private</p>
              <p className="text-muted-foreground">All payments processed via Stripe. GDPR compliant.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">ðŸ’¬ Cancel Anytime</p>
              <p className="text-muted-foreground">No long-term commitment. Money-back guarantee.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    <HubExtras category="marketing" />
      </div>
  )
}