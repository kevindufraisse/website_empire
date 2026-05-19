'use client'

import { useRef, useState, useEffect, useCallback, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X, Play, Users, Clock, ArrowRight, Quote, Zap, Target, Tv, BookOpen, Mic, Phone, Loader2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const CTA_LINK = '#inscription'

const WEBINAR_DATE = new Date('2026-06-10T19:00:00+02:00')

const PERSONALITIES = [
  { name: 'Idriss Aberkane', role: 'Essayiste · Conférencier', img: '/webinar/idriss-aberkane.jpg' },
  { name: 'Anthony Bourbon', role: 'Fondateur Feed · Blast Club', img: '/webinar/anthony-bourbon.jpg' },
  { name: 'Oussama Ammar', role: 'Co-fondateur The Family', img: '/webinar/oussama-ammar.jpg' },
  { name: 'Kevin Dufraisse', role: 'Fondateur Empire Internet', img: '/founders/kevin.jpg', self: true },
]

const HERO_BULLETS = [
  { text: 'Pourquoi certains deviennent des phénomènes (et pas toi)' },
  { text: 'Le décryptage complet de La Méthode Gourou' },
  { text: 'Comment l\'appliquer à ton business sans devenir un imposteur' },
]

/* ── Utilities ── */

function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
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
  const [time, setTime] = useState(calc)

  useEffect(() => {
    setMounted(true)
    setTime(calc)
    const id = setInterval(() => setTime(calc), 1000)
    return () => clearInterval(id)
  }, [calc])

  return { ...time, mounted }
}

