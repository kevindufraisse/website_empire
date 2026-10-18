'use client'

import { Fragment, useState } from 'react'
import { ArrowRight, Check, Minus } from 'lucide-react'
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
import { startFreeTrial, TRIAL_CREDITS, TRIAL_TERMS_EN, TRIAL_TERMS_FR } from '@/lib/startTrial'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'

/**
 * Page tarifs du site. Même grille que `/join/empire` côté app (prix, remises
 * -12 % / -18 %, contenus du mois, lignes incluses). Au mois, chaque formule
 * ouvre l'essai 7 jours ; en trimestriel / annuel l'essai n'existe pas, le
 * bouton envoie au paiement de l'app. Le programme partenaire n'a qu'une ligne
 * en bas : c'est une autre offre, pas une formule de plus.
 */

type Col = PlanId | 'payg'

type Row = { fr: string; en: string; cells: Record<Col, boolean | string>; bonus?: boolean }

// Bas des fourchettes publiées en 2026 : un post LinkedIn chez un ghostwriter
// 50-250 € (Copylinker), un reel simple chez un monteur 50-120 € (Le Cut).
// L'ancrage prend les posts de la formule au bas de la fourchette.
const FREELANCE_FLOOR = { reel: 50, post: 50 }
const FREELANCE_SOURCES = [
  { label: 'Le Cut', href: 'https://www.lecut.fr/blog/tarifs-monteur-video-freelance' },
  { label: 'Copylinker', href: 'https://copylinker.fr/tarif-ghostwriter-linkedin/' },
]
const POST_CREDITS = CONTENT_CREDITS.post

function freelanceFloor(plan: PlanId) {
  const d = PLAN_DELIVERABLES[plan]
  return d.posts * FREELANCE_FLOOR.post
}

const ROWS: Row[] = [
  {
    fr: 'Reels montés par l’équipe, jusqu’à', en: 'Reels edited by the team, up to',
    cells: { starter: String(PLAN_DELIVERABLES.starter.reels), growth: String(PLAN_DELIVERABLES.growth.reels), scale: String(PLAN_DELIVERABLES.scale.reels), payg: 'à l’usage' },
  },
  {
    fr: 'ou posts LinkedIn, jusqu’à', en: 'or LinkedIn posts, up to',
    cells: { starter: String(PLAN_DELIVERABLES.starter.posts), growth: String(PLAN_DELIVERABLES.growth.posts), scale: String(PLAN_DELIVERABLES.scale.posts), payg: 'à l’usage' },
  },
  {
    fr: 'ou newsletters, jusqu’à', en: 'or newsletters, up to',
    cells: { starter: String(PLAN_DELIVERABLES.starter.newsletters), growth: String(PLAN_DELIVERABLES.growth.newsletters), scale: String(PLAN_DELIVERABLES.scale.newsletters), payg: 'à l’usage' },
  },
  {
    fr: 'Publication sur 7 réseaux, sans supplément', en: 'Publishing to 7 networks, no extra cost',
    cells: { starter: true, growth: true, scale: true, payg: true },
  },
  {
    fr: 'Des idées prêtes à filmer chaque semaine', en: 'Ready-to-film ideas every week',
    cells: { starter: true, growth: true, scale: true, payg: true },
  },
  {
    fr: 'Support prioritaire sous 4 h', en: 'Priority support within 4h',
    cells: { starter: false, growth: true, scale: true, payg: false },
  },
  {
    fr: 'Revue stratégique mensuelle (retours Loom)', en: 'Monthly strategy review (Loom feedback)',
    cells: { starter: false, growth: false, scale: true, payg: false },
  },
  {
    fr: 'Essai 7 jours gratuit', en: '7-day free trial',
    cells: { starter: 'au mois', growth: 'au mois', scale: 'au mois', payg: false },
  },
  {
    fr: 'Communauté Slack', en: 'Slack community',
    cells: { starter: true, growth: true, scale: true, payg: true },
    bonus: true,
  },
  {
    fr: 'Live client chaque semaine', en: 'Weekly client live',
    cells: { starter: true, growth: true, scale: true, payg: false },
    bonus: true,
  },
  {
    fr: 'Replays masterclass', en: 'Masterclass replays',
    cells: { starter: false, growth: true, scale: true, payg: false },
    bonus: true,
  },
]

