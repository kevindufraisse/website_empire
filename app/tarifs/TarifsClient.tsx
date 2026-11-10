'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarCheck, ChevronDown, ShieldCheck, Undo2, Wallet } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import CustomerReviews from '@/components/pricing/CustomerReviews'
import PlanCards from '@/components/pricing/PlanCards'
import TeamCards from '@/components/pricing/TeamCards'
import OptionsPanel from '@/components/pricing/OptionsPanel'
import OfferReceipt from '@/components/pricing/OfferReceipt'
import OfferBonuses from '@/components/pricing/OfferBonuses'
import OfferVersus from '@/components/pricing/OfferVersus'
import PressRow from '@/components/pricing/PressRow'
import StickyTrialBar from '@/components/pricing/StickyTrialBar'
import TrialCta, { CallLink, CardTrialButton, trialContents } from '@/components/pricing/TrialCta'
import { useTrialCart } from '@/components/pricing/useTrialCart'
import { nbsp, rich } from '@/components/pricing/typo'
import glass from '@/components/pricing/pricing.module.css'
import { PLAN_LABELS, type BillingId, type PlanId } from '@/lib/plans'
import { TRIAL_CREDITS } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { useLiveOffer } from '@/lib/liveOffer'
import { postitJoinUrl } from '@/lib/postit'

/**
 * Page tarifs du site, en offre « Grand Slam » (novembre 2026). Dans l'ordre,
 * sur téléphone : le titre, le choix de la formule et de la période, la carte
 * de la formule (prix, bande « Chez des freelances », bouton d'essai) ; la
 * méthode Empire (les chiffres de la page d'accueil, Favikon, la vérification
 * des reels) ; le reçu de la formule choisie ; les bonus ; l'essai sans
 * risque ; « Empire contre… » ; le récapitulatif avec les options (bootcamp,
 * expert) ; les avis ; la presse ; ce qui se passe après le bouton ; la FAQ ;
 * un dernier bouton, le lien équipe et le pied de page.
 *
 * Un seul chiffre freelance partout (`freelanceMonthly`, `lib/plans.ts`) :
 * reels, posts, miniatures, community manager et outils, au prix moyen d'un
 * freelance (mode « moyen » ; « bas » en un mot dans `FREELANCE_MODE`).
 * Prix et remises : `lib/plans.ts`, les mêmes que `/join/empire`. Chaque
 * bouton d'essai passe par `useTrialCart` (mêmes adresses et mêmes événements
 * qu'avant). L'offre du live (`?offer=live`) garde ses textes et son paiement.
 * Les tarifs Équipe et agence restent sur `/tarifs#equipe`.
 */

// Le haut de page, au même endroit pour pouvoir essayer d'autres titres
// (revue de Kevin, 10 novembre 2026). Le titre reprend la promesse déjà
// publiée sur le site ; la ligne de preuve, les chiffres de la page d'accueil.
const HERO_COPY = {
  eyebrow: { fr: 'La machine à contenu Empire', en: 'The Empire content machine' },
  title: { fr: 'Sois vu, choisi et recommandé grâce à ton contenu.', en: 'Get seen, chosen and recommended through your content.' },
  sub: {
    fr: 'Tu filmes 1 h par semaine. Empire trouve les idées, écrit, monte et publie tous les jours sur 7 réseaux.',
    en: 'You film 1 hour a week. Empire finds the ideas, writes, edits and publishes every day on 7 networks.',
  },
  proof: {
    fr: ['La méthode testée sur 10 000+ posts', '10M de vues par mois'],
    en: ['The method tested on 10,000+ posts', '10M views a month'],
  },
}

type Tab = 'solo' | 'team'

// L'ancre garde la vue dans l'adresse (#equipe), comme Claude.
const TABS: { id: Tab; hash: string; fr: string; en: string }[] = [
  { id: 'solo', hash: 'solo', fr: 'Solo', en: 'Solo' },
  { id: 'team', hash: 'equipe', fr: 'Équipe et agence', en: 'Team and agency' },
]

const FAVIKON_RANKING = '/community/kevin-favikon.webp'

// Mot pour mot les chiffres du haut de la page d'accueil (`HeroSection`).
const PROOF = {
  fr: [['1 an', 'de R&D'], ['10 000+', 'posts testés'], ['10M', 'de vues par mois']],
  en: [['1 year', 'of R&D'], ['10,000+', 'posts tested'], ['10M', 'views a month']],
}

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

