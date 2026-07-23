'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Scissors, CalendarCheck, ShieldCheck, Loader2, GraduationCap, Minus, Plus, ChevronDown, MessageCircle } from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude, withAmplitudeDeviceId, getAmplitudeDeviceId } from '@/lib/amplitude'
import { FLASH_PROMO_ID, fetchFlashPromo, getBrowserFingerprint, formatCountdown } from '@/lib/flash-promo'

const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

type PlanId = 'starter' | 'growth' | 'scale'
type BillingId = 'monthly' | 'quarterly' | 'yearly'

const BILLING_PERIODS: {
  id: BillingId
  discount: number
  months: number
  labelFr: string
  labelEn: string
  badgeFr?: string
  badgeEn?: string
}[] = [
  { id: 'monthly', discount: 0, months: 1, labelFr: 'Mensuel', labelEn: 'Monthly' },
  { id: 'quarterly', discount: 0.12, months: 3, labelFr: 'Trimestriel', labelEn: 'Quarterly', badgeFr: '-12%', badgeEn: '-12%' },
  { id: 'yearly', discount: 0.18, months: 12, labelFr: 'Annuel', labelEn: 'Yearly', badgeFr: '-18%', badgeEn: '-18%' },
]

type Plan = {
  id: PlanId
  price: number
  credits: number
  contents: string
  nameFr: string
  nameEn: string
  descFr: string
  descEn: string
  featuresFr: string[]
  featuresEn: string[]
  highlighted?: boolean
}

// Mirrors the app's pricing (empire-tracking src/pages/Pricing.tsx PACKS).
// Un seul plan "Créateur" avec sélecteur de volume : les 3 entrées ci-dessous
// sont les paliers de crédits (ils mappent sur les abonnements Stripe existants).
const PLANS: Plan[] = [
  {
    id: 'starter',
    price: 199,
    credits: 2200,
    contents: '~22',
    nameFr: '2 200 crédits',
    nameEn: '2,200 credits',
    descFr: 'Pour poster régulièrement sans y penser',
    descEn: 'Post consistently without thinking about it',
    featuresFr: [],
    featuresEn: [],
  },
  {
    id: 'growth',
    price: 499,
    credits: 6600,
    contents: '~89',
    nameFr: '6 600 crédits',
    nameEn: '6,600 credits',
    descFr: 'Pour devenir une référence',
    descEn: 'Become the reference',
    featuresFr: [],
    featuresEn: [],
    highlighted: true,
  },
  {
    id: 'scale',
    price: 799,
    credits: 12000,
    contents: '~177',
    nameFr: '12 000 crédits',
    nameEn: '12,000 credits',
    descFr: 'Pour saturer votre marché de contenu',
    descEn: 'Saturate your market with content',
    featuresFr: [],
    featuresEn: [],
  },
]

// Inclus dans tous les plans — affiché sous les cartes
const ALL_PLANS_FEATURES: { fr: string; en: string }[] = [
  { fr: 'Tous les formats (posts, reels, newsletters, YouTube, carrousels)', en: 'All formats (posts, reels, newsletters, YouTube, carousels)' },
  { fr: 'Veille quotidienne des sujets viraux', en: 'Daily viral topic detection' },
  { fr: 'Montage humain de vos vidéos', en: 'Human video editing' },
  { fr: 'Relecture & corrections avant livraison', en: 'Proofreading & corrections before delivery' },
  { fr: 'Miniatures personnalisées', en: 'Custom thumbnails' },
  { fr: 'Publication sur 7 réseaux', en: 'Publishing to 7 networks' },
  { fr: 'Analytics & CRM leads', en: 'Analytics & lead CRM' },
  { fr: 'API & intégrations', en: 'API & integrations' },
  { fr: 'Cerveau Empire — mémoire IA', en: 'Empire Brain — AI memory' },
  { fr: 'Communauté Slack', en: 'Slack community' },
]

