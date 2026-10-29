'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Play, Pause, Volume2, VolumeX, Maximize, Check, ArrowRight, ChevronDown } from 'lucide-react'
import { trackAmplitude } from '@/lib/amplitude'
import { withAmplitudeDeviceId } from '@/lib/amplitude'
import VideoEmailGate, { adoptEmailFromUrl, storedVideoEmail } from '@/components/VideoEmailGate'
import { AudioPlayerCard, TextVersionSection, ExitFormatsPopup, useExitIntent } from '@/components/ListenReadFormats'
import { SCRIPT_SECTIONS, READ_MINUTES } from './vslScript'

const VIDEO_ID = 'AKfoDblGUNs'
const VIDEO_TITLE = 'Le système de personnalisation des entrepreneurs à 7 chiffres par an, expliqué'
const PROGRESS_MARKS = [25, 50, 75, 95]
const SPEEDS = [1, 1.25, 1.5, 1.75, 2]
const speedLabel = (v: number) => `${String(v).replace('.', ',')}x`
const clock = (sec: number) => {
  const t = Math.max(0, Math.floor(sec))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

// L'offre du live (app, /join/internet?offer=live) : 300 € de moins par mois
// pendant 3 mois, sur Growth ou Scale, pendant 72 h à partir de la première
// visite d'un email. L'email donné pour la vidéo part avec le lien, la page
// ne le redemande pas.
const OFFER_URL = 'https://app.empire-internet.com/join/internet?offer=live'
// Les boutons de l'offre n'apparaissent qu'après 10 min de vidéo
// réellement regardées (avancer dans la barre ne compte pas).
const OFFER_UNLOCK_SECONDS = 600
const WATCHED_KEY = 'empire_vsl_watched_v1'
const OFFER_POINTS = [
  '300 € de moins par mois pendant 3 mois, sur Growth ou Scale',
  'Valable 72 h à partir de ta première visite',
  'Ton premier contenu livré sous 48 h',
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
// La même porte email vaut pour les trois formats : vidéo, texte, audio.
const TIME_KEY = 'empire_vsl_time_v1'
const AUDIO_TIME_KEY = 'empire_vsl_audio_time_v1'
const TEXT_POS_KEY = 'empire_vsl_text_pos_v1'

// L'audio de la VSL (extrait de la vidéo, 64 kbit/s mono), hébergé sur le
// bucket public `user-files` comme les autres assets publics d'Empire.
const AUDIO_URL =
  'https://aaaaktbefgvyokfrzrmb.supabase.co/storage/v1/object/public/user-files/public-assets/vsl/v1/vsl-live-2026-audio.mp3'

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

function VideoPlayer({
  onPlayingChange,
  onWatched,
}: {
  onPlayingChange?: (playing: boolean) => void
  onWatched?: (seconds: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const sentRef = useRef<Set<number>>(new Set())
  const lastTimeRef = useRef<number | null>(null)
  const watchedRef = useRef(0)
  const onWatchedRef = useRef(onWatched)
  onWatchedRef.current = onWatched
  const unlockedRef = useRef(false)
  const [askEmail, setAskEmail] = useState(false)
  const [started, setStarted] = useState(false)
  const [startAt, setStartAt] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    unlockedRef.current = adoptEmailFromUrl('empire')
    watchedRef.current = Number(readStore(WATCHED_KEY)) || 0
    setStartAt(Number(readStore(TIME_KEY)) || 0)
    setCanFullscreen(Boolean(document.fullscreenEnabled))
  }, [])

  useEffect(() => {
    onPlayingChange?.(isPlaying)
  }, [isPlaying, onPlayingChange])

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
            if (e.data === S.ENDED) {
              trackAmplitude('vsl_video_progress', { percent: 100 })
              // Vue jusqu'au bout : la prochaine visite repart du début.
              writeStore(TIME_KEY, '0')
            }
          },
        },
      })
      timer = setInterval(() => {
        const p = playerRef.current
        if (!p?.getCurrentTime) return
        const t = p.getCurrentTime()
        const duration = p.getDuration?.() || 0
        // Temps regardé : seulement l'avance normale de la lecture, jamais un saut.
        const prev = lastTimeRef.current
        lastTimeRef.current = t
        if (prev !== null && p.getPlayerState?.() === window.YT?.PlayerState?.PLAYING) {
          const delta = t - prev
          if (delta > 0 && delta < 3) {
            watchedRef.current += delta
            writeStore(WATCHED_KEY, String(Math.floor(watchedRef.current)))
            onWatchedRef.current?.(watchedRef.current)
          }
        }
        setCurrent(t)
        if (duration) setDuration(duration)
        if (t > 0 && p.getPlayerState?.() !== window.YT?.PlayerState?.ENDED) writeStore(TIME_KEY, String(Math.floor(t)))
        if (!duration) return
        const pct = (t / duration) * 100
        for (const mark of PROGRESS_MARKS) {
          if (pct >= mark && !sentRef.current.has(mark)) {
            sentRef.current.add(mark)
            trackAmplitude('vsl_video_progress', { percent: mark })
          }
        }
      }, 500)
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
    // L'email a pu être donné après le montage, via la porte texte ou audio.
    if (!unlockedRef.current) unlockedRef.current = Boolean(storedVideoEmail())
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

  // Barre de progression : on avance ou on recule où on veut.
  const seekFromPointer = (clientX: number, target: HTMLElement) => {
    const p = playerRef.current
    if (!p?.seekTo || !duration) return
    const rect = target.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const to = ratio * duration
    p.seekTo(to, true)
    setCurrent(to)
    writeStore(TIME_KEY, String(Math.floor(to)))
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
            // Plus haute que le cadre : la vidéo garde sa taille, le titre et
            // la chaîne YouTube tombent dans la bande noire, hors du cadre.
            className="absolute inset-x-0 top-[-30%] w-full h-[160%] pointer-events-none"
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
            {!isPlaying && <span className="absolute inset-0 bg-black/40" />}
            {!isPlaying && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-empire text-black shadow-xl">
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </span>
            )}
          </button>
          <div className="absolute bottom-0 inset-x-0 z-10 px-3 pb-2 pt-6 bg-gradient-to-t from-black/80 to-transparent">
          <div
            role="slider"
            tabIndex={0}
            aria-label="Avancer dans la vidéo"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(current)}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              seekFromPointer(e.clientX, e.currentTarget)
            }}
            onPointerMove={(e) => {
              if (e.buttons) seekFromPointer(e.clientX, e.currentTarget)
            }}
            onKeyDown={(e) => {
              const p = playerRef.current
              if (!p?.seekTo || !duration) return
              const step = e.key === 'ArrowRight' ? 10 : e.key === 'ArrowLeft' ? -10 : 0
              if (!step) return
              e.preventDefault()
              const to = Math.min(duration, Math.max(0, current + step))
              p.seekTo(to, true)
              setCurrent(to)
            }}
            className="group/seek relative mb-1 flex h-5 cursor-pointer touch-none items-center"
          >
            <div className="h-1.5 w-full rounded-full bg-white/25 group-hover/seek:h-2 transition-all">
              <div className="h-full rounded-full bg-empire" style={{ width: `${duration ? (current / duration) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
              className="flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
            </button>
            <span className="mr-auto text-xs tabular-nums text-white/80">{clock(current)}{duration ? ` / ${clock(duration)}` : ''}</span>
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

function Ctas({ location, remaining = 0 }: { location: string; remaining?: number }) {
  const [loading, setLoading] = useState(false)

  if (remaining > 0) {
    const min = Math.ceil(remaining / 60)
    return (
      <div className="w-full max-w-xl mx-auto rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
        <p className="text-sm text-neutral-300">
          Une offre apparaît dans <span className="font-bold text-empire">{min} min</span> de vidéo
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-empire transition-all"
            style={{ width: `${Math.min(100, ((OFFER_UNLOCK_SECONDS - remaining) / OFFER_UNLOCK_SECONDS) * 100)}%` }}
          />
        </div>
      </div>
    )
  }

  const openOffer = () => {
    if (loading) return
    setLoading(true)
    trackAmplitude('vsl_offer_clicked', { location })
    const url = new URL(OFFER_URL)
    const email = storedVideoEmail()
    if (email) url.searchParams.set('email', email)
    window.location.href = withAmplitudeDeviceId(url.toString())
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={openOffer}
          disabled={loading}
          className="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-empire px-7 py-3.5 text-base font-bold text-black shadow-[0_0_24px_rgb(var(--empire-rgb)_/_0.2)] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Ouverture…' : 'Voir l’offre'}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
        {/* Le même bouton que « Demander une démo » du site (EmpireSalesCta). */}
        <a
          href="/demo"
          onClick={() => trackAmplitude('empire_demo_clicked', { source: `vsl_${location}` })}
          className="flex-1 inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/5"
        >
          Demander une démo
        </a>
      </div>
      <ul className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-x-5 gap-y-1.5 text-sm text-neutral-400">
        {OFFER_POINTS.map((p) => (
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
  const [textOpen, setTextOpen] = useState(false)
  const [audioOpen, setAudioOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [gateFor, setGateFor] = useState<'text' | 'audio' | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [watched, setWatched] = useState(0)
  const remaining = Math.max(0, OFFER_UNLOCK_SECONDS - watched)

  useEffect(() => {
    setWatched(Number(readStore(WATCHED_KEY)) || 0)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emp = params.get('emp')
    if (emp) sessionStorage.setItem('emp', emp)
    trackAmplitude('vsl_viewed', { has_emp: Boolean(emp) || undefined })
  }, [])

  const reveal = (kind: 'text' | 'audio') => {
    setGateFor(null)
    setPopupOpen(false)
    if (kind === 'text') {
      setTextOpen(true)
      trackAmplitude('vsl_text_opened')
    } else {
      setAudioOpen(true)
      trackAmplitude('vsl_audio_opened')
      requestAnimationFrame(() => {
        document.getElementById('version-audio')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }

  // Même porte email que la vidéo : un email donné pour un format ouvre les trois.
  const pickFormat = (kind: 'text' | 'audio') => {
    if (!storedVideoEmail()) {
      setGateFor(kind)
      trackAmplitude('vsl_email_gate_shown', { funnel: 'empire', format: kind })
      return
    }
    reveal(kind)
  }

  // « Pas le temps ? Lis-la ou écoute-la » : en exit popup, jamais pendant
  // que la vidéo joue, une fois par session.
  useExitIntent({
    enabled: !popupOpen && !textOpen && !audioOpen && !videoPlaying,
    sessionKey: 'empire_vsl_exit_v1',
    onTrigger: () => {
      setPopupOpen(true)
      trackAmplitude('vsl_exit_popup_shown')
    },
  })

  const closePopup = () => {
    setPopupOpen(false)
    setGateFor(null)
  }

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
            Dans 30 jours, tout votre marché vous connaîtra après avoir regardé <span className="text-empire">cette vidéo</span>&nbsp;:
          </h1>

          {/* Largeur bornée par la hauteur d'écran : les boutons restent au-dessus de la ligne de flottaison. */}
          <div className="mx-auto w-full max-w-[max(18rem,calc((100svh-24rem)*16/9))]">
            <VideoPlayer onPlayingChange={setVideoPlaying} onWatched={setWatched} />
          </div>

          {audioOpen && (
            <div id="version-audio">
              <AudioPlayerCard
                src={AUDIO_URL}
                title={VIDEO_TITLE}
                storageKey={AUDIO_TIME_KEY}
                eventPrefix="vsl_audio"
                accent="empire"
                fallbackDuration="1:26:42"
              />
            </div>
          )}

          <div className="mt-6">
            <Ctas location="top" remaining={remaining} />
          </div>
        </div>
      </section>

      <ExitFormatsPopup
        open={popupOpen}
        accent="empire"
        title="Pas le temps de regarder la vidéo en entier ?"
        subtitle="La même formule, dans le format qui te va."
        readTitle={`Lire la version texte (${READ_MINUTES} min)`}
        readSub="Le script complet, scannable : titres, chiffres, mêmes offres."
        listenTitle="Écouter en podcast"
        listenSub="L’audio continue téléphone verrouillé, et reprend où tu t’arrêtes."
        onPick={pickFormat}
        onClose={closePopup}
        gate={
          gateFor ? (
            <VideoEmailGate
              funnel="empire"
              title="Où on t’envoie la formule ?"
              subtitle={
                gateFor === 'text'
                  ? 'Ton email, et la version texte s’affiche tout de suite.'
                  : 'Ton email, et l’audio démarre tout de suite.'
              }
              cta={gateFor === 'text' ? 'Lire' : 'Écouter'}
              onUnlocked={() => reveal(gateFor)}
            />
          ) : undefined
        }
      />

      {textOpen && (
        <TextVersionSection
          sections={SCRIPT_SECTIONS}
          storageKey={TEXT_POS_KEY}
          eventPrefix="vsl_text"
          accent="empire"
          heading="La vidéo, en page écrite"
          intro={`Les mêmes idées, les mêmes chiffres, les mêmes offres — environ ${READ_MINUTES} minutes de lecture. Ta position est retenue : tu reprends où tu t’es arrêté.`}
          renderCta={(location) => <Ctas location={location} />}
        />
      )}

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
          <Ctas location="bottom" remaining={remaining} />
        </div>
      </section>
    </main>
  )
}
