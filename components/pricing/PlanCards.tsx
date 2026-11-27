'use client'

import type React from 'react'
import { Check } from 'lucide-react'
import glass from './pricing.module.css'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  BILLING_PERIODS,
  PLANS,
  finalPrice,
  freelanceMonthly,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { trackAmplitude } from '@/lib/amplitude'
import { LIVE_OFFER, isLivePlan, useCountdown, type LiveWindow } from '@/lib/liveOffer'
import { BLACK_FRIDAY, blackFridayBase, formatBlackFridayLeft, useBlackFriday, useBlackFridayDuration } from '@/lib/blackFriday'
import { ORDER_CTA_SECONDARY, ORDER_SEGMENT, ORDER_SEGMENTS } from '@/lib/orderStyles'
import { nbsp } from './typo'

/**
 * Formules Empire V3 : Empire Solo (199 €/mois, autonome) vs Empire Club
 * (499 €/mois, avec Kevin & le Club). Pendant le Black Friday (jusqu'au
 * 30 novembre 23 h 59, Paris), la carte Empire Club route automatiquement sur
 * `scale` avec la promo `scale499` (2× plus d'usage à vie + Academy offerte).
 * Passé `BLACK_FRIDAY.endsAt`, elle rebascule seule sur `growth` (499 €).
 */

export const RHYTHM_SHORT: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: '1 par jour', en: '1 a day' },
  growth: { fr: 'tous les jours + Club', en: 'every day + Club' },
  scale: { fr: '2 fois par jour + Club', en: 'twice a day + Club' },
}

export const RHYTHM_TU: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: '1 contenu par jour · 100 % autonome', en: '1 post a day · 100% self-serve' },
  growth: { fr: 'Tous les jours + Kevin & le Club', en: 'Every day + Kevin & the Club' },
  scale: { fr: '2 fois par jour + Kevin & le Club', en: 'Twice a day + Kevin & the Club' },
}

const WEEK_DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const WEEK_DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type Props = {
  cta?: React.ReactNode
  location: string
  period: BillingId
  onPeriodChange: (p: BillingId) => void
  chosen: PlanId
  onChoose: (plan: PlanId) => void
  live?: LiveWindow | null
  detailHref?: string
}

