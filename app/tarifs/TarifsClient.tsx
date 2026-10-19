'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CASE_STUDIES } from '@/components/sections/CaseStudiesSection'
import FeaturedInSection from '@/components/FeaturedInSection'
import CustomerReviews from '@/components/pricing/CustomerReviews'
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
 * Page tarifs du site, construite sur le pricing de l'app (cartes, sélecteur
 * de formule sur mobile, « Vu dans », avis clients, FAQ) avec en plus ce que
 * l'app ne montre pas : les fonctionnalités, le paiement à l'usage et les
 * blocs qui expliquent le prix (formats, méthode, vérification, preuves, ce
 * qu'il faudrait organiser sans Empire). Prix et remises : `lib/plans.ts`,
 * les mêmes que `/join/empire`. Au mois, chaque formule ouvre l'essai ; en
 * trimestriel / annuel il n'existe pas, le bouton envoie au paiement de l'app.
 */

type Col = PlanId | 'payg'

type Group = 'features' | 'bonus'

type Row = { fr: string; en: string; cells: Record<PlanId, boolean | string>; group?: Group }

const GROUP_LABELS: Record<Group, { fr: string; en: string }> = {
  features: { fr: 'Dans chaque formule', en: 'In every plan' },
  bonus: { fr: 'À partir d’Intermédiaire', en: 'From Intermediate' },
}

// Bas des fourchettes publiées en 2026 : un reel simple chez un monteur
// 50-120 € (Le Cut), un post LinkedIn chez un ghostwriter 50-250 € (Copylinker),
// une gestion légère par un community manager 300-500 €/mois (mission-freelances).
// Les volumes sont « au choix » : l'équipe est chiffrée sur la moitié des crédits
// en reels et l'autre moitié en posts, jamais sur les deux volumes additionnés.
const FREELANCE_FLOOR = { reel: 50, post: 50, communityManager: 300 }
const FREELANCE_SOURCES = [
  { label: 'Le Cut', href: 'https://www.lecut.fr/blog/tarifs-monteur-video-freelance' },
  { label: 'Copylinker', href: 'https://copylinker.fr/tarif-ghostwriter-linkedin/' },
  { label: 'mission-freelances', href: 'https://www.mission-freelances.fr/blog/barometre/tjm-freelance-communication-2026/' },
]
const POST_CREDITS = CONTENT_CREDITS.post

function teamMix(plan: PlanId) {
  const half = (PLANS.find((p) => p.id === plan)?.credits ?? 0) / 2
  return { reels: Math.floor(half / CONTENT_CREDITS.reel), posts: Math.floor(half / CONTENT_CREDITS.post) }
}

const ACADEMY_VALUE_EUROS = 297

// Résultats déjà publiés sur l'accueil, attribués à Empire (Deborah, lancée sur
// les conseils de Kevin, n'y est pas).
const PROOF_LINES: { name: string; statFr: string; statEn: string; howFr: string; howEn: string }[] = [
  { name: 'Caroline Blivet', statFr: '361 → 8 000 impressions', statEn: '361 → 8,000 impressions', howFr: 'dès son premier post avec Empire', howEn: 'on her first post with Empire' },
  { name: 'Evelyne Guitard', statFr: '100 000 vues en 21 jours', statEn: '100,000 views in 21 days', howFr: 'sur LinkedIn, après son onboarding', howEn: 'on LinkedIn, after onboarding' },
  { name: 'Olivier Sarezinski', statFr: '1 h par semaine', statEn: '1 hour a week', howFr: 'au lieu de plusieurs freelances', howEn: 'instead of several freelancers' },
]
const PROOF = PROOF_LINES.flatMap((line) => {
  const cs = CASE_STUDIES.find((c) => c.name === line.name)
  return cs ? [{ ...line, photo: cs.photo, roleFr: cs.roleFr, roleEn: cs.roleEn }] : []
})

const TOP50_SCREENSHOT = 'https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png'

// Compte de démo de l'app : connexion anonyme, rempli selon le profil choisi.
const DEMO_URL = 'https://app.empire-internet.com/demo'

// Cette page tutoie ; l'accueil, qui lit aussi `rhythmFr`, vouvoie.
const RHYTHM_TU: Record<PlanId, string> = {
  starter: 'Tu postes tous les 2 jours',
  growth: 'Tu postes tous les jours',
  scale: 'Tu postes 2 fois par jour',
}

const CARD_EXTRAS: Record<PlanId, { fr: string; en: string }[]> = {
  starter: [
    { fr: 'Toutes les fonctionnalités de l’app', en: 'Every feature of the app' },
    { fr: 'Live, Slack privé et replays : à partir d’Intermédiaire', en: 'Live, private Slack and replays: from Intermediate' },
  ],
  growth: [
    { fr: 'Live client chaque semaine', en: 'Weekly client live' },
    { fr: 'Communauté privée Slack', en: 'Private Slack community' },
    { fr: `Replays masterclass (valeur ${ACADEMY_VALUE_EUROS} €)`, en: `Masterclass replays (worth €${ACADEMY_VALUE_EUROS})` },
    { fr: 'Support prioritaire sous 4 h', en: 'Priority support within 4h' },
  ],
  scale: [
    { fr: 'Tout Intermédiaire', en: 'Everything in Intermediate' },
    { fr: 'Revue stratégique mensuelle (retours Loom)', en: 'Monthly strategy review (Loom feedback)' },
  ],
}

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
  { fr: `Replays masterclass (valeur ${ACADEMY_VALUE_EUROS} €)`, en: `Masterclass replays (worth €${ACADEMY_VALUE_EUROS})`, cells: FROM_GROWTH, group: 'bonus' },
]

