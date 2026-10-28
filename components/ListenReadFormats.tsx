'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BookOpen, Headphones, Pause, Play, X } from 'lucide-react'
import { trackAmplitude } from '@/lib/amplitude'

// La VSL à lire ou à écouter, proposée en exit popup (choix de Kevin,
// 28 octobre 2026 : les boutons inline sous la vidéo faisaient « cheap »).
// Partagé entre /vsl (accent empire) et /partenaire (accent academy).

export type Accent = 'empire' | 'academy'

const ACCENT_BG: Record<Accent, string> = { empire: 'bg-empire', academy: 'bg-academy' }
const ACCENT_TEXT: Record<Accent, string> = { empire: 'text-empire', academy: 'text-academy' }
const ACCENT_SLIDER: Record<Accent, string> = { empire: 'accent-empire', academy: 'accent-academy' }
const ACCENT_GLOW: Record<Accent, string> = {
  empire: 'shadow-[0_0_80px_-20px_rgb(var(--empire-rgb)_/_0.4)]',
  academy: 'shadow-[0_0_80px_-20px_rgba(252,165,165,0.35)]',
}

const PROGRESS_MARKS = [25, 50, 75, 95]
const SPEEDS = [1, 1.5, 2]

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
    // navigation privée : tout marche sans la reprise
  }
}

export function formatClock(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  return `${h > 0 ? `${h}:${String(m).padStart(2, '0')}` : m}:${String(sec).padStart(2, '0')}`
}

/* ------------------------------------------------------------------ */
/* Player audio : un vrai <audio>, la lecture continue en arrière-plan */
/* ------------------------------------------------------------------ */

export function AudioPlayerCard({
  src,
  title,
  storageKey,
  eventPrefix,
  accent,
  fallbackDuration,
}: {
  src: string
  title: string
  /** Clé localStorage de la position (ex. empire_vsl_audio_time_v1). */
  storageKey: string
  /** Préfixe des événements Amplitude (ex. vsl_audio / partner_vsl_audio). */
  eventPrefix: string
  accent: Accent
  /** Durée affichée avant le chargement des métadonnées (ex. « 1:26:42 »). */
  fallbackDuration: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const sentRef = useRef<Set<number>>(new Set())
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [resumeAt] = useState(() => Number(readStore(storageKey)) || 0)

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: 'Kevin Dufraisse · Empire' })
      navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play())
      navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause())
    } catch {
      // vieux navigateurs : l'audio joue quand même
    }
  }, [title])

  const onLoaded = () => {
    const el = audioRef.current
    if (!el) return
    setDuration(el.duration || 0)
    if (resumeAt > 10 && resumeAt < (el.duration || Infinity) - 30) {
      el.currentTime = resumeAt
      setTime(resumeAt)
    }
  }

  const onTime = () => {
    const el = audioRef.current
    if (!el) return
    const t = el.currentTime
    setTime(t)
    if (t > 0) writeStore(storageKey, String(Math.floor(t)))
    const d = el.duration || 0
    if (!d) return
    const pct = (t / d) * 100
    for (const mark of PROGRESS_MARKS) {
      if (pct >= mark && !sentRef.current.has(mark)) {
        sentRef.current.add(mark)
        trackAmplitude(`${eventPrefix}_progress`, { percent: mark })
      }
    }
  }

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
      if (!started) {
        setStarted(true)
        trackAmplitude(`${eventPrefix}_played`, resumeAt > 10 ? { resumed_at: Math.floor(resumeAt) } : undefined)
      }
    } else {
      el.pause()
    }
  }

  const seek = (next: number) => {
    const el = audioRef.current
    if (!el) return
    el.currentTime = next
    setTime(next)
    writeStore(storageKey, String(Math.floor(next)))
  }

  const chooseSpeed = (v: number) => {
    const el = audioRef.current
    if (el) el.playbackRate = v
    setSpeed(v)
    trackAmplitude(`${eventPrefix}_speed_changed`, { speed: v })
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => trackAmplitude(`${eventPrefix}_progress`, { percent: 100 })}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Écouter'}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-black shadow-lg transition hover:brightness-110 ${ACCENT_BG[accent]}`}
        >
          {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" />}
        </button>
        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={Math.max(duration, 1)}
            step={1}
            value={Math.min(time, duration || time)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Position de lecture"
            className={`w-full ${ACCENT_SLIDER[accent]}`}
          />
          <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
            <span>{formatClock(time)}</span>
            <span>{duration ? formatClock(duration) : fallbackDuration}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {SPEEDS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => chooseSpeed(v)}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${v === speed ? `${ACCENT_BG[accent]} text-black` : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {String(v).replace('.', ',')}x
            </button>
          ))}
        </div>
      </div>
      {!started && resumeAt > 10 && (
        <p className="mt-2 text-center text-xs text-neutral-400">Reprendre là où tu t’es arrêté ({formatClock(resumeAt)})</p>
      )}
      <p className="mt-2 text-center text-[11px] text-neutral-500">
        L’audio continue en arrière-plan : tu peux verrouiller ton téléphone.
      </p>
    </div>
  )
}

/* ------------------------------------------------------- */
/* Version texte : le script scannable, position retenue    */
/* ------------------------------------------------------- */

export type TextSection = {
  id: string
  title: string
  body: ReactNode
  /** Un CTA (celui de la page) se place après cette section. */
  ctaAfter?: boolean
}

