import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getToolBySlug } from '../data/ictTools'
import { FaqItem, RelatedMortgageTools } from '../components/mortgage/MortgageLayout'
import SaveCalculation from '../components/SaveCalculation'
import { setPageMeta } from '../lib/seo';

export default function IctToolPage() {
  const { slug } = useParams()
  const tool = getToolBySlug(slug)

  const [fields, setFields] = useState({})
  const [mode, setMode] = useState(tool?.modes?.[0]?.id || null)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Reset state when tool changes
  useEffect(() => {
    setPageMeta();
    if (!tool) return
    // Initialize field defaults
    const init = {}
    tool.fields.forEach(f => { init[f.id] = f.defaultValue || '' })
    setFields(init)
    setMode(tool.modes?.[0]?.id || null)
    setOutput('')
    setError('')
  }, [slug, tool])

  // Update page title
  useEffect(() => {
    if (tool) {
      document.title = tool.name + ' 2026 — Free Online Tool | TimeGovern'
      const desc = document.querySelector('meta[name="description"]') || Object.assign(document.createElement('meta'), { name: 'description' })
      desc.content = tool.description + ' Free, no signup, runs in your browser.'
      if (!desc.parentNode) document.head.appendChild(desc)
    }
  }, [tool])

  if (!tool) return <Navigate to="/ict" replace />

  const updateField = (id, value) => setFields({ ...fields, [id]: value })

  const runTool = async () => {
    setError('')
    setLoading(true)
    try {
      let result
      if (tool.modes && tool.modes.length > 0) {
        const m = tool.modes.find(x => x.id === mode) || tool.modes[0]
        result = m.fn(fields)
      } else if (tool.transform) {
        result = tool.transform(fields)
      }
      if (result instanceof Promise) result = await result
      setOutput(String(result))
    } catch (e) {
      setError('Error: ' + e.message)
    }
    setLoading(false)
  }

  const copyOutput = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const hasFields = tool.fields.length > 0
  const hasModes = tool.modes && tool.modes.length > 0

  return (
    <div className="container mx-auto p-4 max-w-5xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="opacity-40">/</span>
        <Link to="/ict" className="hover:text-primary">ICT Tools</Link>
        <span className="opacity-40">/</span>
        <span className="font-semibold text-foreground">{tool.name}</span>
      </nav>

      <Link to="/ict" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:border-primary hover:text-primary transition-all text-sm font-semibold mb-6">
        <ArrowLeft className="h-4 w-4" /> All ICT Tools
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950"></div>
        <div className="relative z-10 p-6 md:p-10 text-white">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">{tool.name}</h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl">{tool.description}</p>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <SaveCalculation type="ict" title={tool.name} />
      </div>

      {/* Main tool */}
      <Card className="border-2 shadow-xl bg-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md">
              <Lock className="h-4 w-4 text-white" />
            </div>
            {tool.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Mode tabs */}
          {hasModes && (
            <div className="flex flex-wrap gap-2">
              {tool.modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={'px-4 py-2 rounded-lg text-xs font-bold border transition ' + (mode === m.id ? 'bg-primary text-white border-primary' : 'bg-muted border-transparent')}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}

          {/* Fields */}
          {tool.fields.map(f => (
            <div key={f.id}>
              <label className="text-sm font-semibold mb-1.5 block">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={fields[f.id] || ''}
                  onChange={(e) => updateField(f.id, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              ) : f.type === 'select' ? (
                <select
                  value={fields[f.id] || f.defaultValue || ''}
                  onChange={(e) => updateField(f.id, e.target.value)}
                  className="w-full h-11 px-3 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <Input
                  type={f.type}
                  value={fields[f.id] || ''}
                  onChange={(e) => updateField(f.id, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className="h-11"
                />
              )}
            </div>
          ))}

          {/* Run button */}
          {hasFields && (
            <Button
              onClick={runTool}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white font-bold"
            >
              {loading ? 'Processing...' : 'Run Tool'}
            </Button>
          )}

          {/* Auto-run for tools with no fields (reference tools) */}
          {!hasFields && (
            <Button
              onClick={runTool}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white font-bold"
            >
              Show Reference
            </Button>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">{error}</div>
          )}

          {/* Output */}
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Output</label>
                <button
                  onClick={copyOutput}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-card hover:border-primary transition"
                >
                  {copied ? <><Check className="h-3 w-3 text-emerald-600" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
              </div>
              <pre className="w-full p-4 rounded-lg border border-border bg-muted/30 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all">
                {output}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Long-form content — improves content depth for AdSense compliance */}
      {(tool.intro || tool.howToUse || tool.useCases) && (
        <section className="mb-10 space-y-6">
          {tool.intro && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{tool.intro}</p>
          )}
          {tool.howToUse && tool.howToUse.length > 0 && (
            <div>
              <h2 className="text-xl font-black tracking-tight mb-3">How to use it</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside ml-2">
                {tool.howToUse.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
          {tool.useCases && tool.useCases.length > 0 && (
            <div>
              <h2 className="text-xl font-black tracking-tight mb-3">Common use cases</h2>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                {tool.useCases.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* FAQs */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-black tracking-tight mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {tool.faqs.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </section>
      )}

      {/* Privacy note */}
      <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-400 mb-10">
        <strong>Privacy:</strong> This tool runs entirely in your browser. No data is uploaded, saved, or transmitted.
      </div>

      {/* Related */}
      <section className="mb-10">
        <h2 className="text-2xl font-black tracking-tight mb-5">Related tools</h2>
        <RelatedMortgageTools items={[
          { name: 'All ICT Tools', href: '/ict' },
          { name: 'Salary Calculator', href: '/salary' },
          { name: 'Mortgage Calculator', href: '/mortgage' },
          { name: 'All Calculators', href: '/calculators' },
        ]} />
      </section>
    </div>
  )
}