const FORMATS = [
  {
    image: '/formats/tierlist.webp',
    fr: { title: 'Tier list', how: 'Tu classes des noms connus de ton métier. Chacun veut contester ton classement, donc il commente.' },
    en: { title: 'Tier list', how: 'You rank well-known names in your field. Everyone wants to argue with it, so they comment.' },
  },
  {
    image: '/formats/blur-reveal.webp',
    fr: { title: 'Flou → net', how: 'La réponse est cachée et se dévoile au fil de la vidéo : on reste jusqu’au bout pour la voir.' },
    en: { title: 'Blur → reveal', how: 'The answer is hidden and revealed as the video goes: people stay to the end to see it.' },
  },
  {
    image: '/formats/reaction.webp',
    fr: { title: 'Réaction', how: 'Tu réagis à une vidéo qui marche déjà dans ta niche et tu profites de son audience.' },
    en: { title: 'Reaction', how: 'You react to a video already working in your niche and borrow its audience.' },
  },
  {
    image: '/formats/faq.webp',
    fr: { title: 'Fausse FAQ', how: 'Tu réponds à l’objection que ton client se pose sans oser la dire. Ça vend sans vendre.' },
    en: { title: 'Fake Q&A', how: 'You answer the objection your client has but never says out loud. It sells without selling.' },
  },
]

const ALONE = {
  fr: [
    'Trouver un sujet chaque jour',
    'Choisir le format qui marche en ce moment',
    'Écrire l’accroche et le texte',
    'Monter la vidéo et construire le format',
    'Adapter chaque contenu à 7 réseaux',
    'Publier, puis regarder ce qui a marché',
  ],
  en: [
    'Find a topic every day',
    'Pick the format that works right now',
    'Write the hook and the copy',
    'Edit the video and build the format',
    'Adapt each piece to 7 networks',
    'Publish, then check what worked',
  ],
}

const WITH_EMPIRE = {
  fr: [
    'Des idées prêtes chaque semaine, tirées de ton positionnement et de ta veille',
    'Des formats testés sur les comptes de Kevin',
    'Tu filmes ou tu dictes, Empire écrit et monte',
    'Chaque reel vérifié par l’équipe avant de t’arriver',
    'Publication programmée sur 7 réseaux',
    'Un rapport chaque semaine : ce qui marche, par format',
  ],
  en: [
    'Ready ideas every week, from your positioning and your daily brief',
    'Formats tested on Kevin’s accounts',
    'You film or dictate, Empire writes and edits',
    'Every reel checked by the team before it reaches you',
    'Scheduled publishing to 7 networks',
    'A weekly report: what works, per format',
  ],
}

