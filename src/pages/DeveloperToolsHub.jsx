import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Key, QrCode, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import HubExtras from '../components/HubExtras';

const TOOLS = [
  { to: '/password-generator', name: 'Password Generator', desc: 'Create strong, random passwords with custom length and character rules.', icon: Key, color: 'purple' },
  { to: '/qr-code-generator', name: 'QR Code Generator', desc: 'Generate QR codes for URLs, text, WiFi, and contact cards.', icon: QrCode, color: 'fuchsia' },
]

const FAQ = [
  { q: 'What are developer tools?', a: 'Free utilities for developers and technical users - password generators, QR codes, and more.' },
  { q: 'Are these developer tools free?', a: 'Yes. All tools are free with no signup, no ads, no limits.' },
  { q: 'Are generated passwords secure?', a: 'Yes. The Password Generator uses crypto.getRandomValues() for cryptographically strong randomness.' },
  { q: 'Do you store any data?', a: 'No. Everything runs in your browser. Passwords, QR codes, and inputs are never sent anywhere.' },
  { q: 'Can I use these tools offline?', a: 'Yes. Once the page is loaded, tools work entirely offline.' },
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const COLLECTION_SCHEMA = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Developer Tools', description: 'Free developer tools - password generator, QR code, and more.', url: 'https://timegovern.com/developer-tools' }

export default function DeveloperToolsHub() {
  useEffect(() => {
    document.title = 'Developer Tools - Free & Private | TimeGovern'
    const meta = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
    meta.content = 'Free developer tools - password generator, QR code, and more. All in one place, no signup, 100% private.'
    if (!meta.parentNode) document.head.appendChild(meta)
    setPageMeta()
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_SCHEMA) }} />

      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-fuchsia-950 to-slate-950" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-purple-200">{TOOLS.length} tools - Free - Private</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight flex items-center gap-4">
              <Code2 className="h-10 w-10 md:h-14 md:w-14 text-purple-300" />
              Developer Tools
            </h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
              Free utilities for developers - passwords, QR codes, and more.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">The developer tools</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {TOOLS.map((t) => {
              const Icon = t.icon
              return (
                <Link key={t.to} to={t.to} className="block rounded-xl border border-border bg-card hover:border-purple-400 p-5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={'p-2.5 rounded-xl bg-' + t.color + '-500/10 border border-' + t.color + '-500/30 shrink-0'}>
                      <Icon className={'h-5 w-5 text-' + t.color + '-500'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black mb-1 text-sm">{t.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{t.desc}</p>
                      <div className="text-[11px] font-bold text-purple-500 inline-flex items-center gap-1">Open tool <ArrowRight className="h-3 w-3" /></div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (<Card key={i}><CardContent className="p-5"><h3 className="font-bold mb-2">{f.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p></CardContent></Card>))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Developer Tools'} />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Note:</strong> These tools are for informational purposes only.
        </div>
      <HubExtras category="reference-hub" />
      </div>
    </>
  )
}