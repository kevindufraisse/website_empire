'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPartnerFestivalPricing } from '@/lib/partner-festival-pricing'
import { BILLING_PERIODS, PLANS, finalPrice, type BillingId, type PlanId } from '@/lib/plans'
import { startFreeTrial, type TrialOption } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { LIVE_OFFER, isLivePlan, liveCheckoutUrl, type LiveWindow } from '@/lib/liveOffer'
import { BLACK_FRIDAY, blackFridayBase, useBlackFriday } from '@/lib/blackFriday'

/**
 * L'état d'achat de /tarifs, partagé par tous les boutons de la page (sous la
 * carte, dans le récapitulatif, en bas de page et dans la barre du bas) : la
 * formule, la période, les deux options et un seul `checkout`.
 *  - Bootcamp Academy : payé aujourd'hui avec le premier paiement Stripe, au
 *    prix de la grille de la semaine.
 *  - Expert Empire Partners : 0 € aujourd'hui, 500 €/mois réglés avec
 *    l'expert ; selon les places du mois (liste d'attente à 0).
 * Les montants, les événements Amplitude et les adresses de destination sont
 * ceux de l'ancien panier (`OptionsPanel`), inchangés.
 */

export const EXPERT_MONTHLY_EUROS = 500

type Spots = { total: number | null; left: number | null }

export function useTrialCart(plan: PlanId, period: BillingId, live: LiveWindow | null) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
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
    ? (fr ? 'Complet ce mois-ci : tu passes en liste d’attente.' : 'Full this month: you join the waiting list.')
    : typeof spots?.left === 'number'
      ? (fr ? `Encore ${spots.left} place${spots.left > 1 ? 's' : ''} ce mois-ci.` : `${spots.left} spot${spots.left > 1 ? 's' : ''} left this month.`)
      : ''

  const planInfo = PLANS.find((p) => p.id === plan)!
  const billing = BILLING_PERIODS.find((b) => b.id === period)!
  // Offre du live : Growth / Scale en mensuel, premier mois prélevé
  // aujourd'hui par la page de l'app, sans essai ni options.
  // Black Friday : Scale à 499 € pendant 12 mois, mieux que l'offre du live
  // (3 mois) ; le prix est appliqué par l'app (promo `scale499`) à l'essai.
  const bf = useBlackFriday()
  const blackFriday = bf.active && plan === BLACK_FRIDAY.plan
  const liveDeal = live && period === 'monthly' && isLivePlan(plan) && !blackFriday ? LIVE_OFFER.plans[plan] : null
  const perMonth = liveDeal ? liveDeal.monthly : finalPrice(blackFridayBase(plan, planInfo.price, bf.active), period, 1)
  const cycleTotal = perMonth * billing.months
  const today = liveDeal ? liveDeal.monthly : bootcamp ? bootcampEuros : 0

  const toggle = (which: TrialOption) => {
    const next = which === 'bootcamp' ? !bootcamp : !expert
    if (which === 'bootcamp') setBootcamp(next)
    else setExpert(next)
    trackAmplitude('pricing_page_option_toggled', { option: which, on: next, plan })
  }

  const checkout = async () => {
    if (opening) return
    setOpening(true)
    if (liveDeal && live && isLivePlan(plan)) {
      trackAmplitude('pricing_page_plan_clicked', { plan, billing_period: 'monthly', location: 'cart', offer: 'live' })
      window.location.href = liveCheckoutUrl(live.email, plan)
      return
    }
    const options: TrialOption[] = [...(bootcamp ? ['bootcamp' as const] : []), ...(expert ? ['expert' as const] : [])]
    trackAmplitude('pricing_page_plan_clicked', { plan, billing_period: period, location: 'cart', options: options.join(',') })
    await startFreeTrial(plan, period, options)
  }

  return {
    plan, period, billing, liveDeal, blackFriday,
    bootcamp, expert, opening, full, spotsLine, bootcampEuros,
    perMonth, cycleTotal, today,
    toggle, checkout,
  }
}

export type TrialCart = ReturnType<typeof useTrialCart>
