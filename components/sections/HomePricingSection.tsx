'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Scissors, CalendarCheck, ShieldCheck, Loader2, GraduationCap, Minus, Plus, Calculator } from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude, withAmplitudeDeviceId, getAmplitudeDeviceId } from '@/lib/amplitude'

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
// Cartes minimalistes façon lemlist : le détail des contenus vit dans la
// section Fonctionnalités (#features), pas dans les cartes.
const PLANS: Plan[] = [
  {
    id: 'starter',
    price: 199,
    credits: 2200,
    contents: '~22',
    nameFr: 'Starter',
    nameEn: 'Starter',
    descFr: 'Pour poster régulièrement sans y penser',
    descEn: 'Post consistently without thinking about it',
    featuresFr: [
      'Posts LinkedIn + Reels',
      'Cerveau Empire — mémoire IA de votre business',
      'Communauté Slack',
    ],
    featuresEn: [
      'LinkedIn posts + Reels',
      'Empire Brain — AI memory of your business',
      'Slack community',
    ],
  },
  {
    id: 'growth',
    price: 499,
    credits: 6600,
    contents: '~89',
    nameFr: 'Growth',
    nameEn: 'Growth',
    descFr: 'Pour devenir une référence',
    descEn: 'Become the reference',
    featuresFr: [
      'Tout Starter, plus :',
      'Newsletters, vidéos YouTube, carrousels',
      'Replays masterclass inclus (197€ offerts)',
    ],
    featuresEn: [
      'Everything in Starter, plus:',
      'Newsletters, YouTube videos, carousels',
      'Masterclass replays included (€197 value)',
    ],
    highlighted: true,
  },
  {
    id: 'scale',
    price: 799,
    credits: 12000,
    contents: '~177',
    nameFr: 'Scale',
    nameEn: 'Scale',
    descFr: 'Pour saturer votre marché de contenu',
    descEn: 'Saturate your market with content',
    featuresFr: [
      'Tout Growth, plus :',
      'Sièges & multi-comptes (agence/équipe)',
      'Analytics avancés',
      'Priorité de production',
    ],
    featuresEn: [
      'Everything in Growth, plus:',
      'Seats & multi-accounts (agency/team)',
      'Advanced analytics',
      'Production priority',
    ],
  },
]

// Coaching add-on, same offer as the app's pre-checkout popup (500€ one-time)
const COACHING_PRICE = 500

// Coûts crédits par contenu (miroir de l'app : src/lib/hooks/useCredits.ts CREDIT_COSTS)
const ESTIMATOR_ITEMS: { key: string; labelFr: string; labelEn: string; cost: number }[] = [
  { key: 'linkedin', labelFr: 'Posts LinkedIn (+ reel viral auto)', labelEn: 'LinkedIn posts (+ auto viral reel)', cost: 85 + 29 },
  { key: 'frontcam', labelFr: 'Reels front-cam montés', labelEn: 'Edited front-cam reels', cost: 350 },
  { key: 'newsletter', labelFr: 'Newsletters', labelEn: 'Newsletters', cost: 115 },
  { key: 'youtube', labelFr: 'Vidéos YouTube', labelEn: 'YouTube videos', cost: 275 },
  { key: 'carousel', labelFr: 'Carrousels', labelEn: 'Carousels', cost: 180 },
]

