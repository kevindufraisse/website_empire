'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { Check, Mail, Sparkles, ArrowRight, RotateCcw, Clock, Shield, Calendar, Users, UserPlus, Send } from 'lucide-react'
import {
  ARCHETYPES,
  iconAvatarUrl,
  type ArchetypeId,
  type IconFigure,
  type RecommendedOffer,
  type ScoreBand,
} from '@/lib/quiz-data'
import { COHORT_RANGE_LONG } from '@/lib/cohort-config'
import QuizShareButtons from './QuizShareButtons'

export interface QuizResultPayload {
  archetype: ArchetypeId
  score: number
  scoreBand: ScoreBand
  recommendedOffer: RecommendedOffer
  secondaryOffer: RecommendedOffer | null
  archetypeRanking: { id: ArchetypeId; pct: number }[]
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
  autopilot: {
    kicker: '🔒 Accès Premium · Réservé aux profils qualifiés',
    title: 'Autopilot · Done for you',
    pitch:
      "Vu votre CA, votre budget et votre niveau d'urgence, vous êtes éligible à notre offre premium. Un expert dédié pilote toute votre machine de contenu pendant que vous gérez votre business. Cette offre n'est pas publique — seuls les profils qualifiés y accèdent.",
    benefits: [
      "Au RDV : on calcule votre ROI projeté à 90 jours sur votre cas exact",
      "Au RDV : on identifie les 3 leviers prioritaires de votre business",
      "Au RDV : on vous dit honnêtement si Autopilot est rentable pour vous",
      'Si on signe : expert dédié + production multi-canal + reporting hebdo',
      'Garantie résultats sous 90 jours - sinon on continue gratuitement',
    ],
    cta: {
      label: 'Réserver un appel stratégique →',
      href: '/',
    },
    reassurance: 'Page privée · Aucun engagement',
    lossLine:
      "Sans système : 6 à 12 mois pour atteindre ce qu'on règle en 90 jours.",
  },
  copilot: {
    kicker: '🎯 Recommandation #1 · Le meilleur ratio impact/temps',
    title: 'Copilot · Avec coach senior',
    pitch:
      "Votre profil correspond exactement aux clients qu'on aide le mieux : décideur, du budget, conscient du coût de l'inaction. 15 min/sem avec un coach senior + vos outils = contenu prévisible qui convertit.",
    benefits: [
      "Au RDV : audit gratuit de votre positionnement actuel",
      "Au RDV : 3 angles éditoriaux concrets que vous pourrez tester cette semaine",
      "Au RDV : on vous dit si Copilot peut vraiment vous faire passer à l'étape d'après",
      'Si on signe : coaching hebdo + système d\'automatisation + calendrier 4 semaines',
      'Communauté privée Empire (creators sérieux uniquement)',
    ],
    cta: {
      label: 'Découvrir Empire Copilot →',
      href: '/',
    },
    reassurance: 'Voir l\'offre complète · Aucun engagement',
    lossLine:
      "Continuer seul = encore 6 mois à publier sans liste email. Ou un système qui tourne dès demain.",
  },
  academy: {
    kicker: '🎯 Recommandation #1 · Votre porte d\'entrée',
    title: 'Empire Academy · 21 jours intensifs',
    pitch:
      "Pour votre profil, Academy est le bon premier pas. 21 jours pour bâtir vos fondations + 42 contenus produits pour vous + un système clé en main que vous pourrez upgrader plus tard si besoin.",
    benefits: [
      'Système de viralité copy-paste à appliquer dès J1',
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
    lossLine:
      "Sans fondations + sans système, vous allez continuer à essayer 10 trucs sans en maîtriser un seul.",
  },
  nurture: {
    kicker: '🎯 Recommandation #1 - Votre point de départ',
    title: 'Empire Academy - 21 jours intensifs',
    pitch:
      "Vous n'êtes pas encore convaincu par la création de contenu ? C'est exactement pour ça qu'Academy existe. 21 jours pour comprendre la puissance de la viralité dans votre business - avec du contenu produit pour vous.",
    benefits: [
      '21 jours pour comprendre comment le contenu génère des clients',
      '21 posts LinkedIn + 21 Shorts produits POUR vous',
      'Système de viralité copy-paste à appliquer dès J1',
      'Communauté privée + sessions live + accès à vie',
    ],
    cta: {
      label: 'Découvrir Empire Academy →',
      href: '/academy',
    },
    reassurance: '497€ · Paiement en 3x possible · Garantie 30 jours satisfait ou remboursé',
  },
}

// ─── Score ring (animated 0 → value) ──────────────────────────────────────────

function ScoreRing({ value }: { value: number }) {
  const radius = 54
  const stroke = 8
  const circ = 2 * Math.PI * radius
  const offset = circ - (value / 100) * circ

  // Animated number — counts from 0 to `value`.
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => Math.round(v).toString())

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [count, value])

  return (
    <div className="relative w-[140px] h-[140px]">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none"
        />
        <motion.circle
          cx="70" cy="70" r={radius}
          stroke="rgb(var(--empire-rgb))" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-black text-white tabular-nums">
          {display}
        </motion.span>
        <span className="text-[10px] uppercase tracking-widest text-neutral-400">/ 100</span>
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

// ─── Personalization helpers ──────────────────────────────────────────────────

/**
 * Estimated annual cost of inaction based on the visitor's own admission.
 * Used in the "Coût de votre inaction" block - the conversion engine.
 */
function inactionAnalysis(answers?: Record<string, string>): {
  amount: string
  yearly: string
  message: string
  intensity: 'low' | 'medium' | 'high' | 'critical'
} | null {
  if (!answers) return null
  const cost = answers.inaction_cost
  const business = answers.business

  // Map answers to realistic ranges based on the business stage
  const isHighRev = business === '20_50k' || business === 'gt50k'
  const isMidRev = business === '5_20k'

  if (cost === 'never_thought') {
    return {
      amount: isHighRev ? '5 à 10k€' : isMidRev ? '2 à 5k€' : '500€ à 2k€',
      yearly: isHighRev ? '60 à 120k€' : isMidRev ? '24 à 60k€' : '6 à 24k€',
      message: "Vous n'y aviez pas pensé - mais avec votre profil, c'est probablement le coût caché de chaque mois sans système.",
      intensity: 'medium',
    }
  }
  if (cost === 'few') {
    return {
      amount: isHighRev ? '3 à 8k€' : '1 à 3k€',
      yearly: isHighRev ? '36 à 96k€' : '12 à 36k€',
      message: "Vous le sentez : ces opportunités manquées s'accumulent. Sur 12 mois, ça pèse lourd.",
      intensity: 'medium',
    }
  }
  if (cost === 'thousands') {
    return {
      amount: '3 à 8k€',
      yearly: '36 à 96k€',
      message: 'Plusieurs milliers chaque mois. Sur l\'année, c\'est une voiture, un salaire, un changement de vie.',
      intensity: 'high',
    }
  }
  if (cost === 'ten_plus') {
    return {
      amount: '10k+',
      yearly: '120k€+',
      message: "10k+ par mois, c'est plus de 120k€ par an qui n'arrivent jamais sur votre compte. C'est exactement ce qu'on règle en 90 jours.",
      intensity: 'critical',
    }
  }
  if (cost === 'biggest') {
    return {
      amount: 'Votre #1',
      yearly: 'Inestimable',
      message: "Vous l'avez dit : c'est votre plus grosse perte business. Continuer 6 mois de plus comme ça = manquer ce que vous pourriez accomplir en 90 jours.",
      intensity: 'critical',
    }
  }
  return null
}

// ─── Main result component ────────────────────────────────────────────────────

const OFFER_COLORS: Record<RecommendedOffer, { accent: string; glow: string; bg: string; border: string; text: string }> = {
  copilot:   { accent: '#DAFC68', glow: 'shadow-[0_0_28px_rgba(218,252,104,0.45)]', bg: 'from-[#DAFC68]/15 via-[#DAFC68]/5 to-transparent', border: 'border-[#DAFC68]/40', text: 'text-[#DAFC68]' },
  academy:   { accent: '#fca5a5', glow: 'shadow-[0_0_28px_rgba(252,165,165,0.45)]', bg: 'from-[#fca5a5]/15 via-[#fca5a5]/5 to-transparent', border: 'border-[#fca5a5]/40', text: 'text-[#fca5a5]' },
  autopilot: { accent: '#d4a574', glow: 'shadow-[0_0_28px_rgba(212,165,116,0.45)]', bg: 'from-[#d4a574]/15 via-[#d4a574]/5 to-transparent', border: 'border-[#d4a574]/40', text: 'text-[#d4a574]' },
  nurture:   { accent: '#fca5a5', glow: 'shadow-[0_0_28px_rgba(252,165,165,0.45)]', bg: 'from-[#fca5a5]/15 via-[#fca5a5]/5 to-transparent', border: 'border-[#fca5a5]/40', text: 'text-[#fca5a5]' },
}

function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Kevin Dufraisse',
    'N:Dufraisse;Kevin;;;',
    'ORG:Empire Internet',
    'EMAIL;TYPE=INTERNET:kevin@empire-internet.com',
    'URL:https://empire-internet.com',
    'NOTE:Empire Internet - The Content Machine',
    'END:VCARD',
  ].join('\r\n')
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Kevin-Dufraisse-Empire.vcf'
  a.click()
  URL.revokeObjectURL(url)
}

