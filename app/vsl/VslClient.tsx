'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Play, Pause, Volume2, VolumeX, Maximize, Check, Calendar, ArrowRight, ChevronDown } from 'lucide-react'
import CalPopupButton from '@/components/CalPopupButton'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial } from '@/lib/startTrial'
import VideoEmailGate, { adoptEmailFromUrl } from '@/components/VideoEmailGate'

const VIDEO_ID = 'AKfoDblGUNs'
const VIDEO_TITLE = 'Le système de personnalisation des entrepreneurs à 7 chiffres par an, expliqué'
const PROGRESS_MARKS = [25, 50, 75, 95]
const SPEEDS = [1, 1.25, 1.5, 1.75, 2]
const speedLabel = (v: number) => `${String(v).replace('.', ',')}x`

const TRIAL_POINTS = [
  '7 jours gratuits avec 500 crédits',
  'Carte demandée : l’abonnement démarre au 8e jour, ou dès que tu dépasses les 500 crédits',
  'Tu arrêtes en un clic depuis l’app',
]

const WHAT_YOU_GET = [
  {
    title: 'Des idées prêtes à filmer',
    text: 'Chaque semaine, Empire te propose des sujets tirés de ton actu, de tes notes Telegram et de ce qui marche chez tes concurrents.',
  },
  {
    title: 'Les formats qui font des vues',
    text: 'Classement, Devine, Pour ou contre, Réagir à une vidéo, Citation, Actu : tu choisis, tu donnes ton avis, l\u2019app monte.',
  },
  {
    title: 'Publié partout, suivi jusqu\u2019à la vente',
    text: 'Un clic pour publier sur tes réseaux, et un lien qui compte les clics, les leads et les rendez-vous qu\u2019il t\u2019apporte.',
  },
]

const FAQ = [
  {
    q: 'L\u2019essai est vraiment gratuit ?',
    a: 'Oui. Tu as 7 jours et 500 crédits pour créer tes premiers contenus. Si tu arrêtes avant, tu ne paies rien. L\u2019abonnement Growth (499 €/mois) démarre au 8e jour, ou plus tôt si tu utilises plus que tes 500 crédits : tu paies seulement quand tu veux aller au-delà.',
  },
  {
    q: 'Pourquoi une carte pour un essai gratuit ?',
    a: 'Pour que tu ne sois jamais bloqué : si tu dépasses tes 500 crédits ou si tu restes après 7 jours, l\u2019abonnement démarre sans coupure. Tant que tu restes dans l\u2019essai, rien n\u2019est prélevé.',
  },
  {
    q: 'Ça me prend combien de temps ?',
    a: 'Environ 20 minutes par semaine : tu choisis tes idées, tu donnes ton avis ou tu filmes une prise. Le texte, le montage et la publication sont faits pour toi.',
  },
  {
    q: 'Je dois passer devant la caméra ?',
    a: 'Non. Une actu devient un post LinkedIn illustré, une citation se pose sur une de tes vidéos, et une vidéo virale peut être refaite avec ton visage et ta voix. Ton avis suffit.',
  },
  {
    q: 'Je préfère en parler avant',
    a: 'Réserve un appel : on regarde ta situation et on te dit si Empire est fait pour toi, sans engagement. Pour une question rapide, écris-nous sur WhatsApp (bulle en bas à droite).',
  },
]

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

// L'email est demandé avant la lecture (choix de Kevin, 17 octobre 2026).
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

function VideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const sentRef = useRef<Set<number>>(new Set())
  const unlockedRef = useRef(false)
  const [askEmail, setAskEmail] = useState(false)
  const [started, setStarted] = useState(false)
  const [startAt, setStartAt] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(false)

  useEffect(() => {
    unlockedRef.current = adoptEmailFromUrl('empire')
    setStartAt(Number(readStore(TIME_KEY)) || 0)
    setCanFullscreen(Boolean(document.fullscreenEnabled))
  }, [])

  useEffect(() => {
    if (!started) return
    let timer: ReturnType<typeof setInterval> | undefined

    const attach = () => {
      if (!window.YT?.Player || playerRef.current) return
      playerRef.current = new window.YT.Player('vsl-player', {
        events: {
          onStateChange: (e: any) => {
            const S = window.YT.PlayerState
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
    if (!unlockedRef.current) {
      setAskEmail(true)
      trackAmplitude('vsl_email_gate_shown', { funnel: 'empire' })
      return
    }
    setStarted(true)
    trackAmplitude('vsl_video_played', startAt > 0 ? { resumed_at: startAt } : undefined)
  }

  const togglePlay = () => {
    const p = playerRef.current
    if (!p?.getPlayerState) return
    if (p.getPlayerState() === window.YT.PlayerState.PLAYING) p.pauseVideo()
    else p.playVideo()
  }

  const chooseSpeed = (next: number) => {
    playerRef.current?.setPlaybackRate?.(next)
    setSpeed(next)
    setSpeedOpen(false)
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
    setAskEmail(false)
    setStarted(true)
    trackAmplitude('vsl_video_played', startAt > 0 ? { resumed_at: startAt } : undefined)
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
            {!isPlaying && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-empire text-black shadow-xl">
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </span>
            )}
          </button>
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
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSpeedOpen((o) => !o)}
                  aria-label="Vitesse de lecture"
                  aria-expanded={speedOpen}
                  className={`h-9 min-w-[3.25rem] px-3 rounded-full text-sm font-bold transition ${speed !== 1 ? 'bg-empire text-black' : 'text-white bg-white/10 hover:bg-white/20'}`}
                >
                  {speedLabel(speed)}
                </button>
                {speedOpen && (
                  <div className="absolute bottom-full right-0 mb-2 flex flex-row rounded-xl border border-white/10 bg-[#111] p-1 shadow-xl">
                    {SPEEDS.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => chooseSpeed(v)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap ${v === speed ? 'bg-empire text-black' : 'text-white hover:bg-white/10'}`}
                      >
                        {speedLabel(v)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
        </>
      ) : (
        <>
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
        {askEmail && (
          <VideoEmailGate
            funnel="empire"
            title="Où on t’envoie la formule ?"
            subtitle="Ton email, et la vidéo démarre tout de suite."
            onUnlocked={unlock}
          />
        )}
        </>
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
    await startFreeTrial()
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
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            Le système de personnalisation des entrepreneurs à <span className="text-empire">7 chiffres par an</span>, expliqué
          </h1>

          {/* Largeur bornée par la hauteur d'écran : les boutons restent au-dessus de la ligne de flottaison. */}
          <div className="mx-auto w-full max-w-[max(18rem,calc((100svh-24rem)*16/9))]">
            <VideoPlayer />
          </div>

          <div className="mt-6">
            <Ctas location="top" />
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-2">Ce que tu testes pendant 7 jours</h2>
          <p className="text-center text-neutral-400 mb-8">La formule de la vidéo, appliquée pour toi</p>
          <div className="grid gap-4 md:grid-cols-3">
            {WHAT_YOU_GET.map((item, i) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-empire text-black text-sm font-bold mb-4">{i + 1}</span>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
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
