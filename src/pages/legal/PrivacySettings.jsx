import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch" // Ensure Switch component exists; otherwise use simple checkbox
import { setPageMeta } from '../../lib/seo';

import { LegalExtras } from '../../components/LegalExtras'

export default function PrivacySettings() {

  useEffect(() => {
    document.title = 'Privacy Settings | TimeGovern';
    setPageMeta();
  }, []);
  const { settings, updateSettings } = useUser()
  const [cookies, setCookies] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  const saveSettings = () => {
    updateSettings({
      cookies,
      analytics,
      marketing,
      privacyUpdated: new Date().toISOString()
    })
    alert('Privacy settings saved successfully')
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Privacy Settings</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Control how we handle your personal information and tracking preferences.</p>
          <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-semibold">Essential Cookies</h3>
                <p className="text-muted-foreground">Required for the website to function properly. Always enabled.</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Always On</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-semibold">Analytics Cookies</h3>
                <p className="text-muted-foreground">Help us understand how users interact with our website to improve services.</p>
              </div>
              <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-semibold">Marketing Cookies</h3>
                <p className="text-muted-foreground">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
              </div>
              <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="h-4 w-4" />
            </div>
            <Button onClick={saveSettings} className="w-full">Save Privacy Settings</Button>
          </div>
        </CardContent>
      </Card>
      <LegalExtras category="privacy" context="your region" />
    </div>
  )
}
