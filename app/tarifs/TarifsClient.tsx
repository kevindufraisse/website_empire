'use client'

import { Fragment, useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import FeaturedInSection from '@/components/FeaturedInSection'
import PlanCards from '@/components/pricing/PlanCards'
import TeamCards from '@/components/pricing/TeamCards'
import PaygCards from '@/components/pricing/PaygCards'
import glass from '@/components/pricing/pricing.module.css'
import {
  CONTENT_CREDITS,
  MAX_SELF_SERVE_SEATS,
  PAYG_RECHARGE,
  PLANS,
  PLAN_DELIVERABLES,
  PLAN_LABELS,
  finalPrice,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { TRIAL_CREDITS, TRIAL_TERMS_EN, TRIAL_TERMS_FR } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { ORDER_SEGMENT, ORDER_SEGMENTS } from '@/lib/orderStyles'

/**
 * Page tarifs du site, sur le modèle des pages de prix de Claude et ChatGPT
 * (choix de Kevin, 29 octobre 2026) : un titre court, trois onglets par type
 * de client (Solo, Équipe et agence, À l'usage), des cartes courtes, une ligne
 * vers l'Academy, puis le comparatif et la FAQ. Les blocs qui expliquaient le
 * produit (formats, méthode, coût d'une équipe freelance) ne sont plus ici.
 * Prix et remises : `lib/plans.ts`, les mêmes que `/join/empire`. Chaque
 * onglet mène au bon paiement de /join/empire (essai, places, recharge).
 */

type Group = 'features' | 'bonus'

type Row = { fr: string; en: string; cells: Record<PlanId, boolean | string>; group?: Group }

type Tab = 'solo' | 'team' | 'payg'

// L'ancre garde l'onglet dans l'adresse (#equipe, #usage), comme Claude.
const TABS: { id: Tab; hash: string; fr: string; en: string }[] = [
  { id: 'solo', hash: 'solo', fr: 'Solo', en: 'Solo' },
  { id: 'team', hash: 'equipe', fr: 'Équipe et agence', en: 'Team and agency' },
  { id: 'payg', hash: 'usage', fr: 'À l’usage', en: 'Pay as you go' },
]

const GROUP_LABELS: Record<Group, { fr: string; en: string }> = {
  features: { fr: 'Dans chaque formule', en: 'In every plan' },
  bonus: { fr: 'À partir de Growth', en: 'From Growth' },
}

const POST_CREDITS = CONTENT_CREDITS.post

const ALL: Record<PlanId, boolean> = { starter: true, growth: true, scale: true }
const FROM_GROWTH: Record<PlanId, boolean> = { starter: false, growth: true, scale: true }

const ROWS: Row[] = [
  {
    fr: 'Reels montés, jusqu’à', en: 'Edited reels, up to',
    cells: { starter: String(PLAN_DELIVERABLES.starter.reels), growth: String(PLAN_DELIVERABLES.growth.reels), scale: String(PLAN_DELIVERABLES.scale.reels) },
  },
  {
    fr: 'ou posts LinkedIn, jusqu’à', en: 'or LinkedIn posts, up to',
    cells: { starter: String(PLAN_DELIVERABLES.starter.posts), growth: String(PLAN_DELIVERABLES.growth.posts), scale: String(PLAN_DELIVERABLES.scale.posts) },
  },
  {
    fr: 'ou newsletters, jusqu’à', en: 'or newsletters, up to',
    cells: { starter: String(PLAN_DELIVERABLES.starter.newsletters), growth: String(PLAN_DELIVERABLES.growth.newsletters), scale: String(PLAN_DELIVERABLES.scale.newsletters) },
  },
  { fr: 'Support prioritaire sous 4 h', en: 'Priority support within 4h', cells: FROM_GROWTH },
  { fr: 'Revue stratégique mensuelle (retours Loom)', en: 'Monthly strategy review (Loom feedback)', cells: { starter: false, growth: false, scale: true } },
  { fr: 'Chaque reel vérifié par l’équipe', en: 'Every reel checked by the team', cells: ALL, group: 'features' },
  { fr: 'Publication sur 7 réseaux, sans supplément', en: 'Publishing to 7 networks, no extra cost', cells: ALL, group: 'features' },
  { fr: 'Des idées prêtes à filmer chaque semaine', en: 'Ready-to-film ideas every week', cells: ALL, group: 'features' },
  { fr: 'Veille : chaque matin, les sujets qui montent dans ta niche', en: 'Daily brief: the topics rising in your niche', cells: ALL, group: 'features' },
  { fr: 'Bot Telegram : tu envoies un lien, il devient une idée', en: 'Telegram bot: send a link, it becomes an idea', cells: ALL, group: 'features' },
  { fr: 'Miniatures YouTube et Instagram générées depuis la vidéo', en: 'YouTube and Instagram thumbnails generated from the video', cells: ALL, group: 'features' },
  { fr: 'Republication automatique de tes meilleurs posts', en: 'Automatic republishing of your best posts', cells: ALL, group: 'features' },
  { fr: 'Commentaires et DM de tous tes réseaux au même endroit', en: 'Comments and DMs from all your networks in one place', cells: ALL, group: 'features' },
  { fr: 'Liens trackés : quel contenu t’a amené quel client', en: 'Tracked links: which content brought which client', cells: ALL, group: 'features' },
  { fr: 'Intégrations Cal.com, Calendly, Tally, ManyChat, Systeme.io, Stripe…', en: 'Cal.com, Calendly, Tally, ManyChat, Systeme.io, Stripe… integrations', cells: ALL, group: 'features' },
  { fr: 'Plusieurs comptes, un seul envoi', en: 'Several accounts, one send', cells: ALL, group: 'features' },
  { fr: 'Rapport hebdo : vues, abonnés et leads par format', en: 'Weekly report: views, followers and leads per format', cells: ALL, group: 'features' },
  { fr: 'Live client chaque semaine', en: 'Weekly client live', cells: FROM_GROWTH, group: 'bonus' },
  { fr: 'Communauté privée Slack', en: 'Private Slack community', cells: FROM_GROWTH, group: 'bonus' },
  { fr: 'Masterclass Empire : bien utiliser l’outil pour ta marque (replays)', en: 'Empire masterclass: using the tool for your brand (replays)', cells: FROM_GROWTH, group: 'bonus' },
]

const FAQ = [
  {
    q: { fr: 'Comment marche l’essai gratuit ?', en: 'How does the free trial work?' },
    a: { fr: TRIAL_TERMS_FR, en: TRIAL_TERMS_EN },
  },
  {
    q: { fr: 'Combien de temps ça me prend ?', en: 'How much of my time does it take?' },
    a: {
      fr: 'Environ 20 minutes par semaine pour filmer ou dicter. Empire s’occupe du reste : écriture, montage, publication.',
      en: 'About 20 minutes a week to film or dictate. Empire does the rest: writing, editing, publishing.',
    },
  },
  {
    q: { fr: 'Qui vérifie mes contenus ?', en: 'Who checks my content?' },
    a: {
      fr: 'Chaque reel monté est vérifié par l’équipe avant de t’arriver. Ensuite c’est toi : rien n’est publié sans ta validation.',
      en: 'Every edited reel is checked by the team before it reaches you. Then it’s you: nothing goes out without your approval.',
    },
  },
  {
    q: { fr: 'Et si ça ne sonne pas comme moi ?', en: 'What if it doesn’t sound like me?' },
    a: {
      fr: 'Tout part de ce que tu dis : tes mots, tes exemples, tes expressions. Un post sonne faux ? Tu le refuses ou tu le modifies avant publication.',
      en: 'Everything starts from what you say: your words, your examples, your phrasing. A post sounds off? Reject or edit it before it goes out.',
    },
  },
  {
    q: { fr: 'C’est quoi, les crédits ?', en: 'What are credits?' },
    a: {
      fr: `La monnaie de l’app : chaque contenu en utilise un nombre fixe (un post LinkedIn, ${POST_CREDITS} crédits). Ta formule en verse chaque mois et tu choisis le mix entre reels, posts et newsletters. Les crédits non utilisés passent au mois suivant tant que ton abonnement est actif. L’essai en contient ${TRIAL_CREDITS}.`,
      en: `The app's currency: each piece of content uses a fixed amount (a LinkedIn post, ${POST_CREDITS} credits). Your plan adds them every month and you choose the mix of reels, posts and newsletters. Unused credits roll over while your subscription is active. The trial includes ${TRIAL_CREDITS}.`,
    },
  },
  {
    q: { fr: 'Trimestriel ou annuel, c’est prélevé comment ?', en: 'How are quarterly and yearly billed?' },
    a: {
      fr: `En une fois pour la période : tous les 3 mois en trimestriel (-12 %), une fois par an en annuel (-18 %). Même essai qu’au mois : 7 jours et ${TRIAL_CREDITS} crédits offerts, le premier prélèvement part au 8e jour ou dès que tu dépasses les ${TRIAL_CREDITS} crédits.`,
      en: `Once per period: every 3 months on quarterly (-12%), once a year on yearly (-18%). Same trial as monthly: 7 days and ${TRIAL_CREDITS} free credits, the first charge is taken on day 8 or as soon as you go past ${TRIAL_CREDITS} credits.`,
    },
  },
  {
    q: { fr: 'Et le paiement à l’usage ?', en: 'And pay as you go?' },
    a: {
      fr: `Tu enregistres ta carte, 0 € aujourd’hui. À ta première action payante, une recharge de ${PAYG_RECHARGE.euros} € (${PAYG_RECHARGE.credits} crédits), puis une nouvelle dès que ton solde ne suffit plus. Tu fixes un plafond par mois. Pas d’abonnement, mais ni live, ni Slack, ni replays.`,
      en: `Save your card, €0 today. On your first paid action, a €${PAYG_RECHARGE.euros} top-up (${PAYG_RECHARGE.credits} credits), then another when your balance runs low. You set a monthly cap. No subscription, but no live, Slack or replays.`,
    },
  },
  {
    q: { fr: 'Quelle différence avec MagicPost, Opus Clip ou une agence ?', en: 'How is it different from MagicPost, Opus Clip or an agency?' },
    a: {
      fr: 'Ces outils couvrent une partie du travail : écrire des posts LinkedIn, découper une vidéo longue, ou tout déléguer à prix d’agence. Empire te donne les sujets, les formats testés sur le compte de Kevin et la publication sur 7 réseaux.',
      en: 'Those tools cover part of the job: writing LinkedIn posts, cutting a long video, or handing everything off at agency prices. Empire gives you the topics, the formats tested on Kevin’s account and publishing to 7 networks.',
    },
    link: { href: '/comparatif', fr: 'Voir le comparatif', en: 'See the comparison' },
  },
  {
    q: { fr: 'Et pour une équipe ou une agence ?', en: 'What about a team or an agency?' },
    a: {
      fr: `De 2 à ${MAX_SELF_SERVE_SEATS} comptes, tu prends des places dans l’onglet Équipe et agence : -10 % dès 3 places, -15 % dès 5, -20 % dès 10, en plus de la remise trimestrielle ou annuelle. Au-delà, ou pour des crédits illimités, l’offre agence et entreprise se fait sur devis.`,
      en: `From 2 to ${MAX_SELF_SERVE_SEATS} accounts, get seats in the Team and agency tab: -10% from 3 seats, -15% from 5, -20% from 10, on top of the quarterly or yearly discount. Beyond that, or for unlimited credits, the agency and enterprise offer is custom-priced.`,
    },
  },
  {
    q: { fr: 'Je peux changer de formule ?', en: 'Can I change plan?' },
    a: {
      fr: 'Oui, à tout moment, depuis la page Abonnement de l’app. La différence est calculée au prorata de ton cycle en cours.',
      en: 'Yes, anytime, from the Subscription page in the app. The difference is prorated on your current cycle.',
    },
  },
]

function Cell({ value, fr }: { value: boolean | string; fr: boolean }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-white" aria-label={fr ? 'inclus' : 'included'} />
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-neutral-400" aria-label={fr ? 'non inclus' : 'not included'} />
  return <span className="text-sm tabular-nums text-neutral-200">{value}</span>
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {intro && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-300 md:text-base">{intro}</p>}
    </div>
  )
}

export default function TarifsClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [period, setPeriod] = useState<BillingId>('monthly')
  const [tab, setTab] = useState<Tab>('solo')

  useEffect(() => {
    const sync = () => {
      const fromHash = TABS.find((t) => `#${t.hash}` === window.location.hash)
      if (fromHash) setTab(fromHash.id)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const openTab = (next: Tab) => {
    setTab(next)
    const hash = TABS.find((t) => t.id === next)!.hash
    window.history.replaceState(null, '', next === 'solo' ? window.location.pathname : `#${hash}`)
    trackAmplitude('pricing_page_tab_clicked', { tab: next })
  }

  return (
    <main className={`min-h-screen overflow-x-hidden pb-16 pt-10 text-white md:pt-14 ${glass.page}`}>
      <div className="mx-auto max-w-5xl px-4">
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{fr ? 'Tarifs' : 'Pricing'}</h1>
          <p className="text-base leading-relaxed text-neutral-300">
            {fr ? 'Publie tous les jours, sans écrire ni monter.' : 'Post every day, without writing or editing.'}
          </p>
        </header>

        <div className={`mx-auto mt-8 max-w-lg grid-cols-3 ${ORDER_SEGMENTS}`} role="tablist" aria-label={fr ? 'Type d’offre' : 'Offer type'}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === tab}
              onClick={() => openTab(t.id)}
              className={`text-xs font-semibold sm:text-sm ${ORDER_SEGMENT}`}
            >
              {fr ? t.fr : t.en}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel">
          {tab === 'solo' && <PlanCards location="cards" period={period} onPeriodChange={setPeriod} hidePayg />}
          {tab === 'team' && <TeamCards period={period} onPeriodChange={setPeriod} />}
          {tab === 'payg' && <PaygCards />}
        </div>

        <p className={`mx-auto mt-8 max-w-2xl px-4 py-3 text-center text-sm text-neutral-300 ${glass.panel} ${glass.compact}`}>
          {fr ? 'Tu veux apprendre à le faire, ou le proposer à tes clients ? ' : 'Want to learn to do it, or offer it to your clients? '}
          <a
            href="/academy"
            onClick={() => trackAmplitude('pricing_page_partner_clicked')}
            className="inline-flex items-center gap-1 font-medium text-white underline decoration-white/20 underline-offset-4 hover:decoration-white"
          >
            {fr ? 'L’Academy et Empire Partners' : 'The Academy and Empire Partners'}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </p>

        <FeaturedInSection className="mt-16" variant="compact" title={fr ? 'Mis en avant par' : 'Featured by'} />

        <section id="comparer" className="mt-24 scroll-mt-24">
          <SectionTitle title={fr ? 'Comparer les formules' : 'Compare plans'} />
          <div className={`mx-auto mt-10 max-w-4xl overflow-hidden ${glass.panel}`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className={`border-b border-white/15 ${glass.tableBand}`}>
                  <th className="px-3 py-4 text-xs font-medium text-neutral-300 sm:px-5 sm:text-sm">{fr ? 'Chaque mois' : 'Every month'}</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="w-[19%] px-0.5 py-4 text-center text-[11px] font-semibold sm:w-[20%] sm:px-3 sm:text-sm">
                      {PLAN_LABELS[p.id][fr ? 'fr' : 'en']}
                      <span className="block text-[11px] font-normal tabular-nums text-neutral-300 sm:text-xs">
                        {finalPrice(p.price, period, 1)} €{fr ? '/mois' : '/mo'}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <Fragment key={row.fr}>
                    {row.group && row.group !== ROWS[i - 1]?.group && (
                      <tr className={`border-b border-white/15 ${glass.tableBand}`}>
                        <td colSpan={4} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-300 sm:px-5">{GROUP_LABELS[row.group][fr ? 'fr' : 'en']}</td>
                      </tr>
                    )}
                    <tr className="border-b border-white/15 last:border-0">
                      <td className="px-3 py-3 text-xs leading-snug text-neutral-300 sm:px-5 sm:py-3.5 sm:text-sm">{fr ? row.fr : row.en}</td>
                      {PLANS.map((p) => (
                        <td key={p.id} className={`px-1 py-3 text-center sm:px-3 ${p.id === 'growth' ? glass.comparisonColumn : ''}`}>
                          <Cell value={row.cells[p.id]} fr={fr} />
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-2xl space-y-3">
          <h2 className="text-center text-sm font-semibold text-white">{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
          {FAQ.map((item) => (
            <details key={item.q.fr} className={`group ${glass.panel} ${glass.compact}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between min-h-12 px-4 py-3 text-sm font-medium text-white transition-colors hover:text-white/80 [&::-webkit-details-marker]:hidden">
                {fr ? item.q.fr : item.q.en}
                <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 text-neutral-300 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-neutral-300">
                {fr ? item.a.fr : item.a.en}
                {item.link && (
                  <>
                    {' '}
                    <a href={item.link.href} className="font-medium text-white underline-offset-2 hover:underline">
                      {fr ? item.link.fr : item.link.en}
                    </a>
                  </>
                )}
              </p>
            </details>
          ))}
        </section>

      </div>
    </main>
  )
}