// Value stack façon Brunson : ce que chaque palier remplace chaque mois (indicatif)
const VALUE_STACK: Record<PlanId, { items: { fr: string; en: string; amount: number }[]; total: number }> = {
  starter: {
    items: [
      { fr: 'Ghostwriter LinkedIn', en: 'LinkedIn ghostwriter', amount: 800 },
      { fr: 'Ghostwriter newsletter', en: 'Newsletter ghostwriter', amount: 480 },
      { fr: 'Monteur vidéo', en: 'Video editor', amount: 600 },
      { fr: 'Graphiste (miniatures, carrousels)', en: 'Graphic designer (thumbnails, carousels)', amount: 300 },
      { fr: 'Photographe / DA visuels', en: 'Photographer / visual AD', amount: 200 },
      { fr: 'Community manager', en: 'Community manager', amount: 500 },
    ],
    total: 2880,
  },
  growth: {
    items: [
      { fr: 'Ghostwriter LinkedIn', en: 'LinkedIn ghostwriter', amount: 1500 },
      { fr: 'Ghostwriter newsletter', en: 'Newsletter ghostwriter', amount: 960 },
      { fr: 'Monteur vidéo', en: 'Video editor', amount: 1200 },
      { fr: 'Graphiste (miniatures, carrousels)', en: 'Graphic designer (thumbnails, carousels)', amount: 600 },
      { fr: 'Photographe / DA visuels', en: 'Photographer / visual AD', amount: 400 },
      { fr: 'Community manager', en: 'Community manager', amount: 800 },
    ],
    total: 5460,
  },
  scale: {
    items: [
      { fr: 'Ghostwriter LinkedIn', en: 'LinkedIn ghostwriter', amount: 2500 },
      { fr: 'Ghostwriter newsletter', en: 'Newsletter ghostwriter', amount: 1440 },
      { fr: 'Monteur vidéo', en: 'Video editor', amount: 2000 },
      { fr: 'Graphiste (miniatures, carrousels)', en: 'Graphic designer (thumbnails, carousels)', amount: 900 },
      { fr: 'Photographe / DA visuels', en: 'Photographer / visual AD', amount: 600 },
      { fr: 'Community manager', en: 'Community manager', amount: 1200 },
    ],
    total: 8640,
  },
}

// Carte Équipe & Agence (sièges — flux enterprise de l'app, mêmes paliers
// et remises volume que app /pricing et /upgrade/enterprise)
const TEAM_FEATURES: { fr: string; en: string }[] = [
  { fr: 'Chaque siège : son calendrier + ses crédits', en: 'Each seat: its own calendar + credits' },
  { fr: 'Account manager dédié', en: 'Dedicated account manager' },
  { fr: 'Priorité de traitement', en: 'Priority processing' },
  { fr: 'Onboarding personnalisé', en: 'Personalized onboarding' },
  { fr: 'Facturation sur mesure', en: 'Custom billing' },
]

const TEAM_TIER_PRICES: Record<PlanId, { price: number; credits: number }> = {
  starter: { price: 199, credits: 2200 },
  growth: { price: 499, credits: 6600 },
  scale: { price: 799, credits: 12000 },
}

function teamVolumeDiscount(seats: number): { label: string; percent: number } | null {
  if (seats >= 10) return { label: '-20%', percent: 20 }
  if (seats >= 5) return { label: '-15%', percent: 15 }
  if (seats >= 3) return { label: '-10%', percent: 10 }
  return null
}

// Coaching add-on, same offer as the app's pre-checkout popup (500€ one-time)
const COACHING_PRICE = 500


function monthlyPrice(base: number, billing: BillingId): number {
  const period = BILLING_PERIODS.find((p) => p.id === billing)!
  return Math.round(base * (1 - period.discount))
}

function planUrl(planId: PlanId, billing: BillingId): string {
  return withAmplitudeDeviceId(`${APP_ONBOARDING_URL}?plan=${planId}&billing=${billing}&intent=trial`)
}

