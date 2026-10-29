'use client'

import { useEffect, useRef, useState } from 'react'
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
  // Barre flottante : le bouton d'achat reste visible pendant qu'on fait
  // défiler la page ; elle se cache quand le panier lui-même est à l'écran.
  const cartRef = useRef<HTMLDivElement>(null)
  const [cartVisible, setCartVisible] = useState(false)
  useEffect(() => {
    const el = cartRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([entry]) => setCartVisible(entry.isIntersecting), { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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
    ? (fr ? 'Complet ce mois-ci : tu passes en liste d’attente.' : 'Full this month: you join the waiting list.')
    : typeof spots?.left === 'number'
      ? (fr ? `Encore ${spots.left} place${spots.left > 1 ? 's' : ''} ce mois-ci.` : `${spots.left} spot${spots.left > 1 ? 's' : ''} left this month.`)
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
        <p className={ORDER_LABEL}>{fr ? 'Ajoute à ta formule' : 'Add to your plan'}</p>
        {optionRow(
          'bootcamp', bootcamp, <GraduationCap className="h-4 w-4 text-neutral-300" />,
          fr ? 'Bootcamp Academy' : 'Academy bootcamp',
          `+${bootcampEuros} €`,
          fr ? '21 vidéos pour apprendre la méthode Empire à ton rythme, avec la certification. Paiement unique.' : '21 videos to learn the Empire method at your own pace, with the certification. One-time payment.',
        )}
        {optionRow(
          'expert', expert, <UserRound className="h-4 w-4 text-neutral-300" />,
          fr ? 'Expert Empire' : 'Empire expert',
          fr ? `${EXPERT_MONTHLY_EUROS} €/mois` : `€${EXPERT_MONTHLY_EUROS}/mo`,
          fr ? 'Un expert Empire Partners t’accompagne chaque mois. Il te contacte sous 48 h et tu le règles directement.' : 'An Empire Partners expert coaches you every month. They contact you within 48h and you pay them directly.',
          spotsLine,
        )}
      </div>

      <div ref={cartRef} className={`p-5 sm:p-6 ${ORDER_CARD}`}>
        <p className="text-base font-semibold text-white">{fr ? 'Ton panier' : 'Your cart'}</p>
        <div className="mt-4 space-y-2">
          {line(`${PLAN_LABELS[plan][fr ? 'fr' : 'en']} · ${fr ? billing.labelFr.toLowerCase() : billing.labelEn.toLowerCase()}`, `${perMonth} €${fr ? '/mois' : '/mo'}`)}
          {bootcamp && line(fr ? 'Bootcamp Academy' : 'Academy bootcamp', `${bootcampEuros} €`, () => toggle('bootcamp'))}
          {expert && line(full ? (fr ? 'Expert Empire (liste d’attente)' : 'Empire expert (waiting list)') : (fr ? 'Expert Empire' : 'Empire expert'), fr ? 'réglé avec l’expert' : 'paid to the expert', () => toggle('expert'))}
        </div>
        <div className="my-4 h-px bg-white/15" />
        <p className="flex items-baseline justify-between text-sm">
          <span className="font-medium text-white">{fr ? 'À payer aujourd’hui' : 'Due today'}</span>
          <span className="text-lg font-semibold tabular-nums text-white">{today.toLocaleString(locale)} €</span>
        </p>
        <p className="mt-1 text-xs text-neutral-300">
          {bootcamp
            ? (fr ? `Le bootcamp. Ta formule démarre après 7 jours d’essai gratuit (ou ${TRIAL_CREDITS} crédits).` : `The bootcamp. Your plan starts after a 7-day free trial (or ${TRIAL_CREDITS} credits).`)
            : (fr ? `Ta formule démarre après 7 jours d’essai gratuit (ou ${TRIAL_CREDITS} crédits).` : `Your plan starts after a 7-day free trial (or ${TRIAL_CREDITS} credits).`)}
        </p>
        <p className="mt-3 flex items-baseline justify-between text-sm">
          <span className="text-neutral-300">{fr ? 'Ensuite' : 'Then'}</span>
          <span className="tabular-nums text-white">{billing.months > 1 ? (fr ? `${cycleTotal.toLocaleString(locale)} € tous les ${billing.months} mois` : `€${cycleTotal.toLocaleString(locale)} every ${billing.months} months`) : `${perMonth} €${fr ? '/mois' : '/mo'}`}</span>
        </p>
        <button type="button" onClick={checkout} disabled={opening} className={`mt-5 ${ORDER_CTA}`}>
          {opening ? (fr ? 'Ouverture…' : 'Opening…') : (
            <>
              {fr ? 'Continuer' : 'Continue'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-neutral-300">
          {fr ? 'Sans engagement : annule pendant l’essai et ta formule ne te coûte rien.' : 'No commitment: cancel during the trial and your plan costs nothing.'}
        </p>
      </div>

      <div
        aria-hidden={cartVisible}
        className={`fixed inset-x-0 bottom-4 z-40 mx-auto w-[min(640px,calc(100%-2rem))] transition-all duration-200 ${cartVisible ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100'}`}
      >
        <div className={`flex items-center gap-3 p-2.5 pl-4 ${ORDER_CARD}`}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {PLAN_LABELS[plan][fr ? 'fr' : 'en']}{bootcamp ? ' + bootcamp' : ''}{expert ? (fr ? ' + expert' : ' + expert') : ''}
            </p>
            <p className="truncate text-xs text-neutral-300">
              {fr ? `${today.toLocaleString(locale)} € aujourd’hui, puis ${perMonth} €/mois` : `€${today.toLocaleString(locale)} today, then €${perMonth}/mo`}
            </p>
          </div>
          <button type="button" onClick={checkout} disabled={opening} tabIndex={cartVisible ? -1 : 0} className={`!w-auto shrink-0 px-5 ${ORDER_CTA}`}>
            {opening ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Continuer' : 'Continue')}
            {!opening && <ArrowRight className="ml-1 h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  )
}
