'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, TrendingUp, Crown, ChevronDown, Scissors, CalendarCheck, ShieldCheck, Loader2, GraduationCap } from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude, withAmplitudeDeviceId, getAmplitudeDeviceId } from '@/lib/amplitude'
import { getCurrentSeasonalPromo, getAnchorPrice } from '@/lib/seasonal-promo'

const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

type PlanId = 'starter' | 'growth' | 'scale'
type BillingId = 'monthly' | 'quarterly' | 'yearly'

// Mirrors the app's billing periods (empire-tracking src/pages/Pricing.tsx BILLING_PERIODS)
const BILLING_PERIODS: { id: BillingId; discount: number; months: number; labelFr: string; labelEn: string }[] = [
  { id: 'monthly', discount: 0, months: 1, labelFr: 'Mensuel', labelEn: 'Monthly' },
  { id: 'quarterly', discount: 0.12, months: 3, labelFr: 'Trimestriel', labelEn: 'Quarterly' },
  { id: 'yearly', discount: 0.18, months: 12, labelFr: 'Annuel', labelEn: 'Yearly' },
]

type Plan = {
  id: PlanId
  icon: typeof Zap
  price: number
  credits: number
  contents: string
  nameFr: string
  nameEn: string
  descFr: string
  descEn: string
  featuresFr: string[]
  featuresEn: string[]
  bonusesFr?: string[]
  bonusesEn?: string[]
  highlighted?: boolean
}

// Mirrors the app's pricing (empire-tracking src/pages/Pricing.tsx PACKS + MONTH_EXAMPLES)
const PLANS: Plan[] = [
  {
    id: 'starter',
    icon: Zap,
    price: 199,
    credits: 2200,
    contents: '~22',
    nameFr: 'Starter',
    nameEn: 'Starter',
    descFr: 'Pour poster régulièrement sans y penser',
    descEn: 'Post consistently without thinking about it',
    featuresFr: ['15 posts LinkedIn / mois', '15 Reels & Shorts / mois', '4 newsletters / mois', 'Publication automatique partout'],
    featuresEn: ['15 LinkedIn posts / month', '15 Reels & Shorts / month', '4 newsletters / month', 'Auto-publish everywhere'],
  },
  {
    id: 'growth',
    icon: TrendingUp,
    price: 499,
    credits: 6600,
    contents: '~89',
    nameFr: 'Growth',
    nameEn: 'Growth',
    descFr: 'Pour devenir une référence de votre niche',
    descEn: 'Become a reference in your niche',
    featuresFr: ['25 posts LinkedIn / mois', '25 Reels + 8 Reels montés pro / mois', '4 newsletters / mois', '1 vidéo YouTube + 1 carrousel / mois'],
    featuresEn: ['25 LinkedIn posts / month', '25 Reels + 8 pro-edited Reels / month', '4 newsletters / month', '1 YouTube video + 1 carousel / month'],
    bonusesFr: ['Bonus : Loom stratégique personnalisé'],
    bonusesEn: ['Bonus: personalized strategy Loom'],
    highlighted: true,
  },
  {
    id: 'scale',
    icon: Crown,
    price: 799,
    credits: 12000,
    contents: '~177',
    nameFr: 'Scale',
    nameEn: 'Scale',
    descFr: 'Pour saturer votre marché de contenu',
    descEn: 'Saturate your market with content',
    featuresFr: ['30 posts LinkedIn / mois', '30 Reels + 18 Reels montés pro / mois', '4 newsletters + 4 vidéos YouTube / mois', '4 carrousels / mois'],
    featuresEn: ['30 LinkedIn posts / month', '30 Reels + 18 pro-edited Reels / month', '4 newsletters + 4 YouTube videos / month', '4 carousels / month'],
    bonusesFr: ['Bonus : call stratégique avec Kevin', 'Bonus : replays des masterclass'],
    bonusesEn: ['Bonus: strategy call with Kevin', 'Bonus: masterclass replays'],
  },
]