export default function QuizResult({ result, email, firstName, answers, onRestart }: Props) {
  const profile = ARCHETYPES[result.archetype]
  const offer = OFFERS[result.recommendedOffer]
  const offerColor = OFFER_COLORS[result.recommendedOffer]
  const secondaryOffer = result.secondaryOffer ? OFFERS[result.secondaryOffer] : null
  const greeting = firstName ? `${firstName}, ` : ''
  const primaryIcon = profile.icons[0]
  const tribe = profile.icons.slice(1)
  const inaction = inactionAnalysis(answers)

  const blocker = answers?.blocker
  const diagnostic = blocker ? profile.diagnostics[blocker] ?? null : null

  const topPct = (() => {
    if (result.score >= 80) return 'top 12%'
    if (result.score >= 70) return 'top 25%'
    if (result.score >= 55) return 'top 40%'
    return 'majorité'
  })()

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
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
            <ScoreRing value={result.score} />
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
                <Sparkles size={12} className="text-empire" />
                <span className="text-[11px] uppercase tracking-widest text-empire font-bold">
                  Votre archétype
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {profile.emoji} {profile.name}
              </h1>
              <p className="text-neutral-400 mt-1 text-sm sm:text-base italic">
                {profile.tagline}
              </p>
              <p className="text-empire text-xs sm:text-sm font-bold mt-3">
                Vous êtes dans le {topPct} des candidats Empire.
              </p>
            </div>
          </div>

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
                  Votre créateur de référence
                </p>
                <p className="text-white text-2xl sm:text-3xl font-black leading-tight">
                  {greeting}vous construisez comme<br className="hidden sm:block" />{' '}
                  <span className="text-empire">{primaryIcon.name}</span>
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

          {/* ── COÛT D'INACTION (le moteur de conversion RDV) ── */}
          {inaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className={`relative mb-8 rounded-2xl p-5 sm:p-6 border overflow-hidden ${
                inaction.intensity === 'critical'
                  ? 'bg-gradient-to-br from-red-500/15 to-orange-500/5 border-red-500/40'
                  : inaction.intensity === 'high'
                    ? 'bg-gradient-to-br from-orange-500/15 to-amber-500/5 border-orange-500/40'
                    : 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30'
              }`}
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-3xl bg-red-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xl ${inaction.intensity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                    🚨
                  </span>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-black ${
                    inaction.intensity === 'critical' ? 'text-red-300' : 'text-amber-300'
                  }`}>
                    Le coût de votre inaction
                  </p>
                </div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className={`text-3xl sm:text-4xl font-black ${
                    inaction.intensity === 'critical' ? 'text-red-300' : 'text-amber-300'
                  }`}>
                    {inaction.amount}
                  </span>
                  <span className="text-neutral-400 text-sm">/mois perdus</span>
                </div>
                <p className="text-white text-sm sm:text-[15px] font-semibold mb-2">
                  {inaction.message}
                </p>
                <p className="text-neutral-400 text-xs sm:text-sm">
                  Sur 12 mois, c&apos;est <span className="text-white font-bold">{inaction.yearly}</span> qui n&apos;arrivent jamais sur votre compte.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── TRIBE ── */}
          {tribe.length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-4 text-center">
                Votre tribu de Creators
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
                Pourquoi vos posts ne convertissent pas
              </p>
              <p className="text-neutral-200 text-sm sm:text-[15px] leading-relaxed">
                {diagnostic}
              </p>
            </div>
          )}

          {/* ── 10 SUJETS à poster cette semaine ── */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-empire font-bold mb-3">
              Votre stratégie complète arrive par email
            </p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-empire/10 via-empire/5 to-transparent border border-empire/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-empire flex-shrink-0" size={22} />
                <p className="text-white font-bold text-base sm:text-lg leading-tight">
                  Check votre boîte mail dans 20 minutes
                </p>
              </div>
              <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
                On vous envoie le détail complet personnalisé pour votre archétype <span className="text-empire font-semibold">{profile.name.replace('Le ', '').replace("L'", '')}</span> :
              </p>
              <ul className="space-y-2">
                {[
                  'Vos 10 sujets exacts à poster cette semaine (templates copy-paste)',
                  'Votre plan d\'action sur 30 jours (semaine par semaine)',
                  'Les 3 erreurs que font 90% des ' + profile.name.replace('Le ', '').replace("L'", '').toLowerCase() + 's',
                  'La méthode complète pour transformer votre archétype en machine à clients',
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-neutral-200"
                  >
                    <Check size={14} className="text-empire mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
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

              {result.recommendedOffer === 'academy' && (
                <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <Calendar size={14} className="text-amber-400 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-amber-200">
                    Cohorte en cours :{' '}
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
                  <Shield size={11} /> Sans engagement
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={11} /> +700 entrepreneurs
                </span>
              </div>

              {offer.lossLine && (
                <p className="text-center text-[12px] text-neutral-500 italic mt-4 max-w-md mx-auto">
                  {offer.lossLine}
                </p>
              )}
            </div>
          </motion.div>

          {/* ── SECONDARY LINK ── */}
          {result.recommendedOffer === 'autopilot' && (
            <Link
              href="/"
              className="block text-center text-sm text-neutral-400 hover:text-[#DAFC68] transition mb-6"
            >
              Pas prêt pour le Premium ?{' '}
              <span className="underline underline-offset-2">Voir Copilot →</span>
            </Link>
          )}
          {result.recommendedOffer === 'copilot' && (
            <Link
              href="/academy"
              className="block text-center text-sm text-neutral-400 hover:text-empire transition mb-6"
            >
              Budget serré ?{' '}
              <span className="underline underline-offset-2">Commencer par Academy - 497€ →</span>
            </Link>
          )}
          {result.recommendedOffer === 'academy' && (
            <Link
              href="/vsl"
              className="block text-center text-sm text-neutral-400 hover:text-empire transition mb-6"
            >
              Voir comment Empire fonctionne en{' '}
              <span className="underline underline-offset-2">vidéo de 20 min →</span>
            </Link>
          )}

          {/* ── SHARE ── */}
          <QuizShareButtons archetype={result.archetype} score={result.score} />

          {/* ── EMAIL CONFIRMATION ── */}
          <div className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <Mail className="text-empire flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="text-white font-semibold">
                Votre plan détaillé est en route vers <span className="text-empire">{email}</span>
              </p>
              <p className="text-neutral-400 text-xs mt-1">
                Vérifiez vos spams si vous ne le voyez pas dans 20 minutes.
              </p>
            </div>
          </div>

          {/* ── ADD TO CONTACTS (email warming) ── */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-empire/5 to-transparent border border-empire/20">
            <p className="text-xs font-bold text-empire uppercase tracking-widest mb-3">
              Pour être sûr de recevoir votre plan
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={downloadVCard}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <UserPlus size={15} className="text-empire" />
                Ajouter Kevin aux contacts
              </button>
              <a
                href="mailto:kevin@empire-internet.com?subject=OK%20Kevin&body=OK"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.1] hover:border-empire/30 transition-all"
              >
                <Send size={15} className="text-empire" />
                Envoyer &quot;OK&quot; à Kevin
              </a>
            </div>
            <p className="text-[11px] text-neutral-500 mt-2 text-center">
              Ça garantit que nos emails arrivent dans votre boîte principale
            </p>
          </div>

          {onRestart && (
            <button
              onClick={onRestart}
              className="mt-6 inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <RotateCcw size={12} />
              Refaire le test
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