// Table de comparaison des plans (aligné sur le gating in-app)
const COMPARE_ROWS: { labelFr: string; labelEn: string; values: (string | boolean)[] }[] = [
  { labelFr: 'Prix (base mensuelle)', labelEn: 'Price (monthly base)', values: ['199€', '499€', '799€', '__custom__'] },
  { labelFr: 'Crédits / mois', labelEn: 'Credits / mo', values: ['2 200', '6 600', '12 000', '__unlimited__'] },
  { labelFr: 'Contenus / mois', labelEn: 'Contents / mo', values: ['~22', '~89', '~177', '__custom__'] },
  { labelFr: 'Posts LinkedIn + Reels', labelEn: 'LinkedIn posts + Reels', values: [true, true, true, true] },
  { labelFr: 'Cerveau Empire (IA)', labelEn: 'Empire Brain (AI)', values: [true, true, true, true] },
  { labelFr: 'Communauté Slack', labelEn: 'Slack community', values: [true, true, true, true] },
  { labelFr: 'Publication sur 7 réseaux', labelEn: 'Publishing to 7 networks', values: [true, true, true, true] },
  { labelFr: 'Newsletters', labelEn: 'Newsletters', values: [false, true, true, true] },
  { labelFr: 'Vidéos YouTube', labelEn: 'YouTube videos', values: [false, true, true, true] },
  { labelFr: 'Carrousels', labelEn: 'Carousels', values: [false, true, true, true] },
  { labelFr: 'Replays masterclass (197€)', labelEn: 'Masterclass replays (€197)', values: [false, true, true, true] },
  { labelFr: 'Sièges & multi-comptes', labelEn: 'Seats & multi-accounts', values: [false, false, true, true] },
  { labelFr: 'Analytics avancés', labelEn: 'Advanced analytics', values: [false, false, true, true] },
  { labelFr: 'Priorité de production', labelEn: 'Production priority', values: [false, false, true, true] },
  { labelFr: 'Account manager dédié', labelEn: 'Dedicated account manager', values: [false, false, false, true] },
]

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
  // Estimateur de crédits (sélectionneur façon lemlist)
  const [estimator, setEstimator] = useState<Record<string, number>>({ linkedin: 12, frontcam: 1, newsletter: 4, youtube: 0, carousel: 0 })
  const totalEstimate = ESTIMATOR_ITEMS.reduce((sum, it) => sum + (estimator[it.key] || 0) * it.cost, 0)
  const recommendedPlan = totalEstimate <= 2200 ? PLANS[0] : totalEstimate <= 6600 ? PLANS[1] : totalEstimate <= 12000 ? PLANS[2] : null

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
              ? '7 jours d’essai gratuit sur tous les plans. Sans engagement, annulez en 1 clic.'
              : '7-day free trial on every plan. No commitment, cancel in 1 click.'}
          </p>


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

        <div className="mt-10 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {PLANS.map((plan, i) => {
            const monthly = monthlyPrice(plan.price, billing)
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'border-empire/50 bg-empire/[0.06] shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.12)]'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-empire px-3 py-1 text-[11px] font-bold text-black whitespace-nowrap">
                    {fr ? 'Le plus populaire' : 'Most popular'}
                  </span>
                )}

                <h3 className="text-lg font-bold">{fr ? plan.nameFr : plan.nameEn}</h3>
                <p className="mt-1 text-sm text-neutral-400">{fr ? plan.descFr : plan.descEn}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold">{monthly}€</span>
                  <span className="text-sm text-neutral-400">{fr ? '/mois' : '/month'}</span>
                </div>
                <p className="mt-1.5 text-[12px] text-neutral-500">
                  {plan.credits.toLocaleString()} {fr ? 'crédits' : 'credits'} · {plan.contents} {fr ? 'contenus/mois' : 'contents/mo'}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {(fr ? plan.featuresFr : plan.featuresEn).map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[13px] text-neutral-300">
                      <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex-1" />

                <button
                  onClick={() => handlePlanClick(plan)}
                  disabled={loadingPlan !== null}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 ${
                    plan.highlighted
                      ? 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
                      : 'bg-empire/90 text-black hover:bg-empire'
                  }`}
                >
                  {loadingPlan === plan.id && <Loader2 size={15} className="animate-spin" />}
                  {fr ? 'Démarrer l’essai gratuit' : 'Start free trial'}
                </button>
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  {fr ? '7 jours gratuits · Annulez en 1 clic' : '7 days free · Cancel in 1 click'}
                </p>
              </motion.div>
            )
          })}

        </div>

        {/* Lien vers le détail des contenus/features (section Fonctionnalités) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-6 text-center"
        >
          <a
            href="#features"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-empire hover:underline"
          >
            {fr ? 'Explorer tout ce qui est inclus dans chaque plan ↓' : 'Explore everything included in each plan ↓'}
          </a>
        </motion.div>

        {/* Estimateur de crédits — sélectionneur façon lemlist */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.32, ease: 'easeOut' }}
          className="mt-10 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5"
        >
          <div className="flex items-center gap-2.5">
            <Calculator size={18} className="text-empire shrink-0" />
            <div>
              <h3 className="text-base font-bold">
                {fr ? 'De combien de crédits avez-vous besoin ?' : 'How many credits do you need?'}
              </h3>
              <p className="text-sm text-neutral-400">
                {fr
                  ? 'Composez votre mois type — on vous recommande le plan adapté.'
                  : "Build your typical month — we'll recommend the right plan."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ESTIMATOR_ITEMS.map((it) => (
              <div key={it.key} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                <p className="text-xs font-medium text-neutral-200 leading-tight min-h-8">
                  {fr ? it.labelFr : it.labelEn}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    aria-label="-"
                    onClick={() => setEstimator((prev) => ({ ...prev, [it.key]: Math.max(0, (prev[it.key] || 0) - 1) }))}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-neutral-400 transition-colors hover:bg-white/10"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold tabular-nums">{estimator[it.key] || 0}</span>
                  <button
                    type="button"
                    aria-label="+"
                    onClick={() => setEstimator((prev) => ({ ...prev, [it.key]: Math.min(60, (prev[it.key] || 0) + 1) }))}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-neutral-400 transition-colors hover:bg-white/10"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-center text-[10px] text-neutral-500">{it.cost} cr. / u</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-empire/30 bg-empire/10 px-4 py-3 sm:flex-row">
            <p className="text-sm text-neutral-200">
              Total : <span className="font-bold text-empire">{totalEstimate.toLocaleString(fr ? 'fr-FR' : 'en-US')}</span>{' '}
              <span className="text-xs text-neutral-400">{fr ? 'crédits/mois' : 'credits/mo'}</span>
            </p>
            {recommendedPlan ? (
              <p className="text-sm font-semibold">
                {fr ? 'Plan recommandé :' : 'Recommended plan:'}{' '}
                <span className="font-bold text-empire">{fr ? recommendedPlan.nameFr : recommendedPlan.nameEn}</span>
                <span className="ml-1.5 text-xs text-neutral-400">
                  ({recommendedPlan.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} cr. — {recommendedPlan.price}€{fr ? '/mois' : '/mo'})
                </span>
              </p>
            ) : (
              <p className="text-sm font-semibold text-empire">
                {fr ? 'Volume élevé — parlons-en (Agence & Entreprise)' : "High volume — let's talk (Agency & Enterprise)"}
              </p>
            )}
          </div>
        </motion.div>

        {/* Table de comparaison des plans */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.34, ease: 'easeOut' }}
          className="mt-6 max-w-5xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <h3 className="text-base font-bold">{fr ? 'Comparer les plans' : 'Compare plans'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="min-w-44 px-6 py-2.5 text-left text-xs font-medium text-neutral-500"></th>
                  <th className="px-4 py-2.5 text-xs font-bold text-white">Starter</th>
                  <th className="px-4 py-2.5 text-xs font-bold text-empire">Growth</th>
                  <th className="px-4 py-2.5 text-xs font-bold text-white">Scale</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-xs font-bold text-white">
                    {fr ? 'Agence & Entreprise' : 'Agency & Enterprise'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                    <td className="px-6 py-2 text-xs text-neutral-400">{fr ? row.labelFr : row.labelEn}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className={`px-4 py-2 text-center text-xs ${j === 1 ? 'bg-empire/5' : ''}`}>
                        {typeof v === 'string' ? (
                          <span className="font-semibold text-neutral-200">
                            {v === '__custom__' ? (fr ? 'Sur mesure' : 'Custom') : v === '__unlimited__' ? (fr ? 'Illimités' : 'Unlimited') : v}
                          </span>
                        ) : v ? (
                          <Check size={14} className="inline text-empire" />
                        ) : (
                          <Minus size={14} className="inline text-neutral-700" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Enterprise banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mt-6 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
            <div className="shrink-0">
              <h3 className="text-lg font-bold">{fr ? 'Agence / Entreprise' : 'Agency / Enterprise'}</h3>
              <p className="text-sm text-neutral-400">
                {fr ? 'Volumes et tarifs sur mesure' : 'Custom volumes and pricing'}
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-1.5 flex-1">
              {(fr
                ? ['Volumes illimités', 'Multi-comptes et multi-marques', 'Account manager dédié', 'Onboarding personnalisé', 'Facturation sur mesure']
                : ['Unlimited volumes', 'Multi-account & multi-brand', 'Dedicated account manager', 'Custom onboarding', 'Custom billing']
              ).map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-sm text-neutral-300">
                  <Check size={14} className="shrink-0 text-empire" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/join-us"
              className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-white/10"
            >
              {fr ? 'Parlons-en' : 'Let\u2019s talk'}
            </Link>
          </div>
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
                    {fr ? `Plan ${coachingModal.nameFr}` : `${coachingModal.nameEn} plan`}
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
          className="mt-10 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto"
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