function CountdownTimer({ compact }: { compact?: boolean }) {
  const { mounted, ...t } = useCountdown(WEBINAR_DATE)
  const pad = (n: number) => String(n).padStart(2, '0')
  const placeholder = '--'

  if (compact) {
    return (
      <div className="flex items-center gap-1 font-mono text-sm font-bold text-empire tabular-nums">
        {mounted && t.days > 0 && <><span>{t.days}j</span><span className="text-empire/50">:</span></>}
        <span>{mounted ? pad(t.hours) : placeholder}</span><span className="text-empire/50">:</span>
        <span>{mounted ? pad(t.minutes) : placeholder}</span><span className="text-empire/50">:</span>
        <span>{mounted ? pad(t.seconds) : placeholder}</span>
      </div>
    )
  }

  const blocks = mounted
    ? [
        ...(t.days > 0 ? [{ v: pad(t.days), l: 'jours' }] : []),
        { v: pad(t.hours), l: 'heures' },
        { v: pad(t.minutes), l: 'min' },
        { v: pad(t.seconds), l: 'sec' },
      ]
    : [
        { v: placeholder, l: 'jours' },
        { v: placeholder, l: 'heures' },
        { v: placeholder, l: 'min' },
        { v: placeholder, l: 'sec' },
      ]

  return (
    <div className="flex items-center justify-center gap-2">
      {blocks.map((b, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center font-mono text-xl md:text-2xl font-black text-empire tabular-nums">
            {b.v}
          </span>
          <span className="text-[9px] text-neutral-500 mt-1 uppercase tracking-wider">{b.l}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Phone country codes ── */

const COUNTRY_CODES = [
  { flag: '🇫🇷', code: '+33', name: 'France' },
  { flag: '🇧🇪', code: '+32', name: 'Belgique' },
  { flag: '🇨🇭', code: '+41', name: 'Suisse' },
  { flag: '🇨🇦', code: '+1', name: 'Canada' },
  { flag: '🇱🇺', code: '+352', name: 'Luxembourg' },
  { flag: '🇲🇦', code: '+212', name: 'Maroc' },
  { flag: '🇹🇳', code: '+216', name: 'Tunisie' },
  { flag: '🇨🇮', code: '+225', name: "Côte d'Ivoire" },
  { flag: '🇸🇳', code: '+221', name: 'Sénégal' },
]

/* ── Registration Form ── */

function RegistrationForm({ id }: { id?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState('+33')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const prenom = (form.elements.namedItem('prenom') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const phoneRaw = (form.elements.namedItem('telephone') as HTMLInputElement).value.trim()
    const telephone = phoneRaw ? `${countryCode}${phoneRaw}` : ''

    try {
      const res = await fetch('/api/webinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, email, telephone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }
      router.push('/webinar/merci')
    } catch {
      setError('Erreur réseau, réessaie.')
      setLoading(false)
    }
  }

  return (
    <div id={id} className="relative">
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/[0.12]"
      >
        {/* Top "ticket" band - live + compact countdown */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[11px] font-bold text-white tracking-wide uppercase">10 juin · 19h</span>
          </div>
          <CountdownTimer compact />
        </div>

        <div className="p-5">
          {/* Title inside the form */}
          <div className="mb-4 text-center">
            <p className="text-lg font-extrabold text-white leading-tight">Réserve ta place gratuite</p>
            <div className="flex items-center justify-center gap-3 mt-1.5">
              <span className="text-[10px] text-neutral-400">90 min en live</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="text-[10px] text-neutral-400">Replay 48h</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="text-[10px] text-empire font-bold">100% gratuit</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              name="prenom"
              required
              placeholder="Ton prénom"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-empire/50 focus:ring-1 focus:ring-empire/30 transition-colors"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Ton email"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-empire/50 focus:ring-1 focus:ring-empire/30 transition-colors"
            />
            <div>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-[95px] px-2 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-empire/50 cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-neutral-900">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Numéro (optionnel)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-empire/50 focus:ring-1 focus:ring-empire/30 transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 pl-1">
                <Phone size={11} className="text-empire/70" />
                <p className="text-[10px] text-neutral-300">
                  <span className="text-empire font-semibold">Bonus VIP</span> + rappels par SMS <span className="text-neutral-500">(pas de spam)</span>
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 px-1 mt-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl bg-empire text-black font-black text-base flex items-center justify-center gap-2 transition-colors hover:bg-empire/90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Inscription en cours...</>
            ) : (
              <>Réserver ma place gratuite <ArrowRight size={17} /></>
            )}
          </button>

          <p className="text-[10px] text-neutral-500 text-center mt-2">
            500 places en live · premier arrivé, premier servi
          </p>

          {/* Trust line under CTA */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <Lock size={10} className="text-neutral-600" />
            <p className="text-[10px] text-neutral-500">Tes infos restent privées · Désinscription en 1 clic</p>
          </div>
        </div>
      </form>
    </div>
  )
}

function CTAButton({ large, className }: { large?: boolean; className?: string }) {
  return (
    <a
      href={CTA_LINK}
      className={cn(
        'inline-flex items-center justify-center gap-2 bg-empire text-black font-bold rounded-xl transition-colors hover:bg-empire/90',
        large ? 'px-10 py-5 text-lg' : 'px-8 py-4 text-base',
        className
      )}
    >
      Oui, je réserve ma place
      <ArrowRight size={large ? 20 : 18} />
    </a>
  )
}

/* ── SVG Logos ── */

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function SectionDivider() {
  return (
    <div className="relative w-full bg-black">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-empire/20 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-empire/40" />
          <div className="flex-1 h-px bg-gradient-to-r from-empire/20 via-empire/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}

function CredibilityStrip() {
  const logos = [
    { name: 'BFM', icon: <Tv size={14} /> },
    { name: 'Nouvel Obs', icon: <BookOpen size={14} /> },
  ]
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap opacity-70">
        {logos.map((l) => (
          <div key={l.name} className="flex items-center gap-1 text-neutral-400">
            {l.icon}
            <span className="text-[10px] font-bold tracking-wider uppercase">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HERO - Split layout: left (headline + bullets) / right (form)
   ═══════════════════════════════════════════════════════════════ */
/* Russell-Brunson-style helpers */

/** Yellow highlighter underline. Hand-drawn SVG underline behind the text. */
function Highlight({ children, color = 'yellow' }: { children: React.ReactNode; color?: 'yellow' | 'empire' | 'red' }) {
  const colorMap: Record<string, string> = {
    yellow: 'rgba(250, 204, 21, 0.45)',
    empire: 'rgba(218, 252, 104, 0.45)',
    red: 'rgba(248, 113, 113, 0.45)',
  }
  return (
    <span
      className="relative inline-block"
      style={{
        backgroundImage: `linear-gradient(180deg, transparent 60%, ${colorMap[color]} 60%, ${colorMap[color]} 92%, transparent 92%)`,
        paddingInline: '0.1em',
      }}
    >
      {children}
    </span>
  )
}

function HeroSection() {
  return (
    <section className="relative w-full pt-16 md:pt-20 pb-6 md:pb-8 bg-black">
      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-6 lg:gap-10 items-start">

          {/* LEFT: headline + content */}
          <div className="py-2 md:py-4">
            <span className="text-[11px] font-black text-empire tracking-[0.2em] uppercase">
              Webinar gratuit · Mer. 10 juin · 19h
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-extrabold leading-[1.1] mt-3 mb-4">
              La Méthode <span className="text-empire">Gourou</span><span className="text-red-400/70 text-[0.5em] align-super ml-0.5">*</span>
            </h1>

            <p className="text-base lg:text-lg text-neutral-300 mb-6 leading-relaxed max-w-lg">
              Pourquoi certains entrepreneurs deviennent des phénomènes pendant que 99% restent invisibles - et comment appliquer <Highlight color="yellow">les mêmes techniques</Highlight> à ton business.
            </p>

            {/* Bullets */}
            <div className="space-y-3 mb-7">
              {HERO_BULLETS.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="rounded-full bg-empire flex items-center justify-center flex-shrink-0 mt-0.5" style={{ width: 20, height: 20 }}>
                    <Check size={11} className="text-black" strokeWidth={3.5} />
                  </div>
                  <span className="text-sm md:text-base text-neutral-200 leading-snug">{b.text}</span>
                </div>
              ))}
            </div>

            {/* GRATUIT + value anchor */}
            <div className="flex items-center gap-4 mb-6">
              <div className="transform -rotate-[6deg]">
                <div className="px-3 py-1 border-2 border-red-500 rounded bg-red-500/5">
                  <span className="text-red-500 font-black text-sm tracking-widest" style={{ fontFamily: 'Impact, sans-serif' }}>
                    100% GRATUIT
                  </span>
                </div>
              </div>
            </div>

            {/* Hosts + "Vu sur" */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2 flex-shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-empire/50 z-10">
                    <img src="/founders/kevin.jpg" alt="Kevin" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-empire/50">
                    <img src="/founders/marc.jpg" alt="Marc" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-xs text-neutral-400">Kevin & Marc Dufraisse</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 opacity-60">
                <span className="text-[9px] text-neutral-500 uppercase tracking-wider">Vu sur</span>
                <CredibilityStrip />
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 mt-2.5">
              Top 50 LinkedIn France - 700M vues - 4 000 clients
            </p>
          </div>

          {/* RIGHT: form sticky */}
          <div className="md:sticky md:top-20">
            <RegistrationForm id="inscription" />
          </div>
        </div>

        {/* Personality strip inline */}
        <div className="mt-8">
          <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-bold mb-3">
            On va décortiquer leurs techniques
          </p>
          <div
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STRIP_FACES.map((p, i) => (
              <div key={i} className="relative flex-shrink-0 w-[90px] md:w-[110px] snap-center group text-center">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  {p.img ? (
                    <>
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }}
                      />
                      <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center hidden absolute inset-0', p.gradient || 'from-neutral-800 to-neutral-900')}>
                        <span className="text-2xl font-black text-white/30">{p.initials}</span>
                      </div>
                    </>
                  ) : (
                    <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', p.gradient || 'from-neutral-800 to-neutral-900')}>
                      <span className="text-2xl font-black text-white/30">{p.initials}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {p.self && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-empire rounded text-[7px] font-black text-black uppercase tracking-wider">
                      Host
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-1.5">
                    <p className="text-[9px] font-bold text-white leading-tight drop-shadow-lg truncate">{p.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div id="disclaimer" className="mt-6 scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 max-w-3xl">
          <p className="text-xs text-neutral-400 leading-relaxed">
            <span className="text-red-400 font-bold">*</span> <span className="text-neutral-300 font-semibold">Disclaimer obligatoire :</span> nous ne sommes pas responsables de ce que tu feras avec les techniques enseignées dans ce webinar. Chacun a son libre arbitre. Notre intérêt est d'aider les personnes avec un produit qui apporte de la vraie valeur à leurs clients à se faire connaître à travers les réseaux sociaux.{' '}
            <a href="#legal" className="text-neutral-500 underline hover:text-white transition-colors">Mention légale</a>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PERSONALITY STRIP - horizontal scroll with big images
   ═══════════════════════════════════════════════════════════════ */
const STRIP_FACES: { name: string; img?: string; initials?: string; gradient?: string; self?: boolean }[] = [
  { name: 'Idriss Aberkane', img: '/webinar/idriss-aberkane.jpg' },
  { name: 'Anthony Bourbon', img: '/webinar/anthony-bourbon.jpg' },
  { name: 'Oussama Ammar', img: '/webinar/oussama-ammar.jpg' },
  { name: 'Léna Situations', img: '/webinar/lena-situations.jpg', initials: 'LS', gradient: 'from-pink-900 to-purple-900' },
  { name: 'Squeezie', img: '/webinar/squeezie.jpg', initials: 'SQ', gradient: 'from-blue-900 to-indigo-900' },
  { name: 'Hugo Décrypte', img: '/webinar/hugo-decrypte.jpg', initials: 'HD', gradient: 'from-red-900 to-rose-900' },
  { name: 'Yomi Denzel', img: '/webinar/yomi-denzel.jpg', initials: 'YD', gradient: 'from-amber-900 to-orange-900' },
  { name: 'Kevin Dufraisse', img: '/founders/kevin.jpg', self: true },
]

/* ═══════════════════════════════════════════════════════════════
   WHY SECTION - SMS / iMessage conversation style
   ═══════════════════════════════════════════════════════════════ */

const WHY_MESSAGES: { from: 'kevin' | 'marc'; text: string; highlight?: boolean }[] = [
  { from: 'kevin', text: 'On va être honnêtes.' },
  { from: 'kevin', text: 'On voit tous les jours des entrepreneurs avec des produits incroyables qui n\'arrivent pas à se faire connaître.' },
  { from: 'kevin', text: 'Ils ont le talent, l\'expertise, la valeur réelle.' },
  { from: 'marc', text: 'Mais personne ne sait qu\'ils existent.' },
  { from: 'kevin', text: 'Et de l\'autre côté tu as des gens avec des produits moyens (voire nuls) qui utilisent certaines techniques de visibilité' },
  { from: 'marc', text: 'Et qui deviennent des phénomènes.' },
  { from: 'marc', text: 'Qui raflent les clients. Qui remplissent les salles. Qui signent les contrats.' },
  { from: 'kevin', text: 'Le problème c\'est pas le talent.', highlight: true },
  { from: 'kevin', text: 'C\'est que les techniques qui marchent ne sont enseignées nulle part.' },
  { from: 'marc', text: 'Du coup on a décidé de faire ce webinar pour rééquilibrer les forces.' },
  { from: 'kevin', text: 'On va décortiquer les techniques exactes des personnalités les plus visibles.' },
  { from: 'marc', text: 'Dans les médias, en politique, sur les réseaux sociaux.' },
  { from: 'kevin', text: 'Et te montrer comment les utiliser pour ton business.' },
  { from: 'kevin', text: 'Ces techniques entre les mains de quelqu\'un d\'honnête = la combinaison la plus puissante du marché.', highlight: true },
]

function WhySection() {
  return (
    <section className="relative w-full py-16 md:py-24 bg-[#060606] overflow-hidden">
      <div className="container relative z-10 max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-sm text-empire mb-3 tracking-widest uppercase font-bold">Pourquoi ce webinar</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              On en a marre de voir{' '}
              <span className="text-empire">les mauvais gagner</span>
            </h2>
          </div>
        </FadeIn>

        {/* iMessage-style conversation */}
        <div className="space-y-3 px-2">
          {WHY_MESSAGES.map((msg, i) => {
            const isKevin = msg.from === 'kevin'
            const avatar = isKevin ? '/founders/kevin.jpg' : '/founders/marc.jpg'
            const name = isKevin ? 'Kevin' : 'Marc'
            const showAvatar = i === 0 || WHY_MESSAGES[i - 1].from !== msg.from

            return (
              <FadeIn key={i}>
                <div className={cn('flex items-end gap-2', isKevin ? 'justify-start' : 'justify-end')}>
                  {isKevin && (
                    <div className="flex-shrink-0 w-7 h-7">
                      {showAvatar ? (
                        <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover" />
                      ) : <div className="w-7" />}
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] px-4 py-2.5 text-sm leading-relaxed',
                      isKevin
                        ? 'bg-neutral-800 rounded-2xl rounded-bl-md text-neutral-200'
                        : 'bg-empire/20 rounded-2xl rounded-br-md text-neutral-200',
                      msg.highlight && isKevin && 'bg-white/10 text-white font-semibold',
                      msg.highlight && !isKevin && 'bg-empire/30 text-white font-semibold',
                    )}
                  >
                    {msg.text}
                  </div>
                  {!isKevin && (
                    <div className="flex-shrink-0 w-7 h-7">
                      {showAvatar ? (
                        <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover bg-neutral-800" />
                      ) : <div className="w-7" />}
                    </div>
                  )}
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   3 KEYS SECTION
   ═══════════════════════════════════════════════════════════════ */
function KeysSection() {
  const keys = [
    {
      number: '01',
      title: 'Pourquoi certaines personnes deviennent des phénomènes (et pas toi)',
      description: 'Pourquoi nos cerveaux sont câblés pour suivre ceux qui polarisent - et pourquoi essayer de plaire à tout le monde te rend invisible.',
      visual: (
        <div className="flex items-center -space-x-3">
          {PERSONALITIES.slice(0, 3).map((p, i) => (
            <div key={i} className="w-10 h-10 rounded-full overflow-hidden border-2 border-black ring-1 ring-white/10">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-xs font-bold text-neutral-400 ring-1 ring-white/10">+</div>
        </div>
      ),
    },
    {
      number: '02',
      title: 'Ce que font les plus gros créateurs-entrepreneurs (et ce que tu ne fais pas)',
      description: 'Leur hook, leur storytelling, leur fréquence, leur positionnement clivant. On décortique les mécaniques exactes qui transforment un post en machine à clients.',
      visual: (
        <div className="flex items-center gap-2 flex-wrap">
          {['Hook', 'Storytelling', 'Fréquence', 'Positionnement clivant'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-empire/10 border border-empire/20 text-[10px] font-bold text-empire tracking-wide">{tag}</span>
          ))}
        </div>
      ),
    },
    {
      number: '03',
      title: 'Comment appliquer ça à ton business (sans devenir un imposteur)',
      description: 'Le système Empire Internet pour transformer des profils inconnus en références de leur niche. Ces techniques marchent dans tous les secteurs - de la tech au coaching en passant par la finance et le conseil. Avec un cas concret.',
      visual: (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-400">?</div>
            <span className="text-xs text-neutral-400">Inconnu</span>
          </div>
          <ArrowRight size={14} className="text-empire" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-empire/10 border border-empire/20">
            <div className="w-6 h-6 rounded-full bg-empire/20 flex items-center justify-center text-[8px] font-bold text-empire">★</div>
            <span className="text-xs text-empire font-semibold">Référence</span>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="relative w-full py-20 md:py-32 bg-[#080808]">
      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center mb-6">
            <p className="text-sm text-empire mb-3 tracking-widest uppercase font-bold">Ce que tu vas découvrir</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              3 secrets décortiqués <span className="text-empire">en 90 minutes</span>
            </h2>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto mt-12 md:mt-16 grid gap-6 md:gap-8">
          {keys.map((key, i) => (
            <FadeIn key={i}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-5 md:gap-7">
                    <div className="flex-shrink-0">
                      <div className="text-5xl md:text-6xl font-black text-empire/80 leading-none tabular-nums">
                        {key.number}
                      </div>
                      <div className="mt-1.5">
                        <span className="text-[10px] font-black text-empire tracking-[0.2em]">SECRET</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">{key.title}</h3>
                      <p className="text-sm md:text-base text-neutral-400 leading-relaxed mb-4">{key.description}</p>
                      {key.visual}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className="text-center text-lg md:text-xl text-neutral-200 font-semibold mt-14 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ces techniques entre les mains de quelqu&apos;un d&apos;honnête = <span className="text-empire">la combinaison la plus puissante du marché.</span>
          </p>
          <div className="text-center">
            <CTAButton large />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════════════ */
function AboutSection() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-[#0a0a0a]">
      <div className="container relative z-10 max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-sm text-empire mb-3 tracking-widest uppercase font-bold">Qui on est</p>
            <h2 className="text-3xl md:text-5xl font-bold">Kevin & Marc Dufraisse</h2>
            <p className="text-neutral-400 mt-3 text-lg">4 ans à tester 1000 techniques marketing. Aujourd'hui :</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          <FadeIn className="md:col-span-2">
            <div className="relative mx-auto md:mx-0 flex gap-3 justify-center md:justify-start">
              <div className="relative aspect-[3/4] w-[45%] max-w-[160px] rounded-2xl overflow-hidden border border-white/10">
                <img src="/founders/kevin.jpg" alt="Kevin Dufraisse" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-[10px] font-bold text-white">Kevin</p>
                  <p className="text-[8px] text-neutral-400">Fondateur</p>
                </div>
              </div>
              <div className="relative aspect-[3/4] w-[45%] max-w-[160px] rounded-2xl overflow-hidden border border-white/10 mt-6">
                <img src="/founders/marc.jpg" alt="Marc Dufraisse" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-[10px] font-bold text-white">Marc</p>
                  <p className="text-[8px] text-neutral-400">Co-fondateur</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                  <LinkedInLogo className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center">
                  <YouTubeLogo className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                  <InstagramLogo className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-black border border-white/20 flex items-center justify-center">
                  <TikTokLogo className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="md:col-span-3">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
                  <div className="text-2xl md:text-3xl font-black text-empire mb-1">Top 50</div>
                  <div className="text-xs text-neutral-400">LinkedIn France</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
                  <div className="text-2xl md:text-3xl font-black text-empire mb-1">700M</div>
                  <div className="text-xs text-neutral-400">vues cumulées</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
                  <div className="text-2xl md:text-3xl font-black text-empire mb-1">3M€</div>
                  <div className="text-xs text-neutral-400">générés via le contenu</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center">
                  <div className="text-2xl md:text-3xl font-black text-empire mb-1">4 000</div>
                  <div className="text-xs text-neutral-400">clients accompagnés</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-start gap-3">
                  <div className="flex -space-x-1 flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center"><YouTubeLogo className="h-3 w-3 text-white" /></div>
                    <div className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center"><LinkedInLogo className="h-3 w-3 text-white" /></div>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    <span className="text-white font-medium">Top 2 YouTube France</span> en marketing. 80+ dirigeants accompagnés. 19 000 abonnés newsletter à 30% d'ouverture.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-empire/5 border border-empire/15">
                <p className="text-sm text-empire font-semibold">
                  Et oui - on utilise La Méthode Gourou sur nous-mêmes. C'est aussi pour ça qu'on peut l'enseigner honnêtement.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CASE STUDY
   ═══════════════════════════════════════════════════════════════ */
function CaseStudySection() {
  const mediaResults = [
    { text: 'Invitée chez France 2', icon: <Tv size={16} />, highlight: true },
    { text: 'Citée dans Cosmopolitan', icon: <BookOpen size={16} />, highlight: true },
    { text: 'Magazines, podcasts, médias mainstream', icon: <Mic size={16} />, highlight: false },
    { text: 'LA référence française arrêt alcool < 12 mois', icon: <Target size={16} />, highlight: false },
  ]

  return (
    <section className="relative w-full py-20 md:py-32 bg-black">
      <div className="container relative z-10 max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-sm text-empire mb-3 tracking-widest uppercase font-bold">Cas client</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              La preuve que ça marche <span className="text-empire">pour les inconnus</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.1] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col items-center justify-center text-center md:border-r border-white/[0.06]">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-empire/30 mb-4">
                  <img src="/webinar/thefrenchsober-logo.jpg" alt="thefrenchsober" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Lorraine Vallery-Radot</h3>
                <p className="text-xs text-empire font-medium mb-4">@thefrenchsober</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Tv size={12} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-neutral-300">France 2</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <BookOpen size={12} className="text-pink-400" />
                    <span className="text-[10px] font-bold text-neutral-300">Cosmopolitan</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 p-6 md:p-8">
                <p className="text-sm text-empire font-bold mb-3 tracking-wider uppercase">De zéro à France 2 avec un seul post</p>
                <div className="space-y-3 mb-6">
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Lorraine partait de rien. Aucune notoriété. Aucune audience. Aucun réseau dans les médias. Elle a appliqué les principes de La Méthode Gourou sur <span className="text-white font-semibold">un seul post LinkedIn</span>.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {mediaResults.map((r, i) => (
                    <div key={i} className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-lg',
                      r.highlight ? 'bg-empire/8 border border-empire/15' : 'bg-white/[0.03] border border-white/[0.06]'
                    )}>
                      <span className={r.highlight ? 'text-empire' : 'text-neutral-500'}>{r.icon}</span>
                      <span className="text-xs text-neutral-200 font-medium">{r.text}</span>
                    </div>
                  ))}
                </div>
                <div className="relative p-4 rounded-xl bg-black/40 border border-white/[0.08]">
                  <Quote size={16} className="text-empire/40 absolute top-3 left-3" />
                  <p className="text-sm text-neutral-200 italic leading-relaxed pl-5">
                    "Un seul post a tout changé. Maintenant je suis sollicitée par des médias que je n'aurais jamais osé contacter."
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 pl-5">- Lorraine Vallery-Radot</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="text-center mt-10">
            <CTAButton large />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FOR WHO
   ═══════════════════════════════════════════════════════════════ */
function ForWhoSection() {
  const forYou = [
    'Tu es entrepreneur, consultant, coach ou expert avec un vrai produit',
    'Tu sens que tu mérites plus de visibilité que tu n\'en as',
    'Tu es fasciné (et un peu agacé) par les personnalités qui dominent leur marché',
    'Tu veux apprendre les techniques que personne n\'ose enseigner',
    'Tu refuses de devenir un imposteur mais tu veux les leviers des meilleurs',
  ]
  const notForYou = [
    'Tu cherches un cours de "personal branding gentil"',
    'Tu penses que la polarisation est immorale par principe',
    'Tu n\'as pas encore de produit ou service à proposer',
    'Tu veux des techniques pour arnaquer - on ne joue pas à ce jeu',
  ]

  return (
    <section className="relative w-full py-20 md:py-32 bg-[#060606]">
      <div className="container relative z-10 max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-sm text-empire mb-3 tracking-widest uppercase font-bold">Pour qui</p>
            <h2 className="text-3xl md:text-5xl font-bold">Ce webinar est pour toi si</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn>
            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-empire/15 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-empire/20 flex items-center justify-center"><Check size={16} className="text-empire" /></div>
                <h3 className="text-lg font-bold text-empire">C'est pour toi</h3>
              </div>
              <div className="space-y-3">
                {forYou.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-empire mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-200 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-red-500/10 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center"><X size={16} className="text-red-400" /></div>
                <h3 className="text-lg font-bold text-red-400">Reste pas si</h3>
              </div>
              <div className="space-y-3">
                {notForYou.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <X size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const faqs = [
    { q: 'Le webinar est gratuit ?', a: 'Oui. 100% gratuit. Pas de carte bancaire pour s\'inscrire.' },
    { q: 'Y aura-t-il un replay ?', a: 'Un replay 48h est disponible uniquement pour les inscrits ayant assisté à au moins la moitié du live. Si tu n\'es pas là, tu n\'as pas accès au replay.' },
    { q: 'Vous allez vendre quelque chose ?', a: 'Oui. À la fin, on présente Empire Internet - le système qu\'on a construit pour appliquer La Méthode Gourou à grande échelle. Tu achètes ou pas. Aucune pression.' },
    { q: 'C\'est légal de citer ces personnes ?', a: 'Oui, dans le cadre d\'une analyse critique éducative (droit français). Voir la mention légale en bas de page.' },
    { q: '"Méthode Gourou" - c\'est éthique ?', a: 'Le mot "gourou" est volontairement direct. La méthode n\'a rien de manipulateur. On parle de techniques marketing publiques, observables, analysables, applicables à n\'importe quel entrepreneur honnête qui veut être vu pour ce qu\'il vaut.' },
    { q: 'Combien de temps dure le webinar ?', a: '90 minutes + 15 minutes de Q&A.' },
  ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-[#080808]">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Questions</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">FAQ</h2>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="space-y-2.5">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div key={i} className={cn(
                    'rounded-xl border overflow-hidden',
                    isOpen ? 'bg-white/[0.06] border-empire/30' : 'bg-white/[0.03] border-white/10'
                  )}>
                    <button onClick={() => setOpenIndex(isOpen ? null : i)} className="w-full p-5 flex items-center justify-between text-left min-h-[52px]">
                      <h3 className={cn('text-base md:text-lg font-semibold pr-3', isOpen ? 'text-empire' : 'text-white')}>{faq.q}</h3>
                      <ChevronDown className={cn('text-neutral-400 transition-transform duration-200 flex-shrink-0', isOpen && 'rotate-180 text-empire')} size={18} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-5 pb-5 pt-0 border-t border-white/10">
                            <p className="text-sm md:text-base text-neutral-300 leading-relaxed pt-4">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA - with repeated registration form
   ═══════════════════════════════════════════════════════════════ */
function FinalCTASection() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-[#060606]">
      <div className="container relative z-10 max-w-3xl mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="flex-shrink-0 flex -space-x-4">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-white/10 z-10">
                <img src="/founders/kevin.jpg" alt="Kevin Dufraisse" className="w-full h-full object-cover" />
              </div>
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-white/10">
                <img src="/founders/marc.jpg" alt="Marc Dufraisse" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-neutral-400 text-sm mb-2">Un message de Kevin & Marc :</p>
              <p className="text-white text-lg md:text-xl font-semibold leading-snug mb-2">
                "On fait ce webinar parce qu'on est convaincus que les bonnes personnes méritent d'être vues."
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Si tu as un vrai produit et que tu es frustré par ton manque de visibilité, ce webinar est fait pour toi. Viens, c'est gratuit - et tu repars avec des techniques actionnables.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Prêt à découvrir <span className="text-empire">La Méthode Gourou</span> ?
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Clock size={14} className="text-empire" />
                <span className="text-sm text-neutral-200 font-medium">10 juin à 19h</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Play size={14} className="text-empire" />
                <span className="text-sm text-neutral-200 font-medium">90 min en live</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="mb-4 text-center">
              <p className="text-[10px] text-neutral-500 mb-2 uppercase tracking-widest">Début dans</p>
              <CountdownTimer />
            </div>
            <RegistrationForm />
          </div>

          <div className="mt-10">
            <p className="text-[10px] text-neutral-600 text-center mb-3 tracking-widest uppercase">Kevin a été vu sur</p>
            <CredibilityStrip />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LEGAL FOOTER
   ═══════════════════════════════════════════════════════════════ */
function LegalSection() {
  return (
    <section id="legal" className="w-full py-10 bg-[#050505] border-t border-white/[0.05]">
      <div className="container max-w-3xl mx-auto">
        <p className="text-[10px] md:text-xs text-neutral-600 leading-relaxed text-center">
          Ce webinar contient une analyse marketing de personnalités publiques à des fins éducatives. Les références à Idriss Aberkane, Anthony Bourbon, Oussama Ammar et autres figures citées relèvent du droit à l'information et à la critique tel que défini par la jurisprudence française. Aucune affiliation, partenariat ou endorsement n'est sous-entendu (sauf pour Lorraine Vallery-Radot, citée avec son accord). Toutes les opinions exprimées sont celles de l'auteur. Empire Internet - Kevin & Marc Dufraisse.
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STICKY CTA MOBILE
   ═══════════════════════════════════════════════════════════════ */
function StickyWebinarBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const nearBottom = y + window.innerHeight > document.body.scrollHeight - 400
      setVisible(y > window.innerHeight * 0.5 && !nearBottom)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[100] md:hidden transition-transform duration-200',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bg-black border-t border-empire/30 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-neutral-500 uppercase tracking-wider">Début dans</span>
          <CountdownTimer compact />
        </div>
        <a
          href={CTA_LINK}
          className="flex-shrink-0 px-5 py-3 bg-empire text-black font-bold rounded-lg text-sm"
        >
          Réserver
        </a>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function WebinarClient() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <HeroSection />
      <WhySection />
      <SectionDivider />
      <KeysSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <CaseStudySection />
      <SectionDivider />
      <ForWhoSection />
      <SectionDivider />
      <FAQSection />
      <FinalCTASection />
      <LegalSection />
      <StickyWebinarBar />
    </main>
  )
}
