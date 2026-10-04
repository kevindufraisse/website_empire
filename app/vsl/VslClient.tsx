'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Play, Pause, Volume2, VolumeX, Maximize, Check, Calendar, ArrowRight, ChevronDown } from 'lucide-react'
import CalPopupButton from '@/components/CalPopupButton'
import { trackAmplitude, getAmplitudeDeviceId } from '@/lib/amplitude'

const VIDEO_ID = 'AKfoDblGUNs'
const VIDEO_TITLE = '94 % des gens ont fait +1M de vues avec cette formule'
// L'essai part sur Growth en mensuel : 7 jours, 500 crédits, rien débité avant
// le 8e jour (plafond appliqué au claim côté app, cf. FREE_TRIAL_CREDITS).
const TRIAL_PLAN = 'growth'
const TRIAL_BILLING = 'monthly'
const PROGRESS_MARKS = [25, 50, 75, 95]

const TRIAL_POINTS = [
  '7 jours gratuits, 500 crédits pour produire',
  'Carte demandée, rien débité avant le 8e jour',
  'Tu arrêtes en un clic depuis l’app',
]

const FAQ = [
  {
    q: 'L’essai est vraiment gratuit ?',
    a: 'Oui. Tu as 7 jours et 500 crédits. Si tu arrêtes avant le 8e jour, tu ne paies rien. Sinon l’abonnement Growth démarre à 499 €/mois.',
  },
  {
    q: 'Pourquoi une carte pour un essai gratuit ?',
    a: 'Pour que l’abonnement continue sans coupure si tu restes. Rien n’est prélevé pendant les 7 jours.',
  },
  {
    q: 'Je dois passer devant la caméra ?',
    a: 'Non. Plusieurs formats se font sans visage : posts illustrés, réactions, classements, citations. Tu donnes ton avis, l’app fait le reste.',
  },
  {
    q: 'Je préfère en parler avant',
    a: 'Réserve un appel : on regarde ta situation et on te dit si Empire est fait pour toi, sans engagement.',
  },
]

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

// Au-delà de 5 min, on demande l'email pour continuer.
const GATE_SECONDS = 300
const EMAIL_KEY = 'empire_vsl_email_v1'
const TIME_KEY = 'empire_vsl_time_v1'

function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // navigation privée : la page marche sans
  }
}

function EmailGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/vsl-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Impossible d’enregistrer ton email. Réessaie.')
        setSending(false)
        return
      }
      writeStore(EMAIL_KEY, email.trim().toLowerCase())
      trackAmplitude('vsl_email_submitted')
      onUnlocked()
    } catch {
      setError('Connexion impossible. Réessaie.')
      setSending(false)
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="w-full max-w-sm text-center">
        <p className="hidden sm:block text-empire text-xs font-semibold tracking-wider uppercase mb-2">La suite arrive</p>
        <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-1">Laisse ton email pour voir la suite</h3>
        <p className="hidden sm:block text-neutral-400 text-sm mb-4">La vidéo reprend là où tu t’es arrêté.</p>
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div className="flex flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ton email"
            autoComplete="email"
            className="flex-1 min-w-0 rounded-lg bg-white text-black px-4 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-empire"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-empire text-black font-bold px-5 py-2.5 sm:py-3 hover:brightness-110 transition disabled:opacity-60"
          >
            {sending ? '…' : 'Continuer'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}

function VideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const sentRef = useRef<Set<number>>(new Set())
  const unlockedRef = useRef(false)
  const gatedRef = useRef(false)
  const [started, setStarted] = useState(false)
  const [startAt, setStartAt] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<1 | 2>(1)
  const [muted, setMuted] = useState(false)
  const [gated, setGated] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(false)

  useEffect(() => {
    unlockedRef.current = Boolean(readStore(EMAIL_KEY))
    const saved = Number(readStore(TIME_KEY)) || 0
    // Sans email, on ne reprend jamais au-delà du seuil.
    setStartAt(unlockedRef.current ? saved : Math.min(saved, GATE_SECONDS - 5))
    setCanFullscreen(Boolean(document.fullscreenEnabled))
  }, [])

  const showGate = () => {
    if (gatedRef.current) return
    gatedRef.current = true
    playerRef.current?.pauseVideo?.()
    setGated(true)
    trackAmplitude('vsl_email_gate_shown')
  }

  useEffect(() => {
    if (!started) return
    let timer: ReturnType<typeof setInterval> | undefined

    const attach = () => {
      if (!window.YT?.Player || playerRef.current) return
      playerRef.current = new window.YT.Player('vsl-player', {
        events: {
          onStateChange: (e: any) => {
            const S = window.YT.PlayerState
            if (e.data === S.PLAYING && gatedRef.current) {
              e.target.pauseVideo()
              return
            }
            setIsPlaying(e.data === S.PLAYING)
            if (e.data === S.ENDED) trackAmplitude('vsl_video_progress', { percent: 100 })
          },
        },
      })
      timer = setInterval(() => {
        const p = playerRef.current
        if (!p?.getCurrentTime) return
        const t = p.getCurrentTime()
        const duration = p.getDuration?.() || 0
        if (t > 0) writeStore(TIME_KEY, String(Math.floor(t)))
        if (!unlockedRef.current && t >= GATE_SECONDS) showGate()
        if (!duration) return
        const pct = (t / duration) * 100
        for (const mark of PROGRESS_MARKS) {
          if (pct >= mark && !sentRef.current.has(mark)) {
            sentRef.current.add(mark)
            trackAmplitude('vsl_video_progress', { percent: mark })
          }
        }
      }, 1000)
    }

    if (window.YT?.Player) attach()
    else {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        attach()
      }
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [started])

  const start = () => {
    setStarted(true)
    trackAmplitude('vsl_video_played', startAt > 0 ? { resumed_at: startAt } : undefined)
  }

  const togglePlay = () => {
    const p = playerRef.current
    if (!p?.getPlayerState || gatedRef.current) return
    if (p.getPlayerState() === window.YT.PlayerState.PLAYING) p.pauseVideo()
    else p.playVideo()
  }

  const toggleSpeed = () => {
    const next = speed === 1 ? 2 : 1
    playerRef.current?.setPlaybackRate?.(next)
    setSpeed(next)
    trackAmplitude('vsl_speed_changed', { speed: next })
  }

  const toggleMute = () => {
    const p = playerRef.current
    if (!p?.mute) return
    if (muted) p.unMute()
    else p.mute()
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else el.requestFullscreen?.().catch(() => {})
  }

  const unlock = () => {
    unlockedRef.current = true
    gatedRef.current = false
    setGated(false)
    playerRef.current?.playVideo?.()
  }

  const embedParams = new URLSearchParams({
    autoplay: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    playsinline: '1',
    enablejsapi: '1',
    start: String(Math.floor(startAt)),
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_60px_-12px_rgb(var(--empire-rgb)_/_0.25)]"
    >
      {started ? (
        <>
          <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
          <iframe
            id="vsl-player"
            className="absolute inset-0 w-full h-full pointer-events-none"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${embedParams.toString()}`}
            title={VIDEO_TITLE}
            allow="autoplay; encrypted-media; picture-in-picture"
          />
          {/* Couche cliquable : pas d'accès aux commandes YouTube (avance, titre, suggestions). */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Lecture'}
            className="absolute inset-0 z-10 w-full h-full"
          >
            {!isPlaying && !gated && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-empire text-black shadow-xl">
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </span>
            )}
          </button>
          {!gated && (
            <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
                className="flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleSpeed}
                  aria-label="Vitesse de lecture"
                  className={`h-9 px-3 rounded-full text-sm font-bold transition ${speed === 2 ? 'bg-empire text-black' : 'text-white bg-white/10 hover:bg-white/20'}`}
                >
                  x2
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Activer le son' : 'Couper le son'}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-white/10"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                {canFullscreen && (
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Plein écran"
                    className="flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-white/10"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
          {gated && <EmailGate onUnlocked={unlock} />}
        </>
      ) : (
        <button
          type="button"
          onClick={start}
          aria-label="Lancer la vidéo"
          className="group absolute inset-0 w-full h-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
            alt={VIDEO_TITLE}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-empire text-black shadow-xl group-hover:scale-105 transition-transform">
            <Play className="w-9 h-9 ml-1" fill="currentColor" />
          </span>
          {startAt > 0 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
              Reprendre là où tu t’es arrêté
            </span>
          )}
        </button>
      )}
    </div>
  )
}

function Ctas({ location }: { location: 'top' | 'bottom' }) {
  const [loading, setLoading] = useState(false)

  const startTrial = async () => {
    if (loading) return
    setLoading(true)
    trackAmplitude('vsl_trial_clicked', { location })
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: TRIAL_PLAN,
          billing: TRIAL_BILLING,
          lang: 'fr',
          ampDeviceId: getAmplitudeDeviceId(),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
    } catch {
      // repli plus bas
    }
    window.location.href = `https://app.empire-internet.com/onboarding?plan=${TRIAL_PLAN}&billing=${TRIAL_BILLING}&intent=trial`
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={startTrial}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-empire text-black font-bold px-6 py-4 text-base hover:brightness-110 transition disabled:opacity-60"
        >
          {loading ? 'Ouverture…' : 'Tester gratuitement 7 jours'}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
        <span data-cal-keep onClickCapture={() => trackAmplitude('vsl_call_clicked', { location })} className="flex-1 flex">
          <CalPopupButton className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] text-white font-semibold px-6 py-4 text-base hover:bg-white/[0.08] transition">
            <Calendar className="w-5 h-5" />
            Réserver un appel
          </CalPopupButton>
        </span>
      </div>
      <ul className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-x-5 gap-y-1.5 text-sm text-neutral-400">
        {TRIAL_POINTS.map((p) => (
          <li key={p} className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-empire shrink-0" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left font-semibold text-white"
      >
        {q}
        <ChevronDown className={`w-5 h-5 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-neutral-400 text-sm leading-relaxed">{a}</p>}
    </div>
  )
}

export default function VslClient() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emp = params.get('emp')
    if (emp) sessionStorage.setItem('emp', emp)
    trackAmplitude('vsl_viewed', { has_emp: Boolean(emp) || undefined })
  }, [])

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Script
        src="https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js"
        strategy="lazyOnload"
      />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(var(--empire-rgb)_/_0.10),transparent)] pointer-events-none" />

      <section className="relative pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-center text-empire text-xs font-semibold tracking-wider uppercase mb-3">
            Vidéo gratuite
          </p>
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            94 % des gens ont fait <span className="text-empire">+1M de vues</span> avec cette formule
          </h1>
          <p className="text-center text-neutral-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Regarde la vidéo, puis applique la formule avec Empire : 7 jours pour la tester, gratuitement.
          </p>

          <VideoPlayer />

          <div className="mt-8">
            <Ctas location="top" />
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16 bg-gradient-to-b from-black via-[#0f0f0f] to-black">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-2">Ce qu&apos;en disent les clients</h2>
          <p className="text-center text-neutral-400 mb-8">Des entrepreneurs qui publient avec Empire</p>
          <div
            className="senja-embed"
            data-id="a7bf7e4a-0f3b-4751-8190-849f83d16306"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block', width: '100%' }}
          />
        </div>
      </section>

      <section className="relative py-12 md:py-16">
        <div className="container max-w-2xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">Questions fréquentes</h2>
          <div className="border-t border-white/10">
            {FAQ.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 pt-4">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Prêt à appliquer la formule ?</h2>
          <Ctas location="bottom" />
        </div>
      </section>
    </main>
  )
}
