'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Scissors, CalendarCheck, ShieldCheck, Loader2, GraduationCap } from 'lucide-react'
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
  bonusesFr?: string[]
  bonusesEn?: string[]
  highlighted?: boolean
}

// Mirrors the app's pricing (empire-tracking src/pages/Pricing.tsx PACKS + MONTH_EXAMPLES)
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
    featuresFr: ['15 posts LinkedIn / mois', '15 Reels & Shorts / mois', '4 newsletters / mois'],
    featuresEn: ['15 LinkedIn posts / month', '15 Reels & Shorts / month', '4 newsletters / month'],
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
    featuresFr: ['25 posts LinkedIn / mois', '33 Reels & Shorts / mois dont 8 montés pro', '4 newsletters / mois', '1 vidéo YouTube + 1 carrousel / mois'],
    featuresEn: ['25 LinkedIn posts / month', '33 Reels & Shorts / month incl. 8 pro-edited', '4 newsletters / month', '1 YouTube video + 1 carousel / month'],
    bonusesFr: ['Bonus : Loom stratégique personnalisé'],
    bonusesEn: ['Bonus: personalized strategy Loom'],
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
    featuresFr: ['30 posts LinkedIn / mois', '48 Reels & Shorts / mois dont 18 montés pro', '4 newsletters + 4 vidéos YouTube / mois', '4 carrousels / mois'],
    featuresEn: ['30 LinkedIn posts / month', '48 Reels & Shorts / month incl. 18 pro-edited', '4 newsletters + 4 YouTube videos / month', '4 carousels / month'],
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

                <h3 className="text-lg font-bold">{fr ? plan.nameFr : plan.nameEn}</h3>
                <p className="mt-1 text-sm text-neutral-400">{fr ? plan.descFr : plan.descEn}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold">{monthly}€</span>
                  <span className="text-sm text-neutral-400">{fr ? '/mois' : '/month'}</span>
                </div>

                <p className="mt-1.5 text-sm text-neutral-500">
                  {plan.contents} {fr ? 'contenus/mois' : 'contents/month'}
                  {billing !== 'monthly' && (
                    <>
                      {' · '}
                      {fr
                        ? `facturé ${total}€${billing === 'quarterly' ? '/trim.' : '/an'}`
                        : `billed ${total}€${billing === 'quarterly' ? '/qtr' : '/yr'}`}
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
