'use client'

import { ArrowUpRight, Check, ChevronDown, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  FREELANCE_MODE,
  FREELANCE_PRICES,
  FREELANCE_SOURCES,
  PLANS,
  PLAN_LABELS,
  USD_PER_EUR,
  freelanceValue,
  toolEuros,
  type PlanId,
} from '@/lib/plans'
import { LIVE_OFFER, isLivePlan, type LiveWindow } from '@/lib/liveOffer'
import { ORDER_SEGMENT, ORDER_SEGMENTS } from '@/lib/orderStyles'
import glass from './pricing.module.css'
import { CardTrialButton } from './TrialCta'
import { RHYTHM_SHORT } from './PlanCards'
import { freelanceAmount, freelanceTotalLabel } from './freelanceCopy'
import { nbsp } from './typo'
import type { TrialCart } from './useTrialCart'

/**
 * « Ce que tu reçois chaque mois » : le reçu de la formule choisie (le même
 * état que le choix du haut de page). Les lignes chiffrées au prix freelance
 * de `lib/plans.ts` (mode « moyen » par défaut) : reels, posts, miniatures
 * (une par reel), le community manager sans la vidéo, les outils remplacés
 * (avec leurs noms) ; puis ce qui est inclus et non compté ; les newsletters
 * en échange possible, jamais ajoutées au total ; enfin le total, le prix
 * Empire, le bouton et les sources.
 */

// Inclus et non compté dans le total (les miniatures, la publication, les
// commentaires, les DM et les liens trackés sont déjà chiffrés plus haut).
const NOT_COUNTED: { fr: string; en: string }[] = [
  { fr: 'Chaque matin, les sujets qui montent dans ta niche', en: 'Every morning, the topics rising in your niche' },
  { fr: 'Des idées prêtes à filmer chaque semaine', en: 'Ready-to-film ideas every week' },
  { fr: 'Rapport chaque semaine', en: 'A report every week' },
]

// Même matrice que l'ancien tableau des formules.
const PLAN_ONLY: { fr: string; en: string; plans: PlanId[] }[] = [
  { fr: 'Réponse prioritaire sous 4 h', en: 'Priority reply within 4h', plans: ['growth', 'scale'] },
  { fr: 'Un point stratégie chaque mois (retours par Loom)', en: 'A strategy review every month (Loom feedback)', plans: ['scale'] },
]

type Props = {
  cart: TrialCart
  onChoose: (plan: PlanId) => void
  live?: LiveWindow | null
}

