'use client'

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import CustomerReviews from '@/components/pricing/CustomerReviews'
import PlanCards from '@/components/pricing/PlanCards'
import TeamCards from '@/components/pricing/TeamCards'
import OptionsPanel from '@/components/pricing/OptionsPanel'
import PressRow from '@/components/pricing/PressRow'
import StickyTrialBar from '@/components/pricing/StickyTrialBar'
import TrialCta, { CardTrialButton, trialContents } from '@/components/pricing/TrialCta'
import { useTrialCart } from '@/components/pricing/useTrialCart'
import { nbsp, rich } from '@/components/pricing/typo'
import glass from '@/components/pricing/pricing.module.css'
import {
  CONTENT_CREDITS,
  PLANS,
  PLAN_DELIVERABLES,
  PLAN_LABELS,
  finalPrice,
  type BillingId,
  type PlanId,
} from '@/lib/plans'
import { TRIAL_CREDITS } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { useLiveOffer } from '@/lib/liveOffer'
import { postitJoinUrl } from '@/lib/postit'

/**
 * Page tarifs du site (refonte « tarifs clairs », novembre 2026). Dans
 * l'ordre, sur téléphone : le titre et les trois prix, la carte de la formule
 * (dite en contenus par mois) avec sa période, la ligne d'essai et le bouton ;
 * un exemple de ce qu'on reçoit ; ce qui se passe après le bouton et comment
 * marche l'essai ; qui fait quoi ; le récapitulatif avec les options
 * (bootcamp, expert) ; les avis ; la méthode de Kevin ; la comparaison avec des
 * freelances ; le tableau des formules (replié sur téléphone) ; la FAQ ; un
 * dernier bouton et le pied de page.
 *
 * Prix et remises : `lib/plans.ts`, les mêmes que `/join/empire`. Chaque
 * bouton d'essai passe par `useTrialCart` (mêmes adresses et mêmes événements
 * qu'avant). L'offre du live (`?offer=live`) garde ses textes et son paiement.
 * Les tarifs Équipe et agence restent sur `/tarifs#equipe`, ouverts par le
 * lien sous le tableau.
 */

type Group = 'features' | 'bonus'

type Row = { fr: string; en: string; cells: Record<PlanId, boolean | string>; group?: Group }

type Tab = 'solo' | 'team'

// L'ancre garde la vue dans l'adresse (#equipe), comme Claude.
const TABS: { id: Tab; hash: string; fr: string; en: string }[] = [
  { id: 'solo', hash: 'solo', fr: 'Solo', en: 'Solo' },
  { id: 'team', hash: 'equipe', fr: 'Équipe et agence', en: 'Team and agency' },
]

const GROUP_LABELS: Record<Group, { fr: string; en: string }> = {
  features: { fr: 'Dans toutes les formules', en: 'In every plan' },
  bonus: { fr: 'À partir de Growth', en: 'From Growth' },
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

function teamMix(plan: PlanId) {
  const half = (PLANS.find((p) => p.id === plan)?.credits ?? 0) / 2
  return { reels: Math.floor(half / CONTENT_CREDITS.reel), posts: Math.floor(half / CONTENT_CREDITS.post) }
}

const TOP50_SCREENSHOT = 'https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png'
const FAVIKON_RANKING = '/community/kevin-favikon.webp'

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
  { fr: 'Un appel de démarrage en 1-1 (30 min), avec Kevin ou l’équipe', en: 'A 1-1 kickoff call (30 min), with Kevin or the team', cells: FROM_GROWTH },
  { fr: 'Réponse prioritaire sous 4 h', en: 'Priority reply within 4h', cells: FROM_GROWTH },
  { fr: 'Un point stratégie chaque mois (retours par Loom)', en: 'A strategy review every month (Loom feedback)', cells: { starter: false, growth: false, scale: true } },
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
  { fr: 'Le live de Kevin chaque lundi à 14 h', en: 'Kevin’s live every Monday at 2 pm (Paris)', cells: FROM_GROWTH, group: 'bonus' },
  { fr: 'La communauté privée sur Slack', en: 'The private Slack community', cells: FROM_GROWTH, group: 'bonus' },
  { fr: 'La masterclass Empire en replay', en: 'The Empire masterclass replays', cells: FROM_GROWTH, group: 'bonus' },
]

// Un vrai reel de Kevin, publié sur son compte Instagram (fiche :
// `public/demo/kevin-leadmagnet-claude-20261023.json`), puis quatre formats
// Empire déjà montrés sur le site (`/formats`).
const KEVIN_REEL = {
  video: '/demo/kevin-leadmagnet-claude-20261023.mp4',
  poster: '/demo/kevin-leadmagnet-claude-20261023.jpg',
  permalink: 'https://www.instagram.com/reel/De1ncaACJuN/',
}

