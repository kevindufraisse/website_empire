'use client'

import type React from 'react'

import glass from './pricing.module.css'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  BILLING_PERIODS,
  PLANS,
  PLAN_LABELS,
  finalPrice,
  freelanceMonthly,
  planMix,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { trackAmplitude } from '@/lib/amplitude'
import { LIVE_OFFER, isLivePlan, useCountdown, type LiveWindow } from '@/lib/liveOffer'
import { ORDER_CTA_SECONDARY, ORDER_PRICE, ORDER_SEGMENT, ORDER_SEGMENTS, ORDER_STRUCK, ORDER_TAG } from '@/lib/orderStyles'
import { freelanceAmount, freelanceCardLead } from './freelanceCopy'
import { nbsp } from './typo'

/**
 * Le choix de la formule en haut de /tarifs (offre « Grand Slam », novembre
 * 2026). Téléphone : trois pastilles (nom, rythme, prix), la période, puis la
 * carte de la formule choisie : prix, le même travail chez des freelances,
 * bouton d'essai. Ordinateur : la période, puis les trois cartes côte à côte,
 * chacune avec ses deux lignes ; le bouton d'essai est dans la carte choisie,
 * les autres la choisissent.
 *
 * Pas de prix barré pour la comparaison freelance : c'est une comparaison
 * étiquetée (« Le même travail chez des freelances : plus de … »), pas une
 * réduction.
 */

export const RHYTHM_SHORT: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: 'tous les 2 jours', en: 'every other day' },
  growth: { fr: 'tous les jours', en: 'every day' },
  scale: { fr: '2 fois par jour', en: 'twice a day' },
}

export const RHYTHM_TU: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: 'Tu publies tous les 2 jours', en: 'You publish every other day' },
  growth: { fr: 'Tu publies tous les jours', en: 'You publish every day' },
  scale: { fr: 'Tu publies 2 fois par jour', en: 'You publish twice a day' },
}

// Ce qui change d'une formule à l'autre (ordinateur, sous le bouton). Même
// matrice que le reçu : réponse prioritaire et bonus à partir de Growth, point
// stratégie en Scale.
const CARD_EXTRAS: Record<PlanId, { fr: string; en: string }[]> = {
  starter: [
    { fr: 'Publication sur 7 réseaux', en: 'Publishing to 7 networks' },
    { fr: 'Onboarding 1-1 offert', en: 'Free 1-1 onboarding' },
  ],
  growth: [
    { fr: 'Publication sur 7 réseaux', en: 'Publishing to 7 networks' },
    { fr: 'Onboarding 1-1 offert', en: 'Free 1-1 onboarding' },
    { fr: 'Réponse prioritaire sous 4 h', en: 'Priority reply within 4h' },
    { fr: 'Le live, le Slack et la masterclass', en: 'The live, the Slack and the masterclass' },
  ],
  scale: [
    { fr: 'Tout Growth', en: 'Everything in Growth' },
    { fr: 'Un point stratégie chaque mois', en: 'A strategy review every month' },
  ],
}

type Props = {
  /** Le bouton d'essai, dans la carte choisie, sous la bande freelance. */
  cta?: React.ReactNode
  /** Envoyé avec `pricing_page_plan_chosen`. */
  location: string
  period: BillingId
  onPeriodChange: (p: BillingId) => void
  chosen: PlanId
  onChoose: (plan: PlanId) => void
  /** Arrivé par le lien du live : Growth et Scale à -300 €/mois pendant 3 mois (mensuel seulement). */
  live?: LiveWindow | null
  /** L'ancre du reçu détaillé (« Le détail »). */
  detailHref?: string
}