export default function OfferReceipt({ cart, onChoose, live = null }: Props) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const { plan, billing, liveDeal, perMonth, cycleTotal } = cart
  const mode = FREELANCE_MODE
  const euros = (n: number) => (fr ? `${n.toLocaleString(locale)} €` : `€${n.toLocaleString(locale)}`)
  const t = (f: string, e: string) => (fr ? nbsp(f) : e)
  const v = freelanceValue(plan, mode)
  const { mix } = v
  const p = FREELANCE_PRICES
  const label = PLAN_LABELS[plan][fr ? 'fr' : 'en']
  const plans = live ? PLANS.filter((x) => isLivePlan(x.id)) : PLANS
  const times = (n: number, unit: number) => (fr ? `${n} × ${unit} €` : `${n} × €${unit}`)
  const perMonthWord = fr ? 'par mois' : 'per month'

  const priced = [
    { key: 'reels', text: t(`${mix.reels} reels montés, sous-titres inclus`, `${mix.reels} edited reels, captions included`), unit: times(mix.reels, p.reel[mode]), amount: euros(v.reels) },
    { key: 'posts', text: t(`${mix.posts} posts écrits dans ta voix (LinkedIn, X, Threads…)`, `${mix.posts} posts written in your voice (LinkedIn, X, Threads…)`), unit: times(mix.posts, p.post[mode]), amount: euros(v.posts) },
    { key: 'thumbs', text: t(`${mix.reels} miniatures YouTube et Instagram`, `${mix.reels} YouTube and Instagram thumbnails`), unit: times(mix.reels, p.thumbnail[mode]), amount: euros(v.thumbnails) },
    { key: 'cm', text: t('Publication, commentaires et DM (community manager, sans la vidéo)', 'Publishing, comments and DMs (community manager, without video)'), unit: perMonthWord, amount: euros(v.communityManager) },
  ]
  const extras = PLAN_ONLY.filter((l) => l.plans.includes(plan))
  const hasUsd = p.tools.some((tool) => tool.eur === undefined)

  const priceNote = liveDeal
    ? t(`Les ${LIVE_OFFER.discountMonths} premiers mois, puis ${liveDeal.listMonthly} €/mois.`, `For the first ${LIVE_OFFER.discountMonths} months, then €${liveDeal.listMonthly}/mo.`)
    : billing.months > 1
      ? t(
        `Facturé ${cycleTotal.toLocaleString(locale)} € ${billing.months === 12 ? 'une fois par an' : `tous les ${billing.months} mois`}.`,
        `Billed €${cycleTotal.toLocaleString(locale)} ${billing.months === 12 ? 'once a year' : `every ${billing.months} months`}.`,
      )
      : t('Sans engagement.', 'No commitment.')

  const row = (key: string, text: string, unit: string, amount: string) => (
    <li key={key} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-snug text-white">{text}</span>
        <span className="mt-0.5 block text-[13px] tabular-nums text-neutral-400">{unit}</span>
      </span>
      <span className="whitespace-nowrap pt-px text-right text-[15px] font-semibold tabular-nums text-white">{amount}</span>
    </li>
  )

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-12">
      <div className="text-center lg:sticky lg:top-8 lg:pt-6 lg:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-empire">{fr ? 'Le reçu' : 'The receipt'}</p>
        <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-white [text-wrap:balance] md:text-4xl">
          {fr ? 'Ce que tu reçois chaque mois' : 'What you get every month'}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-neutral-300 [text-wrap:pretty] lg:mx-0">
          {mode === 'moyen'
            ? t(
              'Chaque ligne au prix moyen d’un freelance en 2026 : le milieu des fourchettes publiées. Les outils, au prix des éditeurs.',
              'Each line at an average freelancer’s 2026 price: the middle of published ranges. Tools at their vendors’ prices.',
            )
            : t(
              'Chaque ligne au bas des tarifs freelance publiés en 2026. Les outils, au prix des éditeurs.',
              'Each line at the low end of freelance rates published in 2026. Tools at their vendors’ prices.',
            )}
        </p>
        <div className={`mx-auto mt-6 grid max-w-sm grid-flow-col auto-cols-fr lg:mx-0 ${ORDER_SEGMENTS}`} role="tablist" aria-label={fr ? 'Formule du reçu' : 'Receipt plan'}>
          {plans.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={x.id === plan}
              onClick={() => onChoose(x.id)}
              className={`text-[13px] font-semibold ${ORDER_SEGMENT}`}
            >
              {PLAN_LABELS[x.id][fr ? 'fr' : 'en']}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-5 sm:p-7 ${glass.panel} ${glass.plan}`}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-bold text-white">{label}</p>
          <p className="text-[13px] text-neutral-400">{fr ? nbsp(`Tu publies ${RHYTHM_SHORT[plan].fr}`) : `You publish ${RHYTHM_SHORT[plan].en}`}</p>
        </div>

        <ul className="mt-5 space-y-3.5">
          {priced.map((l) => row(l.key, l.text, l.unit, l.amount))}
          <li className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
            <span className="min-w-0">
              <span className="block text-[15px] font-medium leading-snug text-white">{fr ? 'Outils que tu ne paies plus' : 'Tools you no longer pay for'}</span>
              <span className="mt-0.5 block text-[13px] text-neutral-400">{perMonthWord}{fr ? nbsp(' · prix des éditeurs') : ' · vendor prices'}</span>
            </span>
            <span className="whitespace-nowrap pt-px text-right text-[15px] font-semibold tabular-nums text-white">{hasUsd ? '≈ ' : ''}{euros(v.tools)}</span>
            <ul className="col-span-2 mt-2.5 space-y-1.5 border-l border-white/10 pl-3">
              {p.tools.map((tool) => (
                <li key={tool.name} className="flex items-baseline justify-between gap-3 text-[13px] leading-snug text-neutral-300">
                  <span className="min-w-0">
                    <span className="text-neutral-100">{tool.name}</span>
                    <span className="text-neutral-400">{fr ? nbsp(` · ${tool.fr}`) : ` · ${tool.en}`}</span>
                  </span>
                  <span className="whitespace-nowrap tabular-nums text-neutral-300">
                    {tool.eur !== undefined ? euros(tool.eur) : `≈ ${euros(toolEuros(tool))}`}
                    {tool.usd !== undefined && <span className="text-neutral-500">{fr ? ` (${tool.usd} $)` : ` ($${tool.usd})`}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-neutral-400">
          {t(
            'Ici, la moitié de tes crédits en reels et l’autre en posts. Tu changes la répartition quand tu veux.',
            'Here, half your credits go to reels and half to posts. Change the split whenever you want.',
          )}
        </p>

        <div className={`mt-5 pt-5 ${glass.receiptRule}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{fr ? 'Inclus, non compté' : 'Included, not counted'}</p>
          <ul className="mt-3 space-y-2.5">
            {[...NOT_COUNTED, ...extras].map((l) => (
              <li key={l.fr} className="flex items-start gap-3 text-[14.5px] leading-snug text-neutral-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-empire" strokeWidth={2.5} />
                <span className="min-w-0">{t(l.fr, l.en)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-[13.5px] leading-relaxed text-neutral-300">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
          <span>
            {t(
              `Ou, avec les mêmes crédits : jusqu’à ${mix.newsletters} newsletters (${p.newsletter.low} à ${p.newsletter.high} € pièce chez un rédacteur). Non ajouté au total.`,
              `Or, with the same credits: up to ${mix.newsletters} newsletters (€${p.newsletter.low} to €${p.newsletter.high} each from a copywriter). Not added to the total.`,
            )}
          </span>
        </p>

        <div className={`mt-6 pt-5 ${glass.receiptRule}`}>
          {/* « Au prix moyen d'un freelance : ≈ 8 300 €/mois », en une phrase. */}
          <p className="text-[15px] leading-snug text-neutral-300">
            {freelanceTotalLabel(fr, mode)}{fr ? '\u00a0: ' : ': '}
            <span className="whitespace-nowrap font-semibold tabular-nums text-neutral-100">{freelanceAmount(v.shown, fr, mode)}</span>
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <span className="pb-1 text-[17px] font-bold text-white">{fr ? 'Avec Empire' : 'With Empire'}</span>
            <span className="whitespace-nowrap text-right tabular-nums text-white">
              <span className="text-[2.5rem] font-bold leading-none tracking-tight">{euros(perMonth)}</span>
              <span className="text-sm text-neutral-300">{fr ? '/mois' : '/mo'}</span>
            </span>
          </div>
          <p className="mt-1.5 text-right text-[13px] text-neutral-400">{priceNote}</p>
        </div>

        <div className="mt-6">
          <CardTrialButton cart={cart} />
        </div>

        <details className="group mt-6 border-t border-white/10 pt-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-[13px] font-semibold text-neutral-300 hover:text-white [&::-webkit-details-marker]:hidden">
            Sources
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-2.5 text-[13px] leading-relaxed text-neutral-300">
            {mode === 'moyen'
              ? t(
                `On retient le milieu des fourchettes publiées : ${p.reel.moyen} € le reel, ${p.post.moyen} € le post, ${p.communityManager.moyen} € le community manager ; ${p.thumbnail.moyen} € la miniature (prix d’entrée).`,
                `We use the middle of published ranges: €${p.reel.moyen} a reel, €${p.post.moyen} a post, €${p.communityManager.moyen} for the community manager; €${p.thumbnail.moyen} a thumbnail (entry price).`,
              )
              : t(
                `On retient le bas des fourchettes publiées : ${p.reel.bas} € le reel, ${p.post.bas} € le post, ${p.communityManager.bas} € le community manager, ${p.thumbnail.bas} € la miniature.`,
                `We use the low end of published ranges: €${p.reel.bas} a reel, €${p.post.bas} a post, €${p.communityManager.bas} for the community manager, €${p.thumbnail.bas} a thumbnail.`,
              )}
          </p>
          <ul className="space-y-2 pb-1 text-[13px] leading-relaxed text-neutral-400">
            {FREELANCE_SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-200 underline decoration-white/25 underline-offset-2 hover:text-white">
                  {s.name}
                  <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
                </a>
                {fr ? nbsp(`, ${s.fr}.`) : `, ${s.en}.`}
              </li>
            ))}
            <li className="text-neutral-500">
              {t(
                `Dollars convertis au cours BCE du 9 novembre 2026 (1 € = ${USD_PER_EUR.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} $). Le community manager est compté sans la vidéo, pour ne pas compter les reels deux fois. Total ${mode === 'moyen' ? 'arrondi à la centaine' : 'arrondi à la centaine inférieure'}.`,
                `Dollars converted at the ECB rate of November 9, 2026 (€1 = $${USD_PER_EUR}). The community manager is counted without video, so reels are not counted twice. Total ${mode === 'moyen' ? 'rounded to the nearest hundred' : 'rounded down to the hundred'}.`,
              )}
            </li>
          </ul>
        </details>
      </div>
    </div>
  )
}
