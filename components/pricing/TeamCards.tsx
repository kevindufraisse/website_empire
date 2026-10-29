'use client'

import { useState } from 'react'
import { ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  APP_JOIN_URL,
  BILLING_PERIODS,
  MAX_SELF_SERVE_SEATS,
  PLANS,
  PLAN_LABELS,
  finalPrice,
  volumeDiscount,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'
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
 * Onglet « Équipe et agence » de /tarifs (29 octobre 2026), sur le modèle
 * Team & Enterprise de Claude : les places en libre-service (2 à 20, remise de
 * volume de /join/empire), et l'offre agence et entreprise sur devis.
 */

const AGENCY = {
  fr: [
    'Crédits illimités',
    'Un account manager dédié',
    'Stratégie mensuelle de contenu',
    'Un appel stratégique avec Kevin',
    'Production prioritaire',
  ],
  en: [
    'Unlimited credits',
    'A dedicated account manager',
    'Monthly content strategy',
    'A strategy call with Kevin',
    'Priority production',
  ],
}

const TEAM = {
  fr: ['Une formule par compte, au même rythme', 'Facturation centralisée', 'Chaque compte publie sur ses 7 réseaux', 'Remise de volume dès 3 places'],
  en: ['One plan per account, same pace', 'Centralised billing', 'Each account publishes to its 7 networks', 'Volume discount from 3 seats'],
}

export default function TeamCards({ period, onPeriodChange }: { period: BillingId; onPeriodChange: (p: BillingId) => void }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const [plan, setPlan] = useState<PlanId>('growth')
  const [seats, setSeats] = useState(3)
  const [opening, setOpening] = useState(false)
  const base = PLANS.find((p) => p.id === plan)!.price
  const perSeat = finalPrice(base, period, seats)
  const billingOnly = finalPrice(base, period, 1)
  const volume = volumeDiscount(seats)
  const months = BILLING_PERIODS.find((b) => b.id === period)!.months
  const perMonth = fr ? '/mois' : '/mo'

  const choose = () => {
    if (opening) return
    setOpening(true)
    trackAmplitude('pricing_page_plan_clicked', { plan, billing_period: period, seats, location: 'team' })
    const url = new URL(APP_JOIN_URL)
    url.searchParams.set('plan', plan)
    url.searchParams.set('period', period)
    url.searchParams.set('seats', String(seats))
    window.location.href = withAmplitudeDeviceId(url.toString())
  }

  return (
    <div className="space-y-6">
      <div className={`mx-auto max-w-md grid-flow-col auto-cols-fr items-center ${ORDER_SEGMENTS}`} role="tablist">
        {BILLING_PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === period}
            onClick={() => onPeriodChange(p.id)}
            className={`min-w-0 flex-1 whitespace-nowrap text-xs font-semibold ${ORDER_SEGMENT}`}
          >
            {fr ? p.labelFr : p.labelEn}
            {p.discount > 0 && <span className="ml-1 text-[11px] text-neutral-300">-{Math.round(p.discount * 100)}%</span>}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-2 lg:items-stretch">
        <div className={`flex h-full flex-col ${ORDER_CARD}`}>
          <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-white">{fr ? 'Équipe' : 'Team'}</p>
                <p className="text-sm text-neutral-300">{fr ? `De 2 à ${MAX_SELF_SERVE_SEATS} comptes` : `2 to ${MAX_SELF_SERVE_SEATS} accounts`}</p>
              </div>
              {volume > 0 && <span className={ORDER_TAG}>-{Math.round(volume * 100)}%</span>}
            </div>

            <div className="space-y-2">
              <p className={ORDER_LABEL}>{fr ? 'Formule de chaque compte' : 'Plan for each account'}</p>
              <div className={`grid-cols-3 ${ORDER_SEGMENTS}`} role="radiogroup">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={p.id === plan}
                    aria-selected={p.id === plan}
                    onClick={() => setPlan(p.id)}
                    className={`text-xs font-semibold ${ORDER_SEGMENT}`}
                  >
                    {PLAN_LABELS[p.id][fr ? 'fr' : 'en']}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className={ORDER_LABEL}>{fr ? 'Places' : 'Seats'}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={fr ? 'Une place de moins' : 'One seat less'}
                  onClick={() => setSeats((n) => Math.max(2, n - 1))}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-xl font-semibold tabular-nums text-white" aria-live="polite">{seats}</span>
                <button
                  type="button"
                  aria-label={fr ? 'Une place de plus' : 'One more seat'}
                  onClick={() => setSeats((n) => Math.min(MAX_SELF_SERVE_SEATS, n + 1))}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                {perSeat < base && <span className={`text-xl ${ORDER_STRUCK}`}>{base}€</span>}
                <span className={`text-[2.75rem] ${ORDER_PRICE}`}>{perSeat}€</span>
                <span className="text-sm text-neutral-300">{fr ? `par place ${perMonth}` : `per seat ${perMonth}`}</span>
              </div>
              <p className="pt-1.5 text-xs text-neutral-300">
                {fr
                  ? `${seats} places : ${(perSeat * seats).toLocaleString(locale)} €${perMonth}${months > 1 ? `, facturé ${(perSeat * seats * months).toLocaleString(locale)} € tous les ${months} mois` : ''}`
                  : `${seats} seats: €${(perSeat * seats).toLocaleString(locale)}${perMonth}${months > 1 ? `, billed €${(perSeat * seats * months).toLocaleString(locale)} every ${months} months` : ''}`}
              </p>
              <p className="text-xs text-neutral-300">
                {fr ? '-10 % dès 3 places, -15 % dès 5, -20 % dès 10' : '-10% from 3 seats, -15% from 5, -20% from 10'}
                {billingOnly < base ? (fr ? ', en plus de la remise de durée.' : ', on top of the billing discount.') : '.'}
              </p>
            </div>

            <button type="button" onClick={choose} disabled={opening} className={ORDER_CTA}>
              {opening ? (fr ? 'Ouverture…' : 'Opening…') : (
                <>
                  {fr ? `Prendre ${seats} places` : `Get ${seats} seats`}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </button>

            <ul className="space-y-2 border-t border-white/15 pt-4">
              {TEAM[fr ? 'fr' : 'en'].map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className={ORDER_CHECK} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`flex h-full flex-col ${ORDER_CARD_QUIET}`}>
          <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
            <div>
              <p className="text-base font-semibold text-white">{fr ? 'Agence et entreprise' : 'Agency and enterprise'}</p>
              <p className="text-sm text-neutral-300">{fr ? `Plus de ${MAX_SELF_SERVE_SEATS} comptes, ou un volume illimité` : `More than ${MAX_SELF_SERVE_SEATS} accounts, or unlimited volume`}</p>
            </div>
            <div className="space-y-1">
              <span className={`text-[2.75rem] ${ORDER_PRICE}`}>{fr ? 'Sur devis' : 'Custom'}</span>
              <p className="pt-1.5 text-xs text-neutral-300">{fr ? 'Prix selon le nombre de comptes et le volume.' : 'Priced on accounts and volume.'}</p>
            </div>
            <a
              href="/demo"
              onClick={() => trackAmplitude('empire_demo_clicked', { source: 'tarifs_agency' })}
              className={ORDER_CTA_SECONDARY}
            >
              {fr ? 'Parler à l’équipe' : 'Talk to the team'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
            <ul className="space-y-2 border-t border-white/15 pt-4">
              <li className="text-sm font-medium text-white">{fr ? 'Tout ce qu’il y a dans Scale, plus :' : 'Everything in Scale, plus:'}</li>
              {AGENCY[fr ? 'fr' : 'en'].map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className={ORDER_CHECK} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
