'use client'

import type React from 'react'

import glass from './pricing.module.css'
import { Check, Linkedin, Mail, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  BILLING_PERIODS,
  PLANS,
  PLAN_DELIVERABLES,
  PLAN_LABELS,
  finalPrice,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { trackAmplitude } from '@/lib/amplitude'
import { LIVE_OFFER, isLivePlan, useCountdown, type LiveWindow } from '@/lib/liveOffer'
import { ORDER_PRICE, ORDER_SEGMENT, ORDER_SEGMENTS, ORDER_STRUCK, ORDER_TAG } from '@/lib/orderStyles'
import { nbsp } from './typo'

/**
 * Les formules de /tarifs, dites en contenus par mois (plus en crédits).
 * Sur téléphone : trois tuiles de prix, puis la carte de la formule choisie
 * avec son sélecteur de période. Sur ordinateur : un sélecteur de période et
 * les trois cartes côte à côte. La carte choisit la formule ; le bouton
 * d'achat est sous les cartes (`TrialCta`).
 */

const RHYTHM_TU: Record<PlanId, string> = {
  starter: 'Tu publies tous les 2 jours',
  growth: 'Tu publies tous les jours',
  scale: 'Tu publies 2 fois par jour',
}

// Ce qu'Empire fait pour chaque formule : repris des lignes du tableau comparatif de /tarifs.
const DOES: { fr: string; en: string }[] = [
  { fr: 'Chaque matin, les sujets qui montent dans ta niche', en: 'Every morning, the topics rising in your niche' },
  { fr: 'Des idées prêtes à filmer chaque semaine', en: 'Ready-to-film ideas every week' },
  { fr: 'Écriture, montage, sous-titres et miniatures', en: 'Writing, editing, captions and thumbnails' },
  { fr: 'Publication sur 7 réseaux, et un rapport chaque semaine', en: 'Publishing to 7 networks, and a weekly report' },
]

const EXTRAS: Record<PlanId, { title: { fr: string; en: string }; lines: { fr: string; en: string }[] } | null> = {
  starter: null,
  growth: {
    title: { fr: 'En plus', en: 'Also included' },
    lines: [
      { fr: 'Réponse prioritaire sous 4 h', en: 'Priority reply within 4h' },
      { fr: 'Le live de Kevin chaque lundi à 14 h', en: 'Kevin’s live every Monday at 2 pm (Paris)' },
      { fr: 'La communauté privée sur Slack', en: 'The private Slack community' },
      { fr: 'La masterclass Empire en replay', en: 'The Empire masterclass replays' },
    ],
  },
  scale: {
    title: { fr: 'Tout Growth, plus', en: 'Everything in Growth, plus' },
    lines: [
      { fr: 'Un point stratégie chaque mois (retours par Loom)', en: 'A strategy review every month (Loom feedback)' },
    ],
  },
}

type Props = {
  /** Téléphone : le bouton d'essai dans la carte choisie, sous le prix (comme Claude, Intercom, Semrush). */
  cta?: React.ReactNode
  /** Envoyé avec `pricing_page_plan_chosen`. */
  location: string
  period: BillingId
  onPeriodChange: (p: BillingId) => void
  chosen: PlanId
  onChoose: (plan: PlanId) => void
  /** Arrivé par le lien du live : Growth et Scale à -300 €/mois pendant 3 mois (mensuel seulement). */
  live?: LiveWindow | null
}

export default function PlanCards({ location, period, onPeriodChange, chosen, onChoose, live = null, cta }: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const selected = chosen
  const billing = BILLING_PERIODS.find((p) => p.id === period)!
  const discount = billing.discount
  const perMonth = fr ? '/mois' : '/mo'
  const countdown = useCountdown(live?.endsAt)
  // Offre du live : seuls Growth et Scale sont concernés, Starter est masqué.
  const plans = live ? PLANS.filter((p) => isLivePlan(p.id)) : PLANS
  const percent = (d: number) => (fr ? `−${Math.round(d * 100)} %` : `-${Math.round(d * 100)}%`)
  // Annuel −18 % ≈ 2 mois sur 12 ; trimestriel −12 % ≈ 11 jours sur 91 (arrondi en dessous : 10). Dit en temps plutôt qu'en pourcentage.
  const saving = (b: { discount: number; months: number }) => (b.months === 12 ? (fr ? '2 mois offerts' : '2 months free') : b.months === 3 ? (fr ? '10 jours offerts' : '10 days free') : percent(b.discount))

  const choose = (plan: PlanId) => {
    onChoose(plan)
    trackAmplitude('pricing_page_plan_chosen', { plan, billing_period: period, location })
  }

  const periodTabs = (className: string) => (
    <div className={`grid-flow-col auto-cols-fr items-center ${ORDER_SEGMENTS} ${className}`} role="tablist" aria-label={fr ? 'Période de facturation' : 'Billing period'}>
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
  )

  return (
    <div>
      {/* Téléphone : les trois prix d'abord, visibles sans faire défiler. */}
      <div className={`grid gap-2 lg:hidden ${plans.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} role="radiogroup" aria-label={fr ? 'Formule' : 'Plan'}>
        {plans.map((p) => {
          const active = p.id === selected
          const price = live && period === 'monthly' && isLivePlan(p.id) ? LIVE_OFFER.plans[p.id].monthly : finalPrice(p.price, period, 1)
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChoose(p.id)}
              className={`relative flex min-h-[68px] cursor-pointer flex-col items-start justify-center gap-0.5 px-3 py-3 text-left ${glass.planOption}`}
            >
              {p.highlighted && (
                <span className={`absolute -top-2.5 right-2 whitespace-nowrap px-2 py-0.5 text-[11px] font-bold leading-tight ${glass.limeTag}`}>
                  {fr ? 'Populaire' : 'Popular'}
                </span>
              )}
              <span className={`text-[13px] font-semibold leading-tight ${active ? 'text-white' : 'text-neutral-300'}`}>{PLAN_LABELS[p.id][fr ? 'fr' : 'en']}</span>
              <span className="whitespace-nowrap leading-tight tabular-nums text-white">
                <span className="text-[17px] font-bold">{fr ? `${price} €` : `€${price}`}</span>
                <span className="text-xs text-neutral-400">{perMonth}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Ordinateur : un seul sélecteur de période au-dessus des trois cartes. */}
      {periodTabs('mx-auto hidden max-w-md lg:grid')}

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
          const price = liveDeal ? liveDeal.monthly : finalPrice(plan.price, period, 1)
          const total = (price * billing.months).toLocaleString(locale)
          const d = PLAN_DELIVERABLES[plan.id]
          const extras = EXTRAS[plan.id]
          const label = PLAN_LABELS[plan.id][fr ? 'fr' : 'en']
          return (
            <div key={plan.id} className={isSelected ? '' : 'hidden lg:block'}>
              {/* La carte entière choisit la formule (clic) ; son en-tête est le
                  bouton radio pour le clavier et les lecteurs d'écran. */}
              <div
                data-selected={isSelected}
                onClick={() => choose(plan.id)}
                className={`flex h-full flex-col gap-5 p-5 sm:p-6 lg:cursor-pointer ${glass.panel} ${glass.plan} ${glass.planCard}`}
              >
                <button type="button" role="radio" aria-checked={isSelected} className="flex w-full cursor-pointer items-start justify-between gap-3 text-left">
                  <span className="min-w-0">
                    <span className="block text-xl font-bold leading-tight text-white">{label}</span>
                    <span className="mt-1 block text-sm text-neutral-300">{fr ? RHYTHM_TU[plan.id] : plan.rhythmEn.replace('You post', 'You publish')}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {plan.highlighted && <span className={`hidden whitespace-nowrap px-2.5 py-1 text-xs font-bold lg:inline-block ${glass.limeTag}`}>{fr ? 'Populaire' : 'Popular'}</span>}
                    <span aria-hidden className={`hidden h-5 w-5 items-center justify-center rounded-full border lg:flex ${isSelected ? 'border-empire bg-empire text-black' : 'border-white/30'}`}>
                      {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </span>
                </button>

                {/* Téléphone : la période se règle dans la carte, au-dessus du prix,
                    pour que le sélecteur ne bouge pas sous le doigt quand le prix
                    barré et la ligne de facturation apparaissent. */}
                <div className="lg:hidden" onClick={(e) => e.stopPropagation()}>
                  {periodTabs('grid')}
                </div>

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
                      {discount > 0 && <span className={`text-lg ${ORDER_STRUCK}`}>{fr ? `${plan.price} €` : `€${plan.price}`}</span>}
                      <span className={`text-[2.75rem] !font-bold ${ORDER_PRICE}`}>{fr ? `${price} €` : `€${price}`}</span>
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

                {cta && isSelected && <div className="lg:hidden" onClick={(e) => e.stopPropagation()}>{cta}</div>}

                <div className="space-y-2.5 border-t border-white/10 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{fr ? 'Chaque mois, au choix, jusqu’à' : 'Every month, your pick, up to'}</p>
                  {[
                    { icon: Video, n: d.reels, fr: 'reels montés', en: 'edited reels', or: false },
                    { icon: Linkedin, n: d.posts, fr: 'posts LinkedIn', en: 'LinkedIn posts', or: true },
                    { icon: Mail, n: d.newsletters, fr: 'newsletters', en: 'newsletters', or: true },
                  ].map((row) => (
                    <p key={row.fr} className="flex items-center gap-3 text-[15px] text-neutral-200">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                        <row.icon className="h-4 w-4 text-empire" />
                      </span>
                      <span>
                        {row.or && <span className="text-neutral-400">{fr ? 'ou ' : 'or '}</span>}
                        <span className="font-bold tabular-nums text-white">{row.n}</span> {fr ? row.fr : row.en}
                      </span>
                    </p>
                  ))}
                  {/* Ce qu'Empire fait autour de chaque contenu (repris du tableau comparatif). */}
                  <div className="!mt-4 rounded-xl bg-white/[0.05] px-3.5 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{fr ? 'Empire s’occupe de tout' : 'Empire handles everything'}</p>
                    <ul className="mt-2.5 space-y-2 text-[13px] leading-snug text-neutral-200">
                      {DOES.map((d) => (
                        <li key={d.fr} className="flex gap-2.5">
                          <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-empire" strokeWidth={3} />
                          <span>{fr ? nbsp(d.fr) : d.en}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[12px] text-neutral-400">{fr ? nbsp('Tu mélanges les formats comme tu veux, chaque mois.') : 'Mix the formats as you like, every month.'}</p>
                  </div>
                </div>

                {extras && (
                  <div className="border-t border-white/10 pt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{fr ? extras.title.fr : extras.title.en}</p>
                    <ul className="mt-3 space-y-2.5">
                      {extras.lines.map((l) => (
                        <li key={l.fr} className="flex items-start gap-2.5 text-sm leading-snug text-neutral-200">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-empire" strokeWidth={2.5} />
                          <span>{fr ? nbsp(l.fr) : l.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
