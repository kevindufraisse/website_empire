'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { Check, Mail, Sparkles, ArrowRight, RotateCcw, Clock, Shield, Calendar, Users } from 'lucide-react'
import {
  ARCHETYPES,
  getArchetypeIcons,
  getLocalizedArchetype,
  iconAvatarUrl,
  type ArchetypeId,
  type IconFigure,
  type IconLang,
  type RecommendedOffer,
  type ScoreBand,
} from '@/lib/quiz-data'
import { COHORT_RANGE_LONG } from '@/lib/cohort-config'
import { useLanguage } from '@/contexts/LanguageContext'
import QuizShareButtons from './QuizShareButtons'

export interface QuizResultPayload {
  archetype: ArchetypeId
  score: number
  scoreBand: ScoreBand
  recommendedOffer: RecommendedOffer
  secondaryOffer: RecommendedOffer | null
  archetypeRanking: { id: ArchetypeId; pct: number }[]
  /** True when the lead qualifies for the premium done-for-you tier. */
  premiumEligible?: boolean
}

interface Props {
  result: QuizResultPayload
  email: string
  firstName?: string
  /** Raw answers — used to personalize the result copy with their actual choices. */
  answers?: Record<string, string>
  onRestart?: () => void
}

// ─── Offer copy (CA-first; book-a-call obsessed) ──────────────────────────────

interface OfferCopy {
  kicker: string
  title: string
  pitch: string
  /** What they GET out of the call — concrete deliverables, not "we'll talk". */
  benefits: string[]
  /** Primary CTA button. */
  cta: { label: string; href: string }
  /** Reassurance under the button. */
  reassurance: string
  /** Loss aversion — what happens if they don't act. */
  lossLine?: string
}

const OFFERS: Record<RecommendedOffer, OfferCopy> = {
  copilot: {
    kicker: 'Recommandé pour votre profil',
    title: 'Empire',
    pitch:
      "Vous avez du CA, vous décidez, vous savez ce que ça vous coûte de ne pas avoir d'audience. Empire est fait pour vous : 15 min par semaine avec votre expert, on s'occupe de transformer ça en contenu qui amène des clients.",
    benefits: [
      'Un expert senior dédié qui vous interview 15 min/sem',
      'On rédige vos posts LinkedIn + Shorts à partir de vos mots',
      'Un système d\'automatisation qui multi-poste sur tous vos canaux',
      'Calendrier éditorial 4 semaines à l\'avance — vous savez exactement ce qui va sortir',
      'Accès à la communauté privée Empire',
    ],
    cta: {
      label: 'Réserver un appel découverte →',
      href: '/',
    },
    reassurance: 'Appel gratuit · 15 minutes · On vous dit si on peut vous aider',
  },
  academy: {
    kicker: 'Recommandé pour votre profil',
    title: 'Empire Academy · 21 jours',
    pitch:
      "Pour votre profil, Academy est le bon premier pas : 21 jours pour bâtir vos fondations de contenu, avec 42 publications produites pour vous. Vous repartez avec un système qui tourne et vous pourrez passer à Empire (avec expert dédié) quand vous voudrez accélérer.",
    benefits: [
      'Système de viralité copy-paste à appliquer dès le jour 1',
      '21 posts LinkedIn + 21 Shorts produits POUR vous pendant 21 jours',
      'Templates d\'automatisation multi-canal (gain de temps immédiat)',
      'Tunnel newsletter + scripts DMs : vos premiers leads dès J7',
      'Communauté privée + sessions live + accès à vie',
    ],
    cta: {
      label: 'Découvrir Empire Academy →',
      href: '/academy',
    },
    reassurance: '497€ · Paiement en 3x possible · Garantie 30 jours satisfait ou remboursé',
  },
  autopilot: {
    kicker: 'Recommandé pour votre profil',
    title: 'Empire',
    pitch:
      "Vous avez du CA, vous décidez, vous savez ce que ça vous coûte de ne pas avoir d'audience. Empire est fait pour vous.",
    benefits: [
      'Expert senior dédié 15 min/sem',
      'Production multi-canal (LinkedIn + Shorts)',
      'Système d\'automatisation clé en main',
      'Calendrier éditorial 4 semaines',
      'Communauté privée Empire',
    ],
    cta: { label: 'Réserver un appel découverte →', href: '/' },
    reassurance: 'Appel gratuit · 15 minutes',
  },
  nurture: {
    kicker: 'Recommandé pour votre profil',
    title: 'Empire Academy · 21 jours',
    pitch:
      "Academy est conçu exactement pour vous : 21 jours pour comprendre la puissance du contenu dans votre business — avec 42 publications produites pour vous.",
    benefits: [
      '21 jours pour comprendre comment le contenu génère des clients',
      '21 posts LinkedIn + 21 Shorts produits POUR vous',
      'Système de viralité copy-paste à appliquer dès J1',
      'Communauté privée + sessions live + accès à vie',
    ],
    cta: { label: 'Découvrir Empire Academy →', href: '/academy' },
    reassurance: '497€ · Paiement en 3x possible · Garantie 30 jours satisfait ou remboursé',
  },
}

