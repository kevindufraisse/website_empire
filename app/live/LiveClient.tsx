'use client'

import { useEffect, useState, useCallback, useRef, FormEvent } from 'react'
import { ArrowRight, Calendar, Clock, Play, Users, X, Mail, Loader2, Eye } from 'lucide-react'

const WEBINAR_START = new Date('2026-06-18T19:00:00+02:00')
const WEBINAR_END = new Date('2026-06-18T20:30:00+02:00')
const REPLAY_DEADLINE = new Date(WEBINAR_END.getTime() + 48 * 3600 * 1000)
const DOORS_OPEN_TIME = new Date('2026-06-18T18:30:00+02:00')

const YOUTUBE_VIDEO_ID = 'v9BzAOWKt8U'
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`
const YOUTUBE_CHAT_URL = `https://www.youtube.com/live_chat?v=${YOUTUBE_VIDEO_ID}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : ''}`

const REPLAY_URL = process.env.NEXT_PUBLIC_WEBINAR_REPLAY_URL || ''

const EMAIL_STORAGE_KEY = 'empire_live_email'
const VIEWERS_MIN = 478
const VIEWERS_MAX = 894

type LiveState = 'before' | 'doors-open' | 'live' | 'replay' | 'expired'

function getState(_now: number): LiveState {
  return 'live'
}

function useNow() {
  const [now, setNow] = useState<number>(() => Date.now())
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return { now, mounted }
}

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      total: diff,
    }
  }, [target])
  const [mounted, setMounted] = useState(false)
  const [t, setT] = useState(calc)
  useEffect(() => {
    setMounted(true)
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [calc])
  return { ...t, mounted }
}

function useViewerCount() {
  const [count, setCount] = useState(() =>
    Math.floor(VIEWERS_MIN + Math.random() * (VIEWERS_MAX - VIEWERS_MIN))
  )
  const target = useRef(count)

  useEffect(() => {
    const pickNewTarget = () => {
      const drift = Math.floor(Math.random() * 30) - 12
      target.current = Math.min(VIEWERS_MAX, Math.max(VIEWERS_MIN, target.current + drift))
    }

    const tick = setInterval(() => {
      setCount((prev) => {
        if (prev === target.current) {
          pickNewTarget()
          return prev
        }
        const step = prev < target.current ? 1 : -1
        return prev + step
      })
    }, 2000 + Math.random() * 3000)

    const bigShift = setInterval(() => {
      const jump = Math.floor(Math.random() * 60) - 20
      target.current = Math.min(VIEWERS_MAX, Math.max(VIEWERS_MIN, target.current + jump))
    }, 15000 + Math.random() * 20000)

    return () => {
      clearInterval(tick)
      clearInterval(bigShift)
    }
  }, [])

  return count
}

function useEmailGate() {
  const [hasEmail, setHasEmail] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(EMAIL_STORAGE_KEY)
    setHasEmail(!!stored)
    setLoading(false)
  }, [])

  const saveEmail = useCallback((email: string) => {
    localStorage.setItem(EMAIL_STORAGE_KEY, email)
    setHasEmail(true)
  }, [])

  return { hasEmail, loading, saveEmail }
}

const pad = (n: number) => String(n).padStart(2, '0')

function CountdownBig() {
  const { mounted, days, hours, minutes, seconds } = useCountdown(WEBINAR_START)
  const placeholder = '--'
  const blocks = mounted
    ? [
        ...(days > 0 ? [{ v: pad(days), l: 'jours' }] : []),
        { v: pad(hours), l: 'heures' },
        { v: pad(minutes), l: 'min' },
        { v: pad(seconds), l: 'sec' },
      ]
    : [
        { v: placeholder, l: 'jours' },
        { v: placeholder, l: 'heures' },
        { v: placeholder, l: 'min' },
        { v: placeholder, l: 'sec' },
      ]
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {blocks.map((b, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono text-3xl md:text-4xl font-black text-empire tabular-nums">
            {b.v}
          </span>
          <span className="text-[10px] md:text-xs text-neutral-500 mt-2 uppercase tracking-widest">{b.l}</span>
        </div>
      ))}
    </div>
  )
}

