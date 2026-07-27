'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Scissors, CalendarCheck, ShieldCheck, Minus, Plus, ChevronDown, MessageCircle, GraduationCap } from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'
import { fetchFlashPromo, formatCountdown } from '@/lib/flash-promo'
import { useAcademyPricing } from '@/hooks/useAcademyPricing'

const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

type PlanId = 'starter' | 'growth' | 'scale'
type BillingId = 'monthly' | 'quarterly' | 'yearly'

const BILLING_PERIODS: {
  id: BillingId
  discount: number
  months: number
  labelFr: string
  labelEn: string
}[] = [
  { id: 'monthly', discount: 0, months: 1, labelFr: 'Mensuel', labelEn: 'Monthly' },
  { id: 'quarterly', discount: 0.12, months: 3, labelFr: 'Trimestriel', labelEn: 'Quarterly' },
  { id: 'yearly', discount: 0.18, months: 12, labelFr: 'Annuel', labelEn: 'Yearly' },
]

type Plan = {
  id: PlanId
  price: number
  credits: number
  contents: string
  highlighted?: boolean
}

const PLANS: Plan[] = [
  { id: 'starter', price: 199, credits: 2200, contents: '~22' },
  { id: 'growth', price: 499, credits: 6600, contents: '~89', highlighted: true },
  { id: 'scale', price: 799, credits: 12000, contents: '~177' },
]

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

function volumeDiscount(seats: number): number {
  if (seats >= 10) return 0.20
  if (seats >= 5) return 0.15
  if (seats >= 3) return 0.10
  return 0
}

function combinedDiscount(billing: BillingId, seats: number): number {
  const billingD = BILLING_PERIODS.find(p => p.id === billing)!.discount
  const volumeD = volumeDiscount(seats)
  return 1 - (1 - billingD) * (1 - volumeD)
}

function finalPrice(base: number, billing: BillingId, seats: number): number {
  return Math.round(base * (1 - combinedDiscount(billing, seats)))
}

function planUrl(planId: PlanId, billing: BillingId, seats: number): string {
  const base = `${APP_ONBOARDING_URL}?plan=${planId}&billing=${billing}&intent=${seats > 1 ? 'enterprise' : 'trial'}`
  const withSeats = seats > 1 ? `${base}&seats=${seats}` : base
  return withAmplitudeDeviceId(withSeats)
}

