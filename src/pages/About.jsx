import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
﻿import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Globe2, Users, CalendarDays, Rocket, MapPin, Mail, Phone } from "lucide-react"
import HubExtras from '../components/HubExtras';

export default function About() {

  useEffect(() => {
    document.title = 'About | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Hero / Mission */}
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">About TimeGovern</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simplifying life by offering reliable information, quick answers, and great explanations for everything related to time, dates, and astronomy.
          </p>
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-6 text-center"><Rocket className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-4xl font-bold text-primary">2026</p><p className="text-muted-foreground">Launched</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><Globe2 className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-4xl font-bold text-primary">100+</p><p className="text-muted-foreground">Tools & Features</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><Users className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-4xl font-bold text-primary">250+</p><p className="text-muted-foreground">Countries Covered</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><CalendarDays className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-4xl font-bold text-primary">24/7</p><p className="text-muted-foreground">Live Updates</p></CardContent></Card>
      </div>

      {/* Company Address */}
      <Card className="border-border bg-card/80 backdrop-blur-sm shadow-xl mb-6">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" /> Our Registered Office
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Australian Head Office</h3>
              <p className="text-sm text-muted-foreground">
                TimeGovern Pty Ltd<br/>
                123 Flinders Street<br/>
                Melbourne, VIC 3000<br/>
                Australia
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">
                <Mail className="h-4 w-4 inline mr-1" /> <a href="mailto:info@timegovern.com" className="hover:underline">info@timegovern.com</a><br/>
                <Phone className="h-4 w-4 inline mr-1" /> +61 3 1234 5678<br/>
                <Mail className="h-4 w-4 inline mr-1" /> <a href="mailto:legal@timegovern.com" className="hover:underline">legal@timegovern.com</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal Notices</h3>
              <p className="text-sm text-muted-foreground">
                ABN: 12 345 678 901<br/>
                ACN: 123 456 789<br/>
                Registered in Victoria, Australia
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What We Offer */}
      <Card className="border-border bg-card/80 backdrop-blur-sm shadow-xl mb-6">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">World-Leading on Time & Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Core Time Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Live world clocks for 5000+ cities</li>
                <li>Time zone converter with DST handling</li>
                <li>Meeting planner across time zones</li>
                <li>Countdowns, timers, and date calculators</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Astronomy & Calendar</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Sunrise, sunset, and solar position data</li>
                <li>Moon phases, rise/set times, and altitude</li>
                <li>Global holidays and printable calendars</li>
                <li>Night sky viewer & meteor showers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer / Copyright */}
      <div className="text-center text-sm text-muted-foreground mt-6">
        <p>© {new Date().getFullYear()} TimeGovern Pty Ltd. All rights reserved.</p>
        <p className="mt-1">Registered in Victoria, Australia | ABN 12 345 678 901</p>
      </div>
    <HubExtras category="about" />
      </div>
  )
}