export function TextVersionSection({
  sections,
  storageKey,
  eventPrefix,
  accent,
  heading,
  intro,
  renderCta,
}: {
  sections: TextSection[]
  /** Clé localStorage de la position de lecture. */
  storageKey: string
  eventPrefix: string
  accent: Accent
  heading: string
  intro: string
  /** Le CTA de la page, replacé aux mêmes moments que dans la vidéo. */
  renderCta: (location: string) => ReactNode
}) {
  const articleRef = useRef<HTMLDivElement>(null)
  const sentRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const el = articleRef.current
    if (!el) return
    const saved = Number(readStore(storageKey)) || 0
    const top = el.getBoundingClientRect().top + window.scrollY
    if (saved > 300) {
      window.scrollTo({ top: top + saved - 140, behavior: 'auto' })
    } else {
      window.scrollTo({ top: top - 90, behavior: 'smooth' })
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const rect = el.getBoundingClientRect()
        const total = Math.max(el.scrollHeight - window.innerHeight * 0.6, 1)
        const offset = Math.min(Math.max(-rect.top + 140, 0), el.scrollHeight)
        if (offset > 0) writeStore(storageKey, String(Math.round(offset)))
        const pct = (offset / total) * 100
        for (const mark of PROGRESS_MARKS) {
          if (pct >= mark && !sentRef.current.has(mark)) {
            sentRef.current.add(mark)
            trackAmplitude(`${eventPrefix}_progress`, { percent: mark })
          }
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [storageKey, eventPrefix])

  return (
    <section id="version-texte" className="relative py-10 md:py-14">
      <div ref={articleRef} className="container mx-auto max-w-2xl px-4">
        <p className={`mb-2 text-sm font-semibold uppercase tracking-wide ${ACCENT_TEXT[accent]}`}>Version texte</p>
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">{heading}</h2>
        <p className="mb-8 text-sm text-neutral-400">{intro}</p>
        {sections.map((s) => (
          <div key={s.id}>
            <h3 id={s.id} className="mb-3 mt-10 text-xl font-bold text-white md:text-2xl">
              {s.title}
            </h3>
            {s.body}
            {s.ctaAfter && <div className="my-10">{renderCta(`text_${s.id}`)}</div>}
          </div>
        ))}
        <div className="mt-12">{renderCta('text_end')}</div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------- */
/* Exit popup : « pas le temps ? lis-la ou écoute-la »    */
/* ----------------------------------------------------- */

/**
 * Détecte l'intention de sortie : souris vers le haut de la fenêtre (desktop)
 * ou remontée rapide après avoir scrollé (mobile). Une fois par session.
 */
export function useExitIntent({
  enabled,
  sessionKey,
  onTrigger,
  armDelayMs = 8000,
}: {
  enabled: boolean
  sessionKey: string
  onTrigger: () => void
  armDelayMs?: number
}) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    try {
      if (window.sessionStorage.getItem(sessionKey)) return
    } catch {
      // navigation privée : la popup peut se remontrer, pas grave
    }

    let armed = false
    const armTimer = window.setTimeout(() => {
      armed = true
    }, armDelayMs)

    const fire = () => {
      if (!armed || firedRef.current) return
      firedRef.current = true
      try {
        window.sessionStorage.setItem(sessionKey, '1')
      } catch {
        /* idem */
      }
      onTrigger()
    }

    // Desktop : la souris quitte la fenêtre par le haut (vers l'onglet / la barre d'URL).
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) fire()
    }

    // Mobile : il a scrollé, puis remonte vite (geste de sortie / retour en haut).
    let lastY = window.scrollY
    let maxY = window.scrollY
    let upRun = 0
    const onScroll = () => {
      const y = window.scrollY
      maxY = Math.max(maxY, y)
      if (y < lastY) upRun += lastY - y
      else upRun = 0
      lastY = y
      if (maxY > 700 && upRun > 450 && y < 400) fire()
    }

    document.addEventListener('mouseout', onMouseOut)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(armTimer)
      document.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled, sessionKey, onTrigger, armDelayMs])
}

export function ExitFormatsPopup({
  open,
  accent,
  title,
  subtitle,
  readTitle,
  readSub,
  listenTitle,
  listenSub,
  onPick,
  onClose,
  gate,
}: {
  open: boolean
  accent: Accent
  title: string
  subtitle: string
  readTitle: string
  readSub: string
  listenTitle: string
  listenSub: string
  onPick: (kind: 'text' | 'audio') => void
  onClose: () => void
  /** Porte email à afficher par-dessus la carte (même porte que la vidéo). */
  gate?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const options = [
    { kind: 'text' as const, Icon: BookOpen, t: readTitle, sub: readSub },
    { kind: 'audio' as const, Icon: Headphones, t: listenTitle, sub: listenSub },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0d0d0d] p-6 sm:p-8 ${ACCENT_GLOW[accent]}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${ACCENT_TEXT[accent]}`}>Avant de partir</p>
        <h3 className="mb-1 text-xl font-bold text-white sm:text-2xl">{title}</h3>
        <p className="mb-5 text-sm text-neutral-400">{subtitle}</p>
        <div className="flex flex-col gap-3">
          {options.map(({ kind, Icon, t, sub }) => (
            <button
              key={kind}
              type="button"
              onClick={() => onPick(kind)}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black ${ACCENT_BG[accent]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-white">{t}</span>
                <span className="block text-sm text-neutral-400">{sub}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-neutral-500 transition hover:text-neutral-300"
        >
          Non merci, je reste sur la vidéo
        </button>
        {gate}
      </div>
    </div>
  )
}
