import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timer, Play, Pause, RotateCcw, Flag, Bell, Zap, Coffee, Clock, AlarmClock as AlarmClockIcon, Plus, Trash2, Volume2, BellRing, BellOff } from "lucide-react"
import { playBeep, playAlarmSound, startRepeatingAlarm, notify, requestNotificationPermission, SOUND_OPTIONS } from '../utils/sounds'
import { setPageMeta } from '../lib/seo';
import HubExtras from '../components/HubExtras';

function pad(n) { return String(n).padStart(2, '0') }
function fmtMs(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}.${pad(cs)}`
}
function fmtSec(totalSec) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// Reusable sound selector
function SoundPicker({ value, onChange, compact = false }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'justify-center'}`}>
      <Volume2 className="h-4 w-4 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          playAlarmSound(e.target.value, 0.3)
        }}
        className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm h-9"
      >
        {SOUND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export default function TimersPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-2">Timers & Alarms</h1>
        <p className="text-muted-foreground">Countdown, stopwatch, pomodoro, egg timer, and alarm clock — all with sound</p>
      </div>

      <Tabs defaultValue="countdown" className="w-full">
        <TabsList className="grid w-full grid-cols-5 rounded-xl">
          <TabsTrigger value="countdown">Countdown</TabsTrigger>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="egg">Egg Timer</TabsTrigger>
          <TabsTrigger value="alarm">Alarm</TabsTrigger>
        </TabsList>

        <TabsContent value="countdown" className="mt-6"><Countdown /></TabsContent>
        <TabsContent value="stopwatch" className="mt-6"><Stopwatch /></TabsContent>
        <TabsContent value="pomodoro" className="mt-6"><Pomodoro /></TabsContent>
        <TabsContent value="egg" className="mt-6"><EggTimer /></TabsContent>
        <TabsContent value="alarm" className="mt-6"><AlarmClock /></TabsContent>
      </Tabs>
      <HubExtras category="reference-hub" />
    </div>
  )
}