const OFFERS_EN: Record<RecommendedOffer, OfferCopy> = {
  copilot: {
    kicker: 'Recommended for your profile',
    title: 'Empire',
    pitch:
      "You have revenue, you're a decision-maker, and you know what it costs to not have an audience. Empire is built for you: 15 min/week with your expert, we turn it into content that brings clients.",
    benefits: [
      'A dedicated senior expert who interviews you 15 min/week',
      'We write your LinkedIn posts + Shorts from your words',
      'An automation system that multi-posts across all your channels',
      'Editorial calendar 4 weeks ahead — you know exactly what goes out',
      'Access to the private Empire community',
    ],
    cta: {
      label: 'Book a discovery call →',
      href: '/',
    },
    reassurance: 'Free call · 15 minutes · We tell you if we can help',
  },
  academy: {
    kicker: 'Recommended for your profile',
    title: 'Empire Academy · 21 days',
    pitch:
      "For your profile, Academy is the right first step: 21 days to build your content foundations, with 42 publications produced for you. You leave with a working system and can upgrade to Empire (with a dedicated expert) whenever you want to accelerate.",
    benefits: [
      'Copy-paste virality system to apply from day 1',
      '21 LinkedIn posts + 21 Shorts produced FOR you over 21 days',
      'Multi-channel automation templates (immediate time savings)',
      'Newsletter funnel + DM scripts: your first leads by day 7',
      'Private community + live sessions + lifetime access',
    ],
    cta: {
      label: 'Discover Empire Academy →',
      href: '/academy',
    },
    reassurance: '€497 · 3x payment available · 30-day money-back guarantee',
  },
  autopilot: {
    kicker: 'Recommended for your profile',
    title: 'Empire',
    pitch:
      "You have revenue, you decide, and you know what it costs to not have an audience. Empire is built for you.",
    benefits: [
      'Dedicated senior expert 15 min/week',
      'Multi-channel production (LinkedIn + Shorts)',
      'Turnkey automation system',
      '4-week editorial calendar',
      'Private Empire community',
    ],
    cta: { label: 'Book a discovery call →', href: '/' },
    reassurance: 'Free call · 15 minutes',
  },
  nurture: {
    kicker: 'Recommended for your profile',
    title: 'Empire Academy · 21 days',
    pitch:
      "Academy is designed exactly for you: 21 days to understand the power of content in your business — with 42 publications produced for you.",
    benefits: [
      '21 days to understand how content generates clients',
      '21 LinkedIn posts + 21 Shorts produced FOR you',
      'Copy-paste virality system to apply from day 1',
      'Private community + live sessions + lifetime access',
    ],
    cta: { label: 'Discover Empire Academy →', href: '/academy' },
    reassurance: '€497 · 3x payment available · 30-day money-back guarantee',
  },
}

// ─── Score ring (animated 0 → value) ──────────────────────────────────────────