export default function HomePricingSection() {
  const { lang } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const viewedRef = useRef(false)
  // Annual by default: the single highest-impact pricing-page lever
  // (~15-20% more annual mix, ~2x lower churn) — verified across SaaS benchmarks.
  const [billing, setBilling] = useState<BillingId>('yearly')

  useEffect(() => {
    if (!isInView || viewedRef.current) return
    viewedRef.current = true
    trackAmplitude('pricing_section_viewed', { location: 'home' })
    if (posthog.__loaded) {
      posthog.capture('pricing_section_viewed', { location: 'home' })
    }
  }, [isInView])

  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null)
  const [coachingModal, setCoachingModal] = useState<Plan | null>(null)
  // Promo flash — deadline par visiteur (fingerprint + IP), partagée avec l'app
  const [flashPromo, setFlashPromo] = useState<{ deadline: number; plan: PlanId; promoMonthly: number; baseMonthly: number } | null>(null)
  const [flashPromoLeft, setFlashPromoLeft] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchFlashPromo().then((status) => {
      if (cancelled || !status || status.expired) return
      setFlashPromo({
        deadline: new Date(status.deadline).getTime(),
        plan: status.promo.plan as PlanId,
        promoMonthly: status.promo.promoMonthly,
        baseMonthly: status.promo.baseMonthly,
      })
    })
    return () => { cancelled = true }
  }, [])
  useEffect(() => {
    if (!flashPromo) return
    const tick = () => {
      const remaining = flashPromo.deadline - Date.now()
      if (remaining <= 0) {
        setFlashPromo(null)
        setFlashPromoLeft(null)
        return
      }
      setFlashPromoLeft(formatCountdown(remaining))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [flashPromo])
  const promoOn = !!flashPromo && !!flashPromoLeft
  // Prix mensuel de base d'un palier, promo flash appliquée sur le plan visé
  const planBase = (p: Plan) => (promoOn && flashPromo && p.id === flashPromo.plan ? flashPromo.promoMonthly : p.price)

  // Équipe & Agence : crédits par siège + nombre de sièges (miroir de l'app)
  const [teamTier, setTeamTier] = useState<PlanId>('starter')
  const [teamSeats, setTeamSeats] = useState(2)
  const teamDiscount = teamVolumeDiscount(teamSeats)
  const teamEngagedPrice = monthlyPrice(TEAM_TIER_PRICES[teamTier].price, billing)
  const teamSeatPrice = Math.round(teamEngagedPrice * (1 - (teamDiscount?.percent || 0) / 100))
  const teamBillingBadge = BILLING_PERIODS.find((p) => p.id === billing)?.badgeFr || null

  const [loadingTeam, setLoadingTeam] = useState(false)
  const handleTeamCheckout = async () => {
    if (loadingTeam) return
    const props = { plan: teamTier, seats: teamSeats, billing_period: billing, location: 'home' }
    trackAmplitude('pricing_team_configure_click', props)
    if (posthog.__loaded) {
      posthog.capture('pricing_team_configure_click', props, { transport: 'sendBeacon' })
    }
    setLoadingTeam(true)
    try {
      const res = await fetch('/api/checkout-enterprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: teamTier,
          billing,
          seats: teamSeats,
          lang,
          ampDeviceId: getAmplitudeDeviceId(),
        }),
      })
      const data = await res.json()
      if (data.url) {
        trackAmplitude('enterprise_checkout_started', { ...props, flow: 'pay_first' })
        window.location.href = data.url
        return
      }
    } catch {
      // fall through to onboarding fallback
    }
    setLoadingTeam(false)
    window.location.href = withAmplitudeDeviceId(
      `${APP_ONBOARDING_URL}?intent=enterprise&plan=${teamTier}&seats=${teamSeats}&billing=${billing}`,
    )
  }
  // Custom dropdown open states
  const [creatorDropOpen, setCreatorDropOpen] = useState(false)
  const [teamDropOpen, setTeamDropOpen] = useState(false)
  const creatorDropRef = useRef<HTMLDivElement>(null)
  const teamDropRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (creatorDropRef.current && !creatorDropRef.current.contains(e.target as Node)) setCreatorDropOpen(false)
      if (teamDropRef.current && !teamDropRef.current.contains(e.target as Node)) setTeamDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Palier de volume sélectionné sur la carte Créateur
  const [selectedTier, setSelectedTier] = useState<PlanId>('growth')
  // Dès que la promo est chargée, forcer la sélection sur le plan promo
  const promoAutoSelected = useRef(false)
  useEffect(() => {
    if (flashPromo && !promoAutoSelected.current) {
      promoAutoSelected.current = true
      setSelectedTier(flashPromo.plan as PlanId)
    }
  }, [flashPromo])

  const startCheckout = async (plan: Plan, coaching: boolean) => {
    if (loadingPlan) return
    const props = {
      plan: plan.id,
      billing_period: billing,
      price_monthly: monthlyPrice(plan.price, billing),
      coaching_addon: coaching,
      location: 'home',
    }
    trackAmplitude('pricing_plan_click', props)
    if (posthog.__loaded) {
      posthog.capture('pricing_plan_click', props, { transport: 'sendBeacon' })
    }

    setLoadingPlan(plan.id)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id,
          billing,
          lang,
          coaching,
          ampDeviceId: getAmplitudeDeviceId(),
          ...(promoOn && flashPromo && plan.id === flashPromo.plan
            ? { promoId: FLASH_PROMO_ID, fingerprint: getBrowserFingerprint() }
            : {}),
        }),
      })
      const data = await res.json()
      if (data.url) {
        trackAmplitude('trial_checkout_started', { ...props, flow: 'pay_first' })
        window.location.href = data.url
        return
      }
    } catch {
      // fall through to the onboarding fallback
    }
    setLoadingPlan(null)
    window.location.href = planUrl(plan.id, billing)
  }

  const handlePlanClick = (plan: Plan) => {
    setCoachingModal(plan)
  }

  const fr = lang === 'fr'

  return (
    <section ref={ref} id="pricing" className="relative w-full py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            {fr ? 'Un tarif simple, sans surprise' : 'Simple, transparent pricing'}
          </h2>
          <p className="mt-4 text-neutral-400">
            {fr
              ? '7 jours d’essai gratuit, quel que soit le volume. Sans engagement, annulez en 1 clic.'
              : '7-day free trial at any volume. No commitment, cancel in 1 click.'}
          </p>


          {/* Promo flash — compte à rebours par visiteur (IP + cookie) */}
          {promoOn && flashPromo && flashPromoLeft && (
            <div className="mt-8 flex justify-center">
              <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/[0.12] via-orange-500/[0.08] to-red-500/[0.12] px-6 py-4 shadow-[0_0_30px_rgb(239_68_68_/_0.15)]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
                <div className="relative flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-2xl">🔥</span>
                  <div className="text-center sm:text-left">
                    <p className="text-base font-bold text-white">
                      {fr
                        ? `Offre flash : ${flashPromo.promoMonthly}€/mois à vie au lieu de ${flashPromo.baseMonthly}€`
                        : `Flash deal: €${flashPromo.promoMonthly}/mo forever instead of €${flashPromo.baseMonthly}`}
                    </p>
                    <p className="text-sm text-neutral-300">
                      {fr ? '12 000 crédits · ~177 contenus/mois' : '12,000 credits · ~177 pieces/mo'}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-red-500/30 bg-black/30 px-4 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-300">{fr ? 'Expire dans' : 'Expires in'}</span>
                    <span className="font-mono text-xl font-bold tabular-nums text-red-400">{flashPromoLeft}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing period toggle */}
          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
            {BILLING_PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setBilling(p.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  billing === p.id ? 'bg-empire text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {fr ? p.labelFr : p.labelEn}
                {p.badgeFr && (
                  <span className={`ml-1.5 text-[11px] font-bold ${billing === p.id ? 'text-black/70' : 'text-empire'}`}>
                    {fr ? p.badgeFr : p.badgeEn}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {/* Créateur */}
          {(() => {
            const plan = PLANS.find((p) => p.id === selectedTier)!
            const isPromoPlan = promoOn && !!flashPromo && plan.id === flashPromo.plan
            const monthly = monthlyPrice(planBase(plan), billing)
            return (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className={`rounded-2xl p-6 lg:p-8 flex flex-col ${isPromoPlan ? 'border border-red-500/40 bg-white/[0.03]' : 'border border-empire/50 bg-white/[0.03]'}`}
              >
                {/* Header */}
                {isPromoPlan && (
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400">
                    {fr ? 'Offre flash — prix à vie' : 'Flash deal — price locked forever'}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{fr ? 'Créateur' : 'Creator'}</h3>
                  {selectedTier === 'growth' && !isPromoPlan && (
                    <span className="rounded-full bg-empire/15 border border-empire/30 px-2.5 py-0.5 text-[10px] font-bold text-empire uppercase tracking-wider">
                      {fr ? 'Populaire' : 'Popular'}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  {fr ? 'Tout Empire, au volume que vous choisissez' : 'All of Empire, at the volume you choose'}
                </p>

                {/* Selector */}
                <div className="min-h-[155px]">
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    {fr ? 'Votre volume mensuel' : 'Your monthly volume'}
                  </p>
                  <div ref={creatorDropRef} className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => setCreatorDropOpen((o) => !o)}
                      className={`flex w-full items-center justify-between rounded-xl border bg-neutral-900 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:border-empire/40 ${isPromoPlan ? 'border-red-500/30' : 'border-white/10'}`}
                    >
                      <span className="truncate">
                        {plan.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} cr. · {plan.contents} {fr ? 'contenus/mois' : 'pieces/mo'} — {monthly}€{fr ? '/mois' : '/mo'}
                      </span>
                      <ChevronDown size={16} className={`shrink-0 ml-2 text-neutral-400 transition-transform ${creatorDropOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {creatorDropOpen && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl">
                        {PLANS.map((p) => {
                          const mp = monthlyPrice(planBase(p), billing)
                          const isPromo = promoOn && flashPromo && p.id === flashPromo.plan
                          const active = p.id === selectedTier
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => { setSelectedTier(p.id); setCreatorDropOpen(false) }}
                              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${active ? 'bg-empire/10 text-white' : 'text-neutral-300 hover:bg-white/5'}`}
                            >
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-semibold">
                                  {p.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'crédits' : 'credits'} · {p.contents} {fr ? 'contenus/mois' : 'pieces/mo'}
                                </span>
                                {isPromo && (
                                  <span className="text-xs text-red-400">
                                    {fr ? `${mp}€/mois à vie au lieu de ${monthlyPrice(p.price, billing)}€` : `€${mp}/mo forever instead of €${monthlyPrice(p.price, billing)}`}
                                  </span>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="font-bold tabular-nums">{mp}€<span className="text-xs font-normal text-neutral-500">{fr ? '/mois' : '/mo'}</span></span>
                                {isPromo && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">DEAL</span>}
                                {p.highlighted && !isPromo && <span className="rounded-full bg-empire/15 px-2 py-0.5 text-[10px] font-bold text-empire">{fr ? 'Populaire' : 'Popular'}</span>}
                                {active && <Check size={14} className="text-empire" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  {(billing !== 'monthly' || isPromoPlan) && (
                    <span className="text-lg text-neutral-600 line-through tabular-nums">{isPromoPlan ? flashPromo!.baseMonthly : plan.price}€</span>
                  )}
                  <span className="text-4xl font-extrabold tabular-nums">{monthly}€</span>
                  <span className="text-sm text-neutral-400">{fr ? '/mois' : '/mo'}</span>
                  {isPromoPlan && flashPromoLeft && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1">
                      <span className="font-mono text-sm font-bold tabular-nums text-red-400">{flashPromoLeft}</span>
                    </span>
                  )}
                </div>
                {billing !== 'monthly' && (
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {fr ? `Facturé ${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('fr-FR')}€${billing === 'quarterly' ? '/trim' : '/an'}` : `Billed €${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('en-US')}${billing === 'quarterly' ? '/qtr' : '/yr'}`}
                  </p>
                )}

                <div className="my-5 h-px bg-white/10" />

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Tout inclus (voir ci-dessous)' : 'Everything included (see below)'}
                  </li>
                  <li className={`flex items-start gap-2 text-[13px] ${selectedTier === 'starter' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    {selectedTier === 'starter' ? <Minus size={14} className="mt-0.5 shrink-0" /> : <Check size={14} className="mt-0.5 shrink-0 text-empire" />}
                    {fr ? 'Replays masterclass (valeur 197€)' : 'Masterclass replays (€197 value)'}
                  </li>
                  <li className={`flex items-start gap-2 text-[13px] ${selectedTier === 'starter' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    {selectedTier === 'starter' ? <Minus size={14} className="mt-0.5 shrink-0" /> : <Check size={14} className="mt-0.5 shrink-0 text-empire" />}
                    {fr ? 'Live sessions hebdomadaires' : 'Weekly live sessions'}
                  </li>
                  <li className={`flex items-start gap-2 text-[13px] ${selectedTier !== 'scale' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    {selectedTier !== 'scale' ? <Minus size={14} className="mt-0.5 shrink-0" /> : <Check size={14} className="mt-0.5 shrink-0 text-empire" />}
                    {fr ? 'Support prioritaire' : 'Priority support'}
                  </li>
                </ul>

                {/* CTA */}
                <a
                  href={planUrl(plan.id, billing)}
                  onClick={() => {
                    const props = { plan: plan.id, billing_period: billing, price_monthly: monthlyPrice(planBase(plan), billing), location: 'home' }
                    trackAmplitude('pricing_plan_click', props)
                    if (posthog.__loaded) posthog.capture('pricing_plan_click', props, { transport: 'sendBeacon' })
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-4 py-3.5 text-center text-sm font-bold text-black transition-all hover:brightness-110"
                >
                  {fr ? 'Démarrer l\u2019essai gratuit' : 'Start free trial'}
                </a>
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  {fr ? '7 jours gratuits · Annulez en 1 clic' : '7 days free · Cancel in 1 click'}
                </p>

              </motion.div>
            )
          })()}

          {/* Équipe & Agence */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8 flex flex-col"
          >
            {/* Header */}
            <h3 className="text-lg font-bold">{fr ? 'Équipe & Agence' : 'Team & Agency'}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {fr ? 'Plusieurs créateurs, une seule facturation' : 'Several creators, one billing'}
            </p>

            {/* Selector: credits per seat + seats */}
            <div className="min-h-[155px]">
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                {fr ? 'Crédits par siège' : 'Credits per seat'}
              </p>
              <div ref={teamDropRef} className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setTeamDropOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:border-empire/40"
                >
                  <span className="truncate">
                    {TEAM_TIER_PRICES[teamTier].credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'crédits/siège' : 'credits/seat'} — {monthlyPrice(TEAM_TIER_PRICES[teamTier].price, billing)}€{fr ? '/mois' : '/mo'}
                  </span>
                  <ChevronDown size={16} className={`shrink-0 ml-2 text-neutral-400 transition-transform ${teamDropOpen ? 'rotate-180' : ''}`} />
                </button>
                {teamDropOpen && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl">
                    {(Object.keys(TEAM_TIER_PRICES) as PlanId[]).map((tierId) => {
                      const t = TEAM_TIER_PRICES[tierId]
                      const mp = monthlyPrice(t.price, billing)
                      const active = tierId === teamTier
                      return (
                        <button
                          key={tierId}
                          type="button"
                          onClick={() => { setTeamTier(tierId); setTeamDropOpen(false) }}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${active ? 'bg-empire/10 text-white' : 'text-neutral-300 hover:bg-white/5'}`}
                        >
                          <span className="font-semibold">{t.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'crédits/siège' : 'credits/seat'}</span>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="font-bold tabular-nums">{mp}€<span className="text-xs font-normal text-neutral-500">{fr ? '/mois' : '/mo'}</span></span>
                            {active && <Check size={14} className="text-empire" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Seat counter */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {fr ? 'Sièges' : 'Seats'}
                </span>
                <button
                  type="button"
                  onClick={() => setTeamSeats((s) => Math.max(1, s - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-empire/50"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-lg font-bold tabular-nums">{teamSeats}</span>
                <button
                  type="button"
                  onClick={() => setTeamSeats((s) => Math.min(20, s + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-empire/50"
                >
                  <Plus size={14} />
                </button>
                {teamDiscount && (
                  <span className="rounded-full bg-empire/10 px-2 py-0.5 text-[10px] font-bold text-empire">{teamDiscount.label}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              {teamSeatPrice < TEAM_TIER_PRICES[teamTier].price && (
                <span className="text-lg text-neutral-600 line-through tabular-nums">{TEAM_TIER_PRICES[teamTier].price.toLocaleString(fr ? 'fr-FR' : 'en-US')}€</span>
              )}
              <span className="text-4xl font-extrabold tabular-nums">{teamSeatPrice.toLocaleString(fr ? 'fr-FR' : 'en-US')}€</span>
              <span className="text-sm text-neutral-400">{fr ? '/siège/mois' : '/seat/mo'}</span>
              {teamBillingBadge && (
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-400">{teamBillingBadge}</span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              {fr
                ? `≈ ${(teamSeatPrice * teamSeats).toLocaleString('fr-FR')}€/mois au total — ${(TEAM_TIER_PRICES[teamTier].credits * teamSeats).toLocaleString('fr-FR')} crédits/mois`
                : `≈ €${(teamSeatPrice * teamSeats).toLocaleString('en-US')}/mo total — ${(TEAM_TIER_PRICES[teamTier].credits * teamSeats).toLocaleString('en-US')} credits/mo`}
            </p>

            <div className="my-5 h-px bg-white/10" />

            {/* Features */}
            <p className="text-[12px] font-semibold text-white">
              {fr ? 'Tout du plan Créateur, plus :' : 'Everything in Creator, plus:'}
            </p>
            <ul className="mt-2 space-y-2 flex-1">
              {TEAM_FEATURES.map((f) => (
                <li key={f.fr} className="flex items-start gap-2 text-[13px] text-neutral-300">
                  <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                  {fr ? f.fr : f.en}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href={withAmplitudeDeviceId(`${APP_ONBOARDING_URL}?intent=enterprise&plan=${teamTier}&seats=${teamSeats}&billing=${billing}`)}
              onClick={() => {
                const props = { plan: teamTier, seats: teamSeats, billing_period: billing, location: 'home' }
                trackAmplitude('pricing_team_configure_click', props)
                if (posthog.__loaded) posthog.capture('pricing_team_configure_click', props, { transport: 'sendBeacon' })
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-center text-sm font-bold text-white transition-all hover:brightness-110 hover:bg-white/10"
            >
              {fr ? `Configurer ${teamSeats} siège${teamSeats > 1 ? 's' : ''}` : `Configure ${teamSeats} seat${teamSeats > 1 ? 's' : ''}`}
            </a>
          </motion.div>

          {/* Plan personnalisé */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8 flex flex-col"
          >
            <h3 className="text-lg font-bold">{fr ? 'Plan personnalisé' : 'Custom Plan'}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {fr
                ? 'Volume, accompagnement et intégrations sur mesure'
                : 'Custom volume, support and integrations'}
            </p>

            <div className="min-h-[155px]" />

            {/* Price - aligned with other cards */}
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-extrabold">{fr ? 'Sur mesure' : 'Custom'}</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              {fr ? 'Tarif adapté à vos besoins' : 'Pricing adapted to your needs'}
            </p>

            <div className="my-5 h-px bg-white/10" />

            <p className="text-[12px] font-semibold text-white mb-2">
              {fr ? 'Tout du plan Créateur, plus :' : 'Everything in Creator, plus:'}
            </p>
            <ul className="space-y-2 flex-1">
              {(fr
                ? [
                    'Volume de crédits sur mesure',
                    'Account manager dédié',
                    'Onboarding personnalisé',
                    'Intégrations & API avancées',
                    'Facturation adaptée',
                    'SLA & support prioritaire',
                  ]
                : [
                    'Custom credit volume',
                    'Dedicated account manager',
                    'Personalized onboarding',
                    'Advanced integrations & API',
                    'Custom billing',
                    'SLA & priority support',
                  ]
              ).map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-300">
                  <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/join-us"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-center text-sm font-bold text-white transition-all hover:brightness-110 hover:bg-white/10"
            >
              <MessageCircle size={15} />
              {fr ? 'Contactez-nous' : 'Contact us'}
            </Link>
          </motion.div>
        </div>

        {/* Inclus dans tous les plans */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          className="mt-6 max-w-6xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5"
        >
          <p className="text-sm font-bold text-white mb-3">
            {fr ? 'Inclus dans tous les plans :' : 'Included in every plan:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2">
            {ALL_PLANS_FEATURES.map((f) => (
              <div key={f.fr} className="flex items-start gap-1.5 text-[12px] text-neutral-400">
                <Check size={12} className="mt-0.5 shrink-0 text-empire" />
                {fr ? f.fr : f.en}
              </div>
            ))}
          </div>
        </motion.div>

        {/* What happens next — 4 steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="mt-14 max-w-6xl mx-auto"
        >
          <h3 className="text-center text-lg font-bold mb-8">
            {fr ? 'Comment ça se passe ?' : 'What happens next?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {([
              { step: 1, fr: 'Créez votre compte et connectez vos réseaux', en: 'Create your account and connect your channels' },
              { step: 2, fr: 'On identifie les sujets viraux de votre niche chaque jour', en: 'We find the viral topics in your niche every day' },
              { step: 3, fr: 'Vous enregistrez 7 sujets en 15 min', en: 'You record 7 topics in 15 min' },
              { step: 4, fr: 'Notre équipe produit et ajoute vos contenus — vous publiez en 1 clic', en: 'Our team produces and delivers your content — you publish in 1 click' },
            ] as const).map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-empire/15 text-sm font-bold text-empire">
                  {s.step}
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">{fr ? s.fr : s.en}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lien vers le détail des contenus/features (section Fonctionnalités) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 text-center"
        >
          <a
            href="#features"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-empire hover:underline"
          >
            {fr ? 'Explorer tout ce qui est inclus ↓' : 'Explore everything included ↓'}
          </a>
        </motion.div>


        {/* Coaching modal */}
        {coachingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setCoachingModal(null); setLoadingPlan(null) }} />
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
              <button
                onClick={() => { setCoachingModal(null); setLoadingPlan(null) }}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors text-lg"
              >
                &times;
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-empire/15 flex items-center justify-center">
                  <GraduationCap size={20} className="text-empire" />
                </div>
                <div>
                  <p className="font-bold text-white">
                    {fr ? 'Ajouter le coaching ?' : 'Add coaching?'}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {fr ? `Palier ${coachingModal.nameFr}` : `${coachingModal.nameEn} tier`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-empire/30 bg-empire/[0.06] p-4 mb-4">
                <p className="text-sm font-semibold text-white mb-1">
                  {fr ? '4h de coaching avec un expert Empire' : '4h of coaching with an Empire expert'}
                  <span className="ml-2 font-bold text-empire">{COACHING_PRICE}€</span>
                  <span className="ml-1 text-neutral-500 font-normal">{fr ? '· une seule fois' : '· one-time'}</span>
                </p>
                <p className="text-[13px] text-neutral-400 mb-2">
                  {fr
                    ? 'Nos coachs génèrent minimum 100K vues par semaine et ont été formés par nos équipes. Ils comprennent votre business et vous donnent la stratégie exacte pour performer dans votre niche.'
                    : 'Our coaches generate 100K+ views per week and have been trained by our team. They understand your business and give you the exact strategy to perform in your niche.'}
                </p>
                <ul className="space-y-1">
                  {(fr
                    ? ['Positionnement et formats gagnants', 'Stratégie de contenu personnalisée', 'Analyse de vos concurrents et opportunités']
                    : ['Positioning and winning formats', 'Personalized content strategy', 'Competitor analysis and opportunities']
                  ).map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                      <Check size={12} className="shrink-0 text-empire" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => { setCoachingModal(null); startCheckout(coachingModal, true) }}
                  disabled={loadingPlan !== null}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-empire px-4 py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {loadingPlan && <Loader2 size={15} className="animate-spin" />}
                  {fr ? `Oui, ajouter le coaching (+${COACHING_PRICE}€)` : `Yes, add coaching (+€${COACHING_PRICE})`}
                </button>
                <button
                  onClick={() => { setCoachingModal(null); startCheckout(coachingModal, false) }}
                  disabled={loadingPlan !== null}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-white/10 disabled:opacity-60"
                >
                  {loadingPlan && <Loader2 size={15} className="animate-spin" />}
                  {fr ? 'Non merci, continuer sans' : 'No thanks, continue without'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Human team reassurance strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-10 grid gap-4 sm:grid-cols-3 max-w-6xl mx-auto"
        >
          {([
            {
              icon: Scissors,
              textFr: 'Notre équipe découpe et monte vos Reels, rédige vos posts LinkedIn et vos newsletters.',
              textEn: 'Our team cuts and edits your Reels, writes your LinkedIn posts and newsletters.',
            },
            {
              icon: CalendarCheck,
              textFr: 'Vos contenus sont ajoutés à votre calendrier — vous publiez en 1 clic.',
              textEn: 'Your content is added to your calendar — publish in 1 click.',
            },
            {
              icon: ShieldCheck,
              textFr: 'Chaque contenu est vérifié par des humains formés à la viralité.',
              textEn: 'Every piece of content is verified by humans trained in virality.',
            },
          ] as const).map((item) => (
            <div key={item.textEn} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
              <item.icon size={18} className="mt-0.5 shrink-0 text-empire" />
              <p className="text-sm text-neutral-300">{fr ? item.textFr : item.textEn}</p>
            </div>
          ))}
        </motion.div>


      </div>
    </section>
  )
}