const NEXT_STEPS = [
  { fr: 'Tu crées ton compte, avec ton e-mail ou Google.', en: 'You create your account, with your email or Google.' },
  { fr: 'Tu ajoutes une carte ou un IBAN sur Stripe. 0 € aujourd’hui pour ta formule.', en: 'You add a card or an IBAN on Stripe. €0 today for your plan.' },
  { fr: `Ton essai démarre : 7 jours, ${TRIAL_CREDITS} crédits.`, en: `Your trial starts: 7 days, ${TRIAL_CREDITS} credits.` },
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
// Titre d'un bloc encadré (essai, étapes).
const H3 = 'text-[22px] font-bold leading-tight tracking-tight text-white [text-wrap:balance] md:text-2xl'
const SECTION = 'mt-16 md:mt-24'

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
  const pathname = usePathname()
  const [period, setPeriod] = useState<BillingId>('monthly')
  const [tab, setTab] = useState<Tab>('solo')
  const [chosenPlan, setChosenPlan] = useState<PlanId>('growth')
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
  const chooseFromReceipt = (plan: PlanId) => {
    setChosenPlan(plan)
    trackAmplitude('pricing_page_plan_chosen', { plan, billing_period: period, location: 'receipt' })
  }

  const h1 = fr ? nbsp(HERO_COPY.title.fr) : HERO_COPY.title.en
  const loginHref = `https://app.empire-internet.com/login${fr ? '?lang=fr' : ''}`

  const trialSafe = [
    {
      icon: Wallet,
      title: cart.bootcamp ? (fr ? '0 € aujourd’hui pour ta formule' : '€0 today for your plan') : (fr ? '0 € aujourd’hui' : '€0 today'),
      body: cart.bootcamp
        ? (fr ? `Seul le Bootcamp est payé aujourd’hui. L’essai : 7 jours et ${TRIAL_CREDITS} crédits.` : `Only the bootcamp is paid today. The trial: 7 days and ${TRIAL_CREDITS} credits.`)
        : (fr ? `7 jours et ${TRIAL_CREDITS} crédits pour tester : de quoi faire ${trialContents(true)}.` : `7 days and ${TRIAL_CREDITS} credits to test: enough for ${trialContents(false)}.`),
    },
    {
      icon: CalendarCheck,
      title: fr ? 'Aucun prélèvement avant le 8ᵉ jour' : 'No charge before day 8',
      body: fr ? `Ou avant, si tu dépasses les ${TRIAL_CREDITS} crédits de l’essai.` : `Or earlier, if you go past the ${TRIAL_CREDITS} trial credits.`,
    },
    {
      icon: Undo2,
      title: fr ? 'Tu annules depuis l’app en quelques clics' : 'You cancel from the app in a few clicks',
      body: fr ? 'Avant le premier prélèvement, ta formule ne te coûte rien.' : 'Before the first charge, your plan costs you nothing.',
    },
  ]

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
            {/* Ordinateur : le bouton d'essai reste visible dans l'en-tête (même
                bouton et même événement que l'en-tête du site). Sur téléphone,
                il est dans la carte, sous le prix. */}
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
        <header className="mx-auto max-w-3xl pt-6 text-center md:pt-14">
          <p className={EYEBROW}>{fr ? HERO_COPY.eyebrow.fr : HERO_COPY.eyebrow.en}</p>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.12] tracking-tight text-white [text-wrap:balance] md:text-5xl md:leading-[1.08]">{h1}</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-normal text-neutral-300 [text-wrap:pretty] md:mt-4 md:text-lg md:leading-relaxed">
            {fr ? nbsp(HERO_COPY.sub.fr) : HERO_COPY.sub.en}
          </p>
          {/* Une seule ligne de preuve ; le détail est plus bas (« Tu ne pars pas de zéro »). */}
          <p className="mt-2.5 text-[13px] leading-snug text-neutral-400 md:mt-3">
            {HERO_COPY.proof[fr ? 'fr' : 'en'].map((part, i) => (
              <span key={part}>
                {i > 0 && <><br className="sm:hidden" /><span aria-hidden className="hidden text-neutral-600 sm:inline">{' · '}</span></>}
                <span className="whitespace-nowrap">{fr ? nbsp(part) : part}</span>
              </span>
            ))}
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
            {/* 1. Le choix de la formule et sa carte. */}
            <section className="mx-auto mt-5 max-w-5xl md:mt-10 lg:max-w-6xl" aria-label={fr ? 'Formules' : 'Plans'}>
              <PlanCards location="cards" period={period} onPeriodChange={setPeriod} chosen={chosenPlan} onChoose={setChosenPlan} live={live} cta={<CardTrialButton cart={cart} />} />
              <CallLink className="mt-4 md:mt-6" />
            </section>

            {/* 2. La méthode : d'où viennent les formats. */}
            <section className={SECTION} aria-labelledby="methode-titre">
              <div className="mx-auto max-w-2xl text-center">
                <p className={`mb-3 ${EYEBROW}`}>{fr ? 'La méthode Empire' : 'The Empire method'}</p>
                <h2 id="methode-titre" className={H2}>{fr ? 'Tu ne pars pas de zéro.' : 'You don’t start from scratch.'}</h2>
                <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-300 md:text-base">
                  {fr ? 'Empire te donne les formats qui marchent déjà.' : 'Empire gives you the formats that already work.'}
                </p>
              </div>

              <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4">
                {PROOF[fr ? 'fr' : 'en'].map(([big, small]) => (
                  <li key={big} className={`px-1 py-4 text-center sm:py-5 ${glass.panel} ${glass.compact}`}>
                    <span className="block text-[22px] font-bold leading-none tracking-tight text-white tabular-nums sm:text-3xl">{fr ? nbsp(big) : big}</span>
                    <span className="mt-1.5 block text-[11.5px] leading-snug text-neutral-400 sm:text-sm">{small}</span>
                  </li>
                ))}
              </ul>

              <div className={`-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 md:mx-auto md:mt-6 md:grid md:max-w-3xl md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0 ${glass.noScrollbar}`}>
                <figure className="w-[31%] min-w-[104px] shrink-0 snap-start md:w-auto md:min-w-0">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-empire/60 bg-neutral-900">
                    <ReelVideo label={fr ? 'Reel de Kevin Dufraisse publié sur Instagram' : 'Kevin Dufraisse’s reel published on Instagram'} />
                  </div>
                  <figcaption className="mt-2">
                    <a href={KEVIN_REEL.permalink} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[12px] font-semibold text-white ${LINK}`}>
                      {fr ? 'Un reel de Kevin' : 'One of Kevin’s reels'}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </figcaption>
                </figure>
                {FORMATS.map((f) => (
                  <figure key={f.image} className="w-[31%] min-w-[104px] shrink-0 snap-start md:w-auto md:min-w-0">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                      <Image src={f.image} alt={fr ? f.fr : f.en} fill sizes="(min-width: 768px) 150px, 130px" className="object-cover" />
                    </div>
                    <figcaption className="mt-2 text-[12px] font-semibold text-neutral-300">{fr ? f.fr : f.en}</figcaption>
                  </figure>
                ))}
              </div>

              <div className={`mx-auto mt-4 max-w-3xl divide-y divide-white/10 md:mt-6 ${glass.panel}`}>
                <div className="flex items-center gap-3.5 p-4 sm:p-5">
                  <Image src="/founders/kevin.jpg" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/20" />
                  <p className="text-[14px] leading-snug text-neutral-200">
                    {tr(
                      'La méthode de Kevin Dufraisse : n° 1 en France en growth et lead gen, et 55ᵉ créateur LinkedIn en France (Favikon, février 2025).',
                      'The method of Kevin Dufraisse: #1 in France for growth and lead gen, and #55 LinkedIn creator in France (Favikon, February 2025).',
                    )}{' '}
                    <a href={FAVIKON_RANKING} target="_blank" rel="noreferrer" className={`whitespace-nowrap font-semibold text-white ${LINK}`}>
                      {fr ? 'Voir le classement' : 'See the ranking'}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-3.5 p-4 sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-empire/40 bg-empire/10">
                    <ShieldCheck className="h-5 w-5 text-empire" />
                  </span>
                  <p className="text-[14px] leading-snug text-neutral-200">{fr ? nbsp('Chaque reel est vérifié par l’équipe avant publication.') : 'Every reel is checked by the team before it goes out.'}</p>
                </div>
              </div>
            </section>

            {/* 3. Le reçu de la formule choisie. */}
            <section id="recu" className={`scroll-mt-6 ${SECTION}`}>
              <OfferReceipt cart={cart} onChoose={chooseFromReceipt} live={live} />
            </section>

            {/* 4. Les bonus. */}
            <section className={SECTION}>
              <SectionTitle
                eyebrow={fr ? 'Tes bonus' : 'Your bonuses'}
                title={fr ? 'Pour démarrer vite et tenir le rythme.' : 'To start fast and keep the pace.'}
              />
              <div className="mt-8">
                <OfferBonuses plan={chosenPlan} />
              </div>
            </section>

            {/* 5. L'essai sans risque (pas avec l'offre du live : elle est payée le premier jour). */}
            {trial && (
              <section className={`mx-auto max-w-5xl p-5 sm:p-8 ${glass.panel} ${glass.featured} ${glass.plan} ${SECTION}`}>
                <p className={EYEBROW}>{fr ? 'Essai sans risque' : 'Risk-free trial'}</p>
                <h2 className={`mt-2 ${H3}`}>
                  <span className="block sm:inline">{fr ? nbsp('Essaie 7 jours. ') : 'Try it for 7 days. '}</span>
                  <span className="block sm:inline">{fr ? 'Tu décides ensuite.' : 'Then decide.'}</span>
                </h2>
                <ul className="mt-6 grid gap-5 md:grid-cols-3 md:gap-8">
                  {trialSafe.map((item) => (
                    <li key={item.title} className="flex items-start gap-3.5 md:flex-col md:gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                        <item.icon className="h-[18px] w-[18px] text-empire" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-semibold leading-snug text-white">{fr ? rich(nbsp(item.title)) : item.title}</p>
                        <p className="mt-1 text-[14px] leading-relaxed text-neutral-300">{fr ? rich(nbsp(item.body)) : item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 6. Empire contre… */}
            <section className={SECTION}>
              <SectionTitle eyebrow={fr ? 'Comparer' : 'Compare'} title={fr ? 'Empire contre…' : 'Empire versus…'} />
              <div className="mt-7">
                <OfferVersus plan={chosenPlan} price={cart.perMonth} />
              </div>
            </section>

            {/* 7. Le récapitulatif, avec les options. */}
            <section className={`scroll-mt-6 ${SECTION}`} id="recapitulatif">
              <SectionTitle
                title={fr ? 'Récapitulatif' : 'Summary'}
                intro={cart.liveDeal ? undefined : (fr ? nbsp('Deux options si tu veux aller plus loin. Aucune n’est obligatoire.') : 'Two add-ons if you want to go further. Neither is required.')}
              />
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
          </section>
        )}

        <div className={SECTION}>
          <CustomerReviews title={fr ? 'Ils publient avec Empire' : 'They publish with Empire'} />
        </div>

        <PressRow title={fr ? 'Mis en avant par' : 'Featured by'} className="mt-14 md:mt-20" />

        {trial && (
          <section className={`mx-auto max-w-5xl p-5 sm:p-8 ${glass.panel} ${SECTION}`}>
            <p className={EYEBROW}>{fr ? nbsp('3 étapes') : '3 steps'}</p>
            <h2 className={`mt-2 ${H3}`}>{fr ? 'Ce qui se passe ensuite' : 'What happens next'}</h2>
            <ol className="mt-6 grid gap-5 md:grid-cols-3 md:gap-8">
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
          </section>
        )}

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
              <span className="tabular-nums">{fr ? `${cart.perMonth} €/mois` : `€${cart.perMonth}/mo`}</span>
              {cart.liveDeal ? (fr ? ' · offre du live' : ' · live offer') : ''}
            </p>
            <TrialCta cart={cart} withCall className="mx-auto mt-6 max-w-md" />
          </section>
        )}

        <div className="mt-12 space-y-1 text-center text-sm leading-relaxed text-neutral-400">
          {solo && (
            <p>
              {fr ? nbsp('Pour une équipe ou une agence : ') : 'For a team or an agency: '}
              <button type="button" onClick={() => openTab('team')} className={`min-h-11 cursor-pointer font-semibold text-white ${LINK}`}>
                {fr ? 'voir les tarifs équipe' : 'see team pricing'}
              </button>
            </p>
          )}
          <p>
            {fr ? nbsp('Tu accompagnes des clients ? ') : 'You coach clients? '}
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
      </div>

      <footer className="mt-12 border-t border-white/10">
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