/** Animated ring showing the share of Empire creators who match this archetype. */
function ArchetypeShareBadge({ pct, lang }: { pct: number; lang: IconLang }) {
  const radius = 38
  const stroke = 6
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  const count = useMotionValue(0)
  const display = useTransform(count, (v) => Math.round(v).toString())

  useEffect(() => {
    const controls = animate(count, pct, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [count, pct])

  return (
    <div className="relative w-[100px] h-[100px] flex-shrink-0">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke="rgb(var(--empire-rgb))" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <motion.span className="text-2xl font-black text-white tabular-nums">
            {display}
          </motion.span>
          <span className="text-base font-black text-empire">%</span>
        </div>
        <span className="text-[8px] uppercase tracking-widest text-neutral-500 leading-none mt-0.5">
          {lang === 'fr' ? 'des créateurs' : 'of creators'}
        </span>
      </div>
    </div>
  )
}

// ─── Iconic figure avatar (with safe fallback) ────────────────────────────────

function IconAvatar({
  icon,
  size = 'md',
  delay = 0,
}: {
  icon: IconFigure
  size?: 'sm' | 'md' | 'lg' | 'xl'
  delay?: number
}) {
  const [errored, setErrored] = useState(false)
  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
  }[size]
  const initials = icon.name.split(' ').map(p => p[0]).slice(0, 2).join('')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${sizeClass} rounded-full overflow-hidden ring-2 ring-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-neutral-400 font-bold flex-shrink-0`}
    >
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconAvatarUrl(icon)}
          alt={icon.name}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="text-sm">{initials}</span>
      )}
    </motion.div>
  )
}

// ─── Main result component ────────────────────────────────────────────────────

const OFFER_COLORS: Record<RecommendedOffer, { accent: string; glow: string; bg: string; border: string; text: string }> = {
  copilot:   { accent: '#DAFC68', glow: 'shadow-[0_0_28px_rgba(218,252,104,0.45)]', bg: 'from-[#DAFC68]/15 via-[#DAFC68]/5 to-transparent', border: 'border-[#DAFC68]/40', text: 'text-[#DAFC68]' },
  academy:   { accent: '#fca5a5', glow: 'shadow-[0_0_28px_rgba(252,165,165,0.45)]', bg: 'from-[#fca5a5]/15 via-[#fca5a5]/5 to-transparent', border: 'border-[#fca5a5]/40', text: 'text-[#fca5a5]' },
  autopilot: { accent: '#DAFC68', glow: 'shadow-[0_0_28px_rgba(218,252,104,0.45)]', bg: 'from-[#DAFC68]/15 via-[#DAFC68]/5 to-transparent', border: 'border-[#DAFC68]/40', text: 'text-[#DAFC68]' },
  nurture:   { accent: '#fca5a5', glow: 'shadow-[0_0_28px_rgba(252,165,165,0.45)]', bg: 'from-[#fca5a5]/15 via-[#fca5a5]/5 to-transparent', border: 'border-[#fca5a5]/40', text: 'text-[#fca5a5]' },
}

export default function QuizResult({ result, email, firstName, answers, onRestart }: Props) {
  const { lang } = useLanguage()
  const profile = getLocalizedArchetype(result.archetype, lang)
  const offers = lang === 'fr' ? OFFERS : OFFERS_EN
  const offer = offers[result.recommendedOffer]
  const offerColor = OFFER_COLORS[result.recommendedOffer]
  const secondaryOffer = result.secondaryOffer ? offers[result.secondaryOffer] : null
  const greeting = firstName ? `${firstName}, ` : ''
  const primaryIcon = profile.localIcons[0]
  const tribe = profile.localIcons.slice(1)
  const blocker = answers?.blocker
  const diagnostic = blocker ? profile.diagnostics[blocker] ?? null : null

  // Confetti burst on mount — only fires once.
  useEffect(() => {
    const t = setTimeout(() => {
      const empire = '#dafc68'
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.35 },
        colors: [empire, '#ffffff', '#a3e635', '#65a30d'],
        scalar: 0.9,
        ticks: 150,
        gravity: 0.9,
      })
    }, 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/80 to-black p-6 sm:p-10 shadow-soft overflow-hidden"
      >
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl bg-gradient-to-br ${profile.accentClass}`}
        />

        <div className="relative">
          {/* ── HEADER ── */}
          {(() => {
            // Distribution observée parmi les ~700 entrepreneurs Empire testés.
            const archetypeShare: Record<typeof result.archetype, number> = {
              storyteller: 32,
              educator: 30,
              builder: 22,
              provocateur: 16,
            }
            const sharePct = archetypeShare[result.archetype]
            return (
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
                <ArchetypeShareBadge pct={sharePct} lang={lang} />
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
                    <Sparkles size={12} className="text-empire" />
                    <span className="text-[11px] uppercase tracking-widest text-empire font-bold">
                      {lang === 'fr' ? 'Votre archétype' : 'Your archetype'}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                    {profile.emoji} {profile.name}
                  </h1>
                  <p className="text-neutral-400 mt-1 text-sm sm:text-base italic">
                    {profile.tagline}
                  </p>
                  <p className="text-empire text-xs sm:text-sm font-bold mt-3">
                    {lang === 'fr'
                      ? `${sharePct}% des créateurs Empire ont votre profil`
                      : `${sharePct}% of Empire creators have your profile`}
                  </p>
                </div>
              </div>
            )
          })()}

          {/* ── HERO CREATOR MATCH ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative rounded-2xl p-6 sm:p-8 mb-8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
              <IconAvatar icon={primaryIcon} size="xl" delay={0.5} />
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-empire font-black mb-2">
                  {lang === 'fr' ? 'Votre créateur de référence' : 'Your reference creator'}
                </p>
                <p className="text-white text-2xl sm:text-3xl font-black leading-tight">
                  {lang === 'fr'
                    ? <>{greeting}vous construisez comme<br className="hidden sm:block" />{' '}<span className="text-empire">{primaryIcon.name}</span></>
                    : <>{greeting}you create like<br className="hidden sm:block" />{' '}<span className="text-empire">{primaryIcon.name}</span></>
                  }
                </p>
                <p className="text-neutral-400 text-sm sm:text-base mt-2 italic">
                  {primaryIcon.role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── DESCRIPTION ── */}
          <p className="text-neutral-200 leading-relaxed mb-6 text-[15px] sm:text-base">
            {profile.description}
          </p>


          {/* ── TRIBE ── */}
          {tribe.length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-4 text-center">
                {lang === 'fr' ? 'Votre tribu de Creators' : 'Your Creator tribe'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {tribe.map((icon, i) => (
                  <motion.div
                    key={icon.handle}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <IconAvatar icon={icon} size="md" delay={0.8 + i * 0.1} />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{icon.name}</p>
                      <p className="text-neutral-500 text-xs truncate">{icon.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── DIAGNOSTIC - Pourquoi tes posts convertissent pas ── */}
          {diagnostic && (
            <div className="mb-8 rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20">
              <p className="text-[11px] uppercase tracking-[0.2em] text-rose-300 font-bold mb-3">
                {lang === 'fr' ? 'Pourquoi vos posts ne convertissent pas' : "Why your posts don't convert"}
              </p>
              <p className="text-neutral-200 text-sm sm:text-[15px] leading-relaxed">
                {diagnostic}
              </p>
            </div>
          )}

          {/* ── EMAIL + WARMING (grouped) ── */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-empire/10 via-empire/5 to-transparent border border-empire/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <Mail className="text-empire flex-shrink-0" size={22} />
                <p className="text-white font-bold text-base sm:text-lg leading-tight">
                  {lang === 'fr' ? 'Check votre boîte mail dans 20 minutes' : 'Check your inbox in 20 minutes'}
                </p>
              </div>
              <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
                {lang === 'fr'
                  ? <>On vous envoie vos 10 sujets à poster + votre plan 30 jours personnalisé pour l&apos;archétype <span className="text-empire font-semibold">{profile.name.replace('Le ', '').replace("L'", '')}</span>.</>
                  : <>We&apos;re sending your 10 topics to post + your personalized 30-day plan for the <span className="text-empire font-semibold">{profile.name.replace('The ', '')}</span> archetype.</>
                }
              </p>

              {/* Email warming - send 'OK' to Kevin to avoid spam */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-empire mb-1">
                  {lang === 'fr' ? 'Pour être sûr de recevoir vos emails :' : 'To make sure you receive our emails:'}
                </p>
                <p className="text-[11px] text-neutral-400 mb-2.5">
                  {lang === 'fr'
                    ? 'Envoyez-moi un "OK" — ça empêche les futurs emails de tomber en spam.'
                    : 'Send me an "OK" — it prevents future emails from going to spam.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kevin@empire-internet.com&su=OK%20Kevin&body=OK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-white hover:bg-white/[0.1] hover:border-empire/30 transition-all"
                  >
                    <svg width="16" height="12" viewBox="0 0 24 18" fill="none" className="flex-shrink-0">
                      <path d="M1.636 18h4.364V8.727L0 5.727V16.364C0 17.267.733 18 1.636 18Z" fill="#4285F4"/>
                      <path d="M18 18h4.364c.905 0 1.636-.733 1.636-1.636V5.727L18 8.727" fill="#34A853"/>
                      <path d="M18 1.636V8.727l6-3V3.273c0-2.017-2.303-3.166-3.927-1.964" fill="#FBBC04"/>
                      <path d="M6 8.727V1.636L12 6l6-4.364V8.727L12 12" fill="#EA4335"/>
                      <path d="M0 3.273v2.454l6 3V1.636L3.927 1.309C2.303.107 0 1.256 0 3.273" fill="#C5221F"/>
                    </svg>
                    {lang === 'fr' ? 'Envoyer via Gmail' : 'Send via Gmail'}
                  </a>
                  <a
                    href="https://outlook.office.com/mail/deeplink/compose?to=kevin@empire-internet.com&subject=OK%20Kevin&body=OK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-white hover:bg-white/[0.1] hover:border-empire/30 transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <path d="M24 7.387v10.478c0 .914-.742 1.656-1.656 1.656H8.22a1.656 1.656 0 0 1-1.656-1.656V7.387l8.718 5.06L24 7.386Z" fill="#0078D4"/>
                      <path d="M16.29 4.48H24v2.906l-8.718 5.06-8.718-5.06V6.135c0-.914.742-1.656 1.656-1.656Z" fill="#0078D4"/>
                      <path opacity=".5" d="M24 7.387v.544l-8.718 5.06-8.718-5.06v-.544L16.29 4.48H24v2.906Z" fill="#000"/>
                      <path d="M6.563 7.5H0v9.375l6.563-1.875V7.5Z" fill="#0078D4"/>
                      <path d="M6.563 7.5H0V5.625L6.563 4.5V7.5Z" fill="#00BCF2"/>
                    </svg>
                    {lang === 'fr' ? 'Envoyer via Outlook' : 'Send via Outlook'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── PRIMARY CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className={`relative rounded-2xl p-6 sm:p-7 mb-6 bg-gradient-to-br ${offerColor.bg} ${offerColor.border} border overflow-hidden`}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at top right, ${offerColor.accent}26, transparent 60%)` }}
            />

            <div className="relative">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-black mb-2 ${offerColor.text}`}>
                {offer.kicker}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                {offer.title}
              </h3>
              <p className="text-neutral-200 text-[15px] mb-5 leading-relaxed">
                {offer.pitch}
              </p>

              <ul className="space-y-2 mb-6">
                {offer.benefits.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + i * 0.06 }}
                    className="flex items-start gap-3 text-sm text-neutral-100"
                  >
                    <Check size={16} className={`${offerColor.text} mt-0.5 flex-shrink-0`} />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>

              {(result.recommendedOffer === 'academy' || result.recommendedOffer === 'nurture') && (
                <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <Calendar size={14} className="text-amber-400 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-amber-200">
                    {lang === 'fr' ? 'Cohorte en cours : ' : 'Current cohort: '}
                    <span className="font-bold text-amber-300">{COHORT_RANGE_LONG}</span>
                  </p>
                </div>
              )}

              <Link
                href={offer.cta.href}
                className={`group inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-bold text-base sm:text-lg hover:scale-[1.02] active:scale-100 transition-all text-black ${offerColor.glow}`}
                style={{ backgroundColor: offerColor.accent }}
              >
                {offer.cta.label}
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-[11px] sm:text-xs text-neutral-400">
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} /> 15 min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Shield size={11} /> {lang === 'fr' ? 'Sans engagement' : 'No commitment'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={11} /> {lang === 'fr' ? '+700 entrepreneurs' : '+700 entrepreneurs'}
                </span>
              </div>

              {offer.lossLine && (
                <p className="text-center text-[12px] text-neutral-500 italic mt-4 max-w-md mx-auto">
                  {offer.lossLine}
                </p>
              )}
            </div>
          </motion.div>

          {/* ── PREMIUM BANNER (shown to top-tier profiles eligible for full delegation) ── */}
          {result.premiumEligible && (result.recommendedOffer === 'copilot' || result.recommendedOffer === 'autopilot') && (
            <div className="mb-6 rounded-xl p-4 sm:p-5 bg-gradient-to-r from-[#d4a574]/15 via-[#d4a574]/8 to-transparent border border-[#d4a574]/30">
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold mb-2 text-[#d4a574]">
                {lang === 'fr' ? 'Vous voulez tout déléguer ?' : 'Want to delegate everything?'}
              </p>
              <p className="text-sm text-neutral-200 leading-snug">
                {lang === 'fr'
                  ? <>Vu votre profil (CA, budget, urgence), vous êtes éligible à notre formule <span className="text-[#d4a574] font-semibold">Done For You</span> : un expert dédié pilote toute votre machine de contenu, vous n&apos;avez plus rien à faire. <span className="text-neutral-400">On en parle pendant l&apos;appel découverte.</span></>
                  : <>Based on your profile (revenue, budget, urgency), you qualify for our <span className="text-[#d4a574] font-semibold">Done For You</span> plan: a dedicated expert runs your entire content machine — you don&apos;t lift a finger. <span className="text-neutral-400">We&apos;ll discuss it on the discovery call.</span></>
                }
              </p>
            </div>
          )}

          {/* ── SECONDARY LINK ── */}
          {(result.recommendedOffer === 'copilot' || result.recommendedOffer === 'autopilot') && (
            <Link
              href="/academy"
              className="block text-center text-sm text-neutral-400 hover:text-empire transition mb-6"
            >
              {lang === 'fr' ? 'Budget serré ? ' : 'Tight budget? '}
              <span className="underline underline-offset-2">
                {lang === 'fr' ? 'Commencer par Academy - 497€ →' : 'Start with Academy - €497 →'}
              </span>
            </Link>
          )}
          {(result.recommendedOffer === 'academy' || result.recommendedOffer === 'nurture') && (
            <Link
              href="/vsl"
              className="block text-center text-sm text-neutral-400 hover:text-empire transition mb-6"
            >
              {lang === 'fr' ? 'Voir comment Empire fonctionne en ' : 'See how Empire works in a '}
              <span className="underline underline-offset-2">
                {lang === 'fr' ? 'vidéo de 20 min →' : '20-min video →'}
              </span>
            </Link>
          )}

          {/* ── SHARE ── */}
          <QuizShareButtons archetype={result.archetype} score={result.score} />

          {/* ── EMAIL CONFIRMATION (compact) ── */}
          <div className="flex items-start gap-3 mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <Mail className="text-empire flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-neutral-400">
              {lang === 'fr'
                ? <>Envoyé à <span className="text-white font-semibold">{email}</span> · Vérifiez vos spams si rien dans 20 min.</>
                : <>Sent to <span className="text-white font-semibold">{email}</span> · Check spam if nothing arrives in 20 min.</>
              }
            </p>
          </div>

          {onRestart && (
            <button
              onClick={onRestart}
              className="mt-6 inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <RotateCcw size={12} />
              {lang === 'fr' ? 'Refaire le test' : 'Retake the quiz'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