const FORMATS = [
  { image: '/formats/tierlist.webp', fr: 'Tier list', en: 'Tier list' },
  { image: '/formats/blur-reveal.webp', fr: 'Flou → net', en: 'Blur → reveal' },
  { image: '/formats/reaction.webp', fr: 'Réaction', en: 'Reaction' },
  { image: '/formats/faq.webp', fr: 'Fausse FAQ', en: 'Fake Q&A' },
]

const IN_EVERY_PLAN = [
  { fr: 'Des idées prêtes à filmer chaque semaine', en: 'Ready-to-film ideas every week' },
  { fr: 'Écriture, montage et sous-titres', en: 'Writing, editing and captions' },
  { fr: 'Chaque reel vérifié par l’équipe', en: 'Every reel checked by the team' },
  { fr: 'Publication sur 7 réseaux : LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook', en: 'Publishing to 7 networks: LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook' },
  { fr: 'Tu changes la répartition quand tu veux', en: 'You change the mix whenever you want' },
]

const NEXT_STEPS = [
  { fr: 'Tu crées ton compte, avec ton e-mail ou Google.', en: 'You create your account, with your email or Google.' },
  { fr: 'Tu ajoutes une carte ou un IBAN sur Stripe. 0 € aujourd’hui pour ta formule.', en: 'You add a card or an IBAN on Stripe. €0 today for your plan.' },
  { fr: `Ton essai démarre : 7 jours, ${TRIAL_CREDITS} crédits.`, en: `Your trial starts: 7 days, ${TRIAL_CREDITS} credits.` },
]

const TRIAL_RULES = [
  {
    fr: `Pendant 7 jours, tu as ${TRIAL_CREDITS} crédits : de quoi faire ${trialContents(true)}.`,
    en: `For 7 days, you have ${TRIAL_CREDITS} credits: enough for ${trialContents(false)}.`,
  },
  {
    fr: `Le 8ᵉ jour, ta formule démarre et le premier prélèvement part. Si tu dépasses les ${TRIAL_CREDITS} crédits avant, elle démarre à ce moment-là.`,
    en: `On day 8, your plan starts and the first charge is taken. If you go past ${TRIAL_CREDITS} credits before that, it starts at that moment.`,
  },
  {
    fr: 'Si tu annules avant le premier prélèvement, tu ne paies rien pour ta formule. Ça se fait depuis l’app.',
    en: 'If you cancel before the first charge, you pay nothing for your plan. You do it from the app.',
  },
  { fr: 'Tu peux changer de formule à tout moment.', en: 'You can change plan anytime.' },
]

const PROCESS = [
  {
    fr: ['Empire prépare l’idée et le format', 'Chaque semaine, Empire te propose des sujets et le format qui va avec.'],
    en: ['Empire prepares the idea and the format', 'Every week, Empire suggests topics and the format that goes with them.'],
  },
  {
    fr: ['Tu filmes ou tu dictes', '1 h par semaine, face caméra ou en vocal.'],
    en: ['You film or dictate', '1 hour a week, on camera or as a voice note.'],
  },
  {
    fr: ['L’équipe vérifie', 'L’équipe vérifie chaque reel monté avant de te l’envoyer.'],
    en: ['The team checks', 'The team checks every edited reel before sending it to you.'],
  },
  {
    fr: ['Tu valides, Empire publie', 'Rien n’est publié sans ton accord.'],
    en: ['You approve, Empire publishes', 'Nothing goes out without your approval.'],
  },
]

type FaqItem = { q: { fr: string; en: string }; a: { fr: string; en: string }; link?: { href: string; fr: string; en: string } }

