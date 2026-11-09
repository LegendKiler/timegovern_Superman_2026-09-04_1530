import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle2, Podcast, Calendar, Newspaper, Play, Pause, ChevronDown, ChevronUp, AudioLines, Loader2 } from "lucide-react"
import { newsletterEditions, podcastEpisodes } from '../data/contentData'
import { setPageMeta } from '../lib/seo';
import HubExtras from '../components/HubExtras';

// Your TTS API key (free tier: 1M chars/month)
// Get from https://cloud.google.com/text-to-speech
const TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_API_KEY || ''

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [podcast, setPodcast] = useState('weekly')
  const [subscribed, setSubscribed] = useState(false)
  const [podcastSubscribed, setPodcastSubscribed] = useState(false)
  const [currentEditions, setCurrentEditions] = useState([])
  const [currentEpisodes, setCurrentEpisodes] = useState([])
  const [expandedEdition, setExpandedEdition] = useState(null)
  const [playingEpisode, setPlayingEpisode] = useState(null)
  const [audioGenerating, setAudioGenerating] = useState(false)
  const [audioError, setAudioError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  useEffect(() => {
    setPageMeta();
    setCurrentEditions(newsletterEditions[frequency] || [])
    setCurrentEpisodes(podcastEpisodes[podcast] || [])
  }, [frequency, podcast])

  const handleSubscribe = () => {
    if (!email) return
    setSubscribed(true)
  }

  const handlePodcastSubscribe = () => {
    if (!email) return
    setPodcastSubscribed(true)
  }

  const toggleEdition = (index) => {
    setExpandedEdition(expandedEdition === index ? null : index)
  }

  // Function to convert text to audio using Google TTS API
  const generateAudio = async (text, title) => {
    if (!TTS_API_KEY) {
      setAudioError('TTS API key not set. Please add VITE_GOOGLE_TTS_API_KEY to .env')
      return
    }
    
    setAudioGenerating(true)
    setAudioError('')
    
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: text },
          voice: { languageCode: 'en-US', name: 'en-US-Standard-C' },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 }
        })
      })

      if (!response.ok) throw new Error('TTS API request failed')
      
      const data = await response.json()
      const base64Audio = data.audioContent
      
      // Convert base64 to audio blob
      const byteCharacters = atob(base64Audio)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      
      setAudioUrl(url)
      setAudioGenerating(false)
    } catch (error) {
      setAudioError(error.message)
      setAudioGenerating(false)
    }
  }

  const handlePlay = async (index) => {
    const episode = currentEpisodes[index]
    if (playingEpisode === index) {
      setPlayingEpisode(null)
      setAudioUrl('')
      return
    }
    // If audio not yet generated, convert the episode content
    if (!audioUrl) {
      await generateAudio(episode.description, episode.title)
    }
    setPlayingEpisode(index)
    // Auto-play the audio
    const audioElement = document.getElementById('podcast-audio')
    if (audioElement && audioUrl) {
      audioElement.src = audioUrl
      audioElement.play()
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Newsletter & Podcast Subscriptions</h1>

      {/* Newsletter Subscription */}
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Email Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Get the latest time, date, and astronomy updates delivered to your inbox.</p>

          {subscribed ? (
            <div className="bg-green-50 text-green-700 p-4 rounded flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>You've subscribed to the {frequency} newsletter. Check your email for confirmation.</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email Address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subscription Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['weekly', 'monthly', 'yearly'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`p-3 rounded border text-center text-sm font-medium transition-colors ${frequency === freq ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted/50'}`}
                    >
                      <Calendar className="h-4 w-4 mx-auto mb-1" />
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubscribe} className="w-full">Subscribe to Newsletter</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Newsletter Editions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" /> Recent {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Editions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentEditions.length > 0 ? (
            <div className="space-y-4">
              {currentEditions.map((edition, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{edition.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{edition.summary}</p>
                      <p className="text-xs text-muted-foreground mt-2">Published: {edition.date}</p>
                    </div>
                    <button onClick={() => toggleEdition(index)} className="text-primary hover:underline flex items-center gap-1">
                      {expandedEdition === index ? 'Close' : 'Read Edition'}
                      {expandedEdition === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  {expandedEdition === index && (
                    <div className="mt-4 pt-4 border-t border-border text-sm">
                      <p>{edition.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No editions available for this frequency yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Podcast Subscription */}
      <Card className="bg-gradient-to-br from-accent/10 via-card to-primary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Podcast className="h-5 w-5" /> Podcast Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Subscribe to our audio podcasts covering time, space, and astronomy topics.</p>

          {podcastSubscribed ? (
            <div className="bg-green-50 text-green-700 p-4 rounded flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>You've subscribed to the {podcast} podcast updates.</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Podcast Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['weekly', 'monthly', 'yearly'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setPodcast(freq)}
                      className={`p-3 rounded border text-center text-sm font-medium transition-colors ${podcast === freq ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted/50'}`}
                    >
                      <Newspaper className="h-4 w-4 mx-auto mb-1" />
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handlePodcastSubscribe} className="w-full">Subscribe to Podcast</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Podcast Episodes */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Podcast className="h-5 w-5" /> Recent {podcast.charAt(0).toUpperCase() + podcast.slice(1)} Episodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentEpisodes.length > 0 ? (
            <div className="space-y-4">
              {currentEpisodes.map((episode, index) => (
                <div key={index} className="flex items-start gap-3 border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="p-2 rounded bg-primary/10">
                    <Podcast className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Episode {episode.episode}: {episode.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{episode.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Published: {episode.date}</p>
                  </div>
                  <button onClick={() => handlePlay(index)} className="text-primary hover:underline flex items-center gap-1">
                    {audioGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : playingEpisode === index ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {audioGenerating ? 'Generating...' : playingEpisode === index ? 'Pause' : 'Play Now'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No episodes available for this frequency yet.</p>
          )}

          {audioError && <p className="text-red-500 text-sm mt-4">{audioError}</p>}

          {audioUrl && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AudioLines className="h-4 w-4" /> Now Playing
              </h4>
              <audio id="podcast-audio" controls className="w-full" src={audioUrl} />
            </div>
          )}
        </CardContent>
      </Card>
    <HubExtras category="marketing" />
      </div>
  )
}
