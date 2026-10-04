'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Play, Check, Calendar, ArrowRight, ChevronDown } from 'lucide-react'
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

function useYouTubeProgress(playing: boolean) {
  const playerRef = useRef<any>(null)
  const sentRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!playing) return
    let timer: ReturnType<typeof setInterval> | undefined

    const attach = () => {
      if (!window.YT?.Player || playerRef.current) return
      playerRef.current = new window.YT.Player('vsl-player', {
        events: {
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              trackAmplitude('vsl_video_progress', { percent: 100 })
            }
          },
        },
      })
      timer = setInterval(() => {
        const p = playerRef.current
        if (!p?.getDuration) return
        const duration = p.getDuration()
        if (!duration) return
        const pct = (p.getCurrentTime() / duration) * 100
        for (const mark of PROGRESS_MARKS) {
          if (pct >= mark && !sentRef.current.has(mark)) {
            sentRef.current.add(mark)
            trackAmplitude('vsl_video_progress', { percent: mark })
          }
        }
      }, 3000)
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
  }, [playing])
}

function VideoPlayer() {
  const [playing, setPlaying] = useState(false)
  useYouTubeProgress(playing)

  const start = () => {
    setPlaying(true)
    trackAmplitude('vsl_video_played')
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_0_60px_-12px_rgb(var(--empire-rgb)_/_0.25)]">
      {playing ? (
        <>
          <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
          <iframe
            id="vsl-player"
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title={VIDEO_TITLE}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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
