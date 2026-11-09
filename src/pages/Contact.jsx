import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, User, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { setPageMeta } from "../lib/seo"
import HubExtras from '../components/HubExtras';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkovnva"

  useEffect(() => {
    document.title = 'Contact Us | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Get in touch with TimeGovern. Questions, feedback, or partnership enquiries - we read every message.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form)
      })
      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Submission failed')
      }
    } catch (err) {
      setError(err.message || 'Unable to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto p-4 max-w-lg">
        <Card className="bg-gradient-to-br from-green-500/10 via-card to-emerald-500/10 border-border shadow-2xl text-center p-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-4">
            Your enquiry has been received. We will get back to you shortly.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', service: '', message: '' }) }}>
            Send Another Message
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-border shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Mail className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold m-0">Contact Us</h1>
          </CardTitle>
          <CardDescription>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" /> Name
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Topic</label>
              <Select onValueChange={(val) => setForm({ ...form, service: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Question</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Type your message here..."
                required
                className="w-full border rounded-md p-3 text-sm bg-background text-foreground"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Sending...' : 'Send Message'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mt-6">
        <p>Or email us directly at: <a href="mailto:support@timegovern.com" className="text-primary hover:underline">support@timegovern.com</a></p>
        <p className="mt-1">Find us on the map or send post to: <span className="font-medium">TimeGovern, Melbourne VIC</span></p>
      </div>
    <HubExtras category="community" />
      </div>
  )
}
