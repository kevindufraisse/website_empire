'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, X, Zap, TrendingUp, Crown, Scissors, CalendarCheck, ShieldCheck, Loader2, GraduationCap, Star } from 'lucide-react'
import posthog from 'posthog-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude, withAmplitudeDeviceId, getAmplitudeDeviceId } from '@/lib/amplitude'
import { getCurrentSeasonalPromo, getAnchorPrice } from '@/lib/seasonal-promo'

const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

type PlanId = 'starter' | 'growth' | 'scale'
type BillingId = 'monthly' | 'quarterly' | 'yearly'

// Mirrors the app's billing periods (empire-tracking src/pages/Pricing.tsx BILLING_PERIODS)
// Le badge annuel est cadré en "mois offerts" (concret) plutôt qu'en % abstrait :
// -18% sur 12 mois ≈ 2,2 mois gratuits, on affiche "2 mois offerts" (sous-promesse).
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
  { id: 'yearly', discount: 0.18, months: 12, labelFr: 'Annuel', labelEn: 'Yearly', badgeFr: '2 mois offerts', badgeEn: '2 months free' },
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
  // Decoy effect: limites visibles du plan (grisées) pour rendre le plan
  // supérieur évident. Utilisé sur Starter uniquement.
  notIncludedFr?: string[]
  notIncludedEn?: string[]
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
    notIncludedFr: ['Pas de Reels montés pro', 'Pas de vidéo YouTube', 'Pas de carrousel'],
    notIncludedEn: ['No pro-edited Reels', 'No YouTube video', 'No carousel'],
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

// Coaching add-on, same offer as the app's pre-checkout popup (500€ one-time)
const COACHING_PRICE = 500

function monthlyPrice(base: number, billing: BillingId): number {
  const period = BILLING_PERIODS.find((p) => p.id === billing)!
  return Math.round(base * (1 - period.discount))
}

function planUrl(planId: PlanId, billing: BillingId): string {
  return withAmplitudeDeviceId(`${APP_ONBOARDING_URL}?plan=${planId}&billing=${billing}&intent=trial`)
}

// Prix par jour (base 30j), affiché comme ancrage "petite dépense quotidienne".
function perDay(monthly: number): string {
  return (Math.round((monthly / 30) * 100) / 100).toFixed(2).replace('.', ',')
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

          {/* Ancrage comparatif — le prospect compare avec l'alternative réelle,
              pas avec le prix unitaire. */}
          <p className="mt-2 text-sm text-neutral-500">
            {fr
              ? 'Un community manager coûte 2 000 à 3 000€/mois. Empire produit plus, pour une fraction du prix.'
              : 'A community manager costs €2,000–3,000/month. Empire produces more, for a fraction of the price.'}
          </p>

          {/* Preuve sociale au point de décision — les témoignages complets sont
              juste au-dessus, ici on rappelle juste la confiance près des CTA. */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
            <span className="flex text-empire">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={13} className="fill-empire" />
              ))}
            </span>
            <span className="text-xs text-neutral-300">
              {fr
                ? 'Ils délèguent déjà leur contenu à Empire'
                : 'They already trust Empire with their content'}
            </span>
          </div>

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

                {/* Ancrages compactés sur 2 lignes max pour ne pas noyer le prix :
                    ligne 1 = valeur (prix/jour + contenus), ligne 2 = facturation. */}
                <p className="mt-1.5 text-sm">
                  <span className="font-medium text-empire">
                    {fr ? `Soit ${perDay(monthly)}€/jour` : `That's ${perDay(monthly)}€/day`}
                  </span>
                  <span className="text-neutral-500">
                    {' · '}
                    {plan.contents} {fr ? 'contenus finis/mois' : 'finished contents/month'}
                  </span>
                </p>

                {billing !== 'monthly' && (
                  <p className="mt-1 text-xs text-neutral-500">
                    {fr
                      ? `Facturé ${total}€ ${billing === 'quarterly' ? 'tous les 3 mois' : 'par an'}`
                      : `Billed ${total}€ ${billing === 'quarterly' ? 'every 3 months' : 'yearly'}`}
                    {billing === 'yearly' && (
                      <span className="font-semibold text-emerald-400">
                        {' · '}
                        {fr
                          ? `vous économisez ${(plan.price - monthly) * 12}€`
                          : `you save ${(plan.price - monthly) * 12}€`}
                      </span>
                    )}
                  </p>
                )}

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
                  {(fr ? plan.notIncludedFr : plan.notIncludedEn)?.map((n) => (
                    <li key={n} className="flex items-start gap-2 text-sm text-neutral-600 line-through">
                      <X size={15} className="mt-0.5 shrink-0" />
                      {n}
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
