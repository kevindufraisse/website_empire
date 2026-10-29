'use client'

import { useState, type KeyboardEvent } from 'react'
import glass from './pricing.module.css'
import { ArrowRight, Check, ChevronDown, Coins, Linkedin, Mail, Video, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  APP_JOIN_URL,
  BILLING_PERIODS,
  CONTENT_CREDITS,
  PAYG_RECHARGE,
  PLANS,
  PLAN_DELIVERABLES,
  PLAN_LABELS,
  finalPrice,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { startFreeTrial, TRIAL_CREDITS } from '@/lib/startTrial'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'
import { LIVE_OFFER, isLivePlan, useCountdown, type LiveWindow } from '@/lib/liveOffer'
import {
  ORDER_CARD,
  ORDER_CARD_QUIET,
  ORDER_CHECK,
  ORDER_CTA,
  ORDER_CTA_SECONDARY,
  ORDER_LABEL,
  ORDER_PRICE,
  ORDER_SEGMENT,
  ORDER_SEGMENTS,
  ORDER_STRUCK,
  ORDER_TAG,
} from '@/lib/orderStyles'

/**
 * Offres partagées avec l'app, présentation en verre fumé pour le site.
 * Chaque formule ouvre l'essai (7 jours, 500 crédits), quelle que soit la période.
 */

const RHYTHM_TU: Record<PlanId, string> = {
  starter: 'Tu postes tous les 2 jours',
  growth: 'Tu postes tous les jours',
  scale: 'Tu postes 2 fois par jour',
}


const EXTRAS: Record<PlanId, { fr: string; en: string }[]> = {
  starter: [],
  growth: [
    { fr: 'Support prioritaire sous 4 h', en: 'Priority support within 4h' },
    { fr: 'Live client chaque semaine', en: 'Weekly client live' },
    { fr: 'Masterclass Empire : bien utiliser l’outil pour ta marque (replays)', en: 'Empire masterclass: using the tool for your brand (replays)' },
  ],
  scale: [
    { fr: 'Support prioritaire sous 4 h', en: 'Priority support within 4h' },
    { fr: 'Live client chaque semaine', en: 'Weekly client live' },
    { fr: 'Masterclass Empire : bien utiliser l’outil pour ta marque (replays)', en: 'Empire masterclass: using the tool for your brand (replays)' },
    { fr: 'Revue stratégique mensuelle (retours Loom)', en: 'Monthly strategy review (Loom feedback)' },
  ],
}

const COMMON = {
  fr: ['Des idées prêtes chaque semaine', 'Écriture, montage et sous-titres', 'Chaque reel vérifié par l’équipe', 'Publication sur 7 réseaux', 'Le mix se change à tout moment'],
  en: ['Ready ideas every week', 'Writing, editing and captions', 'Every reel checked by the team', 'Publishing to 7 networks', 'Change the mix anytime'],
}

const SUFFIX: Record<BillingId, { fr: string; en: string }> = {
  monthly: { fr: '/mois', en: '/mo' },
  quarterly: { fr: '/trim.', en: '/qtr' },
  yearly: { fr: '/an', en: '/yr' },
}

function joinUrl(params: Record<string, string>) {
  const url = new URL(APP_JOIN_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return withAmplitudeDeviceId(url.toString())
}

type Props = {
  /** Envoyé avec `pricing_page_plan_clicked` (`tarifs`, `home`). */
  location: string
  period?: BillingId
  onPeriodChange?: (p: BillingId) => void
  /** /tarifs montre le paiement à l'usage dans son propre onglet. */
  hidePayg?: boolean
  /** Panier de /tarifs : le bouton d'une carte choisit la formule au lieu
   *  d'ouvrir l'inscription ; le panier porte le seul bouton d'achat. */
  chosen?: PlanId
  onChoose?: (plan: PlanId) => void
  /** Arrivé par le lien du live : Growth et Scale à -300 €/mois pendant 3 mois (mensuel seulement). */
  live?: LiveWindow | null
}

export default function PlanCards({ location, period: controlled, onPeriodChange, hidePayg = false, chosen, onChoose, live = null }: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const [own, setOwn] = useState<BillingId>('monthly')
  const period = controlled ?? own
  const setPeriod = (p: BillingId) => (onPeriodChange ? onPeriodChange(p) : setOwn(p))
  const [ownSelected, setOwnSelected] = useState<PlanId>('growth')
  const selected = chosen ?? ownSelected
  const setSelected = (p: PlanId) => (onChoose ? onChoose(p) : setOwnSelected(p))
  const [opening, setOpening] = useState<PlanId | 'payg' | null>(null)
  const billing = BILLING_PERIODS.find((p) => p.id === period)!
  const discount = billing.discount
  const badge = discount > 0 ? `-${Math.round(discount * 100)}%` : null
  const suffix = SUFFIX[period][fr ? 'fr' : 'en']
  const perMonth = fr ? '/mois' : '/mo'
  const countdown = useCountdown(live?.endsAt)
  // Offre du live : seuls Growth et Scale sont concernés, Starter est masqué.
  const plans = live ? PLANS.filter((p) => isLivePlan(p.id)) : PLANS

  const choose = async (col: PlanId | 'payg') => {
    if (onChoose && col !== 'payg') {
      onChoose(col)
      trackAmplitude('pricing_page_plan_chosen', { plan: col, billing_period: period, location })
      return
    }
    if (opening) return
    setOpening(col)
    trackAmplitude('pricing_page_plan_clicked', { plan: col, billing_period: col === 'payg' ? 'payg' : period, location })
    if (col === 'payg') {
      window.location.href = joinUrl({ plan: 'payg', pack: 'payg_start' })
      return
    }
    await startFreeTrial(col, period)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className={`mx-auto max-w-md grid-flow-col auto-cols-fr items-center ${ORDER_SEGMENTS}`} role="tablist">
          {BILLING_PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === period}
              onClick={() => setPeriod(p.id)}
              className={`min-w-0 flex-1 whitespace-nowrap text-xs font-semibold ${ORDER_SEGMENT}`}
            >
              {fr ? p.labelFr : p.labelEn}
              {p.discount > 0 && <span className="ml-1 text-[11px] text-neutral-300">-{Math.round(p.discount * 100)}%</span>}
            </button>
          ))}
        </div>

        <div className={`grid gap-2 lg:hidden ${plans.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} role="radiogroup" aria-label={fr ? 'Formule' : 'Plan'}>
          {plans.map((p) => {
            const active = p.id === selected
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(p.id)}
                className={`relative flex cursor-pointer flex-col items-start gap-1 px-2.5 pb-2.5 pt-3.5 text-left ${glass.planOption}`}
              >
                {p.highlighted && (
                  <span className="absolute -top-2 left-2 whitespace-nowrap rounded-md border border-white/15 bg-[#17171a] px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white/80">
                    {fr ? 'Populaire' : 'Popular'}
                  </span>
                )}
                <span className="text-xs font-semibold leading-tight text-white">{PLAN_LABELS[p.id][fr ? 'fr' : 'en']}</span>
                <span className="text-[11px] tabular-nums text-neutral-300">
                  {live && period === 'monthly' && isLivePlan(p.id) ? LIVE_OFFER.plans[p.id].monthly : finalPrice(p.price, period, 1)}€{perMonth}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {live && period !== 'monthly' && (
        <p className="text-center text-xs text-neutral-300">
          {fr
            ? `Ton offre du live (-${LIVE_OFFER.discountMonthly} € par mois pendant ${LIVE_OFFER.discountMonths} mois) est en mensuel. `
            : `Your live offer (-€${LIVE_OFFER.discountMonthly} a month for ${LIVE_OFFER.discountMonths} months) is monthly. `}
          <button type="button" onClick={() => setPeriod('monthly')} className="cursor-pointer font-semibold text-white underline decoration-white/30 underline-offset-2">
            {fr ? 'Voir en mensuel' : 'See monthly'}
          </button>
        </p>
      )}

      <div className={`mx-auto grid gap-5 lg:items-stretch ${plans.length === 2 ? 'max-w-3xl lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {plans.map((plan) => {
          const featured = onChoose ? plan.id === selected : !!plan.highlighted
          const liveDeal = live && period === 'monthly' && isLivePlan(plan.id) ? LIVE_OFFER.plans[plan.id] : null
          const price = liveDeal ? liveDeal.monthly : finalPrice(plan.price, period, 1)
          const total = (price * billing.months).toLocaleString(locale)
          const d = PLAN_DELIVERABLES[plan.id]
          const extras = EXTRAS[plan.id]
          return (
            <div key={plan.id} className={plan.id === selected ? '' : 'hidden lg:block'}>
              {/* Panier : la carte entière choisit la formule, sans bouton ; le seul
                  bouton d'achat est « Continuer » dans le panier. */}
              <div
                className={`flex h-full flex-col ${featured ? ORDER_CARD : ORDER_CARD_QUIET} ${onChoose ? 'cursor-pointer' : ''}`}
                {...(onChoose ? {
                  role: 'radio',
                  'aria-checked': plan.id === selected,
                  tabIndex: 0,
                  onClick: () => choose(plan.id),
                  onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(plan.id) } },
                } : {})}
              >
                <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-base font-semibold leading-snug text-white">{PLAN_LABELS[plan.id][fr ? 'fr' : 'en']}</p>
                      <p className="text-sm text-neutral-300">{fr ? RHYTHM_TU[plan.id] : plan.rhythmEn}</p>
                    </div>
                    {onChoose && plan.id === selected
                      ? <span className={`inline-flex items-center gap-1 whitespace-nowrap ${ORDER_TAG}`}><Check className="h-3 w-3" />{fr ? 'Choisie' : 'Chosen'}</span>
                      : plan.highlighted && <span className={`whitespace-nowrap ${ORDER_TAG}`}>{fr ? 'Populaire' : 'Popular'}</span>}
                  </div>

                  {liveDeal ? (
                    // Présentation reprise d'ElevenLabs : pastille de fin,
                    // ancien prix barré + offre en petit, puis le prix payé.
                    <div className="space-y-1.5">
                      {countdown && (
                        <span className="inline-flex rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-black">
                          {fr ? `Encore ${countdown}` : `${countdown} left`}
                        </span>
                      )}
                      <p className="text-sm text-neutral-300">
                        <span className="mr-1.5 line-through decoration-neutral-400">{plan.price} €</span>
                        {fr
                          ? `${LIVE_OFFER.discountMonths} premiers mois à -${LIVE_OFFER.discountMonthly} €`
                          : `First ${LIVE_OFFER.discountMonths} months -€${LIVE_OFFER.discountMonthly}`}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-[2.75rem] ${ORDER_PRICE}`}>{price}€</span>
                        <span className="text-sm text-neutral-300">{perMonth}</span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        {fr ? `Puis ${liveDeal.listMonthly} €/mois` : `Then €${liveDeal.listMonthly}/mo`}
                      </p>
                    </div>
                  ) : (
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {discount > 0 && <span className={`text-xl ${ORDER_STRUCK}`}>{plan.price}€</span>}
                      <span className={`text-[2.75rem] ${ORDER_PRICE}`}>{price}€</span>
                      <span className="text-sm text-neutral-300">{perMonth}</span>
                      {badge && <span className={ORDER_TAG}>{badge}</span>}
                    </div>
                    {discount > 0 && (
                      <p className="pt-1.5 text-xs text-neutral-300">{fr ? `Facturé ${total}€${suffix}` : `Billed €${total}${suffix}`}</p>
                    )}
                  </div>
                  )}

                  <div className="space-y-1.5">
                    <p className={ORDER_LABEL}>{fr ? 'Chaque mois, au choix, jusqu’à' : 'Every month, your pick, up to'}</p>
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      <Video className="h-4 w-4 shrink-0 text-neutral-300" />
                      {fr ? `${d.reels} reels montés` : `${d.reels} edited reels`}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      <Linkedin className="h-4 w-4 shrink-0 text-neutral-300" />
                      {fr ? `ou ${d.posts} posts LinkedIn` : `or ${d.posts} LinkedIn posts`}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      <Mail className="h-4 w-4 shrink-0 text-neutral-300" />
                      {fr ? `ou ${d.newsletters} newsletters` : `or ${d.newsletters} newsletters`}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                      <Coins className="h-4 w-4 shrink-0" />
                      {fr ? `${plan.credits.toLocaleString(locale)} crédits par mois` : `${plan.credits.toLocaleString(locale)} credits a month`}
                    </p>
                  </div>

                  <div>
                    {!onChoose && (
                    <button
                      type="button"
                      onClick={() => choose(plan.id)}
                      disabled={opening !== null}
                      className={featured ? ORDER_CTA : ORDER_CTA_SECONDARY}
                    >
                      {opening === plan.id
                        ? (fr ? 'Ouverture…' : 'Opening…')
                        : (
                          <>
                            {fr ? `Commencer · ${price}€${perMonth}` : `Start · €${price}${perMonth}`}
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </>
                        )}
                    </button>
                    )}
                    <p className="mt-2 text-center text-xs leading-snug text-neutral-300">
                      {liveDeal
                        ? (fr ? 'Premier mois prélevé aujourd’hui, sans engagement' : 'First month charged today, no commitment')
                        : fr
                          ? `Essai gratuit : 7 jours ou ${TRIAL_CREDITS} crédits`
                          : `Free trial: 7 days or ${TRIAL_CREDITS} credits`}
                    </p>
                  </div>

                  {extras.length > 0 && (
                    <ul className="space-y-2 border-t border-white/15 pt-4">
                      {extras.map((l) => (
                        <li key={l.fr} className="flex items-start gap-2 text-sm text-neutral-300">
                          <Check className={ORDER_CHECK} />
                          <span>{fr ? l.fr : l.en}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs">
        <span className="font-semibold text-white">{fr ? 'Dans tous les plans :' : 'In every plan:'}</span>
        {COMMON[fr ? 'fr' : 'en'].map((item) => (
          <span key={item} className="inline-flex items-center gap-1 text-neutral-300">
            <Check className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
            {item}
          </span>
        ))}
      </div>

      {!hidePayg && (
      <details className={`group mx-auto w-full max-w-2xl ${glass.panel} ${glass.compact}`}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-neutral-300" />
            {fr ? `Pas prêt pour un abonnement ? Paie à l’usage, dès ${PAYG_RECHARGE.euros} €` : `Not ready for a subscription? Pay as you go, from €${PAYG_RECHARGE.euros}`}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 px-4 pb-4">
          <p className="text-xs leading-relaxed text-neutral-300">
            {fr
              ? `Pas d’abonnement. Tu enregistres ta carte, 0 € aujourd’hui. À ta première action payante, une recharge de ${PAYG_RECHARGE.euros} € (${PAYG_RECHARGE.credits} crédits, environ ${Math.floor(PAYG_RECHARGE.credits / CONTENT_CREDITS.post)} posts LinkedIn), puis une nouvelle dès que ton solde ne suffit plus. Plafond mensuel au choix. Slack inclus ; sans live ni replays.`
              : `No subscription. Save your card, €0 today. On your first paid action, a €${PAYG_RECHARGE.euros} top-up (${PAYG_RECHARGE.credits} credits, about ${Math.floor(PAYG_RECHARGE.credits / CONTENT_CREDITS.post)} LinkedIn posts), then another when your balance runs low. Monthly cap of your choice. Slack included; no live or replays.`}
          </p>
          <button
            type="button"
            onClick={() => choose('payg')}
            disabled={opening !== null}
            className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-4 text-xs font-semibold disabled:opacity-60 ${glass.primaryButton}`}
          >
            {opening === 'payg' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Payer à l’usage · 0 € aujourd’hui' : 'Pay as you go · €0 today')}
          </button>
        </div>
      </details>
      )}
    </div>
  )
}