function StateBadge({ state }: { state: LiveState }) {
  const map: Record<LiveState, { label: string; color: string; pulse?: boolean }> = {
    before: { label: 'Bientôt en live', color: 'bg-white/10 text-neutral-300 border-white/10' },
    'doors-open': { label: 'Ouverture des portes', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    live: { label: '● En direct', color: 'bg-red-500/15 text-red-400 border-red-500/30', pulse: true },
    replay: { label: 'Replay disponible', color: 'bg-empire/10 text-empire border-empire/30' },
    expired: { label: 'Diffusion terminée', color: 'bg-white/5 text-neutral-500 border-white/10' },
  }
  const s = map[state]
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${s.color}`}>
      {s.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
      <span>{s.label}</span>
    </div>
  )
}

function EmailPopup({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setError('Entre un email valide.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/live-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur')
      }
      onSuccess(trimmed)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur, réessaie.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-8 shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-empire/10 border border-empire/20 mx-auto mb-6">
          <Mail className="text-empire" size={24} />
        </div>
        <h2 className="text-2xl font-black text-white text-center mb-2">
          Accède au live gratuitement
        </h2>
        <p className="text-neutral-400 text-center text-sm mb-6">
          Entre ton email pour débloquer le live et recevoir les ressources exclusives.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-empire/50 focus:border-empire/50 transition-all"
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-empire text-black font-black text-sm hover:bg-empire/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Play size={16} /> Regarder le live
              </>
            )}
          </button>
        </form>
        <p className="text-neutral-600 text-[11px] text-center mt-4">
          Tes données restent confidentielles. Pas de spam.
        </p>
      </div>
    </div>
  )
}

function BeforeLive() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <StateBadge state="before" />
      <h1 className="text-3xl md:text-5xl font-black text-white mt-6 leading-tight">
        Le live commence dans...
      </h1>
      <p className="text-neutral-400 mt-3 mb-10 text-sm md:text-base">
        Les secrets des gourous - jeudi 18 juin 2026, 19h00 (Paris).
      </p>
      <CountdownBig />
      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 text-left">
        <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold mb-3">
          En attendant le live
        </p>
        <ul className="space-y-3 text-sm md:text-base text-neutral-200">
          <li className="flex items-start gap-3">
            <Calendar size={16} className="text-empire mt-1 flex-shrink-0" />
            <span>Bloque ton agenda - le live commence pile à 19h00, on n'attend pas les retardataires.</span>
          </li>
          <li className="flex items-start gap-3">
            <Clock size={16} className="text-empire mt-1 flex-shrink-0" />
            <span>Reviens sur cette page dès 18h30 pour rejoindre la salle.</span>
          </li>
          <li className="flex items-start gap-3">
            <Play size={16} className="text-empire mt-1 flex-shrink-0" />
            <span>Pas inscrit ? Tu peux encore rejoindre la liste.</span>
          </li>
        </ul>
        <a
          href="/webinar"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-empire hover:text-empire/80 transition-colors"
        >
          M'inscrire au webinar <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

function DoorsOpen() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <StateBadge state="doors-open" />
      <h1 className="text-3xl md:text-5xl font-black text-white mt-6 leading-tight">
        Les portes sont ouvertes
      </h1>
      <p className="text-neutral-400 mt-3 mb-8 text-sm md:text-base">
        Le live démarre bientôt. Reste sur cette page - tu seras redirigé automatiquement.
      </p>
      <CountdownBig />
    </div>
  )
}

function LiveView() {
  const { hasEmail, loading, saveEmail } = useEmailGate()
  const viewerCount = useViewerCount()
  const [showPopup, setShowPopup] = useState(false)
  const [chatUrl, setChatUrl] = useState('')

  useEffect(() => {
    setChatUrl(`https://www.youtube.com/live_chat?v=${YOUTUBE_VIDEO_ID}&embed_domain=${window.location.hostname}`)
  }, [])

  useEffect(() => {
    if (!loading && !hasEmail) {
      const timer = setTimeout(() => setShowPopup(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [loading, hasEmail])

  function handleEmailSuccess(email: string) {
    saveEmail(email)
    setShowPopup(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-empire" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      {showPopup && <EmailPopup onSuccess={handleEmailSuccess} />}

      <div className="flex items-center justify-between mb-3 px-1">
        <StateBadge state="live" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs md:text-sm">
            <Eye size={14} className="text-red-400" />
            <span className="font-mono tabular-nums font-bold text-white">{viewerCount.toLocaleString('fr-FR')}</span>
            <span className="hidden sm:inline">en ligne</span>
          </div>
          <h1 className="text-sm md:text-lg font-bold text-white leading-tight">
            Les secrets des gourous
          </h1>
        </div>
      </div>

      <div className={`flex flex-col xl:flex-row gap-3 transition-all duration-500 ${!hasEmail ? 'pointer-events-none' : ''}`}>
        {/* Video */}
        <div className="flex-1 min-w-0">
          <div className={`relative w-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-black transition-all duration-500 ${!hasEmail ? 'blur-lg' : 'blur-0'}`} style={{ aspectRatio: '16/8.5' }}>
            <iframe
              src={hasEmail ? YOUTUBE_EMBED_URL : ''}
              title="Live Empire Internet"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Chat */}
        <div className="w-full xl:w-[360px] flex-shrink-0">
          <div className={`relative w-full h-[350px] md:h-[450px] xl:h-full min-h-[350px] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 transition-all duration-500 ${!hasEmail ? 'blur-lg' : 'blur-0'}`}>
            {hasEmail && chatUrl && (
              <iframe
                src={chatUrl}
                title="Live Chat"
                className="absolute inset-0 w-full h-full"
              />
            )}
            {!hasEmail && (
              <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                Chat en direct
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplayView() {
  const { mounted, days, hours, minutes } = useCountdown(REPLAY_DEADLINE)
  return (
    <div className="text-center max-w-2xl mx-auto">
      <StateBadge state="replay" />
      <h1 className="text-3xl md:text-5xl font-black text-white mt-6 leading-tight">
        Le replay est dispo
      </h1>
      <p className="text-neutral-400 mt-3 mb-8 text-sm md:text-base">
        {mounted ? (
          <>
            Encore <span className="text-empire font-bold">{days > 0 ? `${days}j ` : ''}{pad(hours)}h{pad(minutes)}</span> pour le regarder.
          </>
        ) : (
          'Replay disponible 48h.'
        )}
      </p>
      {REPLAY_URL ? (
        <a
          href={REPLAY_URL}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-black text-base hover:bg-empire/90 transition-colors"
        >
          <Play size={18} /> Regarder le replay
        </a>
      ) : (
        <p className="text-sm text-neutral-500">
          Le lien du replay sera publié ici dès la fin du live.
        </p>
      )}
    </div>
  )
}

function Expired() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <StateBadge state="expired" />
      <h1 className="text-3xl md:text-5xl font-black text-white mt-6 leading-tight">
        La diffusion est terminée
      </h1>
      <p className="text-neutral-400 mt-3 mb-8 text-sm md:text-base">
        Le replay n'est plus disponible. Le prochain webinar arrive bientôt - inscris-toi pour être prévenu en premier.
      </p>
      <a
        href="/webinar"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-black text-base hover:bg-empire/90 transition-colors"
      >
        <Users size={18} /> Rejoindre la liste d'attente <ArrowRight size={16} />
      </a>
    </div>
  )
}

export default function LiveClient() {
  const { now, mounted } = useNow()
  const state = mounted ? getState(now) : 'before'

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative w-full pt-4 md:pt-6 pb-6 md:pb-10">
        <div className="mx-auto px-2 md:px-4 max-w-[1800px]">
          {!mounted ? (
            <BeforeLive />
          ) : state === 'before' ? (
            <BeforeLive />
          ) : state === 'doors-open' ? (
            <DoorsOpen />
          ) : state === 'live' ? (
            <LiveView />
          ) : state === 'replay' ? (
            <ReplayView />
          ) : (
            <Expired />
          )}
        </div>
      </section>
    </main>
  )
}
