import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import DataStorageConverter from '../components/calculators/DataStorageConverter'
import ShareButtons from '../components/ShareButtons'
import { setPageMeta } from '../lib/seo'
import CalculatorExtras from '../components/CalculatorExtras.jsx';

const FAQ = [
  { q: "How many bytes are in a kilobyte?", a: "1024 bytes = 1 kilobyte (using binary). However, storage manufacturers often use 1000 bytes = 1 KB (decimal). This is why a 1 TB drive shows about 931 GB in your OS." },
  { q: "What is the difference between a bit and a byte?", a: "A bit is a single binary digit (0 or 1). A byte is 8 bits. Network speeds are usually measured in bits per second; storage in bytes." },
  { q: "Why is a kilobyte sometimes 1000 and sometimes 1024 bytes?", a: "Decimal SI uses 1000 (KB). Binary IEC uses 1024 (KiB, though often labeled KB). Hard drive makers use decimal; operating systems usually display binary." },
  { q: "What is a petabyte?", a: "A petabyte is 1024 terabytes, or about 1 quadrillion bytes (10^15). Large data centers and cloud providers measure storage in petabytes." },
  { q: "How much is a gigabyte in megabytes?", a: "1024 MB = 1 GB using binary. 1000 MB = 1 GB using decimal. Most consumer software shows binary values (1024-based)." }
]

const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const APP_SCHEMA = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Data Storage Converter', description: 'Convert between bytes, KB, MB, GB, TB and bits.', applicationCategory: 'DeveloperApplication', operatingSystem: 'Web', url: 'https://timegovern.com/data-storage-converter', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }

export default function DataStorageConverterPage() {
  useEffect(() => {
    document.title = 'Data Storage Converter - Free | TimeGovern'
    let d = document.querySelector('meta[name="description"]')
    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d) }
    d.setAttribute('content', 'Convert between bytes, KB, MB, GB, TB and bits.')
    setPageMeta()
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <div className="container mx-auto p-4 max-w-4xl space-y-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br  from-slate-900 via-gray-900 to-black" />
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Free - All countries - No signup</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Data Storage Converter</h1>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">Convert between bytes, KB, MB, GB, TB and bits.</p>
          </div>
        </div>

        <DataStorageConverter />

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Card key={i}><CardContent className="p-5"><h3 className="font-bold mb-2 text-sm">{f.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p></CardContent></Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Related tools</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Link to="/unit-converter" className="block rounded-xl border border-border bg-card hover:border-slate-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">Unit Converter</h3><p className="text-xs text-muted-foreground">All units</p></Link>
            <Link to="/math-tools" className="block rounded-xl border border-border bg-card hover:border-indigo-400 p-5 transition-colors"><h3 className="font-bold mb-1 text-sm">All Math Tools</h3><p className="text-xs text-muted-foreground">Full directory</p></Link>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={typeof document !== 'undefined' ? document.title : 'Data Storage Converter'} />
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-center">
          <Link to="/math-tools" className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            See all math tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      
      <CalculatorExtras category="unit-conversion" />
</div>
    </>
  )
}