// Credit cost per content type (empire-tracking src/lib/hooks/useCredits.ts CREDIT_COSTS)
const CONTENT_COSTS: { credits: number; labelFr: string; labelEn: string; detailsFr?: string; detailsEn?: string }[] = [
  // Interview bundles (same rows/wording as the app's pricing grid)
  {
    credits: 2458,
    labelFr: 'Interview IA à thème',
    labelEn: 'Themed AI interview',
    detailsFr: '7 LI + 7 NL + 7 reels + vidéo YouTube + carrousel',
    detailsEn: '7 LinkedIn + 7 newsletters + 7 reels + YouTube video + carousel',
  },
  {
    credits: 2278,
    labelFr: 'Interview libre / à deux',
    labelEn: 'Free or two-person interview',
    detailsFr: '7 LI + 7 NL + 7 reels + vidéo YouTube',
    detailsEn: '7 LinkedIn + 7 newsletters + 7 reels + YouTube video',
  },
  {
    credits: 1803,
    labelFr: 'Quick Create',
    labelEn: 'Quick Create',
    detailsFr: '7 LI + 7 NL + 7 reels',
    detailsEn: '7 LinkedIn + 7 newsletters + 7 reels',
  },
  { credits: 85, labelFr: 'Post LinkedIn', labelEn: 'LinkedIn post' },
  { credits: 115, labelFr: 'Newsletter', labelEn: 'Newsletter' },
  { credits: 29, labelFr: 'Reel / Short', labelEn: 'Reel / Short' },
  { credits: 275, labelFr: 'Vidéo YouTube', labelEn: 'YouTube video' },
  { credits: 180, labelFr: 'Carrousel', labelEn: 'Carousel' },
  { credits: 350, labelFr: 'Reel monté pro', labelEn: 'Pro-edited Reel' },
]

// Coaching add-on, same offer as the app's pre-checkout popup (500€ one-time)
const COACHING_PRICE = 500

function monthlyPrice(base: number, billing: BillingId): number {
  const period = BILLING_PERIODS.find((p) => p.id === billing)!
  return Math.round(base * (1 - period.discount))
}

function planUrl(planId: PlanId, billing: BillingId): string {
  return withAmplitudeDeviceId(`${APP_ONBOARDING_URL}?plan=${planId}&billing=${billing}&intent=trial`)
}

function formatEuro(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2).replace('.', ',').replace(/,00$/, '') + '€'
}