const HIGHLIGHTS: Record<PlanId, { fr: string[]; en: string[]; bonusFr: string; bonusEn: string }> = {
  starter: {
    fr: ['Idées prêtes à filmer chaque semaine', 'Publication sur 7 réseaux'],
    en: ['Ready-to-film ideas every week', 'Publishing to 7 networks'],
    bonusFr: 'Live client chaque semaine, communauté Slack',
    bonusEn: 'Weekly client live, Slack community',
  },
  growth: {
    fr: ['Tout Débutant', 'Support prioritaire sous 4 h'],
    en: ['Everything in Starter', 'Priority support within 4h'],
    bonusFr: 'Live, Slack et replays masterclass',
    bonusEn: 'Live, Slack and masterclass replays',
  },
  scale: {
    fr: ['Tout Intermédiaire', 'Revue stratégique mensuelle (retours Loom)'],
    en: ['Everything in Intermediate', 'Monthly strategy review (Loom feedback)'],
    bonusFr: 'Live, Slack et replays masterclass',
    bonusEn: 'Live, Slack and masterclass replays',
  },
}

const STEPS = [
  { fr: 'Tu parles : une prise face caméra, ou un vocal.', en: 'You talk: one take on camera, or a voice note.' },
  { fr: 'Empire écrit et monte tes reels, posts et newsletters.', en: 'Empire writes and edits your reels, posts and newsletters.' },
  { fr: 'Tout part sur 7 réseaux, programmé.', en: 'Everything goes out to 7 networks, scheduled.' },
]

const FAQ = [
  {
    q: { fr: 'Comment marche l’essai gratuit ?', en: 'How does the free trial work?' },
    a: { fr: TRIAL_TERMS_FR, en: TRIAL_TERMS_EN },
  },
  {
    q: { fr: 'Trimestriel ou annuel, c’est prélevé comment ?', en: 'How are quarterly and yearly billed?' },
    a: {
      fr: 'En une fois pour la période : tous les 3 mois en trimestriel (-12 %), une fois par an en annuel (-18 %). Pas d’essai sur ces formules, le paiement part le jour même.',
      en: 'Once per period: every 3 months on quarterly (-12%), once a year on yearly (-18%). No trial on these, payment is taken the same day.',
    },
  },
  {
    q: { fr: 'Et la formule à la consommation ?', en: 'And pay as you go?' },
    a: {
      fr: `Tu enregistres ta carte, 0 € aujourd’hui. À ta première action payante, une recharge de ${PAYG_RECHARGE.euros} € (${PAYG_RECHARGE.credits} crédits), puis une nouvelle dès que ton solde ne suffit plus. Tu fixes un plafond par mois. Pas d’abonnement, pas de live client.`,
      en: `Save your card, €0 today. On your first paid action, a €${PAYG_RECHARGE.euros} top-up (${PAYG_RECHARGE.credits} credits), then another when your balance runs low. You set a monthly cap. No subscription, no client live.`,
    },
  },
  {
    q: { fr: 'C’est quoi, les crédits ?', en: 'What are credits?' },
    a: {
      fr: `La monnaie unique de l’app : chaque contenu en utilise un nombre fixe (un post LinkedIn, ${POST_CREDITS} crédits). Ta formule en verse chaque mois, tu choisis le mix entre reels, posts et newsletters. L’essai en contient ${TRIAL_CREDITS}.`,
      en: `The app's single currency: each piece of content uses a fixed amount (a LinkedIn post, ${POST_CREDITS} credits). Your plan adds them every month and you choose the mix of reels, posts and newsletters. The trial includes ${TRIAL_CREDITS}.`,
    },
  },
  {
    q: { fr: 'Je peux changer de formule ?', en: 'Can I change plan?' },
    a: {
      fr: 'Oui, depuis la page Abonnement de l’app, à la hausse comme à la baisse.',
      en: 'Yes, from the Subscription page in the app, up or down.',
    },
  },
]