// ==================== COUNTDOWN ====================
function Countdown() {
  const [target, setTarget] = useState('')
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [sound, setSound] = useState('classic')
  const stopAlarmRef = useRef(null)

  useEffect(() => {
    setPageMeta();
    if (!running || !target) return
    const id = setInterval(() => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining(0)
        setRunning(false)
        setDone(true)
        clearInterval(id)
        // 🔔 Ring + notify
        if (sound !== 'none') {
          stopAlarmRef.current = startRepeatingAlarm(sound, 0.3)
        }
        notify('⏰ Countdown finished', 'Your countdown to ' + new Date(target).toLocaleString() + ' has ended.')
      } else {
        setRemaining(diff)
      }
    }, 100)
    return () => clearInterval(id)
  }, [running, target, sound])

  // Stop alarm when done is cleared
  useEffect(() => {
    if (!done && stopAlarmRef.current) {
      stopAlarmRef.current()
      stopAlarmRef.current = null
    }
  }, [done])

  const d = Math.floor(remaining / 86400000)
  const h = Math.floor((remaining % 86400000) / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)

  const stopAlarm = () => {
    if (stopAlarmRef.current) { stopAlarmRef.current(); stopAlarmRef.current = null }
    setDone(false)
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
      <CardContent className="p-8 text-center">
        <Timer className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
        <Input type="datetime-local" value={target} onClick={(e) => e.target.showPicker?.()} onChange={(e) => { setTarget(e.target.value); setDone(false) }} className="max-w-sm mx-auto mb-4 h-11" />

        <div className="mb-6"><SoundPicker value={sound} onChange={setSound} /></div>

        {target && (
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
            {[['Days', d], ['Hours', h], ['Min', m], ['Sec', s]].map(([label, val]) => (
              <div key={label} className="bg-card rounded-xl p-3 border">
                <div className="text-3xl font-black tabular-nums text-indigo-600">{val}</div>
                <div className="text-xs text-muted-foreground uppercase">{label}</div>
              </div>
            ))}
          </div>
        )}

        {done && (
          <div className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2"><BellRing className="h-5 w-5 animate-pulse" /> <strong>Time's up!</strong></div>
            <Button onClick={stopAlarm} size="sm" variant="outline">Stop sound</Button>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          <Button onClick={() => setRunning(true)} disabled={!target || running} className="bg-indigo-600 hover:bg-indigo-700"><Play className="h-4 w-4 mr-2" /> Start</Button>
          <Button variant="outline" onClick={() => setRunning(false)} disabled={!running}><Pause className="h-4 w-4 mr-2" /> Pause</Button>
          <Button variant="outline" onClick={() => { setRunning(false); setRemaining(0); setTarget(''); setDone(false); if (stopAlarmRef.current) stopAlarmRef.current() }}><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== STOPWATCH ====================
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startRef = useRef(null)

  useEffect(() => {
    if (!running) return
    startRef.current = Date.now() - elapsed
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 10)
    return () => clearInterval(id)
  }, [running])

  const lap = () => setLaps([...laps, elapsed])
  const reset = () => { setRunning(false); setElapsed(0); setLaps([]) }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
      <CardContent className="p-8 text-center">
        <div className="text-6xl md:text-8xl font-black tabular-nums mb-6 text-cyan-600 font-mono">{fmtMs(elapsed)}</div>
        <div className="flex gap-2 justify-center mb-6">
          <Button onClick={() => setRunning(!running)} className="bg-cyan-600 hover:bg-cyan-700 h-12 px-8">
            {running ? <><Pause className="h-5 w-5 mr-2" /> Pause</> : <><Play className="h-5 w-5 mr-2" /> Start</>}
          </Button>
          <Button variant="outline" onClick={lap} disabled={!running} className="h-12"><Flag className="h-4 w-4 mr-2" /> Lap</Button>
          <Button variant="outline" onClick={reset} className="h-12"><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
        </div>
        {laps.length > 0 && (
          <div className="max-w-md mx-auto space-y-1 max-h-60 overflow-y-auto">
            {laps.map((l, i) => (
              <div key={i} className="flex justify-between bg-card p-2 rounded border text-sm">
                <span className="text-muted-foreground">Lap {i + 1}</span>
                <span className="font-mono font-bold">{fmtMs(l)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== POMODORO ====================
function Pomodoro() {
  const [workMins, setWorkMins] = useState(25)
  const [breakMins, setBreakMins] = useState(5)
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [cycles, setCycles] = useState(0)
  const [workSound, setWorkSound] = useState('digital')
  const [breakSound, setBreakSound] = useState('chime')

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (mode === 'work') {
            // Work finished → ring + notify
            if (workSound !== 'none') playAlarmSound(workSound, 0.35)
            notify('💪 Focus session complete', 'Time for a break!')
            setMode('break')
            setCycles(c => c + 1)
            return breakMins * 60
          } else {
            // Break finished → gentle chime
            if (breakSound !== 'none') playAlarmSound(breakSound, 0.3)
            notify('☕ Break over', 'Back to focus!')
            setMode('work')
            return workMins * 60
          }
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, mode, workMins, breakMins, workSound, breakSound])

  const reset = () => { setRunning(false); setMode('work'); setSeconds(workMins * 60) }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-rose-500/10 to-orange-500/10">
      <CardContent className="p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          {mode === 'work' ? <Zap className="h-8 w-8 text-rose-500" /> : <Coffee className="h-8 w-8 text-emerald-500" />}
          <span className="text-xl font-bold uppercase tracking-wide">{mode === 'work' ? 'Focus Time' : 'Break Time'}</span>
        </div>
        <div className={`text-7xl md:text-9xl font-black tabular-nums mb-6 font-mono ${mode === 'work' ? 'text-rose-600' : 'text-emerald-600'}`}>
          {pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}
        </div>
        <div className="flex gap-2 justify-center mb-6">
          <Button onClick={() => setRunning(!running)} className={`h-12 px-8 ${mode === 'work' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {running ? <><Pause className="h-5 w-5 mr-2" /> Pause</> : <><Play className="h-5 w-5 mr-2" /> Start</>}
          </Button>
          <Button variant="outline" onClick={reset} className="h-12"><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center text-sm mb-4">
          <label className="flex items-center gap-2">Work (min): <Input type="number" value={workMins} onChange={(e) => { const v = +e.target.value; setWorkMins(v); if (mode === 'work' && !running) setSeconds(v * 60) }} className="w-16 h-9" min="1" max="90" /></label>
          <label className="flex items-center gap-2">Break (min): <Input type="number" value={breakMins} onChange={(e) => setBreakMins(+e.target.value)} className="w-16 h-9" min="1" max="30" /></label>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Work sound:</span>
            <select value={workSound} onChange={(e) => { setWorkSound(e.target.value); playAlarmSound(e.target.value, 0.3) }} className="px-2 py-1 border border-border rounded bg-background text-foreground text-sm">
              {SOUND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Break sound:</span>
            <select value={breakSound} onChange={(e) => { setBreakSound(e.target.value); playAlarmSound(e.target.value, 0.3) }} className="px-2 py-1 border border-border rounded bg-background text-foreground text-sm">
              {SOUND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">Completed pomodoros: <strong>{cycles}</strong></p>
      </CardContent>
    </Card>
  )
}

// ==================== EGG TIMER ====================
function EggTimer() {
  const [total, setTotal] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState('digital')
  const stopAlarmRef = useRef(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setRunning(false)
          setFinished(true)
          if (sound !== 'none') stopAlarmRef.current = startRepeatingAlarm(sound, 0.35)
          notify('🥚 Timer complete', 'Your timer has finished.')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, sound])

  const stopAlarm = () => {
    if (stopAlarmRef.current) { stopAlarmRef.current(); stopAlarmRef.current = null }
    setFinished(false)
  }

  const presets = [60, 180, 300, 600, 900, 1800]

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
      <CardContent className="p-8 text-center">
        <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <div className="text-7xl md:text-9xl font-black tabular-nums mb-6 font-mono text-amber-600">{fmtSec(remaining)}</div>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {presets.map(p => (
            <button key={p} onClick={() => { setTotal(p); setRemaining(p); setRunning(false); setFinished(false) }} className={`px-4 py-2 rounded-full text-sm font-semibold ${total === p ? 'bg-amber-600 text-white' : 'bg-muted'}`}>
              {p < 60 ? `${p}s` : `${p / 60}min`}
            </button>
          ))}
        </div>

        <div className="mb-6"><SoundPicker value={sound} onChange={setSound} /></div>

        <div className="flex gap-2 justify-center">
          <Button onClick={() => setRunning(!running)} disabled={remaining === 0} className="bg-amber-600 hover:bg-amber-700 h-12 px-8">
            {running ? <><Pause className="h-5 w-5 mr-2" /> Pause</> : <><Play className="h-5 w-5 mr-2" /> Start</>}
          </Button>
          <Button variant="outline" onClick={() => { setRunning(false); setRemaining(total); stopAlarm() }} className="h-12"><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
        </div>

        {finished && (
          <div className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2"><BellRing className="h-5 w-5 animate-pulse" /> <strong>Timer complete!</strong></div>
            <Button onClick={stopAlarm} size="sm" variant="outline">Stop sound</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== ALARM CLOCK ====================
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const STORAGE_KEY = 'timegovern_alarms'

function AlarmClock() {
  const [alarms, setAlarms] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [now, setNow] = useState(new Date())
  const [ringingId, setRingingId] = useState(null)
  const [permState, setPermState] = useState('default')
  const beepIntervalRef = useRef(null)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms)) }, [alarms])
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { if ('Notification' in window) setPermState(Notification.permission) }, [])

  useEffect(() => {
    const hh = pad(now.getHours()), mm = pad(now.getMinutes())
    const nowTime = `${hh}:${mm}`
    const todayDow = now.getDay()

    alarms.forEach(a => {
      if (!a.enabled || ringingId) return
      if (a.time !== nowTime) return
      if (a.days.length > 0 && !a.days.includes(todayDow)) return
      setRingingId(a.id)
      playAlarmSound(a.sound, 0.4)
      notify('⏰ Alarm: ' + (a.label || 'Time is up'), a.time)
      beepIntervalRef.current = setInterval(() => playAlarmSound(a.sound, 0.4), 2500)
    })
  }, [now, alarms, ringingId])

  useEffect(() => {
    if (!ringingId && beepIntervalRef.current) { clearInterval(beepIntervalRef.current); beepIntervalRef.current = null }
  }, [ringingId])

  const requestPerm = async () => {
    const result = await requestNotificationPermission()
    setPermState(result)
  }

  const addAlarm = () => setAlarms([...alarms, { id: Date.now().toString(), time: '07:00', label: '', days: [], sound: 'classic', enabled: true }])
  const updateAlarm = (id, changes) => setAlarms(alarms.map(a => a.id === id ? { ...a, ...changes } : a))
  const deleteAlarm = (id) => { setAlarms(alarms.filter(a => a.id !== id)); if (ringingId === id) setRingingId(null) }
  const toggleDay = (id, day) => {
    const a = alarms.find(x => x.id === id); if (!a) return
    const days = a.days.includes(day) ? a.days.filter(d => d !== day) : [...a.days, day].sort()
    updateAlarm(id, { days })
  }

  const snooze = (mins) => {
    if (!ringingId) return
    const alarm = alarms.find(a => a.id === ringingId); if (!alarm) return
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current)
    const snoozeDate = new Date(Date.now() + mins * 60000)
    const snoozeTime = pad(snoozeDate.getHours()) + ':' + pad(snoozeDate.getMinutes())
    updateAlarm(ringingId, { time: snoozeTime, days: [snoozeDate.getDay()], label: (alarm.label || 'Alarm') + ' (snooze)' })
    setRingingId(null)
  }

  const dismiss = () => {
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current)
    const alarm = alarms.find(a => a.id === ringingId)
    if (alarm && alarm.days.length === 0) updateAlarm(ringingId, { enabled: false })
    setRingingId(null)
  }

  const formatPreview = (alarm) => {
    if (!alarm.enabled) return 'Disabled'
    const [h, m] = alarm.time.split(':').map(Number)
    const target = new Date(); target.setHours(h, m, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)
    const diff = target - now
    return `Rings in ${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`
  }

  return (
    <div className="space-y-4">
      {permState !== 'granted' && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
              <Bell className="h-5 w-5" /> Enable browser notifications so alarms ring even in background.
            </div>
            <Button onClick={requestPerm} size="sm" className="bg-amber-600 hover:bg-amber-700">Enable</Button>
          </CardContent>
        </Card>
      )}

      {ringingId && (
        <Card className="border-red-500 border-2 bg-red-50 dark:bg-red-950/50 animate-pulse">
          <CardContent className="p-6 text-center">
            <AlarmClockIcon className="h-16 w-16 text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-black mb-1 text-red-600">ALARM RINGING</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{alarms.find(a => a.id === ringingId)?.label || 'Time is up!'}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => snooze(5)} variant="outline" className="h-11">Snooze 5 min</Button>
              <Button onClick={() => snooze(10)} variant="outline" className="h-11">Snooze 10 min</Button>
              <Button onClick={dismiss} className="bg-red-600 hover:bg-red-700 text-white h-11">Dismiss</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6 text-center">
          <div className="text-5xl md:text-7xl font-black tabular-nums font-mono">
            {pad(now.getHours())}:{pad(now.getMinutes())}<span className="text-3xl md:text-4xl opacity-70">:{pad(now.getSeconds())}</span>
          </div>
          <p className="text-sm opacity-70 mt-1">{now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </CardContent>
      </Card>

      <Button onClick={addAlarm} className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold">
        <Plus className="h-5 w-5 mr-2" /> Add Alarm
      </Button>

      {alarms.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-10 text-center">
            <AlarmClockIcon className="h-14 w-14 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-1">No alarms set</h3>
            <p className="text-sm text-muted-foreground">Click "Add Alarm" to create your first one.</p>
          </CardContent>
        </Card>
      )}

      {alarms.map(alarm => (
        <Card key={alarm.id} className={`border shadow-md ${alarm.enabled ? '' : 'opacity-60'}`}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4 flex-wrap">
              <input type="time" value={alarm.time} onClick={(e) => e.target.showPicker?.()} onChange={(e) => updateAlarm(alarm.id, { time: e.target.value })} className="text-3xl font-black tabular-nums font-mono bg-transparent border-0 outline-none focus:ring-2 focus:ring-primary rounded px-1" />
              <Input placeholder="Label (e.g., Wake up)" value={alarm.label} onChange={(e) => updateAlarm(alarm.id, { label: e.target.value })} className="flex-1 min-w-[150px] h-10" />
              <select value={alarm.sound} onChange={(e) => { updateAlarm(alarm.id, { sound: e.target.value }); playAlarmSound(e.target.value, 0.3) }} className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm h-10">
                {SOUND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={alarm.enabled} onChange={(e) => updateAlarm(alarm.id, { enabled: e.target.checked })} className="h-5 w-5 accent-primary" />
                <span className="text-sm">{alarm.enabled ? 'On' : 'Off'}</span>
              </label>
              <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="h-5 w-5" /></button>
            </div>
            <div className="flex gap-1 mt-3 flex-wrap">
              {DAYS.map((day, i) => (
                <button key={day} onClick={() => toggleDay(alarm.id, i)} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${alarm.days.includes(i) ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/70'}`}>{day}</button>
              ))}
              <span className="text-xs text-muted-foreground self-center ml-2">
                {alarm.days.length === 0 ? 'Once' : alarm.days.length === 7 ? 'Every day' : `${alarm.days.length} days`}
              </span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" />{formatPreview(alarm)}</div>
          </CardContent>
        </Card>
      ))}

      <p className="text-xs text-muted-foreground text-center pt-4">Tip: Keep this tab open. Enable notifications to be alerted even when the tab is in the background.</p>
    </div>
  )
}