export default function HomePricingSection() {
  const { lang } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const viewedRef = useRef(false)
  const [billing, setBilling] = useState<BillingId>('monthly')
  const [showCosts, setShowCosts] = useState(false)

  useEffect(() => {
    if (!isInView || viewedRef.current) return
    viewedRef.current = true
    trackAmplitude('pricing_section_viewed', { location: 'home' })
    if (posthog.__loaded) {
      posthog.capture('pricing_section_viewed', { location: 'home' })
    }
  }, [isInView])

  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null)
  const [withCoaching, setWithCoaching] = useState(false)
  const [promo] = useState(() => getCurrentSeasonalPromo())

  // Pay-first flow: create a Stripe trial checkout with no account, the app
  // claims it after signup. Falls back to the app onboarding link if Stripe
  // isn't configured on the site (env vars missing) or the API fails.
  const handlePlanClick = async (plan: Plan) => {
    if (loadingPlan) return
    const props = {
      plan: plan.id,
      billing_period: billing,
      price_monthly: monthlyPrice(plan.price, billing),
      coaching_addon: withCoaching,
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
          coaching: withCoaching,
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

  const fr = lang === 'fr'
  const period = BILLING_PERIODS.find((p) => p.id === billing)!

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
                {p.discount > 0 && (
                  <span className={`ml-1.5 text-[11px] font-bold ${billing === p.id ? 'text-black/70' : 'text-empire'}`}>
                    -{Math.round(p.discount * 100)}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            const monthly = monthlyPrice(plan.price, billing)
            const total = monthly * period.months
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

                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-empire" />
                  <h3 className="text-lg font-bold">{fr ? plan.nameFr : plan.nameEn}</h3>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{fr ? plan.descFr : plan.descEn}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  {/* Anchor barré aligné sur la promo saisonnière du bandeau (-30% SUMMER, etc.) */}
                  <span className="text-lg font-semibold text-neutral-500 line-through">
                    {getAnchorPrice(monthly, promo)}€
                  </span>
                  <span className="text-4xl font-extrabold">{monthly}€</span>
                  <span className="text-sm text-neutral-400">{fr ? '/mois' : '/month'}</span>
                  <span className="ml-1 rounded-full bg-empire/15 px-2 py-0.5 text-[11px] font-bold text-empire">
                    -{Math.round(promo.discount * 100)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {plan.contents} {fr ? 'contenus créés chaque mois' : 'contents created every month'}
                  {billing !== 'monthly' && (
                    <>
                      {' · '}
                      {fr
                        ? `facturé ${total}€ ${billing === 'quarterly' ? 'tous les 3 mois' : 'par an'}`
                        : `billed ${total}€ ${billing === 'quarterly' ? 'every 3 months' : 'yearly'}`}
                    </>
                  )}
                </p>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {(fr ? plan.featuresFr : plan.featuresEn).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                      <Check size={15} className="mt-0.5 shrink-0 text-empire" />
                      {f}
                    </li>
                  ))}
                  {(fr ? plan.bonusesFr : plan.bonusesEn)?.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm font-medium text-empire">
                      <Check size={15} className="mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan)}
                  disabled={loadingPlan !== null}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 ${
                    plan.highlighted
                      ? 'bg-empire text-black shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]'
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
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

        {/* Coaching add-on — same upsell as the app's pre-checkout popup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mt-8 max-w-5xl mx-auto"
        >
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-5 py-4 transition-colors ${
              withCoaching ? 'border-empire/50 bg-empire/[0.06]' : 'border-white/10 bg-white/[0.03] hover:border-white/20'
            }`}
          >
            <input
              type="checkbox"
              checked={withCoaching}
              onChange={(e) => setWithCoaching(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--empire-rgb))]"
            />
            <GraduationCap size={20} className="mt-0.5 shrink-0 text-empire" />
            <span className="flex-1 text-sm">
              <span className="font-semibold text-white">
                {fr ? 'Ajouter 4h de coaching avec un expert en viralité' : 'Add 4h of coaching with a virality expert'}
              </span>
              <span className="ml-2 font-bold text-empire">{COACHING_PRICE}€</span>
              <span className="ml-1 text-neutral-500">{fr ? '· une seule fois' : '· one-time'}</span>
              <span className="mt-0.5 block text-neutral-400">
                {fr
                  ? 'Stratégie personnalisée, positionnement et formats gagnants pour votre niche — recommandé pour démarrer vite.'
                  : 'Personalized strategy, positioning and winning formats for your niche — recommended to start fast.'}
              </span>
            </span>
          </label>
        </motion.div>

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

        {/* Per-content price grid (mirrors the app's pricing grid tab) */}
        <div className="mt-10 max-w-3xl mx-auto">
          <button
            onClick={() => setShowCosts((v) => !v)}
            className="mx-auto flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            {fr ? 'Voir le prix par contenu' : 'See price per content'}
            <ChevronDown size={15} className={`transition-transform ${showCosts ? 'rotate-180' : ''}`} />
          </button>

          {showCosts && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-neutral-400">
                    <th className="px-4 py-3 font-medium">{fr ? 'Contenu' : 'Content'}</th>
                    {PLANS.map((p) => (
                      <th key={p.id} className={`px-4 py-3 text-right font-medium ${p.highlighted ? 'text-empire' : ''}`}>
                        {fr ? p.nameFr : p.nameEn}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONTENT_COSTS.map((row) => (
                    <tr key={row.labelEn} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-2.5 text-neutral-300">
                        {fr ? row.labelFr : row.labelEn}
                        {(fr ? row.detailsFr : row.detailsEn) && (
                          <span className="mt-0.5 block text-[11px] text-neutral-500">
                            {fr ? row.detailsFr : row.detailsEn}
                          </span>
                        )}
                      </td>
                      {PLANS.map((p) => {
                        const pricePerCredit = monthlyPrice(p.price, billing) / p.credits
                        return (
                          <td key={p.id} className={`px-4 py-2.5 text-right align-top tabular-nums ${p.highlighted ? 'font-semibold text-white' : 'text-neutral-400'}`}>
                            {formatEuro(row.credits * pricePerCredit)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-3 text-[11px] text-neutral-500">
                {fr
                  ? 'Chaque plan inclut des crédits (Starter 2 200 · Growth 6 600 · Scale 12 000 par mois) que vous utilisez librement sur les contenus de votre choix.'
                  : 'Each plan includes credits (Starter 2,200 · Growth 6,600 · Scale 12,000 per month) that you spend freely on the contents you want.'}
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          {fr ? (
            <>
              Besoin de volumes illimités, multi-comptes ou account manager ?{' '}
              <Link href="/join-us" className="text-empire underline-offset-2 hover:underline">
                Parlons-en
              </Link>
            </>
          ) : (
            <>
              Need unlimited volume, multi-accounts or an account manager?{' '}
              <Link href="/join-us" className="text-empire underline-offset-2 hover:underline">
                Let’s talk
              </Link>
            </>
          )}
        </p>
      </div>
    </section>
  )
}