function joinUrl(params: Record<string, string>) {
  const url = new URL(APP_JOIN_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return withAmplitudeDeviceId(url.toString())
}

function Cell({ value, fr }: { value: boolean | string; fr: boolean }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-white" aria-label={fr ? 'inclus' : 'included'} />
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-neutral-700" aria-label={fr ? 'non inclus' : 'not included'} />
  const text = fr ? value : value === 'à l’usage' ? 'as you go' : value === 'au mois' ? 'monthly' : value
  return <span className="text-sm tabular-nums text-neutral-200">{text}</span>
}

export default function TarifsClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [period, setPeriod] = useState<BillingId>('monthly')
  const [opening, setOpening] = useState<Col | null>(null)
  const months = BILLING_PERIODS.find((p) => p.id === period)?.months ?? 1

  const choose = async (col: Col) => {
    if (opening) return
    setOpening(col)
    trackAmplitude('pricing_page_plan_clicked', { plan: col, billing_period: col === 'payg' ? 'payg' : period })
    if (col === 'payg') {
      window.location.href = joinUrl({ plan: 'payg', pack: 'payg_start' })
      return
    }
    if (period === 'monthly') {
      await startFreeTrial(col)
      return
    }
    window.location.href = joinUrl({ plan: col, period })
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-24 pt-28 text-white md:pt-36">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{fr ? 'Tarifs' : 'Pricing'}</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            {fr ? 'Choisis ton rythme de publication.' : 'Pick your publishing pace.'}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'Tu parles ou tu filmes une prise. Empire écrit, monte et publie tes reels, posts et newsletters sur 7 réseaux.'
              : 'You talk or film one take. Empire writes, edits and publishes your reels, posts and newsletters to 7 networks.'}
          </p>
        </header>

        <ol className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.fr} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-left text-sm text-neutral-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">{i + 1}</span>
              {fr ? step.fr : step.en}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <div role="tablist" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {BILLING_PERIODS.map((p) => {
              const active = p.id === period
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPeriod(p.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    active ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {fr ? p.labelFr : p.labelEn}
                  {p.discount > 0 && (
                    <span className="text-[11px] font-semibold text-neutral-500">
                      -{Math.round(p.discount * 100)}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const monthly = finalPrice(plan.price, period, 1)
            const d = PLAN_DELIVERABLES[plan.id]
            const hl = plan.highlighted
            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  hl
                    ? 'lg:-my-3 lg:py-9 border-white/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_30px_60px_-20px_rgba(0,0,0,0.9)]'
                    : 'border-white/10 bg-white/[0.02] shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">{PLAN_LABELS[plan.id][fr ? 'fr' : 'en']}</h2>
                  {hl && (
                    <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-neutral-300">
                      {fr ? 'Recommandé' : 'Recommended'}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-500">{fr ? plan.rhythmFr : plan.rhythmEn}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  {period !== 'monthly' && (
                    <span className="text-lg tabular-nums text-neutral-600 line-through">{plan.price} €</span>
                  )}
                  <span className="text-4xl font-bold tabular-nums tracking-tight">{monthly} €</span>
                  <span className="text-sm text-neutral-500">{fr ? '/mois' : '/mo'}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {fr ? `soit ${Math.round(monthly / 30)} € par jour` : `that's €${Math.round(monthly / 30)} a day`}
                </p>
                <p className="mt-1 h-5 text-xs text-neutral-500">
                  {period === 'monthly'
                    ? (fr ? 'Sans engagement' : 'No commitment')
                    : fr
                      ? `${(monthly * months).toLocaleString('fr-FR')} € ${months === 3 ? 'tous les 3 mois' : 'par an'}`
                      : `€${(monthly * months).toLocaleString('en-US')} ${months === 3 ? 'every 3 months' : 'per year'}`}
                </p>

                <button
                  type="button"
                  onClick={() => choose(plan.id)}
                  disabled={opening !== null}
                  className={`mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
                    hl ? 'bg-white text-black hover:bg-neutral-200' : 'border border-white/15 text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {opening === plan.id
                    ? (fr ? 'Ouverture…' : 'Opening…')
                    : period === 'monthly'
                      ? (fr ? 'Essayer 7 jours gratuits' : 'Try free for 7 days')
                      : (fr ? 'Choisir cette formule' : 'Choose this plan')}
                </button>

                <p className="mt-6 text-center text-[11px] text-neutral-500">{fr ? 'Chaque mois, au choix, jusqu’à' : 'Every month, your pick, up to'}</p>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.07] bg-black/40 p-3 text-center">
                  {[
                    { n: d.reels, l: 'reels' },
                    { n: d.posts, l: fr ? 'ou posts' : 'or posts' },
                    { n: d.newsletters, l: fr ? 'ou newsletters' : 'or newsletters' },
                  ].map((x) => (
                    <div key={x.l}>
                      <p className="text-lg font-semibold tabular-nums">{x.n}</p>
                      <p className="text-[11px] text-neutral-500">{x.l}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-center text-[11px] text-neutral-600">{fr ? 'Tu mélanges comme tu veux.' : 'Mix them as you like.'}</p>
                <p className="mt-3 text-center text-xs text-neutral-500">
                  {fr ? 'En freelance : dès ' : 'With freelancers: from '}
                  <span className="text-neutral-300 line-through decoration-neutral-600">
                    {freelanceFloor(plan.id).toLocaleString(fr ? 'fr-FR' : 'en-US')} €
                  </span>
                  {fr ? ' /mois*' : ' /mo*'}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {HIGHLIGHTS[plan.id][fr ? 'fr' : 'en'].map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-neutral-500">
                  <span className="font-semibold text-neutral-300">Bonus</span> · {fr ? HIGHLIGHTS[plan.id].bonusFr : HIGHLIGHTS[plan.id].bonusEn}
                </p>
              </article>
            )
          })}

          <article className="flex flex-col rounded-2xl border border-dashed border-white/10 p-6">
            <h2 className="text-base font-semibold">{fr ? 'À la consommation' : 'Pay as you go'}</h2>
            <p className="mt-1 text-sm text-neutral-500">{fr ? 'Tu publies quand tu veux' : 'Publish when you want'}</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums tracking-tight">0 €</span>
              <span className="text-sm text-neutral-500">{fr ? 'pour démarrer' : 'to start'}</span>
            </div>
            <p className="mt-1 h-5 text-xs text-neutral-500">
              {fr
                ? `Puis ${PAYG_RECHARGE.euros} € ≈ ${Math.floor(PAYG_RECHARGE.credits / POST_CREDITS)} posts LinkedIn`
                : `Then €${PAYG_RECHARGE.euros} ≈ ${Math.floor(PAYG_RECHARGE.credits / POST_CREDITS)} LinkedIn posts`}
            </p>
            <button
              type="button"
              onClick={() => choose('payg')}
              disabled={opening !== null}
              className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06] disabled:opacity-60"
            >
              {opening === 'payg' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Démarrer à 0 €' : 'Start at €0')}
            </button>
            <ul className="mt-6 space-y-2.5">
              {(fr
                ? ['Pas d’abonnement', 'Un plafond par mois que tu fixes', 'Publication sur 7 réseaux']
                : ['No subscription', 'A monthly cap you set', 'Publishing to 7 networks']
              ).map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          {period === 'monthly'
            ? (fr
              ? '7 jours gratuits. Annule avant : 0 €. La limite de l’essai est dans les questions plus bas.'
              : '7 days free. Cancel before: €0. The trial limit is in the questions below.')
            : (fr ? 'Pas d’essai en trimestriel ou en annuel : le paiement part le jour même.' : 'No trial on quarterly or yearly: payment is taken the same day.')}
        </p>
        <p className="mt-2 text-center text-[11px] text-neutral-600">
          {fr
            ? `* Les posts de la formule chez un ghostwriter LinkedIn, au bas des tarifs publiés en 2026 (${FREELANCE_FLOOR.post} € le post ; un reel chez un monteur freelance part de ${FREELANCE_FLOOR.reel} €). Sources : `
            : `* The plan's posts from a LinkedIn ghostwriter, at the low end of 2026 published rates (€${FREELANCE_FLOOR.post} per post; a reel from a freelance editor starts at €${FREELANCE_FLOOR.reel}). Sources: `}
          {FREELANCE_SOURCES.map((src, i) => (
            <span key={src.href}>
              {i > 0 && ', '}
              <a href={src.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400">{src.label}</a>
            </span>
          ))}
          .
        </p>

        <section className="mt-24">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">{fr ? 'Comparer les formules' : 'Compare plans'}</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-5 py-4 text-sm font-medium text-neutral-500">{fr ? 'Chaque mois' : 'Every month'}</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="px-3 py-4 text-center text-sm font-semibold">
                      {PLAN_LABELS[p.id][fr ? 'fr' : 'en']}
                      <span className="block text-xs font-normal tabular-nums text-neutral-500">
                        {finalPrice(p.price, period, 1)} €{fr ? '/mois' : '/mo'}
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-4 text-center text-sm font-semibold">
                    {fr ? 'Conso' : 'As you go'}
                    <span className="block text-xs font-normal text-neutral-500">{fr ? 'dès 0 €' : 'from €0'}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <Fragment key={row.fr}>
                  {row.bonus && !ROWS[i - 1]?.bonus && (
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <td colSpan={5} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Bonus</td>
                    </tr>
                  )}
                  <tr className="border-b border-white/[0.06] last:border-0">
                    <td className="px-5 py-3.5 text-sm text-neutral-300">{fr ? row.fr : row.en}</td>
                    {(['starter', 'growth', 'scale', 'payg'] as Col[]).map((c) => (
                      <td key={c} className={`px-3 py-3.5 text-center ${c === 'growth' ? 'bg-white/[0.03]' : ''}`}>
                        <Cell value={row.cells[c]} fr={fr} />
                      </td>
                    ))}
                  </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
          <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {FAQ.map((item) => (
              <details key={item.q.fr} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  {fr ? item.q.fr : item.q.en}
                  <span className="text-neutral-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{fr ? item.a.fr : item.a.en}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-16 text-center text-sm text-neutral-500">
          {fr ? 'Tu accompagnes des clients (freelance, consultant, agence) ? ' : 'You coach clients (freelancer, consultant, agency)? '}
          <a
            href="/academy"
            onClick={() => trackAmplitude('pricing_page_partner_clicked')}
            className="inline-flex items-center gap-1 text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
          >
            {fr ? 'Le programme partenaire' : 'The partner program'}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </p>
      </div>
    </main>
  )
}
