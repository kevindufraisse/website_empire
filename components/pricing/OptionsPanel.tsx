'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, GraduationCap, Plus, UserRound, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPartnerFestivalPricing } from '@/lib/partner-festival-pricing'
import { BILLING_PERIODS, PLAN_LABELS, PLANS, finalPrice, type BillingId, type PlanId } from '@/lib/plans'
import { startFreeTrial, TRIAL_CREDITS, type TrialOption } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import glass from '@/components/pricing/pricing.module.css'
import { ORDER_CARD, ORDER_CTA, ORDER_LABEL, ORDER_TAG } from '@/lib/orderStyles'

/**
 * Le panier de /tarifs (29 octobre 2026, maquette validée par Kevin) : la
 * formule choisie dans les cartes, les options à cocher, et un seul bouton.
 *  - Bootcamp Academy : payé aujourd'hui avec le premier paiement Stripe, au
 *    prix de la grille de la semaine.
 *  - Expert Empire Partners : 0 € aujourd'hui, 500 €/mois réglés avec
 *    l'expert ; Marc est prévenu au retour du paiement. Selon les places du
 *    mois (liste d'attente à 0).
 * Le bouton mène à l'inscription, puis au paiement d'essai avec tout le panier.
 */

const EXPERT_MONTHLY_EUROS = 500

type Spots = { total: number | null; left: number | null }

