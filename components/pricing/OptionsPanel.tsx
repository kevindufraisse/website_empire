'use client'

import { Check, GraduationCap, UserRound, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PLAN_LABELS } from '@/lib/plans'
import { TRIAL_CREDITS, type TrialOption } from '@/lib/startTrial'
import { LIVE_OFFER } from '@/lib/liveOffer'
import glass from '@/components/pricing/pricing.module.css'
import { ORDER_LABEL, ORDER_TAG } from '@/lib/orderStyles'
import TrialCta from './TrialCta'
import { nbsp, rich } from './typo'
import { EXPERT_MONTHLY_EUROS, type TrialCart } from './useTrialCart'

/**
 * Le récapitulatif de /tarifs : les deux options à cocher, puis ce qui est
 * prélevé aujourd'hui et ensuite, et le bouton d'essai. L'état (formule,
 * période, options, `checkout`) vient de `useTrialCart`, partagé avec les
 * autres boutons de la page.
 *  - Bootcamp Academy : payé aujourd'hui avec le premier paiement Stripe, au
 *    prix de la grille de la semaine.
 *  - Expert Empire Partners : 0 € aujourd'hui, 500 €/mois réglés avec
 *    l'expert ; Marc est prévenu au retour du paiement. Selon les places du
 *    mois (liste d'attente à 0).
 */