export default function HomePricingSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const viewedRef = useRef(false)

  const academyPricing = useAcademyPricing()

  const [billing] = useState<BillingId>('yearly')
  const [selectedTier, setSelectedTier] = useState<PlanId>('growth')
  const [seats, setSeats] = useState(1)
  const [showSeats, setShowSeats] = useState(false)

  useEffect(() => {
    if (!isInView || viewedRef.current) return
    viewedRef.current = true
    trackAmplitude('pricing_section_viewed', { location: 'home' })
    if (posthog.__loaded) {
      posthog.capture('pricing_section_viewed', { location: 'home' })
    }
  }, [isInView])

  // Promo flash
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
      if (remaining <= 0) { setFlashPromo(null); setFlashPromoLeft(null); return }
      setFlashPromoLeft(formatCountdown(remaining))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [flashPromo])
  const promoOn = !!flashPromo && !!flashPromoLeft

  const promoAutoSelected = useRef(false)
  useEffect(() => {
    if (flashPromo && !promoAutoSelected.current) {
      promoAutoSelected.current = true
      setSelectedTier(flashPromo.plan as PlanId)
    }
  }, [flashPromo])

  const planBase = (p: Plan) => (promoOn && flashPromo && p.id === flashPromo.plan ? flashPromo.promoMonthly : p.price)

  // Dropdown
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Computed prices for card 2
  const plan = PLANS.find(p => p.id === selectedTier)!
  const isPromoPlan = promoOn && !!flashPromo && plan.id === flashPromo.plan
  const monthly = finalPrice(planBase(plan), billing, seats)
  const discount = combinedDiscount(billing, seats)
  const discountPct = Math.round(discount * 100)

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
            {fr ? 'Choisissez votre approche' : 'Choose your approach'}
          </h2>
          <p className="mt-4 text-neutral-400">
            {fr
              ? 'Apprenez à le faire, faites-le avec nous, ou laissez-nous tout gérer.'
              : 'Learn to do it, do it with us, or let us handle everything.'}
          </p>

          {/* Promo flash */}
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
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">

          {/* ── Card 1: Devenez Head of Virality (Academy) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8 flex flex-col"
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-empire" />
              <h3 className="text-lg font-bold">{fr ? 'Devenez Head of Virality' : 'Become Head of Virality'}</h3>
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              {fr ? 'Apprenez à le faire vous-même' : 'Learn to do it yourself'}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-extrabold tabular-nums">{academyPricing.price}€</span>
              <span className="text-sm text-neutral-400">{fr ? 'paiement unique' : 'one-time'}</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              {fr ? 'ou 3x 165€' : 'or 3x €165'}
            </p>

            <div className="my-5 h-px bg-white/10" />

            <ul className="space-y-2 flex-1">
              {(fr
                ? [
                    'Accès à Empire Alpha — posts + Shorts générés',
                    '21 défis quotidiens pour lancer votre marque',
                    '6 masterclass lives (viralité, IA, monétisation)',
                    'Pod LinkedIn — le groupe engage sur vos posts',
                    'Certification officielle (Bronze, Argent, Or)',
                    'Premier client garanti après 3 mois*',
                  ]
                : [
                    'Access to Empire Alpha — posts + Shorts generated',
                    '21 daily challenges to launch your brand',
                    '6 live masterclasses (virality, AI, monetization)',
                    'LinkedIn Pod — the group engages on your posts',
                    'Official certification (Bronze, Silver, Gold)',
                    'First client guaranteed after 3 months*',
                  ]
              ).map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-300">
                  <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/academy"
              target="_blank"
              onClick={() => {
                trackAmplitude('pricing_academy_click', { price: academyPricing.price, location: 'home' })
                if (posthog.__loaded) posthog.capture('pricing_academy_click', { price: academyPricing.price }, { transport: 'sendBeacon' })
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-center text-sm font-bold text-white transition-all hover:brightness-110 hover:bg-white/10"
            >
              {fr ? 'Découvrir l\'Academy' : 'Discover the Academy'}
            </Link>
            {academyPricing.isUrgent && (
              <p className="text-center text-[11px] text-empire font-bold mt-2 animate-pulse">
                {fr ? `Le prix augmente dans ${academyPricing.countdown}` : `Price increases in ${academyPricing.countdown}`}
              </p>
            )}
          </motion.div>

          {/* ── Card 2: Créez votre marque (merged Créateur + Équipe) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className={`rounded-2xl p-6 lg:p-8 flex flex-col ${isPromoPlan ? 'border border-red-500/40 bg-white/[0.03]' : 'border border-empire/50 bg-white/[0.03]'}`}
          >
            {isPromoPlan && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400">
                {fr ? 'Offre flash — prix à vie' : 'Flash deal — price locked forever'}
              </span>
            )}
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{fr ? 'Créez votre marque' : 'Build your brand'}</h3>
              <span className="rounded-full bg-empire/15 border border-empire/30 px-2.5 py-0.5 text-[10px] font-bold text-empire uppercase tracking-wider">
                {fr ? 'Populaire' : 'Popular'}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              {fr ? 'On le fait avec vous' : 'We do it with you'}
            </p>

            {/* Volume dropdown */}
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              {fr ? 'Volume mensuel' : 'Monthly volume'}
            </p>
            <div ref={dropRef} className="relative mt-2">
              <button
                type="button"
                onClick={() => setDropOpen(o => !o)}
                className={`flex w-full items-center justify-between rounded-xl border bg-neutral-900 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:border-empire/40 ${isPromoPlan ? 'border-red-500/30' : 'border-white/10'}`}
              >
                <span className="truncate">
                  {plan.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} cr. · {plan.contents} {fr ? 'contenus/mois' : 'pieces/mo'}
                </span>
                <ChevronDown size={16} className={`shrink-0 ml-2 text-neutral-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl">
                  {PLANS.map((p) => {
                    const active = p.id === selectedTier
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setSelectedTier(p.id); setDropOpen(false) }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${active ? 'bg-empire/10 text-white' : 'text-neutral-300 hover:bg-white/5'}`}
                      >
                        <span className="font-semibold">
                          {p.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'crédits' : 'credits'} · {p.contents} {fr ? 'contenus/mois' : 'pieces/mo'}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="font-bold tabular-nums">{finalPrice(planBase(p), billing, seats)}€<span className="text-xs font-normal text-neutral-500">{fr ? '/mois' : '/mo'}</span></span>
                          {p.highlighted && <span className="rounded-full bg-empire/15 px-2 py-0.5 text-[10px] font-bold text-empire">{fr ? 'Populaire' : 'Popular'}</span>}
                          {active && <Check size={14} className="text-empire" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Multi-seat toggle */}
            {!showSeats ? (
              <button
                type="button"
                onClick={() => { setShowSeats(true); setSeats(2) }}
                className="mt-3 text-[12px] text-empire font-semibold hover:underline text-left"
              >
                {fr ? 'Besoin de plusieurs places ?' : 'Need multiple seats?'}
              </button>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {fr ? 'Places' : 'Seats'}
                </span>
                <button
                  type="button"
                  onClick={() => { const n = Math.max(1, seats - 1); setSeats(n); if (n === 1) setShowSeats(false) }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-empire/50"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-lg font-bold tabular-nums">{seats}</span>
                <button
                  type="button"
                  onClick={() => setSeats(s => Math.min(20, s + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-empire/50"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              {(discountPct > 0 || isPromoPlan) && (
                <span className="text-lg text-neutral-600 line-through tabular-nums">{isPromoPlan ? flashPromo!.baseMonthly : plan.price}€</span>
              )}
              <span className="text-4xl font-extrabold tabular-nums">{monthly}€</span>
              <span className="text-sm text-neutral-400">{seats > 1 ? (fr ? '/place/mois' : '/seat/mo') : (fr ? '/mois' : '/mo')}</span>
              {discountPct > 0 && (
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-400">-{discountPct}%</span>
              )}
              {isPromoPlan && flashPromoLeft && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1">
                  <span className="font-mono text-sm font-bold tabular-nums text-red-400">{flashPromoLeft}</span>
                </span>
              )}
            </div>
            {seats > 1 && (
              <p className="mt-1 text-[11px] text-neutral-500">
                {fr
                  ? `≈ ${(monthly * seats).toLocaleString('fr-FR')}€/mois au total — ${(plan.credits * seats).toLocaleString('fr-FR')} crédits/mois`
                  : `≈ €${(monthly * seats).toLocaleString('en-US')}/mo total — ${(plan.credits * seats).toLocaleString('en-US')} credits/mo`}
              </p>
            )}
            {billing !== 'monthly' && seats <= 1 && (
              <p className="mt-1 text-[11px] text-neutral-500">
                {fr ? `Facturé ${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('fr-FR')}€${billing === 'quarterly' ? '/trim' : '/an'}` : `Billed €${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('en-US')}${billing === 'quarterly' ? '/qtr' : '/yr'}`}
              </p>
            )}

            <div className="my-5 h-px bg-white/10" />

            {/* Features: conditional on seats */}
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
              {seats > 1 && (
                <>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Chaque place : son calendrier + ses crédits' : 'Each seat: its own calendar + credits'}
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Account manager dédié' : 'Dedicated account manager'}
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Onboarding personnalisé' : 'Personalized onboarding'}
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-neutral-300">
                    <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                    {fr ? 'Facturation sur mesure' : 'Custom billing'}
                  </li>
                </>
              )}
              <li className={`flex items-start gap-2 text-[13px] ${selectedTier !== 'scale' && seats <= 1 ? 'text-neutral-600' : 'text-neutral-300'}`}>
                {selectedTier !== 'scale' && seats <= 1 ? <Minus size={14} className="mt-0.5 shrink-0" /> : <Check size={14} className="mt-0.5 shrink-0 text-empire" />}
                {fr ? 'Support prioritaire' : 'Priority support'}
              </li>
            </ul>

            <a
              href={planUrl(plan.id, billing, seats)}
              onClick={() => {
                const props = { plan: plan.id, billing_period: billing, seats, price_monthly: monthly, location: 'home' }
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

          {/* ── Card 3: On la crée pour vous (done-for-you) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8 flex flex-col"
          >
            <h3 className="text-lg font-bold">{fr ? 'On la crée pour vous' : 'We build it for you'}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {fr
                ? 'Kevin Dufraisse crée votre marque de A à Z. Vous ne vous occupez de rien.'
                : 'Kevin Dufraisse builds your brand from A to Z. You handle nothing.'}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-extrabold">{fr ? 'Sur mesure' : 'Custom'}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
              </span>
              <span className="text-[11px] font-bold text-orange-400">
                {fr ? '10 places disponibles' : '10 spots available'}
              </span>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <ul className="space-y-2 flex-1">
              {(fr
                ? [
                    'Stratégie de marque complète par Kevin',
                    'Création de contenu 100% done-for-you',
                    'Volume de crédits sur mesure',
                    'Account manager dédié',
                    'Onboarding personnalisé',
                    'Intégrations & API avancées',
                    'SLA & support prioritaire',
                  ]
                : [
                    'Full brand strategy by Kevin',
                    '100% done-for-you content creation',
                    'Custom credit volume',
                    'Dedicated account manager',
                    'Personalized onboarding',
                    'Advanced integrations & API',
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

        {/* What happens next */}
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