const FAQ: FaqItem[] = [
  {
    q: { fr: 'Comment marche l’essai gratuit ?', en: 'How does the free trial work?' },
    a: {
      fr: `7 jours gratuits avec ${TRIAL_CREDITS} crédits : de quoi faire ${trialContents(true)}. Ta formule démarre le 8ᵉ jour, ou avant si tu dépasses les ${TRIAL_CREDITS} crédits. Si tu annules avant, tu ne paies rien pour ta formule.`,
      en: `7 days free with ${TRIAL_CREDITS} credits: enough for ${trialContents(false)}. Your plan starts on day 8, or earlier if you go past ${TRIAL_CREDITS} credits. If you cancel before that, you pay nothing for your plan.`,
    },
  },
  {
    q: { fr: 'Est-ce que je paie quelque chose pendant l’essai ?', en: 'Do I pay anything during the trial?' },
    a: {
      fr: `Rien n’est prélevé pour ta formule avant le 8ᵉ jour, sauf si tu dépasses les ${TRIAL_CREDITS} crédits. Tu peux aussi payer par prélèvement SEPA.`,
      en: `Nothing is charged for your plan before day 8, unless you go past ${TRIAL_CREDITS} credits. You can also pay by SEPA direct debit.`,
    },
  },
  {
    q: { fr: 'Comment j’arrête ?', en: 'How do I stop?' },
    a: {
      fr: 'Depuis la page Abonnement de l’app. Pendant l’essai, le bouton s’appelle « Annuler l’essai » et ta formule ne te coûte rien. Ensuite, en mensuel, tu arrêtes quand tu veux : l’arrêt prend effet à la fin de la période en cours. Pas d’engagement, pas de préavis.',
      en: 'From the Subscription page in the app. During the trial, the button is called “Cancel trial” and your plan costs you nothing. After that, on monthly, you stop whenever you want: it takes effect at the end of the current period. No commitment, no notice.',
    },
  },
  {
    q: { fr: 'Trimestriel ou annuel, c’est prélevé comment ?', en: 'How are quarterly and yearly billed?' },
    a: {
      fr: `En une fois pour la période : tous les 3 mois en trimestriel (10 jours offerts), une fois par an en annuel (2 mois offerts). Même essai qu’au mois : 7 jours et ${TRIAL_CREDITS} crédits offerts, le premier prélèvement part le 8ᵉ jour, ou avant si tu dépasses les ${TRIAL_CREDITS} crédits.`,
      en: `Once per period: every 3 months on quarterly (10 days free), once a year on yearly (2 months free). Same trial as monthly: 7 days and ${TRIAL_CREDITS} free credits, the first charge is taken on day 8, or earlier if you go past ${TRIAL_CREDITS} credits.`,
    },
  },
  {
    q: { fr: 'C’est quoi, les crédits ?', en: 'What are credits?' },
    a: {
      fr: `Les crédits servent à compter tes contenus : chaque contenu en utilise une partie, un reel monté plus qu’un post. Ta formule t’en donne chaque mois et tu les répartis comme tu veux. Ceux que tu n’utilises pas passent au mois suivant tant que ton abonnement est actif.`,
      en: `Credits count your content: each piece uses some, an edited reel more than a post. Your plan gives you credits every month and you split them as you like. Unused credits roll over to the next month while your subscription is active.`,
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
    q: { fr: 'Et si ça ne me ressemble pas ?', en: 'What if it doesn’t sound like me?' },
    a: {
      fr: 'Tout part de ce que tu dis : tes mots, tes exemples, tes expressions. Un post sonne faux ? Tu le refuses ou tu le modifies avant publication.',
      en: 'Everything starts from what you say: your words, your examples, your phrasing. A post sounds off? Reject or edit it before it goes out.',
    },
  },
  {
    q: { fr: 'Qui est GROWLAB LLC ?', en: 'Who is GROWLAB LLC?' },
    a: {
      fr: 'Empire Internet est édité par GROWLAB LLC, la société américaine de Kevin Dufraisse.',
      en: 'Empire Internet is published by GROWLAB LLC, Kevin Dufraisse’s US company.',
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
]

const LINK = 'underline decoration-white/30 underline-offset-4 hover:decoration-white'
const EYEBROW = 'text-[11px] font-semibold uppercase tracking-[0.18em] text-empire'
const H2 = 'text-[26px] font-bold leading-tight tracking-tight text-white [text-wrap:balance] md:text-4xl'
// Titre d'un bloc encadré (étapes, essai, « Dans toutes les formules »).
const H3 = 'text-[22px] font-bold leading-tight tracking-tight text-white [text-wrap:balance] md:text-2xl'
const SECTION = 'mt-20 md:mt-28'

function Cell({ value, fr }: { value: boolean | string; fr: boolean }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-empire" strokeWidth={2.5} aria-label={fr ? 'inclus' : 'included'} />
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-neutral-600" aria-label={fr ? 'non inclus' : 'not included'} />
  return <span className="text-sm font-semibold tabular-nums text-white">{value}</span>
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow?: string; title: ReactNode; intro?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className={`mb-3 ${EYEBROW}`}>{eyebrow}</p>}
      <h2 className={H2}>{title}</h2>
      {intro && <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-300 [text-wrap:pretty] md:text-base">{intro}</p>}
    </div>
  )
}

/** Le reel de Kevin : lu sans le son quand il est à l'écran, en pause sinon. */
function ReelVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      src={KEVIN_REEL.video}
      poster={KEVIN_REEL.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export default function TarifsClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const locale = fr ? 'fr-FR' : 'en-US'
  const pathname = usePathname()
  const [period, setPeriod] = useState<BillingId>('monthly')
  const [tab, setTab] = useState<Tab>('solo')
  const [chosenPlan, setChosenPlan] = useState<PlanId>('growth')
  const [tableOpen, setTableOpen] = useState(false)
  // Arrivé par le lien du live : prix du live sur les cartes (Growth, Scale).
  const liveOffer = useLiveOffer()
  const live = liveOffer.live
  const [liveEmail, setLiveEmail] = useState('')
  useEffect(() => {
    if (!live) return
    setPeriod('monthly')
    setChosenPlan('scale')
  }, [live])

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
    window.scrollTo({ top: 0 })
  }

  const cart = useTrialCart(chosenPlan, period, live)
  const solo = tab === 'solo'
  const trial = solo && !cart.liveDeal
  const tr = (f: string, e: string) => (fr ? rich(nbsp(f)) : e)

  const growth = PLANS.find((p) => p.id === 'growth')!
  const growthTeam = teamMix('growth')
  const teamLines = [
    { fr: `Un monteur : ${growthTeam.reels} reels × ${FREELANCE_FLOOR.reel} €`, en: `An editor: ${growthTeam.reels} reels × €${FREELANCE_FLOOR.reel}`, euros: growthTeam.reels * FREELANCE_FLOOR.reel },
    { fr: `Un rédacteur : ${growthTeam.posts} posts × ${FREELANCE_FLOOR.post} €`, en: `A writer: ${growthTeam.posts} posts × €${FREELANCE_FLOOR.post}`, euros: growthTeam.posts * FREELANCE_FLOOR.post },
    { fr: 'Un community manager : publication, commentaires, DM', en: 'A community manager: publishing, comments, DMs', euros: FREELANCE_FLOOR.communityManager },
  ]
  const teamTotal = teamLines.reduce((sum, l) => sum + l.euros, 0)
  const h1 = fr ? 'Publie tous les jours, sans écrire ni monter' : 'Post every day, without writing or editing'
  const loginHref = `https://app.empire-internet.com/login${fr ? '?lang=fr' : ''}`

  return (
    <main className={`min-h-screen overflow-x-hidden text-white ${solo ? 'pb-28 lg:pb-10' : 'pb-10'} ${glass.page}`}>
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a href="/" className="flex min-h-11 items-center gap-2.5">
            <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-lg bg-empire text-[15px] font-black leading-none text-black">E</span>
            <span className="text-base font-bold tracking-tight text-white">Empire Internet</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href={loginHref}
              onClick={() => trackAmplitude('header_login_clicked', { path: pathname })}
              className="flex min-h-11 items-center px-1 text-sm font-medium text-neutral-300 hover:text-white"
            >
              {fr ? 'Se connecter' : 'Log in'}
            </a>
            {/* Ordinateur : les cartes remplissent le premier écran et le bouton
                d'essai est dessous ; celui-ci le garde visible dès l'arrivée
                (même bouton et même événement que l'en-tête du site). Sur
                téléphone, le bouton est déjà dans la carte, sous le prix. */}
            {solo && !cart.liveDeal && (
              <button
                type="button"
                onClick={() => { trackAmplitude('header_trial_clicked', { path: pathname }); cart.checkout() }}
                disabled={cart.opening}
                className="hidden cursor-pointer rounded-lg bg-empire px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60 lg:inline-flex"
              >
                {cart.opening ? (fr ? 'Ouverture…' : 'Opening…') : (fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <header className="mx-auto max-w-2xl pt-6 text-center md:pt-14">
          <h1 className="text-[30px] font-bold leading-[1.12] tracking-tight text-white [text-wrap:balance] md:text-5xl md:leading-[1.08]">{h1}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-300 [text-wrap:pretty] md:text-lg">
            {tr(
              'Tu filmes ou tu dictes 1 h par semaine. Empire prépare les idées, écrit, monte et publie sur tes réseaux.',
              'You film or dictate 1 hour a week. Empire prepares the ideas, writes, edits and publishes to your networks.',
            )}
          </p>
          <p className="mx-auto mt-5 flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pl-2.5 pr-4 text-left text-[13px] leading-snug text-neutral-300 md:max-w-lg">
            <Image src="/founders/kevin.jpg" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/20" />
            <span>
              {tr(
                'La méthode de Kevin Dufraisse, classé n° 1 en France par Favikon, catégorie growth et lead gen sur LinkedIn (février 2025).',
                'The method of Kevin Dufraisse, ranked #1 in France by Favikon, growth and lead gen category on LinkedIn (February 2025).',
              )}
            </span>
          </p>
        </header>

        {liveOffer.status === 'need_email' && (
          <form
            className={`mx-auto mt-6 flex max-w-xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center ${glass.panel} ${glass.compact}`}
            onSubmit={(e) => { e.preventDefault(); liveOffer.check(liveEmail) }}
          >
            <p className="flex-1 text-sm text-neutral-200">{fr ? 'Ton email pour voir ton prix du live' : 'Your email to see your live price'}</p>
            <input
              type="email"
              required
              value={liveEmail}
              onChange={(e) => setLiveEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="min-h-11 rounded-lg border border-white/20 bg-black/40 px-3 text-base text-white placeholder:text-neutral-500 sm:text-sm"
            />
            <button type="submit" className={`min-h-11 cursor-pointer px-4 text-sm font-semibold ${glass.primaryButton}`}>
              {fr ? 'Voir' : 'See'}
            </button>
          </form>
        )}
        {liveOffer.status === 'need_email' && liveOffer.error && (
          <p className="mt-2 text-center text-xs text-neutral-300">{fr ? 'Cet email n’a pas l’air valide.' : 'This email does not look valid.'}</p>
        )}

        {solo ? (
          <>
            <section className="mx-auto mt-6 max-w-5xl md:mt-12" aria-label={fr ? 'Formules' : 'Plans'}>
              <PlanCards location="cards" period={period} onPeriodChange={setPeriod} chosen={chosenPlan} onChoose={setChosenPlan} live={live} cta={<CardTrialButton cart={cart} />} />
              <TrialCta cart={cart} withTrialLine withCall className="mx-auto mt-6 max-w-md md:mt-8" />
            </section>

            <PressRow title={fr ? 'Mis en avant par' : 'Featured by'} className="mt-12 md:mt-16" />

            <section className={SECTION}>
              <SectionTitle title={fr ? 'Un exemple de ce que tu reçois' : 'An example of what you get'} />
              <div className={`-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-auto md:grid md:max-w-5xl md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0 ${glass.noScrollbar}`}>
                <figure className="w-[58%] max-w-[230px] shrink-0 snap-start md:w-auto md:max-w-none">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-empire/60 bg-neutral-900">
                    <ReelVideo label={fr ? 'Reel de Kevin Dufraisse publié sur Instagram' : 'Kevin Dufraisse’s reel published on Instagram'} />
                  </div>
                  <figcaption className="mt-3">
                    <p className="text-sm font-semibold text-white">{fr ? 'Un reel de Kevin' : 'One of Kevin’s reels'}</p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                      {tr(
                        'Publié sur son compte Instagram le 23 octobre 2026. Extrait de 20 s, sans le son.',
                        'Published on his Instagram account on October 23, 2026. 20-second excerpt, no sound.',
                      )}
                    </p>
                    <a href={KEVIN_REEL.permalink} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-white ${LINK}`}>
                      {fr ? 'Voir sur Instagram' : 'See it on Instagram'}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </figcaption>
                </figure>
                {FORMATS.map((f) => (
                  <figure key={f.image} className="w-[58%] max-w-[230px] shrink-0 snap-start md:w-auto md:max-w-none">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                      <Image src={f.image} alt={fr ? f.fr : f.en} fill sizes="(min-width: 768px) 20vw, 250px" className="object-cover" />
                    </div>
                    <figcaption className="mt-3">
                      <p className="text-sm font-semibold text-white">{fr ? f.fr : f.en}</p>
                      <p className="mt-1 text-xs text-neutral-400">{fr ? 'Format de reel Empire' : 'Empire reel format'}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className={`mx-auto mt-12 max-w-5xl p-5 sm:p-7 ${glass.panel}`}>
                <h3 className={H3}>{fr ? 'Dans toutes les formules' : 'In every plan'}</h3>
                <ul className="mt-6 grid gap-x-8 gap-y-3.5 md:grid-cols-2">
                  {IN_EVERY_PLAN.map((l) => (
                    <li key={l.fr} className="flex items-start gap-3 text-[15px] leading-snug text-neutral-200">
                      <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-empire" strokeWidth={2.5} />
                      <span>{tr(l.fr, l.en)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {trial && (
              <section className="mx-auto mt-6 grid max-w-5xl gap-6 md:grid-cols-2">
                <div className={`p-5 sm:p-7 ${glass.panel}`}>
                  <p className={EYEBROW}>{fr ? nbsp('3 étapes') : '3 steps'}</p>
                  <h3 className={`mt-2 ${H3}`}>{fr ? 'Ce qui se passe ensuite' : 'What happens next'}</h3>
                  <ol className="mt-6 space-y-5">
                    {NEXT_STEPS.map((s, i) => (
                      <li key={s.fr} className="flex items-start gap-3.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-empire text-sm font-bold text-black">{i + 1}</span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[15px] leading-snug text-neutral-100">{tr(s.fr, s.en)}</p>
                          {i === 1 && (
                            <p className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2 py-1">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/integrations/stripe.svg" alt="" className="h-3 w-3" />
                                Stripe
                              </span>
                              <span className="rounded-md border border-white/15 bg-white/[0.04] px-2 py-1">{fr ? 'Carte' : 'Card'}</span>
                              <span className="rounded-md border border-white/15 bg-white/[0.04] px-2 py-1">IBAN (SEPA)</span>
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className={`p-5 sm:p-7 ${glass.panel}`}>
                  <p className={EYEBROW}>{fr ? nbsp(`7 jours, ${TRIAL_CREDITS} crédits`) : `7 days, ${TRIAL_CREDITS} credits`}</p>
                  <h3 className={`mt-2 ${H3}`}>{fr ? 'Comment marche l’essai' : 'How the trial works'}</h3>
                  <ul className="mt-6 space-y-4">
                    {TRIAL_RULES.map((r) => (
                      <li key={r.fr} className="flex items-start gap-3 text-[15px] leading-snug text-neutral-200">
                        <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-empire" strokeWidth={2.5} />
                        <span>{tr(r.fr, r.en)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section className={SECTION}>
              <SectionTitle title={fr ? 'Ce que tu fais, ce que fait Empire' : 'What you do, what Empire does'} />
              <ol className="mx-auto mt-8 grid max-w-5xl gap-3 md:grid-cols-4 md:gap-4">
                {PROCESS.map((step, i) => {
                  const [title, desc] = fr ? step.fr : step.en
                  return (
                    <li key={step.fr[0]} className={`flex items-start gap-4 p-5 md:flex-col md:gap-4 md:p-6 ${glass.panel}`}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-empire/70 text-sm font-bold text-empire">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-base font-semibold leading-snug text-white">{title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{fr ? nbsp(desc) : desc}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-6 text-center text-sm">
                <a href="/formats" className={`inline-flex min-h-11 items-center gap-1.5 font-semibold text-white ${LINK}`}>
                  {fr ? 'Voir tous les formats' : 'See every format'}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </p>
            </section>

            <section className={`scroll-mt-6 ${SECTION}`} id="recapitulatif">
              <SectionTitle title={fr ? 'Récapitulatif' : 'Summary'} />
              <div className="mx-auto mt-8 max-w-5xl">
                <OptionsPanel cart={cart} />
              </div>
            </section>
          </>
        ) : (
          <section className="mt-8 md:mt-12" aria-label={fr ? 'Équipe et agence' : 'Team and agency'}>
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">{fr ? 'Équipe et agence' : 'Team and agency'}</h2>
              <button type="button" onClick={() => openTab('solo')} className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-semibold text-neutral-200 ${LINK}`}>
                <ArrowLeft className="h-4 w-4" />
                {fr ? 'Voir les formules solo' : 'See solo plans'}
              </button>
            </div>
            <TeamCards period={period} onPeriodChange={setPeriod} />
            <PressRow title={fr ? 'Mis en avant par' : 'Featured by'} className="mt-12" />
          </section>
        )}

        <div className={SECTION}>
          <CustomerReviews title={fr ? 'Ils publient avec Empire' : 'They publish with Empire'} />
        </div>

        <section className={`mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12 ${SECTION}`}>
          <a
            href={FAVIKON_RANKING}
            target="_blank"
            rel="noreferrer"
            aria-label={fr ? 'Voir le classement Favikon de Kevin Dufraisse' : 'See Kevin Dufraisse’s Favikon ranking'}
            className="order-2 mx-auto block w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 md:order-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TOP50_SCREENSHOT} alt={fr ? 'Classement Favikon : Kevin Dufraisse n° 1 Growth & Lead Gen France' : 'Favikon ranking: Kevin Dufraisse #1 Growth & Lead Gen France'} width={318} height={383} loading="lazy" className="block aspect-[318/383] h-auto w-full bg-neutral-900 object-cover" />
          </a>
          <div className="order-1 text-center md:order-2 md:text-left">
            <p className={EYEBROW}>{fr ? 'D’où vient la méthode' : 'Where the method comes from'}</p>
            <h2 className={`mt-3 ${H2}`}>
              {fr ? 'Les formats d’Empire tournent d’abord sur mes comptes.' : 'Empire’s formats run on my own accounts first.'}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300 [text-wrap:pretty] md:text-base">
              {tr(
                'Favikon m’a classé n° 1 des créateurs LinkedIn growth et lead gen en France. Aujourd’hui mes comptes font 10 millions de vues par mois. Empire, c’est ce système : les formats, la production et la diffusion que j’utilise, mis à ta disposition.',
                'Favikon ranked me #1 growth and lead gen creator on LinkedIn in France. Today my accounts get 10 million views a month. Empire is that system: the formats, production and distribution I use, made available to you.',
              )}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-left md:justify-start">
              <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20" />
              <div>
                <p className="text-sm font-semibold text-white">Kevin Dufraisse</p>
                <p className="text-xs text-neutral-400">{fr ? 'Fondateur d’Empire' : 'Founder of Empire'}</p>
              </div>
            </div>
            <a href={FAVIKON_RANKING} target="_blank" rel="noreferrer" className={`mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white ${LINK}`}>
              {fr ? 'Voir le classement' : 'See the ranking'}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className={SECTION}>
          <SectionTitle
            title={fr ? (
              <>
                <span className="block">{nbsp(`Freelances : à partir de ${teamTotal.toLocaleString(locale)} €/mois.`)}</span>
                <span className="block text-empire">{nbsp(`Empire Growth : ${growth.price} €/mois.`)}</span>
              </>
            ) : (
              <>
                <span className="block">{`Freelancers: from €${teamTotal.toLocaleString(locale)}/mo.`}</span>
                <span className="block text-empire">{`Empire Growth: €${growth.price}/mo.`}</span>
              </>
            )}
            intro={fr
              ? 'Pour le volume de Growth, la moitié des crédits en reels et l’autre en posts, aux tarifs freelance publiés en 2026.'
              : 'For the Growth volume, half the credits as reels and half as posts, at 2026 published freelance rates.'}
          />
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className={`p-5 sm:p-7 ${glass.panel}`}>
              <p className="text-sm font-semibold text-neutral-300">{fr ? 'Une équipe en freelance' : 'A freelance team'}</p>
              <ul className="mt-4 divide-y divide-white/10">
                {teamLines.map((l) => (
                  <li key={l.fr} className="flex items-baseline justify-between gap-4 py-3 text-sm text-neutral-300">
                    <span>{fr ? nbsp(l.fr) : l.en}</span>
                    <span className="shrink-0 tabular-nums text-neutral-100">{fr ? `${l.euros.toLocaleString(locale)} €` : `€${l.euros.toLocaleString(locale)}`}</span>
                  </li>
                ))}
              </ul>
              <p className="flex items-baseline justify-between border-t border-white/10 pt-4 text-base font-bold">
                <span>{fr ? 'À partir de' : 'From'}</span>
                <span className="tabular-nums">{fr ? `${teamTotal.toLocaleString(locale)} €/mois` : `€${teamTotal.toLocaleString(locale)}/mo`}</span>
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-400">
                {fr
                  ? 'Et c’est toi qui trouves les sujets, briefes chacun et coordonnes.'
                  : 'And you still find the topics, brief everyone and coordinate.'}
              </p>
            </div>
            <div className={`flex flex-col p-5 sm:p-7 ${glass.panel} ${glass.featured}`}>
              <p className="text-sm font-semibold text-empire">Empire Growth</p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-[2.75rem] font-bold leading-none tracking-tight tabular-nums">{fr ? `${growth.price} €` : `€${growth.price}`}</span>
                <span className="text-sm text-neutral-300">{fr ? '/mois' : '/mo'}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                {fr
                  ? 'Les idées, les formats, l’écriture, le montage, la vérification de chaque reel et la publication, plus l’appel de démarrage en 1-1, le live, le Slack et la masterclass Empire.'
                  : 'Ideas, formats, writing, editing, every reel checked and publishing, plus the 1-1 kickoff call, the live, the Slack and the Empire masterclass.'}
              </p>
            </div>
          </div>
          <div className="mx-auto mt-5 max-w-5xl text-center text-xs leading-relaxed text-neutral-500">
            <p className="[text-wrap:pretty]">
              {fr
                ? nbsp('Reel monté : 50 à 120 € ; post LinkedIn : 50 à 250 € ; community manager qui gère aussi la vidéo : 1 500 à 2 500 €/mois.')
                : 'Edited reel: €50 to €120; LinkedIn post: €50 to €250; community manager who also handles video: €1,500 to €2,500/mo.'}
            </p>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-1">
              <span>{fr ? nbsp('Sources :') : 'Sources:'}</span>
              {FREELANCE_SOURCES.map((src) => (
                <a key={src.href} href={src.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-1.5 text-neutral-400 underline decoration-white/20 underline-offset-2 hover:text-white">{src.label}</a>
              ))}
            </p>
          </div>
        </section>

        <section className={SECTION}>
          <SectionTitle
            title={fr ? 'Comparer les formules' : 'Compare plans'}
            intro={fr
              ? nbsp('Tu peux tout faire toi-même. Écrire un texte ou couper une vidéo, ça va vite. Savoir quoi dire, dans quel format, et tenir le rythme : c’est ça qui prend du temps.')
              : 'You can do it all yourself. Writing a text or cutting a video is quick. Knowing what to say, in which format, and keeping the pace: that is what takes time.'}
          />
          <div className="mx-auto mt-8 max-w-5xl">
            <button
              type="button"
              aria-expanded={tableOpen}
              aria-controls="tarifs-comparatif"
              onClick={() => setTableOpen((v) => !v)}
              className={`flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-3 px-5 text-left text-[15px] font-semibold text-white md:hidden ${glass.panel} ${glass.compact}`}
            >
              {tableOpen ? (fr ? 'Masquer le détail des formules' : 'Hide plan details') : (fr ? 'Voir le détail des formules' : 'See plan details')}
              <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-300 transition-transform ${tableOpen ? 'rotate-180' : ''}`} />
            </button>
            <div id="tarifs-comparatif" className={`overflow-hidden ${glass.panel} ${tableOpen ? 'mt-3 block' : 'hidden'} md:mt-0 md:block`}>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className={`border-b border-white/10 ${glass.tableBand}`}>
                    <th className="px-3 py-4 text-xs font-medium text-neutral-300 sm:px-5 sm:text-sm">{fr ? 'Chaque mois' : 'Every month'}</th>
                    {PLANS.map((p) => (
                      <th key={p.id} className={`w-[19%] px-0.5 py-4 text-center text-[11px] font-semibold sm:w-[20%] sm:px-3 sm:text-sm ${p.id === 'growth' ? glass.comparisonColumn : ''}`}>
                        {PLAN_LABELS[p.id][fr ? 'fr' : 'en']}
                        <span className="block whitespace-nowrap text-[11px] font-normal tabular-nums text-neutral-300 sm:text-xs">
                          {fr ? `${finalPrice(p.price, period, 1)} €/mois` : `€${finalPrice(p.price, period, 1)}/mo`}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, i) => (
                    <Fragment key={row.fr}>
                      {row.group && row.group !== ROWS[i - 1]?.group && (
                        <tr className={`border-b border-white/10 ${glass.tableBand}`}>
                          <td colSpan={4} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-300 sm:px-5">{GROUP_LABELS[row.group][fr ? 'fr' : 'en']}</td>
                        </tr>
                      )}
                      <tr className="border-b border-white/10 last:border-0">
                        <td className="px-3 py-3 text-xs leading-snug text-neutral-300 sm:px-5 sm:py-3.5 sm:text-sm">{fr ? nbsp(row.fr) : row.en}</td>
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
            {solo && (
              <p className="mt-5 text-center text-sm text-neutral-400">
                {fr ? nbsp('Pour une équipe ou une agence : ') : 'For a team or an agency: '}
                <button type="button" onClick={() => openTab('team')} className={`cursor-pointer py-3 font-semibold text-white ${LINK}`}>
                  {fr ? 'voir les tarifs équipe' : 'see team pricing'}
                </button>
              </p>
            )}
          </div>
        </section>

        <section className={`mx-auto max-w-2xl ${SECTION}`}>
          <h2 className={`text-center ${H2}`}>{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
          <div className="mt-8 space-y-2.5">
            {FAQ.map((item) => (
              <details key={item.q.fr} className={`group ${glass.panel} ${glass.compact}`}>
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 text-[15px] font-semibold leading-snug text-white [&::-webkit-details-marker]:hidden">
                  {fr ? nbsp(item.q.fr) : item.q.en}
                  <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-neutral-300">
                  {tr(item.a.fr, item.a.en)}
                  {item.link && (
                    <a href={item.link.href} className={`mt-1 flex min-h-11 w-fit items-center font-semibold text-white ${LINK}`}>
                      {fr ? item.link.fr : item.link.en}
                    </a>
                  )}
                </p>
              </details>
            ))}
          </div>
        </section>

        {solo && (
          <section className={`mx-auto max-w-2xl px-5 py-8 text-center sm:px-10 sm:py-12 ${glass.panel} ${glass.featured} ${glass.plan} ${SECTION}`}>
            <h2 className={H2}>{h1}</h2>
            <p className="mt-3 text-[15px] text-neutral-300">
              {PLAN_LABELS[chosenPlan][fr ? 'fr' : 'en']}
              {' · '}
              <span className="tabular-nums">{fr ? `${cart.perMonth} €/mois` : `€${cart.perMonth}/mo`}</span>
              {cart.liveDeal ? (fr ? ' · offre du live' : ' · live offer') : ''}
            </p>
            <TrialCta cart={cart} withCall className="mx-auto mt-6 max-w-md" />
          </section>
        )}

        <p className="mt-12 text-center text-sm leading-relaxed text-neutral-400">
          <span className="block [text-wrap:balance]">{fr ? nbsp('Tu accompagnes des clients (freelance, consultant, agence) ?') : 'You coach clients (freelancer, consultant, agency)?'}</span>
          <a
            href="/academy"
            onClick={() => trackAmplitude('pricing_page_partner_clicked')}
            className={`inline-flex min-h-11 items-center whitespace-nowrap font-semibold text-neutral-200 ${LINK}`}
          >
            {fr ? 'Le programme partenaire' : 'The partner program'}
            <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </a>
        </p>
      </div>

      <footer className="mt-14 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <a href="/" className="flex min-h-11 items-center gap-2.5 self-start">
              <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-lg bg-empire text-[15px] font-black leading-none text-black">E</span>
              <span className="text-base font-bold tracking-tight text-white">Empire Internet</span>
            </a>
            <nav aria-label={fr ? 'Pied de page' : 'Footer'} className="flex flex-col gap-x-6 md:flex-row md:flex-wrap md:items-center">
              <a href="mailto:kevin@empire-internet.com" className="flex min-h-11 items-center hover:text-white">kevin@empire-internet.com</a>
              <a href="/terms" className="flex min-h-11 items-center hover:text-white">{fr ? 'Conditions d’utilisation' : 'Terms of use'}</a>
              <a href="/privacy" className="flex min-h-11 items-center hover:text-white">{fr ? 'Confidentialité' : 'Privacy'}</a>
              <a href={postitJoinUrl('footer')} className="flex min-h-11 items-center hover:text-white">{fr ? nbsp('Live gratuit le lundi à 14 h') : 'Free live every Monday at 2pm (Paris)'}</a>
            </nav>
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-neutral-500">
            {fr
              ? 'Empire Internet est édité par GROWLAB LLC, la société américaine de Kevin Dufraisse.'
              : 'Empire Internet is published by GROWLAB LLC, Kevin Dufraisse’s US company.'}
          </p>
        </div>
      </footer>

      {/* Dernier dans la page : la barre du bas, avec le même bouton d'essai. */}
      {solo && <StickyTrialBar cart={cart} />}
    </main>
  )
}