export default function OptionsPanel({ cart }: { cart: TrialCart }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const { plan, billing, liveDeal, bootcamp, expert, full, spotsLine, bootcampEuros, perMonth, cycleTotal, today, toggle } = cart
  const label = PLAN_LABELS[plan][fr ? 'fr' : 'en']
  const tr = (f: string, e: string) => (fr ? rich(nbsp(f)) : e)
  const euros = (n: number) => (fr ? `${n.toLocaleString(locale)} €` : `€${n.toLocaleString(locale)}`)

  const optionRow = (which: TrialOption, on: boolean, icon: React.ReactNode, title: string, price: string, body: string, extra?: string) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={() => toggle(which)}
      className={`flex w-full cursor-pointer items-start gap-3.5 p-4 text-left sm:p-5 ${glass.planOption}`}
    >
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-empire bg-empire text-black' : 'border-white/35'}`}>
        {on && <Check className="h-4 w-4" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-white">{icon}{title}</span>
          <span className={`whitespace-nowrap !text-xs ${ORDER_TAG}`}>{price}</span>
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-neutral-300">{body}</span>
        {extra && <span className="mt-1.5 block text-xs font-medium text-neutral-200">{extra}</span>}
      </span>
    </button>
  )

  const line = (text: string, amount: string, onRemove?: () => void) => (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 text-neutral-200">
        {text}
        {onRemove && (
          <button type="button" onClick={onRemove} className="-my-2 inline-flex min-h-11 cursor-pointer items-center gap-1 px-1 text-[13px] text-neutral-400 underline decoration-white/20 underline-offset-2 hover:text-white">
            <X className="h-3.5 w-3.5" />{fr ? 'retirer' : 'remove'}
          </button>
        )}
      </span>
      <span className="shrink-0 text-right tabular-nums text-white">{amount}</span>
    </div>
  )

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      {liveDeal ? (
        <div className="space-y-2 p-1 text-sm leading-relaxed text-neutral-300">
          <p className={ORDER_LABEL}>{fr ? 'Ton offre du live' : 'Your live offer'}</p>
          <p className="text-white">
            {fr
              ? `${PLAN_LABELS[plan].fr} à ${liveDeal.monthly} €/mois au lieu de ${liveDeal.listMonthly} €, les ${LIVE_OFFER.discountMonths} premiers mois.`
              : `${PLAN_LABELS[plan].en} at €${liveDeal.monthly}/mo instead of €${liveDeal.listMonthly}, for the first ${LIVE_OFFER.discountMonths} months.`}
          </p>
          <p>
            {fr
              ? `Ensuite ${liveDeal.listMonthly} €/mois, sans engagement : tu arrêtes quand tu veux depuis l’app.`
              : `Then €${liveDeal.listMonthly}/mo, no commitment: stop anytime from the app.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{fr ? 'Options' : 'Add-ons'}</p>
          {optionRow(
            'bootcamp', bootcamp, <GraduationCap className="h-4 w-4 text-empire" />,
            fr ? 'Bootcamp Academy' : 'Academy bootcamp',
            fr ? `+${bootcampEuros} €` : `+€${bootcampEuros}`,
            fr
              ? nbsp('En une fois, prélevés aujourd’hui. 21 vidéos pour apprendre la méthode Empire.')
              : 'One-time payment, charged today. 21 videos to learn the Empire method.',
          )}
          {optionRow(
            'expert', expert, <UserRound className="h-4 w-4 text-empire" />,
            fr ? 'Expert Empire' : 'Empire expert',
            fr ? `${EXPERT_MONTHLY_EUROS} €/mois` : `€${EXPERT_MONTHLY_EUROS}/mo`,
            fr
              ? nbsp('Tu règles directement l’expert. Il te contacte sous 48 h. Places limitées chaque mois : si c’est complet, tu passes en liste d’attente.')
              : 'You pay the expert directly. They contact you within 48h. Limited spots each month: if it’s full, you join the waiting list.',
            spotsLine ? (fr ? nbsp(spotsLine) : spotsLine) : undefined,
          )}
        </div>
      )}

      <div className={`p-5 sm:p-6 ${glass.panel} ${glass.featured} ${glass.plan}`}>
        <div className="space-y-2.5">
          {line(
            liveDeal
              ? `${label} · ${fr ? 'offre du live' : 'live offer'}`
              : `${label} · ${fr ? billing.labelFr.toLowerCase() : billing.labelEn.toLowerCase()}`,
            fr ? `${perMonth} €/mois` : `€${perMonth}/mo`,
          )}
          {!liveDeal && bootcamp && line(fr ? 'Bootcamp Academy' : 'Academy bootcamp', euros(bootcampEuros), () => toggle('bootcamp'))}
          {!liveDeal && expert && line(
            full ? (fr ? 'Expert Empire (liste d’attente)' : 'Empire expert (waiting list)') : (fr ? 'Expert Empire' : 'Empire expert'),
            fr ? 'réglé avec l’expert' : 'paid to the expert',
            () => toggle('expert'),
          )}
        </div>
        <div className="my-5 h-px bg-white/15" />

        {liveDeal ? (
          <>
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold text-white">{fr ? 'À payer aujourd’hui' : 'Due today'}</span>
              <span className="text-2xl font-bold tabular-nums text-white">{today.toLocaleString(locale)} €</span>
            </p>
            <p className="mt-1 text-[13px] text-neutral-300">{fr ? 'Ton premier mois, prélevé aujourd’hui.' : 'Your first month, charged today.'}</p>
            <p className="mt-4 flex items-baseline justify-between gap-3 text-sm">
              <span className="text-neutral-300">{fr ? 'Ensuite' : 'Then'}</span>
              <span className="text-right tabular-nums text-white">
                {fr ? rich(nbsp(`${liveDeal.monthly} €/mois jusqu’au 3ᵉ mois, puis ${liveDeal.listMonthly} €`)) : `€${liveDeal.monthly}/mo through month 3, then €${liveDeal.listMonthly}`}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold text-white">{fr ? 'Aujourd’hui' : 'Today'}</span>
              <span className="text-2xl font-bold tabular-nums text-white">{euros(today)}</span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-neutral-300">
              {bootcamp
                ? tr(`${bootcampEuros} € pour le Bootcamp Academy, 0 € pour ta formule.`, `€${bootcampEuros} for the Academy bootcamp, €0 for your plan.`)
                : tr('0 € pour ta formule.', '€0 for your plan.')}
            </p>
            <p className="mt-4 flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold text-white">{fr ? 'Ensuite' : 'Then'}</span>
              <span className="text-base font-semibold tabular-nums text-white">
                {billing.months > 1 ? euros(cycleTotal) : (fr ? `${perMonth} €/mois` : `€${perMonth}/mo`)}
              </span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-neutral-300">
              {billing.months > 1
                ? tr(
                  `Prélevés en une fois le 8ᵉ jour, ou avant si tu dépasses les ${TRIAL_CREDITS} crédits, puis tous les ${billing.months} mois.`,
                  `Charged in one go on day 8, or earlier if you go past ${TRIAL_CREDITS} credits, then every ${billing.months} months.`,
                )
                : tr(
                  `À partir du 8ᵉ jour, ou avant si tu dépasses les ${TRIAL_CREDITS} crédits de l’essai.`,
                  `From day 8, or earlier if you go past the ${TRIAL_CREDITS} trial credits.`,
                )}
            </p>
          </>
        )}

        <TrialCta cart={cart} note="cancel" className="mt-6" />
      </div>
    </div>
  )
}