export default function OptionsPanel({ plan, period }: { plan: PlanId; period: BillingId }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const bootcampEuros = getPartnerFestivalPricing().bootcampPrice
  const [spots, setSpots] = useState<Spots | null>(null)
  const [bootcamp, setBootcamp] = useState(false)
  const [expert, setExpert] = useState(false)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/expert-request')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled && data) setSpots(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const full = spots?.left === 0
  const spotsLine = full
    ? (fr ? 'Plus de place ce mois-ci : liste d’attente.' : 'No spot left this month: waiting list.')
    : typeof spots?.left === 'number'
      ? (fr ? `${spots.left} place${spots.left > 1 ? 's' : ''} ce mois-ci.` : `${spots.left} spot${spots.left > 1 ? 's' : ''} this month.`)
      : ''

  const planInfo = PLANS.find((p) => p.id === plan)!
  const billing = BILLING_PERIODS.find((b) => b.id === period)!
  const perMonth = finalPrice(planInfo.price, period, 1)
  const cycleTotal = perMonth * billing.months
  const today = bootcamp ? bootcampEuros : 0
  const toggle = (which: TrialOption) => {
    const next = which === 'bootcamp' ? !bootcamp : !expert
    if (which === 'bootcamp') setBootcamp(next)
    else setExpert(next)
    trackAmplitude('pricing_page_option_toggled', { option: which, on: next, plan })
  }

  const checkout = async () => {
    if (opening) return
    setOpening(true)
    const options: TrialOption[] = [...(bootcamp ? ['bootcamp' as const] : []), ...(expert ? ['expert' as const] : [])]
    trackAmplitude('pricing_page_plan_clicked', { plan, billing_period: period, location: 'cart', options: options.join(',') })
    await startFreeTrial(plan, period, options)
  }

  const optionRow = (which: TrialOption, on: boolean, icon: React.ReactNode, title: string, price: string, body: string, extra?: string) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={() => toggle(which)}
      className={`flex w-full cursor-pointer items-start gap-3 p-4 text-left transition-colors ${glass.panel} ${glass.compact} ${on ? glass.featured : ''}`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? 'border-white bg-white text-black' : 'border-white/40'}`}>
        {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-white/60" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">{icon}{title}</span>
          <span className={`whitespace-nowrap ${ORDER_TAG}`}>{price}</span>
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-neutral-300">{body}</span>
        {extra && <span className="mt-1 block text-xs text-neutral-300">{extra}</span>}
      </span>
    </button>
  )

  const line = (label: string, amount: string, onRemove?: () => void) => (
    <p className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-neutral-200">
        {label}
        {onRemove && (
          <button type="button" onClick={onRemove} className="ml-2 inline-flex cursor-pointer items-center gap-0.5 text-xs text-neutral-400 underline decoration-white/20 underline-offset-2 hover:text-white">
            <X className="h-3 w-3" />{fr ? 'retirer' : 'remove'}
          </button>
        )}
      </span>
      <span className="shrink-0 tabular-nums text-white">{amount}</span>
    </p>
  )

  return (
    <section className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-3">
        <p className={ORDER_LABEL}>{fr ? 'Options, à ajouter à ta formule' : 'Add-ons for your plan'}</p>
        {optionRow(
          'bootcamp', bootcamp, <GraduationCap className="h-4 w-4 text-neutral-300" />,
          fr ? 'Le bootcamp Academy 21 jours' : 'The 21-day Academy bootcamp',
          `+${bootcampEuros} €`,
          fr ? 'Apprends la méthode à ton rythme : 21 vidéos, la certification et la communauté. Payé une fois, au prix de la semaine.' : 'Learn the method at your own pace: 21 videos, the certification and the community. Paid once, at this week’s price.',
        )}
        {optionRow(
          'expert', expert, <UserRound className="h-4 w-4 text-neutral-300" />,
          fr ? 'Un expert Empire t’accompagne' : 'An Empire expert coaches you',
          fr ? `${EXPERT_MONTHLY_EUROS} €/mois` : `€${EXPERT_MONTHLY_EUROS}/mo`,
          fr ? 'Un expert Empire Partners t’accompagne, en plus de ta formule. 0 € aujourd’hui : ton expert te contacte en privé sous 48 h et vous réglez ensemble.' : 'An Empire Partners expert coaches you, on top of your plan. €0 today: your expert contacts you privately within 48h and you settle it together.',
          spotsLine,
        )}
      </div>

      <div className={`p-5 sm:p-6 lg:sticky lg:top-24 ${ORDER_CARD}`}>
        <p className="text-base font-semibold text-white">{fr ? 'Ton panier' : 'Your cart'}</p>
        <div className="mt-4 space-y-2">
          {line(`${PLAN_LABELS[plan][fr ? 'fr' : 'en']} · ${fr ? billing.labelFr.toLowerCase() : billing.labelEn.toLowerCase()}`, `${perMonth} €${fr ? '/mois' : '/mo'}`)}
          {bootcamp && line(fr ? 'Bootcamp Academy' : 'Academy bootcamp', `${bootcampEuros} €`, () => toggle('bootcamp'))}
          {expert && line(full ? (fr ? 'Expert Empire (liste d’attente)' : 'Empire expert (waiting list)') : (fr ? 'Expert Empire' : 'Empire expert'), '0 €', () => toggle('expert'))}
        </div>
        <div className="my-4 h-px bg-white/15" />
        <p className="flex items-baseline justify-between text-sm">
          <span className="text-neutral-300">{fr ? `Aujourd’hui (essai 7 jours ou ${TRIAL_CREDITS} crédits)` : `Today (7-day or ${TRIAL_CREDITS}-credit trial)`}</span>
          <span className="text-lg font-semibold tabular-nums text-white">{today.toLocaleString(locale)} €</span>
        </p>
        <p className="mt-1 flex items-baseline justify-between text-sm">
          <span className="text-neutral-300">{billing.months > 1 ? (fr ? `Puis tous les ${billing.months} mois` : `Then every ${billing.months} months`) : (fr ? 'Puis chaque mois' : 'Then every month')}</span>
          <span className="tabular-nums text-white">{cycleTotal.toLocaleString(locale)} €</span>
        </p>
        <button type="button" onClick={checkout} disabled={opening} className={`mt-5 ${ORDER_CTA}`}>
          {opening ? (fr ? 'Ouverture…' : 'Opening…') : (
            <>
              {fr ? 'Commencer' : 'Start'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-neutral-300">
          {fr ? 'Un seul paiement Stripe pour tout. Annule avant la fin de l’essai : 0 € pour l’abonnement.' : 'One Stripe payment for everything. Cancel before the trial ends: €0 for the plan.'}
        </p>
      </div>
    </section>
  )
}