const PROCESS = [
  { fr: ['Idée et format préparés', 'Empire te propose le sujet et le format qui lui va.'], en: ['Idea and format ready', 'Empire suggests the topic and the format that fits it.'] },
  { fr: ['Tu filmes ou tu dictes', 'Quelques minutes face caméra, ou un vocal.'], en: ['You film or dictate', 'A few minutes on camera, or a voice note.'] },
  { fr: ['Montage par l’IA', 'Coupes, sous-titres, accroche et mise en forme du format.'], en: ['AI edit', 'Cuts, captions, hook and the format itself.'] },
  { fr: ['Vérification par l’équipe', 'Chaque reel monté est vérifié par l’équipe avant de t’arriver.'], en: ['Checked by the team', 'Every edited reel is checked by the team before it reaches you.'] },
  { fr: ['Tu valides, ça part', 'Rien n’est publié sans toi. Programmé sur 7 réseaux.'], en: ['You approve, it goes out', 'Nothing goes out without you. Scheduled on 7 networks.'] },
]

const PACK = [
  {
    fr: ['Les formats et les idées', 'Les formats qui font des vues sur les comptes de Kevin, et chaque semaine des sujets tirés de ton positionnement, de ta veille et de ce que tu envoies sur Telegram.'],
    en: ['Formats and ideas', 'The formats that get views on Kevin’s accounts, and every week topics drawn from your positioning, your daily brief and what you send on Telegram.'],
  },
  {
    fr: ['La production', 'L’écriture, le montage par l’IA, puis la vérification de chaque reel par l’équipe.'],
    en: ['Production', 'Writing, AI editing, then every reel checked by the team.'],
  },
  {
    fr: ['L’app', 'Publication sur 7 réseaux, commentaires et DM au même endroit, liens trackés jusqu’au client, rapport hebdo.'],
    en: ['The app', 'Publishing to 7 networks, comments and DMs in one place, links tracked to the client, weekly report.'],
  },
  {
    fr: ['L’Academy et le live', `À partir d’Intermédiaire : les replays masterclass (valeur ${ACADEMY_VALUE_EUROS} €), un live client chaque semaine et la communauté privée Slack.`],
    en: ['Academy and live', `From Intermediate: masterclass replays (worth €${ACADEMY_VALUE_EUROS}), a weekly client live and the private Slack community.`],
  },
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
      fr: 'En une fois pour la période : tous les 3 mois en trimestriel (-12 %), une fois par an en annuel (-18 %). Pas d’essai sur ces formules, le paiement part le jour même.',
      en: 'Once per period: every 3 months on quarterly (-12%), once a year on yearly (-18%). No trial on these, payment is taken the same day.',
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
    q: { fr: 'Je peux changer de formule ?', en: 'Can I change plan?' },
    a: {
      fr: 'Oui, à tout moment, depuis la page Abonnement de l’app. La différence est calculée au prorata de ton cycle en cours.',
      en: 'Yes, anytime, from the Subscription page in the app. The difference is prorated on your current cycle.',
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
  return <span className="text-sm tabular-nums text-neutral-200">{value}</span>
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {intro && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">{intro}</p>}
    </div>
  )
}

export default function TarifsClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const [period, setPeriod] = useState<BillingId>('monthly')
  const [mobilePlan, setMobilePlan] = useState<PlanId>('growth')
  const [opening, setOpening] = useState<Col | null>(null)
  const months = BILLING_PERIODS.find((p) => p.id === period)?.months ?? 1
  const growth = PLANS.find((p) => p.id === 'growth')!
  const growthTeam = teamMix('growth')
  const teamLines = [
    { fr: `Un monteur : ${growthTeam.reels} reels × ${FREELANCE_FLOOR.reel} €`, en: `An editor: ${growthTeam.reels} reels × €${FREELANCE_FLOOR.reel}`, euros: growthTeam.reels * FREELANCE_FLOOR.reel },
    { fr: `Un rédacteur : ${growthTeam.posts} posts × ${FREELANCE_FLOOR.post} €`, en: `A writer: ${growthTeam.posts} posts × €${FREELANCE_FLOOR.post}`, euros: growthTeam.posts * FREELANCE_FLOOR.post },
    { fr: 'Un community manager, gestion légère', en: 'A community manager, light package', euros: FREELANCE_FLOOR.communityManager },
  ]
  const teamTotal = teamLines.reduce((sum, l) => sum + l.euros, 0)

  const choose = async (col: Col, location = 'cards') => {
    if (opening) return
    setOpening(col)
    trackAmplitude('pricing_page_plan_clicked', { plan: col, billing_period: col === 'payg' ? 'payg' : period, location })
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

  // Les boutons hors des cartes ouvrent toujours l'essai, quelle que soit la période affichée.
  const startTrial = async (location: string) => {
    if (opening) return
    setOpening('growth')
    trackAmplitude('pricing_page_plan_clicked', { plan: 'growth', billing_period: 'monthly', location })
    await startFreeTrial('growth')
  }

  const demoLink = (location: string, label: string) => (
    <a
      href={DEMO_URL}
      onClick={() => trackAmplitude('pricing_page_demo_clicked', { location })}
      className="inline-flex items-center gap-1 text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </a>
  )

  const card = (plan: (typeof PLANS)[number]) => {
    const monthly = finalPrice(plan.price, period, 1)
    const d = PLAN_DELIVERABLES[plan.id]
    const hl = plan.highlighted
    return (
      <article
        key={plan.id}
        className={`relative flex flex-col rounded-2xl p-6 ${
          hl
            ? 'border border-white/[0.14] bg-gradient-to-b from-[#1b1b1f] to-[#0e0e10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_90px_-30px_rgba(0,0,0,0.9)] md:-my-3 md:py-9'
            : 'border border-white/[0.07] bg-white/[0.02]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold">{PLAN_LABELS[plan.id][fr ? 'fr' : 'en']}</h3>
          {hl && (
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-semibold text-white/75">
              {fr ? 'Recommandé' : 'Recommended'}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-500">{fr ? RHYTHM_TU[plan.id] : plan.rhythmEn}</p>

        <div className="mt-6 flex items-baseline gap-2">
          {period !== 'monthly' && <span className="text-lg tabular-nums text-neutral-600 line-through">{plan.price} €</span>}
          <span className="text-[2.75rem] font-semibold leading-none tracking-tight tabular-nums">{monthly} €</span>
          <span className="text-sm text-neutral-500">{fr ? '/mois' : '/mo'}</span>
        </div>
        <p className="mt-2 text-xs text-neutral-400">
          {fr ? `soit ${Math.round(monthly / 30)} € par jour` : `that's €${Math.round(monthly / 30)} a day`}
          {' · '}
          {period === 'monthly'
            ? (fr ? 'sans engagement' : 'no commitment')
            : fr
              ? `${(monthly * months).toLocaleString(locale)} € ${months === 3 ? 'tous les 3 mois' : 'par an'}`
              : `€${(monthly * months).toLocaleString(locale)} ${months === 3 ? 'every 3 months' : 'per year'}`}
        </p>
        <p className="h-5 text-xs font-semibold text-empire">
          {period !== 'monthly' && (fr
            ? `${((plan.price - monthly) * 12).toLocaleString(locale)} € économisés par an`
            : `€${((plan.price - monthly) * 12).toLocaleString(locale)} saved per year`)}
        </p>

        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{fr ? 'Chaque mois, au choix, jusqu’à' : 'Every month, your pick, up to'}</p>
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
        <p className="mt-2 text-center text-[11px] text-neutral-500">
          {fr
            ? `${plan.credits.toLocaleString(locale)} crédits par mois, tu mélanges comme tu veux`
            : `${plan.credits.toLocaleString(locale)} credits a month, mix as you like`}
        </p>

        <button
          type="button"
          onClick={() => choose(plan.id)}
          disabled={opening !== null}
          className={`mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:opacity-60 ${
            hl ? 'bg-white text-black hover:bg-neutral-200' : 'border border-white/[0.14] bg-white/[0.03] text-white hover:bg-white/[0.07]'
          }`}
        >
          {opening === plan.id
            ? (fr ? 'Ouverture…' : 'Opening…')
            : period === 'monthly'
              ? (fr ? 'Essayer 7 jours gratuits' : 'Try free for 7 days')
              : (fr ? `Commencer · ${monthly} €/mois` : `Start · €${monthly}/mo`)}
        </button>
        <p className="mt-2 text-center text-[11px] leading-snug text-neutral-500">
          {period === 'monthly'
            ? (fr
              ? `7 jours ou ${TRIAL_CREDITS} crédits gratuits, puis ${plan.price} €/mois. Annule avant : 0 €.`
              : `7 days or ${TRIAL_CREDITS} credits free, then €${plan.price}/mo. Cancel before: €0.`)
            : (fr ? 'Pas d’essai sur cette période : paiement le jour même.' : 'No trial on this period: payment taken today.')}
        </p>

        <ul className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-5">
          {CARD_EXTRAS[plan.id].map((line) => (
            <li key={line.fr} className="flex items-start gap-2 text-sm text-neutral-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
              {fr ? line.fr : line.en}
            </li>
          ))}
        </ul>
      </article>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-24 pt-28 text-white md:pt-36">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{fr ? 'Tarifs' : 'Pricing'}</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            {fr ? 'Publie tous les jours, sans écrire ni monter.' : 'Post every day, without writing or editing.'}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'Chaque semaine, Empire te prépare des idées. Tu filmes ou tu dictes quelques minutes, Empire écrit, monte et publie tes reels, posts LinkedIn et newsletters sur 7 réseaux.'
              : 'Every week, Empire prepares ideas for you. You film or dictate for a few minutes, Empire writes, edits and publishes your reels, LinkedIn posts and newsletters to 7 networks.'}
          </p>
          <p className="mt-5 text-xs text-neutral-500">
            {fr
              ? 'La méthode de Kevin Dufraisse : n°1 des créateurs LinkedIn growth en France (Favikon), 10 millions de vues par mois.'
              : 'Kevin Dufraisse’s method: #1 growth creator on LinkedIn in France (Favikon), 10 million views a month.'}
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-1 rounded-xl border border-white/[0.07] bg-black/50 p-1" role="tablist">
          {BILLING_PERIODS.map((p) => {
            const active = p.id === period
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(p.id)}
                className={`cursor-pointer whitespace-nowrap rounded-lg px-1.5 py-2 text-center text-xs font-medium transition-colors sm:text-sm ${
                  active ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {fr ? p.labelFr : p.labelEn}
                {p.discount > 0 && (
                  <span className={`ml-1 text-[11px] font-semibold ${active ? 'text-black/60' : 'text-neutral-500'}`}>
                    -{Math.round(p.discount * 100)}%
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Mobile : une carte à la fois, Intermédiaire d'abord. */}
        <div className="mt-6 md:hidden">
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.07] bg-black/50 p-1" role="radiogroup" aria-label={fr ? 'Formule' : 'Plan'}>
            {PLANS.map((p) => {
              const active = p.id === mobilePlan
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMobilePlan(p.id)}
                  className={`cursor-pointer rounded-lg px-1 py-2 text-center transition-colors ${active ? 'bg-white/[0.1] text-white' : 'text-neutral-500'}`}
                >
                  <span className="block text-xs font-semibold">{PLAN_LABELS[p.id][fr ? 'fr' : 'en']}</span>
                  <span className="block text-[11px] tabular-nums">{finalPrice(p.price, period, 1)} €</span>
                </button>
              )
            })}
          </div>
          <div className="mt-4">{card(PLANS.find((p) => p.id === mobilePlan)!)}</div>
        </div>

        <div className="mt-10 hidden gap-4 md:grid md:grid-cols-3">{PLANS.map(card)}</div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-neutral-400">
          <span className="font-semibold text-neutral-200">{fr ? 'Dans tous les plans : ' : 'In every plan: '}</span>
          {fr
            ? 'des idées prêtes chaque semaine · écriture, montage et sous-titres · chaque reel vérifié par l’équipe · publication sur 7 réseaux · le mix se change à tout moment.'
            : 'ready ideas every week · writing, editing and captions · every reel checked by the team · publishing to 7 networks · change the mix anytime.'}
        </p>

        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center justify-between gap-3 rounded-xl border border-white/[0.09] bg-white/[0.03] px-5 py-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold">
              {fr ? `Pas prêt pour un abonnement ? Paie à l’usage, dès ${PAYG_RECHARGE.euros} €.` : `Not ready for a subscription? Pay as you go, from €${PAYG_RECHARGE.euros}.`}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {fr
                ? `0 € aujourd’hui, ${PAYG_RECHARGE.euros} € (${PAYG_RECHARGE.credits} crédits, environ ${Math.floor(PAYG_RECHARGE.credits / POST_CREDITS)} posts LinkedIn) à ta première action, plafond mensuel au choix. Sans live ni Slack.`
                : `€0 today, €${PAYG_RECHARGE.euros} (${PAYG_RECHARGE.credits} credits, about ${Math.floor(PAYG_RECHARGE.credits / POST_CREDITS)} LinkedIn posts) on your first action, monthly cap of your choice. No live or Slack.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => choose('payg')}
            disabled={opening !== null}
            className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-white/[0.14] px-4 text-sm font-semibold transition hover:bg-white/[0.07] disabled:opacity-60"
          >
            {opening === 'payg' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Payer à l’usage' : 'Pay as you go')}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
          {PROOF.map((cs) => (
            <li key={cs.name} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <Image src={cs.photo} alt={cs.name} width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-semibold tabular-nums text-white">{fr ? cs.statFr : cs.statEn}</p>
                <p className="text-xs text-neutral-400">{fr ? cs.howFr : cs.howEn}</p>
                <p className="truncate text-[11px] text-neutral-600">{cs.name.split(' ')[0]}, {fr ? cs.roleFr : cs.roleEn}</p>
              </div>
            </li>
          ))}
        </ul>

        <FeaturedInSection className="mt-12" />

        <p className="mt-6 text-center text-sm">
          {demoLink('cards', fr ? 'Voir un compte Empire déjà rempli, sans inscription' : 'See a filled-in Empire account, no sign-up')}
        </p>

        <section className="mt-28">
          <SectionTitle
            eyebrow={fr ? 'Les formats' : 'Formats'}
            title={fr ? 'Des sous-titres rendent une vidéo lisible. Un format la fait regarder.' : 'Captions make a video readable. A format makes it watched.'}
            intro={fr
              ? 'Chaque format donne une raison de rester : un classement à contester, une réponse cachée, une réaction, une objection. Empire prépare le format, tu n’as qu’à parler.'
              : 'Each format gives people a reason to stay: a ranking to argue with, a hidden answer, a reaction, an objection. Empire builds the format, you just talk.'}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map((f) => {
              const t = fr ? f.fr : f.en
              return (
                <figure key={f.image} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="relative aspect-[4/5] bg-black">
                    <Image src={f.image} alt={t.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                  </div>
                  <figcaption className="p-4">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">{t.how}</p>
                  </figcaption>
                </figure>
              )
            })}
          </div>
          <p className="mt-6 text-center text-sm">
            <a href="/formats" className="inline-flex items-center gap-1 text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white">
              {fr ? 'Voir tous les formats' : 'See every format'}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </p>
        </section>

        <section className="mt-28">
          <SectionTitle
            title={fr ? 'Pourquoi pas ChatGPT et un logiciel de montage ?' : 'Why not ChatGPT and an editing app?'}
            intro={fr
              ? 'Tu peux tout faire seul. Ce qui prend du temps, ce n’est pas d’écrire un texte ou de couper une vidéo : c’est de savoir quoi dire, dans quel format, et de tenir le rythme.'
              : 'You can do it all yourself. What takes time isn’t writing a text or cutting a video: it’s knowing what to say, in which format, and keeping the pace.'}
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <p className="text-sm font-semibold text-neutral-400">{fr ? 'Seul, chaque semaine, tu dois :' : 'Alone, every week, you have to:'}</p>
              <ul className="mt-4 space-y-3">
                {(fr ? ALONE.fr : ALONE.en).map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-neutral-400">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/[0.14] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6">
              <p className="text-sm font-semibold">{fr ? 'Avec Empire :' : 'With Empire:'}</p>
              <ul className="mt-4 space-y-3">
                {(fr ? WITH_EMPIRE.fr : WITH_EMPIRE.en).map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-neutral-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-28">
          <SectionTitle title={fr ? 'Comment ça marche' : 'How it works'} />
          <ol className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, i) => {
              const [title, desc] = fr ? step.fr : step.en
              return (
                <li key={step.fr[0]} className={`rounded-2xl border p-5 ${i === 3 ? 'border-white/[0.18] bg-white/[0.05]' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-black">{i + 1}</span>
                  <p className="mt-3 text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-400">{desc}</p>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="mx-auto mt-28 grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TOP50_SCREENSHOT} alt={fr ? 'Classement Favikon : Kevin Dufraisse n°1 Growth & Lead Gen France' : 'Favikon ranking: Kevin Dufraisse #1 Growth & Lead Gen France'} loading="lazy" className="w-full" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{fr ? 'D’où vient la méthode' : 'Where the method comes from'}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {fr ? 'Les formats d’Empire tournent d’abord sur mes comptes.' : 'Empire’s formats run on my own accounts first.'}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400 md:text-base">
              {fr
                ? 'Favikon m’a classé n°1 des créateurs LinkedIn growth et lead gen en France. Aujourd’hui mes comptes font 10 millions de vues par mois. Empire, c’est ce système : les formats, la production et la diffusion que j’utilise, mis à ta disposition.'
                : 'Favikon ranked me #1 growth and lead gen creator on LinkedIn in France. Today my accounts get 10 million views a month. Empire is that system: the formats, production and distribution I use, made available to you.'}
            </p>
            <p className="mt-4 text-sm font-semibold">Kevin Dufraisse</p>
            <p className="text-xs text-neutral-500">{fr ? 'Fondateur d’Empire' : 'Founder of Empire'}</p>
          </div>
        </section>

        <div className="mt-28">
          <CustomerReviews title={fr ? 'Ils publient avec Empire' : 'They publish with Empire'} />
        </div>

        <section className="mt-28">
          <SectionTitle title={fr ? 'Ce que tu as dans Empire' : 'What you get with Empire'} />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {PACK.map((block) => {
              const [title, desc] = fr ? block.fr : block.en
              return (
                <div key={block.fr[0]} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <p className="text-base font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-28">
          <SectionTitle
            title={fr ? 'Ce que tu devrais organiser sans Empire' : 'What you’d have to organise without Empire'}
            intro={fr
              ? `Pour le volume d’Intermédiaire, la moitié des crédits en reels et l’autre en posts, au bas des tarifs freelance publiés en 2026.`
              : `For the Intermediate volume, half the credits as reels and half as posts, at the low end of 2026 published freelance rates.`}
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <p className="text-sm font-semibold text-neutral-400">{fr ? 'Une équipe en freelance' : 'A freelance team'}</p>
              <ul className="mt-4 divide-y divide-white/[0.06]">
                {teamLines.map((l) => (
                  <li key={l.fr} className="flex items-baseline justify-between gap-4 py-2.5 text-sm text-neutral-300">
                    <span>{fr ? l.fr : l.en}</span>
                    <span className="shrink-0 tabular-nums">{l.euros.toLocaleString(locale)} €</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3 text-sm font-semibold">
                <span>{fr ? 'À partir de' : 'From'}</span>
                <span className="tabular-nums">{teamTotal.toLocaleString(locale)} € {fr ? '/mois' : '/mo'}</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                {fr
                  ? 'Et c’est toi qui trouves les sujets, briefes chacun et coordonnes.'
                  : 'And you still find the topics, brief everyone and coordinate.'}
              </p>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/[0.14] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6">
              <p className="text-sm font-semibold">{fr ? 'Empire Intermédiaire' : 'Empire Intermediate'}</p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-[2.75rem] font-semibold leading-none tracking-tight tabular-nums">{growth.price} €</span>
                <span className="text-sm text-neutral-500">{fr ? '/mois' : '/mo'}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                {fr
                  ? 'Les idées, les formats, l’écriture, le montage, la vérification de chaque reel et la publication, plus le live, le Slack et les replays.'
                  : 'Ideas, formats, writing, editing, every reel checked and publishing, plus the live, the Slack and the replays.'}
              </p>
              <button
                type="button"
                onClick={() => startTrial('comparison')}
                disabled={opening !== null}
                className="mt-auto inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60 md:mt-6"
              >
                {opening === 'growth' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Essayer 7 jours gratuits' : 'Try free for 7 days')}
              </button>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-4xl text-center text-[11px] text-neutral-600">
            {fr
              ? `${FREELANCE_FLOOR.reel} € le reel, ${FREELANCE_FLOOR.post} € le post, ${FREELANCE_FLOOR.communityManager} €/mois de community management. Sources : `
              : `€${FREELANCE_FLOOR.reel} per reel, €${FREELANCE_FLOOR.post} per post, €${FREELANCE_FLOOR.communityManager}/mo of community management. Sources: `}
            {FREELANCE_SOURCES.map((src, i) => (
              <span key={src.href}>
                {i > 0 && ', '}
                <a href={src.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400">{src.label}</a>
              </span>
            ))}
            .
          </p>
        </section>

        <section className="mt-28">
          <SectionTitle title={fr ? 'Comparer les formules' : 'Compare plans'} />
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-3 py-4 text-xs font-medium text-neutral-500 sm:px-5 sm:text-sm">{fr ? 'Chaque mois' : 'Every month'}</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="w-[19%] px-0.5 py-4 text-center text-[11px] font-semibold sm:w-[20%] sm:px-3 sm:text-sm">
                      {PLAN_LABELS[p.id][fr ? 'fr' : 'en']}
                      <span className="block text-[11px] font-normal tabular-nums text-neutral-500 sm:text-xs">
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
                      <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                        <td colSpan={4} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 sm:px-5">{GROUP_LABELS[row.group][fr ? 'fr' : 'en']}</td>
                      </tr>
                    )}
                    <tr className="border-b border-white/[0.06] last:border-0">
                      <td className="px-3 py-3 text-xs leading-snug text-neutral-300 sm:px-5 sm:py-3.5 sm:text-sm">{fr ? row.fr : row.en}</td>
                      {PLANS.map((p) => (
                        <td key={p.id} className={`px-1 py-3 text-center sm:px-3 ${p.id === 'growth' ? 'bg-white/[0.03]' : ''}`}>
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

        <section className="mx-auto mt-28 max-w-3xl">
          <SectionTitle title={fr ? 'Questions fréquentes' : 'FAQ'} />
          <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {FAQ.map((item) => (
              <details key={item.q.fr} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  {fr ? item.q.fr : item.q.en}
                  <span className="text-neutral-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {fr ? item.a.fr : item.a.en}
                  {item.link && (
                    <>
                      {' '}
                      <a href={item.link.href} className="font-medium text-neutral-200 underline decoration-white/20 underline-offset-2 hover:text-white">
                        {fr ? item.link.fr : item.link.en}
                      </a>
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-2xl rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-6 py-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {fr ? 'Essaie 7 jours, sans payer.' : 'Try it for 7 days, free.'}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
            {fr
              ? `Formule Intermédiaire, 7 jours ou ${TRIAL_CREDITS} crédits gratuits, puis ${growth.price} €/mois. Annule avant : 0 €.`
              : `Intermediate plan, 7 days or ${TRIAL_CREDITS} credits free, then €${growth.price}/mo. Cancel before: €0.`}
          </p>
          <button
            type="button"
            onClick={() => startTrial('footer')}
            disabled={opening !== null}
            className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60"
          >
            {opening === 'growth' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Essayer 7 jours gratuits' : 'Try 7 days free')}
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-xs text-neutral-500">
            {fr ? 'Pas encore sûr ? ' : 'Not sure yet? '}
            {demoLink('footer', fr ? 'Visite un compte déjà rempli, sans inscription' : 'Tour a filled-in account, no sign-up')}
          </p>
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
