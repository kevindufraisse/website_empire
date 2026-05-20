'use client'

import { useEffect, useState, useCallback } from 'react'
import { ArrowRight, Calendar, Clock, Play, Users } from 'lucide-react'

const WEBINAR_START = new Date('2026-06-18T19:00:00+02:00')
const WEBINAR_END = new Date('2026-06-18T20:30:00+02:00')
const REPLAY_DEADLINE = new Date(WEBINAR_END.getTime() + 48 * 3600 * 1000)
const DOORS_OPEN_BEFORE_MS = 5 * 60 * 1000

const LIVE_STREAM_URL = process.env.NEXT_PUBLIC_WEBINAR_LIVE_URL || ''
const REPLAY_URL = process.env.NEXT_PUBLIC_WEBINAR_REPLAY_URL || ''

type LiveState = 'before' | 'doors-open' | 'live' | 'replay' | 'expired'

function getState(now: number): LiveState {
  const start = WEBINAR_START.getTime()
  const end = WEBINAR_END.getTime()
  const replayEnd = REPLAY_DEADLINE.getTime()
  if (now >= replayEnd) return 'expired'
  if (now >= end) return 'replay'
  if (now >= start) return 'live'
  if (now >= start - DOORS_OPEN_BEFORE_MS) return 'doors-open'
  return 'before'
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
            <span>Reviens sur cette page 5 min avant pour rejoindre la salle.</span>
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
        Le live démarre dans quelques minutes. Reste sur cette page - tu seras redirigé automatiquement.
      </p>
      <CountdownBig />
      {LIVE_STREAM_URL && (
        <a
          href={LIVE_STREAM_URL}
          className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-black text-base hover:bg-empire/90 transition-colors"
        >
          <Play size={18} /> Rejoindre la salle d'attente
        </a>
      )}
    </div>
  )
}

function LiveView() {
  if (!LIVE_STREAM_URL) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <StateBadge state="live" />
        <h1 className="text-3xl md:text-5xl font-black text-white mt-6 leading-tight">
          Le live a commencé
        </h1>
        <p className="text-neutral-400 mt-3 mb-8 text-sm md:text-base">
          Le lien du live va apparaître ici dans quelques instants. Rafraîchis la page si tu ne le vois pas.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-center mb-5">
        <StateBadge state="live" />
      </div>
      <h1 className="text-2xl md:text-4xl font-black text-white text-center mb-2 leading-tight">
        Les secrets des gourous - En direct
      </h1>
      <p className="text-neutral-400 text-center text-sm md:text-base mb-8">
        Si la vidéo ne charge pas,{' '}
        <a href={LIVE_STREAM_URL} target="_blank" rel="noopener noreferrer" className="text-empire underline hover:no-underline">
          ouvre le live dans un nouvel onglet
        </a>
        .
      </p>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
        <iframe
          src={LIVE_STREAM_URL}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
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
      <section className="relative w-full pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
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
