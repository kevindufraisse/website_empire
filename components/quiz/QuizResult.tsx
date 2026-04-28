'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { Check, Mail, Sparkles, ArrowRight, RotateCcw, Clock, Shield, Calendar, Users } from 'lucide-react'
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
    kicker: '🎯 Recommandation #1 · Le tier où vous allez le plus vite',
    title: 'Autopilot — Done for you',
    pitch:
      "Vu votre profil, vous n'avez ni le temps ni l'envie de produire. Un expert dédié pilote votre machine de viralité de A à Z : sujets, scripts, publication, conversion. Vous validez, c'est tout.",
    benefits: [
      'Un expert viralité dédié + tout le système d\'automatisation',
      'Sujets, scripts, posts, vidéos : produits dans votre voix, sans vous',
      'Publication multi-canal automatique (LinkedIn, X, IG, YouTube)',
      'Tunnel de capture email + scripts DMs pour convertir votre audience',
      'Reporting hebdo : ce qui marche, ce qu\'on scale, ce qu\'on coupe',
    ],
    cta: {
      label: 'Découvrir Empire Autopilot',
      href: '/?tier=autopilot',
    },
    reassurance: 'Gratuit · 15 minutes · Aucun engagement · Pas de pitch agressif',
    lossLine:
      "Sans système, c'est 6 à 12 mois pour atteindre ce qu'on fait en 90 jours.",
  },
  copilot: {
    kicker: '🎯 Recommandation #1 · Votre meilleur ratio impact/temps',
    title: 'Copilot — Avec coach',
    pitch:
      "Vous avez la matière, on construit le système. 15 min/sem avec un coach senior + vos outils d'automatisation = un contenu prévisible qui charge votre liste email et vos DMs.",
    benefits: [
      'Système éditorial automatisé (1 publi → diffusion multi-canal)',
      'Coaching 1:1 hebdo (15 min) avec un expert Empire',
      'Calendrier prévisible : vous savez quoi publier 4 semaines à l\'avance',
      'Tunnel newsletter + scripts DMs pour convertir votre audience',
      'Communauté privée Empire (creators sérieux uniquement)',
    ],
    cta: {
      label: 'Découvrir Empire Copilot',
      href: '/?tier=copilot',
    },
    reassurance: 'Gratuit · 15 minutes · Aucun engagement · On vous dit honnêtement si vous êtes prêt',
    lossLine:
      "Continuer seul = encore 6 mois à publier dans le vide sans liste email. Ou on règle ça en 1 appel.",
  },
  academy: {
    kicker: '🎯 Recommandation #1 · Votre point de départ idéal',
    title: 'Empire Academy — 21 jours intensifs',
    pitch:
      "Vous n'avez pas encore les fondations. Pas grave. Academy vous donne le système de viralité copy-paste + 42 contenus produits pour vous pendant le bootcamp. Vous repartez avec votre machine en place.",
    benefits: [
      'Système de viralité copy-paste à appliquer dès J1',
      '21 posts LinkedIn + 21 Shorts produits POUR vous pendant 21 jours',
      'Templates d\'automatisation multi-canal (gain de temps immédiat)',
      'Tunnel newsletter + scripts DMs : vos premiers leads dès J7',
      'Communauté privée + sessions live + accès à vie',
    ],
    cta: {
      label: 'Découvrir Empire Academy',
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
      label: 'Postuler à Empire Academy',
      href: '/candidature',
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

function personalizedSituation(answers?: Record<string, string>): string | null {
  if (!answers) return null
  const HOURS: Record<string, string> = {
    lt2: 'moins de 2h/sem disponibles',
    '2_5': '2 à 5h/sem disponibles',
    '5_10': '5 à 10h/sem disponibles',
    gt10: 'plus de 10h/sem disponibles',
    done_for_me: 'zéro heure - vous voulez que ce soit fait pour vous',
  }
  const CONVICTION: Record<string, string> = {
    skeptic: 'pas encore convaincu par le contenu',
    curious: 'intéressé mais en recherche de preuves',
    convinced: 'convaincu mais sans système en place',
    urgent: 'conscient de perdre de l\'argent sans système',
    active: 'déjà actif et prêt à passer au niveau supérieur',
  }
  const h = answers.hours ? HOURS[answers.hours] : null
  const c = answers.conviction ? CONVICTION[answers.conviction] : null
  if (!h || !c) return null
  return `Avec ${h} et ${c} - voici exactement ce qui vous bloque encore.`
}

// ─── Main result component ────────────────────────────────────────────────────

export default function QuizResult({ result, email, firstName, answers, onRestart }: Props) {
  const profile = ARCHETYPES[result.archetype]
  const offer = OFFERS[result.recommendedOffer]
  const secondaryOffer = result.secondaryOffer ? OFFERS[result.secondaryOffer] : null
  const greeting = firstName ? `${firstName}, ` : ''
  const primaryIcon = profile.icons[0]
  const tribe = profile.icons.slice(1)
  const personalized = personalizedSituation(answers)

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

          {/* ── DESCRIPTION + PERSONALIZATION ── */}
          <p className="text-neutral-200 leading-relaxed mb-3 text-[15px] sm:text-base">
            {profile.description}
          </p>
          {personalized && (
            <p className="text-empire/90 text-sm font-semibold leading-relaxed mb-8 italic">
              {personalized}
            </p>
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
              Vos 10 sujets à poster cette semaine
            </p>
            <div className="space-y-1.5">
              {profile.topics.map((topic, i) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.04 }}
                  className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03]"
                >
                  <span className="text-empire font-black text-xs mt-0.5 flex-shrink-0 w-5 text-right">{i + 1}</span>
                  <p className="text-sm text-neutral-200 leading-snug">{topic}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── PLAN 30 JOURS ── */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-empire font-bold mb-3">
              Votre plan d&apos;action sur 30 jours
            </p>
            <div className="space-y-3">
              {profile.plan30.map((week) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + week.week * 0.08 }}
                  className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                    <div className="w-7 h-7 rounded-full bg-empire/15 border border-empire/30 flex items-center justify-center flex-shrink-0 text-empire font-black text-xs">
                      S{week.week}
                    </div>
                    <p className="text-white font-semibold text-sm">Semaine {week.week} - {week.title}</p>
                  </div>
                  <ul className="px-4 py-3 space-y-1.5">
                    {week.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2.5 text-sm text-neutral-300">
                        <Check size={14} className="text-empire mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── PRIMARY CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="relative rounded-2xl p-6 sm:p-7 mb-6 bg-gradient-to-br from-empire/15 via-empire/5 to-transparent border border-empire/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(var(--empire-rgb)_/_0.15),transparent_60%)] pointer-events-none" />

            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-empire font-black mb-2">
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
                    <Check size={16} className="text-empire mt-0.5 flex-shrink-0" />
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
                className="group inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-empire text-black font-bold text-base sm:text-lg hover:scale-[1.02] active:scale-100 transition-all shadow-[0_0_28px_rgb(var(--empire-rgb)_/_0.45)]"
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
              href="/decouverte"
              className="block text-center text-sm text-neutral-400 hover:text-empire transition mb-6"
            >
              Pas prêt pour Autopilot ?{' '}
              <span className="underline underline-offset-2">Voir l&apos;offre Copilot →</span>
            </Link>
          )}
          {result.recommendedOffer === 'copilot' && (
            <Link
              href="/candidature"
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

          {/* ── EMAIL REMINDER ── */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <Mail className="text-empire flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="text-white font-semibold">
                Votre plan détaillé arrive sur <span className="text-empire">{email}</span>
              </p>
              <p className="text-neutral-400 text-xs mt-1">
                Vérifiez vos spams si vous ne le voyez pas dans 2 minutes.
              </p>
            </div>
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