export default function PlanCards({ location, period, onPeriodChange, chosen, onChoose, live = null, cta, detailHref = '#recu' }: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const selected = chosen
  const billing = BILLING_PERIODS.find((p) => p.id === period)!
  const discount = billing.discount
  const perMonth = fr ? '/mois' : '/mo'
  const countdown = useCountdown(live?.endsAt)
  const euros = (n: number) => (fr ? `${n.toLocaleString(locale)}\u00a0€` : `€${n.toLocaleString(locale)}`)
  // Offre du live : seuls Growth et Scale sont concernés, Starter est masqué.
  const plans = live ? PLANS.filter((p) => isLivePlan(p.id)) : PLANS
  const percent = (d: number) => (fr ? `−${Math.round(d * 100)} %` : `-${Math.round(d * 100)}%`)
  // Annuel −18 % ≈ 2 mois sur 12 ; trimestriel −12 % ≈ 11 jours sur 91 (arrondi en dessous : 10). Dit en temps plutôt qu'en pourcentage.
  const saving = (b: { discount: number; months: number }) => (b.months === 12 ? (fr ? '2 mois offerts' : '2 months free') : b.months === 3 ? (fr ? '10 jours offerts' : '10 days free') : percent(b.discount))
  const priceOf = (id: PlanId) => {
    const p = PLANS.find((x) => x.id === id)!
    return live && period === 'monthly' && isLivePlan(id) ? LIVE_OFFER.plans[id].monthly : finalPrice(p.price, period, 1)
  }

  const choose = (plan: PlanId) => {
    onChoose(plan)
    trackAmplitude('pricing_page_plan_chosen', { plan, billing_period: period, location })
  }

  return (
    <div>
      {/* Téléphone : les trois formules d'abord, avec leur rythme et leur prix. */}
      <div className={`grid gap-2 lg:hidden ${plans.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} role="radiogroup" aria-label={fr ? 'Formule' : 'Plan'}>
        {plans.map((p) => {
          const active = p.id === selected
          const price = priceOf(p.id)
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChoose(p.id)}
              className={`relative flex min-h-[78px] cursor-pointer flex-col items-start justify-center px-2 py-2.5 text-left min-[380px]:px-3 ${glass.planOption}`}
            >
              {p.highlighted && (
                <span className={`absolute -top-2.5 right-2 whitespace-nowrap px-2 py-0.5 text-[11px] font-bold leading-tight ${glass.limeTag}`}>
                  {fr ? 'Populaire' : 'Popular'}
                </span>
              )}
              <span className={`text-[13px] font-semibold leading-tight ${active ? 'text-white' : 'text-neutral-200'}`}>{PLAN_LABELS[p.id][fr ? 'fr' : 'en']}</span>
              <span className="mt-0.5 whitespace-nowrap text-[11px] leading-tight text-neutral-400 min-[380px]:text-[11.5px]">{fr ? nbsp(RHYTHM_SHORT[p.id].fr) : RHYTHM_SHORT[p.id].en}</span>
              <span className="mt-1.5 whitespace-nowrap leading-tight tabular-nums text-white">
                <span className="text-[17px] font-bold">{euros(price)}</span>
                <span className="text-[11.5px] text-neutral-400">{perMonth}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* La période : sous les pastilles sur téléphone, au-dessus des cartes sur ordinateur. */}
      <div className={`mt-3 grid grid-flow-col auto-cols-fr items-center lg:mx-auto lg:mt-0 lg:max-w-md ${ORDER_SEGMENTS}`} role="tablist" aria-label={fr ? 'Période de facturation' : 'Billing period'}>
        {BILLING_PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === period}
            onClick={() => onPeriodChange(p.id)}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 whitespace-nowrap text-[13px] font-semibold leading-tight ${ORDER_SEGMENT}`}
          >
            <span>{fr ? p.labelFr : p.labelEn}</span>
            {p.discount > 0 && <span className="text-xs font-semibold text-empire">{saving(p)}</span>}
          </button>
        ))}
      </div>

      {live && period !== 'monthly' && (
        <p className="mt-4 text-center text-xs text-neutral-300">
          {fr
            ? `Ton offre du live (-${LIVE_OFFER.discountMonthly} € par mois pendant ${LIVE_OFFER.discountMonths} mois) est en mensuel. `
            : `Your live offer (-€${LIVE_OFFER.discountMonthly} a month for ${LIVE_OFFER.discountMonths} months) is monthly. `}
          <button type="button" onClick={() => onPeriodChange('monthly')} className="cursor-pointer font-semibold text-white underline decoration-white/30 underline-offset-2">
            {fr ? 'Voir en mensuel' : 'See monthly'}
          </button>
        </p>
      )}

      <div className={`mx-auto mt-3 grid gap-4 lg:mt-6 lg:items-stretch ${plans.length === 2 ? 'max-w-3xl lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {plans.map((plan) => {
          const isSelected = plan.id === selected
          const liveDeal = live && period === 'monthly' && isLivePlan(plan.id) ? LIVE_OFFER.plans[plan.id] : null
          const price = priceOf(plan.id)
          const total = (price * billing.months).toLocaleString(locale)
          const label = PLAN_LABELS[plan.id][fr ? 'fr' : 'en']
          const freelance = freelanceMonthly(plan.id)
          const mix = planMix(plan.id)
          return (
            <div key={plan.id} className={isSelected ? '' : 'hidden lg:block'}>
              {/* La carte entière choisit la formule (clic) ; son en-tête est le
                  bouton radio pour le clavier et les lecteurs d'écran. */}
              <div
                data-selected={isSelected}
                onClick={() => choose(plan.id)}
                className={`flex h-full flex-col gap-3 p-5 sm:p-6 lg:cursor-pointer lg:gap-4 lg:p-5 xl:p-6 ${glass.panel} ${glass.plan} ${glass.planCard}`}
              >
                <button type="button" role="radio" aria-checked={isSelected} className="flex w-full cursor-pointer items-center justify-between gap-3 text-left lg:items-start">
                  {/* Téléphone : nom et rythme sur une ligne (les pastilles du dessus les montrent déjà). */}
                  <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 lg:block">
                    <span className="block text-xl font-bold leading-tight text-white">{label}</span>
                    <span className="block text-sm text-neutral-300 lg:mt-1">{fr ? nbsp(RHYTHM_TU[plan.id].fr) : RHYTHM_TU[plan.id].en}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {plan.highlighted && <span className={`hidden whitespace-nowrap px-2.5 py-1 text-xs font-bold lg:inline-block ${glass.limeTag}`}>{fr ? 'Populaire' : 'Popular'}</span>}
                    <span aria-hidden className={`hidden h-5 w-5 items-center justify-center rounded-full border lg:flex ${isSelected ? 'border-empire bg-empire text-black' : 'border-white/30'}`}>
                      {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </span>
                </button>

                {liveDeal ? (
                  // Présentation reprise d'ElevenLabs : pastille de fin,
                  // ancien prix barré + offre en petit, puis le prix payé.
                  <div className="space-y-1.5">
                    {countdown && (
                      <span className="inline-flex rounded-full bg-[#DAFC68] px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-black">
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
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {discount > 0 && <span className={`text-lg ${ORDER_STRUCK}`}>{euros(plan.price)}</span>}
                      <span className={`text-[2.75rem] !font-bold ${ORDER_PRICE}`}>{euros(price)}</span>
                      <span className="text-sm text-neutral-300">{perMonth}</span>
                    </div>
                    {discount > 0 && (
                      <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                        <span className={`!text-xs ${ORDER_TAG}`}>{saving(billing)}</span>
                        <span>
                          {fr
                            ? nbsp(`Facturé ${total} € ${billing.months === 12 ? 'une fois par an' : `tous les ${billing.months} mois`}`)
                            : `Billed €${total} ${billing.months === 12 ? 'once a year' : `every ${billing.months} months`}`}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Sous le prix, deux lignes calmes (revue de Kevin) : le même travail
                    au prix freelance du reçu (`freelanceMonthly`, mode de
                    `lib/plans.ts`), puis le retour possible. Pas de prix barré ni de
                    pastille d'économie : c'est une comparaison. */}
                <div className="space-y-1.5 lg:border-t lg:border-white/10 lg:pt-4">
                  <p className="text-[13.5px] leading-snug text-neutral-300 lg:text-[13px]">
                    {freelanceCardLead(fr)}
                    <a href={detailHref} className="whitespace-nowrap text-neutral-100 underline decoration-white/20 decoration-dotted underline-offset-[3px] hover:decoration-white/60">
                      {freelanceAmount(freelance, fr)}
                    </a>
                  </p>
                  <p className="text-[12.5px] leading-snug text-neutral-400">
                    {fr ? nbsp('Un seul client venu de ton contenu peut suffire à rembourser ton mois.') : 'A single client from your content can be enough to pay for your month.'}
                  </p>
                </div>

                <div className="lg:min-h-[104px]" onClick={(e) => { if (isSelected) e.stopPropagation() }}>
                  {isSelected ? cta : (
                    <button type="button" tabIndex={-1} aria-hidden className={`hidden !min-h-[52px] lg:inline-flex ${ORDER_CTA_SECONDARY}`}>
                      {fr ? `Choisir ${label}` : `Choose ${label}`}
                    </button>
                  )}
                </div>

                {/* Ordinateur : ce qui change d'une formule à l'autre. */}
                <ul className="hidden space-y-2.5 border-t border-white/10 pt-5 lg:block">
                  <li className="flex items-start gap-2.5 text-sm leading-snug text-neutral-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-empire" strokeWidth={2.5} />
                    <span>{fr ? nbsp(`${mix.reels} reels et ${mix.posts} posts par mois, répartition au choix`) : `${mix.reels} reels and ${mix.posts} posts a month, split as you like`}</span>
                  </li>
                  {CARD_EXTRAS[plan.id].map((l) => (
                    <li key={l.fr} className="flex items-start gap-2.5 text-sm leading-snug text-neutral-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-empire" strokeWidth={2.5} />
                      <span>{fr ? nbsp(l.fr) : l.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
