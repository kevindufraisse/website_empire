'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Scissors, CalendarCheck, ShieldCheck, Loader2, GraduationCap, Minus, Plus, Calculator, ChevronDown } from 'lucide-react'
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

// Inclus à tous les paliers du plan Créateur
const CREATOR_FEATURES: { fr: string; en: string }[] = [
  { fr: 'Tous les formats : posts LinkedIn, reels, faux Q&A, yapping, newsletters, YouTube, carrousels', en: 'All formats: LinkedIn posts, reels, fake Q&A, yapping, newsletters, YouTube, carousels' },
  { fr: 'Veille & identification quotidienne des sujets viraux de votre niche', en: 'Daily trend watch & viral topic detection for your niche' },
  { fr: 'Découpage & montage humain de vos vidéos (intro, sous-titres, b-rolls)', en: 'Human video cutting & editing (intro, subtitles, b-rolls)' },
  { fr: 'Relecture & corrections par notre équipe avant livraison', en: 'Proofreading & corrections by our team before delivery' },
  { fr: 'Miniatures personnalisées (Instagram, YouTube, LinkedIn)', en: 'Custom thumbnails (Instagram, YouTube, LinkedIn)' },
  { fr: 'Analytics & CRM leads', en: 'Analytics & lead CRM' },
  { fr: 'API & intégrations', en: 'API & integrations' },
  { fr: 'Cerveau Empire — mémoire IA de votre business', en: 'Empire Brain — AI memory of your business' },
  { fr: 'Communauté Slack', en: 'Slack community' },
  { fr: 'Publication sur 7 réseaux', en: 'Publishing to 7 networks' },
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

// Carte Équipe & Agence (sièges — flux enterprise de l'app)
const TEAM_FEATURES: { fr: string; en: string }[] = [
  { fr: '1 à 20 sièges — dégressif dès 3 sièges', en: '1 to 20 seats — volume discount from 3 seats' },
  { fr: 'Chaque siège : son calendrier + ses crédits', en: 'Each seat: its own calendar + credits' },
  { fr: 'Volume au choix par siège : 2 200, 6 600 ou 12 000 crédits/mois', en: 'Volume of your choice per seat: 2,200, 6,600 or 12,000 credits/mo' },
  { fr: 'Account manager dédié', en: 'Dedicated account manager' },
  { fr: 'Priorité de traitement', en: 'Priority processing' },
  { fr: 'Onboarding personnalisé', en: 'Personalized onboarding' },
  { fr: 'Facturation sur mesure', en: 'Custom billing' },
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

// Table de comparaison des paliers de volume + Équipe & Agence
const COMPARE_ROWS: { labelFr: string; labelEn: string; values: (string | boolean)[] }[] = [
  { labelFr: 'Prix (base mensuelle)', labelEn: 'Price (monthly base)', values: ['199€', '499€', '799€', '__custom__'] },
  { labelFr: 'Contenus / mois', labelEn: 'Contents / mo', values: ['~22', '~89', '~177', '__custom__'] },
  { labelFr: 'Replays masterclass (197€)', labelEn: 'Masterclass replays (€197)', values: [false, true, true, true] },
  { labelFr: 'Live sessions hebdomadaires', labelEn: 'Weekly live sessions', values: [false, true, true, true] },
  { labelFr: 'Priorité de traitement', labelEn: 'Priority processing', values: [false, false, true, true] },
  { labelFr: 'Sièges & multi-comptes', labelEn: 'Seats & multi-accounts', values: [false, false, false, true] },
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
  // Palier de volume sélectionné sur la carte Créateur
  const [selectedTier, setSelectedTier] = useState<PlanId>('growth')
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
              ? '7 jours d’essai gratuit, quel que soit le volume. Sans engagement, annulez en 1 clic.'
              : '7-day free trial at any volume. No commitment, cancel in 1 click.'}
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

        <div className="mt-10 grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {(() => {
            const plan = PLANS.find((p) => p.id === selectedTier)!
            const monthly = monthlyPrice(plan.price, billing)
            const stack = VALUE_STACK[selectedTier]
            return (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="relative flex flex-col rounded-2xl border border-empire/50 bg-empire/[0.06] p-6 shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.12)] lg:col-span-2"
              >
                <h3 className="text-lg font-bold">{fr ? 'Créateur' : 'Creator'}</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {fr ? 'Tout Empire, au volume que vous choisissez' : 'All of Empire, at the volume you choose'}
                </p>

                {/* Sélecteur de volume (liste déroulante façon lemlist) */}
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {fr ? 'Votre volume mensuel' : 'Your monthly volume'}
                </p>
                <div className="relative mt-2">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value as PlanId)}
                    className="w-full appearance-none rounded-xl border-2 border-white/10 bg-neutral-900 px-4 py-3 pr-10 text-sm font-semibold text-white transition-colors hover:border-empire/40 focus:border-empire focus:outline-none"
                  >
                    {PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} cr. · {p.contents} {fr ? 'contenus/mois' : 'contents/mo'} — {monthlyPrice(p.price, billing)}€{fr ? '/mois' : '/mo'}{p.highlighted ? (fr ? ' · Le plus populaire' : ' · Most popular') : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  {billing !== 'monthly' && (
                    <span className="text-lg font-semibold text-neutral-600 line-through tabular-nums">{plan.price}€{fr ? '/mois' : '/mo'}</span>
                  )}
                  <span className="text-3xl font-bold tabular-nums">{monthly}€{fr ? '/mois' : '/mo'}</span>
                  {billing !== 'monthly' && (
                    <span className="text-[11px] text-neutral-500">
                      {fr ? `Facturé ${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('fr-FR')}€${billing === 'quarterly' ? '/trim' : '/an'}` : `Billed €${(monthly * (billing === 'quarterly' ? 3 : 12)).toLocaleString('en-US')}${billing === 'quarterly' ? '/qtr' : '/yr'}`}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 flex-1">
                  <ul className="space-y-1.5">
                    {CREATOR_FEATURES.map((f) => (
                      <li key={f.fr} className="flex items-start gap-1.5 text-[13px] text-neutral-300">
                        <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                        {fr ? f.fr : f.en}
                      </li>
                    ))}
                    <li className={`flex items-start gap-1.5 text-[13px] ${selectedTier === 'starter' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      {selectedTier === 'starter' ? (
                        <Minus size={14} className="mt-0.5 shrink-0" />
                      ) : (
                        <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                      )}
                      {fr ? 'Replays masterclass inclus (valeur 197€)' : 'Masterclass replays included (€197 value)'}
                    </li>
                    <li className={`flex items-start gap-1.5 text-[13px] ${selectedTier === 'starter' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      {selectedTier === 'starter' ? (
                        <Minus size={14} className="mt-0.5 shrink-0" />
                      ) : (
                        <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                      )}
                      {fr ? 'Live sessions chaque semaine avec l\'équipe' : 'Weekly live sessions with the team'}
                    </li>
                    <li className={`flex items-start gap-1.5 text-[13px] ${selectedTier !== 'scale' ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      {selectedTier !== 'scale' ? (
                        <Minus size={14} className="mt-0.5 shrink-0" />
                      ) : (
                        <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                      )}
                      {fr ? 'Support prioritaire' : 'Priority support'}
                    </li>
                  </ul>
                  {/* Value stack */}
                  <div className="self-start w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      {fr ? 'Ce que ça remplace chaque mois :' : 'What it replaces every month:'}
                    </p>
                    {stack.items.map((it) => (
                      <div key={it.fr} className="flex items-center justify-between text-[12px] text-neutral-400">
                        <span>{fr ? it.fr : it.en}</span>
                        <span className="tabular-nums">{it.amount.toLocaleString(fr ? 'fr-FR' : 'en-US')}€</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-white/10 pt-1.5 text-[13px]">
                      <span className="text-neutral-400">{fr ? 'Valeur réelle' : 'Real value'}</span>
                      <span className="font-semibold">
                        <span className="mr-1.5 text-neutral-500 line-through">{stack.total.toLocaleString(fr ? 'fr-FR' : 'en-US')}€{fr ? '/mois' : '/mo'}</span>
                        <span className="text-empire">{monthly}€{fr ? '/mois' : '/mo'} {fr ? 'votre prix' : 'your price'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlanClick(plan)}
                  disabled={loadingPlan !== null}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-empire px-4 py-3 text-center text-sm font-bold text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)] transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loadingPlan === plan.id && <Loader2 size={15} className="animate-spin" />}
                  {fr ? 'Démarrer l’essai gratuit' : 'Start free trial'}
                </button>
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  {fr ? '7 jours gratuits · Annulez en 1 clic' : '7 days free · Cancel in 1 click'}
                </p>
              </motion.div>
            )
          })()}

          {/* Équipe & Agence — sièges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3 className="text-lg font-bold">{fr ? 'Équipe & Agence' : 'Team & Agency'}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {fr ? 'Plusieurs créateurs, une seule facturation' : 'Several creators, one billing'}
            </p>

            <div className="mt-5 flex items-baseline gap-1.5">
              {/* Starter avec remise volume -10% (dès 3 sièges), sur le prix d'engagement sélectionné */}
              <span className="text-4xl font-extrabold">
                {fr ? `dès ${Math.round(monthlyPrice(199, billing) * 0.9)}€` : `from €${Math.round(monthlyPrice(199, billing) * 0.9)}`}
              </span>
              <span className="text-sm text-neutral-400">{fr ? '/siège/mois' : '/seat/mo'}</span>
            </div>

            <p className="mt-4 text-[12px] font-semibold text-white">
              {fr ? 'Tout du plan Créateur, plus :' : 'Everything in Creator, plus:'}
            </p>
            <ul className="mt-2 space-y-1.5 flex-1">
              {TEAM_FEATURES.map((f) => (
                <li key={f.fr} className="flex items-start gap-1.5 text-[13px] text-neutral-300">
                  <Check size={14} className="mt-0.5 shrink-0 text-empire" />
                  {fr ? f.fr : f.en}
                </li>
              ))}
            </ul>

            <Link
              href="/join-us"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-white/10"
            >
              {fr ? 'Parlons-en' : 'Let’s talk'}
            </Link>
            <p className="mt-2 text-center text-[11px] text-neutral-500">
              {fr ? 'Gestion des sièges en libre-service dans l’app' : 'Self-service seat management in the app'}
            </p>
          </motion.div>
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
            {fr ? 'Explorer tout ce qui est inclus ↓' : 'Explore everything included ↓'}
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
                {fr ? 'Palier recommandé :' : 'Recommended tier:'}{' '}
                <span className="font-bold text-empire">{recommendedPlan.credits.toLocaleString(fr ? 'fr-FR' : 'en-US')} cr.</span>
                <span className="ml-1.5 text-xs text-neutral-400">
                  ({recommendedPlan.price}€{fr ? '/mois' : '/mo'})
                </span>
              </p>
            ) : (
              <p className="text-sm font-semibold text-empire">
                {fr ? 'Volume élevé — parlons-en (Équipe & Agence)' : "High volume — let's talk (Team & Agency)"}
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
            <h3 className="text-base font-bold">{fr ? 'Comparer les paliers' : 'Compare tiers'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="min-w-44 px-6 py-2.5 text-left text-xs font-medium text-neutral-500"></th>
                  <th className="whitespace-nowrap px-4 py-2.5">
                    <span className="block text-xs font-bold text-white">Starter</span>
                    <span className="block text-[10px] font-normal text-neutral-500">2 200 cr.</span>
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5">
                    <span className="block text-xs font-bold text-empire">Growth</span>
                    <span className="block text-[10px] font-normal text-neutral-500">6 600 cr.</span>
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5">
                    <span className="block text-xs font-bold text-white">Scale</span>
                    <span className="block text-[10px] font-normal text-neutral-500">12 000 cr.</span>
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5">
                    <span className="block text-xs font-bold text-white">{fr ? 'Équipe & Agence' : 'Team & Agency'}</span>
                    <span className="block text-[10px] font-normal text-neutral-500">{fr ? 'Sur mesure' : 'Custom'}</span>
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
          <div className="border-t border-white/10 bg-white/[0.02] px-6 py-3">
            <p className="text-[11px] text-neutral-500">
              <Check size={12} className="mr-1 inline text-empire" />
              {fr
                ? 'Inclus dans tous les plans : tous les formats, analytics & CRM leads, Cerveau Empire (IA), communauté Slack, publication sur 7 réseaux'
                : 'Included in every plan: all formats, analytics & lead CRM, Empire Brain (AI), Slack community, publishing to 7 networks'}
            </p>
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