export default function PlanCards({
  location,
  period,
  onPeriodChange,
  chosen,
  onChoose,
  live = null,
  cta,
  detailHref = '#recu',
}: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const billing = BILLING_PERIODS.find((p) => p.id === period)!
  const discount = billing.discount
  const perMonth = fr ? '/mois' : '/mo'
  const countdown = useCountdown(live?.endsAt)
  const euros = (n: number) => (fr ? `${n.toLocaleString(locale)}\u00a0€` : `€${n.toLocaleString(locale)}`)
  const percent = (d: number) => (fr ? `−${Math.round(d * 100)} %` : `-${Math.round(d * 100)}%`)
  const saving = (b: { discount: number; months: number }) =>
    b.months === 12
      ? fr ? '2 mois offerts' : '2 months free'
      : b.months === 3
        ? fr ? '10 jours offerts' : '10 days free'
        : percent(b.discount)

  const bf = useBlackFriday()
  const bfMonths = useBlackFridayDuration()
  const bfActive = bf.active
  const clubPlanId: PlanId = bfActive ? BLACK_FRIDAY.plan : 'growth'

  const priceOf = (id: PlanId) => {
    const p = PLANS.find((x) => x.id === id)!
    return live && period === 'monthly' && isLivePlan(id) && !(bfActive && id === BLACK_FRIDAY.plan)
      ? LIVE_OFFER.plans[id].monthly
      : finalPrice(blackFridayBase(id, p.price, bfActive), period, 1)
  }

  const soloSelected = chosen === 'starter'
  const clubSelected = !soloSelected

  const soloPlan = PLANS.find((p) => p.id === 'starter')!
  const clubPlan = PLANS.find((p) => p.id === clubPlanId)!

  const soloPrice = priceOf('starter')
  const soloTotal = (soloPrice * billing.months).toLocaleString(locale)
  const soloFreelance = freelanceMonthly('starter')

  const clubPrice = priceOf(clubPlanId)
  const clubCatalog = finalPrice(clubPlan.price, period, 1)
  const clubTotal = (clubPrice * billing.months).toLocaleString(locale)
  const clubFreelance = freelanceMonthly(clubPlanId)
  const clubLiveDeal = live && period === 'monthly' && isLivePlan(clubPlanId) && !bfActive ? LIVE_OFFER.plans[clubPlanId] : null

  const choose = (plan: PlanId) => {
    onChoose(plan)
    trackAmplitude('pricing_page_plan_chosen', { plan, billing_period: period, location })
  }

  const days = fr ? WEEK_DAYS_FR : WEEK_DAYS_EN

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", var(--font-inter), Inter, -apple-system, sans-serif' }}>
      {/* Période de facturation */}
      <div
        className={`mb-3 grid grid-flow-col auto-cols-fr items-center lg:mx-auto lg:mb-5 lg:max-w-md ${ORDER_SEGMENTS}`}
        role="tablist"
        aria-label={fr ? 'Période de facturation' : 'Billing period'}
      >
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
            {p.discount > 0 && <span className="text-[11px] font-semibold text-empire">{saving(p)}</span>}
          </button>
        ))}
      </div>

      {/* Téléphone : sélecteur rapide Solo vs Empire Club */}
      {!live && (
        <div className="mb-3 grid grid-cols-2 gap-2 lg:hidden" role="radiogroup" aria-label={fr ? 'Formule' : 'Plan'}>
          <button
            type="button"
            role="radio"
            aria-checked={soloSelected}
            onClick={() => choose('starter')}
            className={`relative flex min-h-[64px] cursor-pointer flex-col items-start justify-center px-3 py-2 text-left ${glass.planOption}`}
          >
            <span className={`text-[13px] font-bold leading-tight ${soloSelected ? 'text-white' : 'text-neutral-200'}`}>Empire Solo</span>
            <span className="mt-0.5 text-[10.5px] leading-tight text-neutral-400">{fr ? '1 contenu / jour · seul' : '1 post / day · solo'}</span>
            <span className="mt-1 whitespace-nowrap leading-tight tabular-nums text-white">
              <span className="text-[16px] font-extrabold">{euros(soloPrice)}</span>
              <span className="text-[11px] text-neutral-400">{perMonth}</span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={clubSelected}
            onClick={() => choose(clubPlanId)}
            className={`relative flex min-h-[64px] cursor-pointer flex-col items-start justify-center px-3 py-2 text-left ${glass.planOption}`}
          >
            <span className={`absolute -top-2 right-2 whitespace-nowrap px-2 py-0.5 text-[10px] font-extrabold leading-tight ${glass.limeTag}`}>
              {bfActive ? 'Black Friday' : fr ? 'Le plus choisi' : 'Most chosen'}
            </span>
            <span className={`text-[13px] font-bold leading-tight ${clubSelected ? 'text-white' : 'text-neutral-200'}`}>Empire Club</span>
            <span className="mt-0.5 text-[10.5px] leading-tight text-neutral-400">
              {bfActive ? (fr ? '2 / jour (×2) + le Club' : '2 / day (×2) + Club') : (fr ? 'Tous les jours + le Club' : 'Daily + the Club')}
            </span>
            <span className="mt-1 flex items-baseline gap-1.5 whitespace-nowrap leading-tight tabular-nums text-white">
              {bfActive && <span className="text-[11px] font-semibold text-neutral-500 line-through">{euros(clubCatalog)}</span>}
              <span className="text-[16px] font-extrabold text-empire">{euros(clubPrice)}</span>
              <span className="text-[11px] text-neutral-400">{perMonth}</span>
            </span>
          </button>
        </div>
      )}

      {live && period !== 'monthly' && (
        <p className="mb-4 text-center text-xs text-neutral-300">
          {fr
            ? `Ton offre du live (-${LIVE_OFFER.discountMonthly} € par mois pendant ${LIVE_OFFER.discountMonths} mois) est en mensuel. `
            : `Your live offer (-€${LIVE_OFFER.discountMonthly} a month for ${LIVE_OFFER.discountMonths} months) is monthly. `}
          <button type="button" onClick={() => onPeriodChange('monthly')} className="cursor-pointer font-semibold text-white underline decoration-white/30 underline-offset-2">
            {fr ? 'Voir en mensuel' : 'See monthly'}
          </button>
        </p>
      )}

      {/* Grille éditoriale asymétrique : Empire Solo (0.86fr) vs Empire Club (1.14fr) */}
      <div className={`mx-auto grid gap-5 lg:items-stretch ${live ? 'max-w-2xl' : 'max-w-5xl lg:grid-cols-[0.86fr_1.14fr]'}`}>
        {/* CARTE GAUCHE : EMPIRE SOLO */}
        {!live && (
          <div className={soloSelected ? '' : 'hidden lg:block'}>
            <section
              data-selected={soloSelected}
              onClick={() => choose('starter')}
              className={`flex h-full flex-col rounded-[24px] border bg-[#0d0d0e] p-6 transition-colors lg:cursor-pointer sm:p-7 ${
                soloSelected
                  ? 'border-empire shadow-[0_0_0_1px_rgba(218,252,104,0.22)]'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={soloSelected}
                className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
              >
                <span className="text-[22px] font-bold tracking-tight text-white">Empire Solo</span>
                <span className="flex items-center gap-2">
                  <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-300">
                    {fr ? '100 % autonome' : '100% self-serve'}
                  </span>
                  <span
                    aria-hidden
                    className={`hidden h-5 w-5 items-center justify-center rounded-full border lg:flex ${
                      soloSelected ? 'border-empire bg-empire text-black' : 'border-white/30'
                    }`}
                  >
                    {soloSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </span>
              </button>

              <p className="mt-1.5 text-[13.5px] leading-snug text-neutral-400">
                {fr
                  ? nbsp('L’outil complet pour produire et publier seul, sans appels ni accompagnement.')
                  : 'The complete tool to produce and publish on your own, without calls or coaching.'}
              </p>

              <div className="mt-5 border-b border-white/10 pb-5">
                <div className="flex flex-wrap items-baseline gap-2">
                  {discount > 0 && <span className="text-lg font-semibold text-neutral-500 line-through tabular-nums">{euros(soloPlan.price)}</span>}
                  <span className="text-[46px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-white">{euros(soloPrice)}</span>
                  <span className="text-sm font-medium text-neutral-400">{perMonth}</span>
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  {discount > 0 ? (
                    fr
                      ? nbsp(`Facturé ${soloTotal} € ${billing.months === 12 ? 'une fois par an' : `tous les ${billing.months} mois`}`)
                      : `Billed €${soloTotal} ${billing.months === 12 ? 'once a year' : `every ${billing.months} months`}`
                  ) : (
                    <>
                      {fr ? 'Remplace ~' : 'Replaces ~'}
                      <a href={detailHref} className="text-neutral-200 underline decoration-white/25 decoration-dotted underline-offset-2 hover:decoration-white/70">
                        {euros(soloFreelance)}{perMonth}
                      </a>
                      {fr ? nbsp(' de rédaction, montage & outils') : ' of writing, editing & tools'}
                    </>
                  )}
                </p>
              </div>

              {/* Semainier visuel : 1 contenu par jour */}
              <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#131315] px-3.5 py-3">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <strong className="text-xs font-semibold text-neutral-100">
                    {fr ? 'Rythme : 1 contenu par jour' : 'Pace: 1 post per day'}
                  </strong>
                  <span className="text-[11.5px] tabular-nums text-neutral-400">
                    {fr ? 'Jusqu’à 30 / mois' : 'Up to 30 / mo'}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5" aria-hidden>
                  {days.map((d) => (
                    <span
                      key={d}
                      className="flex h-6 items-center justify-center rounded-md border border-white/15 bg-white/[0.08] text-[10px] font-semibold text-white"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <dl className="mt-4 divide-y divide-white/[0.06] text-[13.5px]">
                <div className="flex items-baseline justify-between gap-3 py-2.5">
                  <dt className="font-medium text-neutral-200">{fr ? 'Idées & veille de niche' : 'Ideas & niche watch'}</dt>
                  <dd className="shrink-0 text-xs text-neutral-400">{fr ? 'Chaque semaine' : 'Every week'}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2.5">
                  <dt className="font-medium text-neutral-200">{fr ? 'Posts, Reels, Carrousels & Newsletter' : 'Posts, Reels, Carousels & Newsletter'}</dt>
                  <dd className="shrink-0 text-xs text-neutral-400">{fr ? 'Inclus' : 'Included'}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2.5">
                  <dt className="font-medium text-neutral-200">{fr ? 'Publication 7 réseaux & Auto-DM' : '7-network publishing & Auto-DM'}</dt>
                  <dd className="shrink-0 text-xs text-neutral-400">{fr ? 'Inclus' : 'Included'}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2.5">
                  <dt className="font-medium text-neutral-200">{fr ? 'Prise en main' : 'Onboarding'}</dt>
                  <dd className="shrink-0 text-xs text-neutral-400">{fr ? 'Vidéos courtes intégrées' : 'Built-in short videos'}</dd>
                </div>
              </dl>

              <div className="mt-auto pt-5" onClick={(e) => { if (soloSelected) e.stopPropagation() }}>
                {soloSelected ? (
                  cta
                ) : (
                  <button
                    type="button"
                    onClick={() => choose('starter')}
                    className={`!min-h-[52px] w-full ${ORDER_CTA_SECONDARY}`}
                  >
                    {fr ? 'Choisir Empire Solo' : 'Choose Empire Solo'}
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* CARTE DROITE : EMPIRE CLUB (Éditoriale + Black Friday ×2 auto-off à BLACK_FRIDAY.endsAt) */}
        <div className={clubSelected || live ? '' : 'hidden lg:block'}>
          <section
            data-selected={clubSelected}
            onClick={() => choose(clubPlanId)}
            className={`flex h-full flex-col overflow-hidden rounded-[24px] bg-[#10120d] transition-colors lg:cursor-pointer ${
              clubSelected
                ? 'border-[1.5px] border-empire shadow-[0_24px_70px_rgba(0,0,0,0.75)]'
                : 'border border-empire/45 hover:border-empire'
            }`}
          >
            {bfActive && (
              <div className="flex items-center justify-between gap-2 bg-empire px-4 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.02em] text-[#070805] sm:px-5 sm:text-[11.5px]">
                <span className="truncate">{fr ? '★ Black Friday · Club doublé au même prix' : '★ Black Friday · 2× Club at the same price'}</span>
                <span className="shrink-0 rounded-full bg-black/15 px-2 py-0.5 text-[10.5px] font-bold normal-case tracking-normal tabular-nums">
                  {bf.left !== null
                    ? (fr ? `Fin dans ${formatBlackFridayLeft(bf.left, true)}` : `Ends in ${formatBlackFridayLeft(bf.left, false)}`)
                    : (fr ? 'Jusqu’à lundi 23 h 59' : 'Until Monday 11:59pm')}
                </span>
              </div>
            )}

            {/* En-tête photo réel : Kevin en live du lundi */}
            <div className={`relative overflow-hidden bg-[#181a14] ${bfActive ? 'h-[96px] sm:h-[118px]' : 'h-[112px] sm:h-[132px]'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/community/kevin-live-v11.webp"
                alt={fr ? 'Kevin en coaching live du lundi' : 'Kevin hosting the Monday live coaching'}
                className="h-full w-full object-cover object-[center_24%] brightness-95 contrast-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(16,18,13,0.12) 0%, rgba(16,18,13,0.58) 62%, #10120d 100%)' }}
              />
              <div className="absolute left-4 right-4 top-3 flex items-center justify-between gap-2 sm:left-5 sm:right-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-3 py-0.5 text-[11px] font-semibold text-neutral-100 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-empire" />
                  {fr ? 'Live privé chaque lundi · 14 h' : 'Private live every Monday · 2pm'}
                </span>
                {!bfActive && (
                  <span className="rounded-full bg-empire px-2.5 py-0.5 text-[10.5px] font-extrabold text-[#070805]">
                    {fr ? 'Le plus choisi' : 'Most chosen'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-5 pt-1 sm:px-6 sm:pb-6">
              <div className="order-1 flex items-end justify-between gap-3 border-b border-empire/15 pb-3.5">
                <div className="min-w-0">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={clubSelected}
                    className="flex cursor-pointer items-center gap-2 text-left"
                  >
                    <span className="text-[22px] font-bold leading-tight tracking-tight text-white sm:text-[25px]">Empire Club</span>
                    <span
                      aria-hidden
                      className={`hidden h-5 w-5 items-center justify-center rounded-full border lg:inline-flex ${
                        clubSelected ? 'border-empire bg-empire text-black' : 'border-white/30'
                      }`}
                    >
                      {clubSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                  <p className="mt-0.5 max-w-[270px] text-[12.5px] leading-snug text-[#b5bba6] sm:text-[13.5px]">
                    {bfActive
                      ? fr
                        ? nbsp('Double puissance + Kevin & le Club chaque semaine.')
                        : 'Double power + Kevin & the Club every week.'
                      : fr
                        ? nbsp('Pleine puissance + Kevin & le Club chaque semaine.')
                        : 'Full power + Kevin & the Club every week.'}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  {clubLiveDeal ? (
                    <div>
                      {countdown && (
                        <span className="mb-1 inline-flex rounded-full bg-empire px-2 py-0.5 text-[10.5px] font-bold tabular-nums text-black">
                          {fr ? `Encore ${countdown}` : `${countdown} left`}
                        </span>
                      )}
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-sm font-semibold text-neutral-500 line-through">{euros(clubPlan.price)}</span>
                        <span className="text-[38px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-empire sm:text-[44px]">{euros(clubPrice)}</span>
                        <span className="text-xs text-neutral-300 sm:text-sm">{perMonth}</span>
                      </div>
                    </div>
                  ) : bfActive ? (
                    <div>
                      <div className="mb-0.5 flex items-center justify-end gap-1.5">
                        <span className="text-sm font-bold text-[#7c826e] line-through tabular-nums sm:text-base">{euros(clubCatalog)}</span>
                        <span className="rounded-full border border-empire/35 bg-empire/15 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-empire">
                          {bfMonths != null
                            ? fr ? `${bfMonths} mois` : `${bfMonths} mo`
                            : fr ? 'À vie' : 'For life'}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-[38px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-empire sm:text-[44px]">{euros(clubPrice)}</span>
                        <span className="text-xs font-medium text-neutral-300 sm:text-sm">{perMonth}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-end gap-1">
                        {discount > 0 && <span className="text-sm font-semibold text-neutral-500 line-through tabular-nums sm:text-base">{euros(clubPlan.price)}</span>}
                        <span className="text-[38px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-empire sm:text-[44px]">{euros(clubPrice)}</span>
                        <span className="text-xs font-medium text-neutral-300 sm:text-sm">{perMonth}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#909680]">
                        {discount > 0 ? (
                          fr
                            ? nbsp(`Facturé ${clubTotal} € ${billing.months === 12 ? 'par an' : `/ ${billing.months} mois`}`)
                            : `Billed €${clubTotal} ${billing.months === 12 ? 'yearly' : `/ ${billing.months} mo`}`
                        ) : (
                          <a href={detailHref} className="hover:text-neutral-200 underline decoration-white/20 decoration-dotted underline-offset-2">
                            {fr ? nbsp(`Valeur ~${euros(clubFreelance)}/mois`) : `Value ~${euros(clubFreelance)}/mo`}
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Encart Black Friday ×2 (disparaît seul dès BLACK_FRIDAY.endsAt) */}
              {bfActive && (
                <div className="order-2 mt-3 flex items-center justify-between gap-2.5 rounded-xl border border-empire/35 bg-empire/[0.08] px-3 py-2 sm:px-3.5 sm:py-2.5">
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold leading-snug text-empire sm:text-[13px]">
                      {fr ? 'Bonus Black Friday : 2× plus d’usage à vie' : 'Black Friday Bonus: 2× usage for life'}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[#dce2cf] sm:text-xs">
                      {fr ? (
                        <><b>2 contenus / jour</b> (100 / mois) au lieu de <s className="text-[#889079]">1 / jour</s></>
                      ) : (
                        <><b>2 posts / day</b> (100 / mo) instead of <s className="text-[#889079]">1 / day</s></>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-empire px-2 py-1 text-[10.5px] font-extrabold tabular-nums text-[#070805]">
                    {fr ? '×2 À VIE' : '×2 FOR LIFE'}
                  </span>
                </div>
              )}

              {/* Un seul noeud CTA : au-dessus de la grille 2×2 sur mobile, en pied sur desktop */}
              <div
                className="order-3 mt-3.5 lg:order-5 lg:mt-auto lg:pt-4"
                onClick={(e) => { if (clubSelected) e.stopPropagation() }}
              >
                {clubSelected ? (
                  cta
                ) : (
                  <button
                    type="button"
                    onClick={() => choose(clubPlanId)}
                    className={`!min-h-[52px] w-full ${ORDER_CTA_SECONDARY}`}
                  >
                    {fr ? 'Choisir Empire Club' : 'Choose Empire Club'}
                  </button>
                )}
              </div>

              {/* Grille architecturale 2×2 des 4 piliers du Club */}
              <div className="order-4 mt-3.5 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-2">
                <div className="border-b border-white/[0.08] p-3.5 sm:border-r">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/founders/kevin.jpg" alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-full border border-empire object-cover" />
                    <strong className="text-[12.5px] font-bold text-white sm:text-[13px]">
                      {fr ? 'Onboarding 1-to-1 (30 min)' : '1-to-1 Onboarding (30 min)'}
                    </strong>
                  </div>
                  <p className="mt-1 text-[11.5px] leading-snug text-[#9fa592]">
                    {fr ? 'En tête-à-tête avec Kevin pour caler ton positionnement et ton offre.' : 'One-on-one with Kevin to lock in your positioning and offer.'}
                  </p>
                </div>

                <div className="border-b border-white/[0.08] p-3.5">
                  <strong className="block text-[12.5px] font-bold text-white sm:text-[13px]">
                    {fr ? 'Coachings live du lundi' : 'Monday live coaching'}
                  </strong>
                  <p className="mt-1 text-[11.5px] leading-snug text-[#9fa592]">
                    {fr ? '4 h/mois en direct pour corriger tes hooks, tes posts et ton tunnel.' : '4h/mo live with Kevin to sharpen your hooks, posts and funnel.'}
                  </p>
                </div>

                <div className="border-b border-white/[0.08] p-3.5 sm:border-b-0 sm:border-r">
                  <strong className="block text-[12.5px] font-bold text-white sm:text-[13px]">
                    {fr ? 'Groupe WhatsApp privé' : 'Private WhatsApp Club'}
                  </strong>
                  <p className="mt-1 text-[11.5px] leading-snug text-[#9fa592]">
                    {fr ? 'Le cercle des entrepreneurs actifs sur Empire + Kevin au quotidien.' : 'Active Empire founders + daily direct access to Kevin.'}
                  </p>
                </div>

                <div className="p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong className="text-[12.5px] font-bold text-white sm:text-[13px]">Empire Academy</strong>
                    {bfActive && (
                      <span className="rounded bg-empire/15 px-1.5 py-0.5 text-[10px] font-extrabold text-empire">
                        {fr ? 'OFFERTE · 497 €' : 'INCLUDED · €497'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11.5px] leading-snug text-[#9fa592]">
                    {fr ? 'Accès intégral au bootcamp 21 jours, formations & playbooks.' : 'Full access to the 21-day bootcamp, trainings & playbooks.'}
                  </p>
                </div>
              </div>

              {!bfActive && (
                <div className="order-4 mt-3 flex flex-wrap items-center justify-between gap-2 px-0.5 text-[11.5px] text-[#d6dcc9]">
                  <strong className="font-semibold">{fr ? 'Capacité doublée : vidéos + écrits tous les jours' : 'Doubled capacity: daily video + written posts'}</strong>
                  <span className="text-[#9fa592]">{fr ? 'Jusqu’à 60 contenus / mois · Support 4 h' : 'Up to 60 posts / mo · 4h support'}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
