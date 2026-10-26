'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, ChevronDown, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import FeaturedInSection from '@/components/FeaturedInSection'
import CustomerReviews from '@/components/pricing/CustomerReviews'
import PlanCards from '@/components/pricing/PlanCards'
import {
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
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Page tarifs du site, construite sur le pricing de l'app (cartes, sélecteur
 * de formule sur mobile, « Vu dans », avis clients, FAQ) avec en plus ce que
 * l'app ne montre pas : les fonctionnalités, le paiement à l'usage et les
 * blocs qui expliquent le prix (formats, méthode, vérification, preuves, ce
 * qu'il faudrait organiser sans Empire). Prix et remises : `lib/plans.ts`,
 * les mêmes que `/join/empire`. Au mois, chaque formule ouvre l'essai ; en
 * trimestriel / annuel il n'existe pas, le bouton envoie au paiement de l'app.
 */

type Group = 'features' | 'bonus'

type Row = { fr: string; en: string; cells: Record<PlanId, boolean | string>; group?: Group }

const GROUP_LABELS: Record<Group, { fr: string; en: string }> = {
  features: { fr: 'Dans chaque formule', en: 'In every plan' },
  bonus: { fr: 'À partir d’Intermédiaire', en: 'From Intermediate' },
}

// Fourchettes publiées en 2026 : un reel simple chez un monteur 50-120 € (Le Cut),
// un post LinkedIn chez un ghostwriter 50-250 € (Copylinker), un community
// manager qui gère aussi la vidéo 1 500-2 500 €/mois (mission-freelances).
// Choix de Kevin (19 octobre 2026) : 100 € le post, 1 500 € le CM.
// Les volumes sont « au choix » : l'équipe est chiffrée sur la moitié des crédits
// en reels et l'autre moitié en posts, jamais sur les deux volumes additionnés.
const FREELANCE_FLOOR = { reel: 50, post: 100, communityManager: 1500 }
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

const TOP50_SCREENSHOT = 'https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png'

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
  const [opening, setOpening] = useState<PlanId | null>(null)
  const growth = PLANS.find((p) => p.id === 'growth')!
  const growthTeam = teamMix('growth')
  const teamLines = [
    { fr: `Un monteur : ${growthTeam.reels} reels × ${FREELANCE_FLOOR.reel} €`, en: `An editor: ${growthTeam.reels} reels × €${FREELANCE_FLOOR.reel}`, euros: growthTeam.reels * FREELANCE_FLOOR.reel },
    { fr: `Un rédacteur : ${growthTeam.posts} posts × ${FREELANCE_FLOOR.post} €`, en: `A writer: ${growthTeam.posts} posts × €${FREELANCE_FLOOR.post}`, euros: growthTeam.posts * FREELANCE_FLOOR.post },
    { fr: 'Un community manager : publication, commentaires, DM', en: 'A community manager: publishing, comments, DMs', euros: FREELANCE_FLOOR.communityManager },
  ]
  const teamTotal = teamLines.reduce((sum, l) => sum + l.euros, 0)

  // Les boutons hors des cartes ouvrent toujours l'essai, quelle que soit la période affichée.
  const startTrial = async (location: string) => {
    if (opening) return
    setOpening('growth')
    trackAmplitude('pricing_page_plan_clicked', { plan: 'growth', billing_period: 'monthly', location })
    await startFreeTrial('growth')
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-24 pt-24 text-white md:pt-28">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {fr ? 'Publie tous les jours, sans écrire ni monter' : 'Post every day, without writing or editing'}
          </h1>
          <p className="text-base leading-relaxed text-white/60">
            {fr
              ? 'Chaque semaine, Empire te prépare des idées. Tu filmes ou tu dictes quelques minutes, Empire écrit, monte et publie tes posts LinkedIn, reels, newsletters et vidéos sur 7 réseaux.'
              : 'Every week, Empire prepares ideas for you. You film or dictate for a few minutes, Empire writes, edits and publishes your LinkedIn posts, reels, newsletters and videos to 7 networks.'}
          </p>
        </header>

        <div className="mt-8">
          <PlanCards location="cards" period={period} onPeriodChange={setPeriod} />
        </div>

        <FeaturedInSection className="mt-12" variant="compact" title={fr ? 'Mis en avant par' : 'Featured by'} />

        <div className="mt-12">
          <CustomerReviews title={fr ? 'Ils publient avec Empire' : 'They publish with Empire'} />
        </div>

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

        <section className="mx-auto mt-28 max-w-5xl space-y-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <h2 className="text-center text-sm font-semibold text-white">{fr ? 'Comment ça marche ?' : 'How does it work?'}</h2>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            {PROCESS.map((step, i) => {
              const [title, desc] = fr ? step.fr : step.en
              return (
                <li key={step.fr[0]} className="space-y-2 text-center">
                  <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 3 ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>{i + 1}</span>
                  <p className="text-xs font-semibold text-white">{title}</p>
                  <p className="text-[11px] leading-relaxed text-white/50">{desc}</p>
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
              ? `Pour le volume d’Intermédiaire, la moitié des crédits en reels et l’autre en posts, aux tarifs freelance publiés en 2026.`
              : `For the Intermediate volume, half the credits as reels and half as posts, at 2026 published freelance rates.`}
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
                {opening === 'growth' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial')}
              </button>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-4xl text-center text-[11px] text-neutral-600">
            {fr
              ? `Reel monté : 50 à 120 € ; post LinkedIn : 50 à 250 € ; community manager qui gère aussi la vidéo : 1 500 à 2 500 €/mois. Sources : `
              : `Edited reel: €50 to €120; LinkedIn post: €50 to €250; community manager who also handles video: €1,500 to €2,500/mo. Sources: `}
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

        <section className="mx-auto mt-28 max-w-2xl space-y-3">
          <h2 className="text-center text-sm font-semibold text-white">{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
          {FAQ.map((item) => (
            <details key={item.q.fr} className="group rounded-lg border border-white/[0.07] bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-white transition-colors hover:text-white/80 [&::-webkit-details-marker]:hidden">
                {fr ? item.q.fr : item.q.en}
                <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 text-white/40 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-3 text-xs leading-relaxed text-white/55">
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
            {opening === 'growth' ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial')}
            <ArrowRight className="h-4 w-4" />
          </button>
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
