'use client'

import { ArrowRight, Check } from 'lucide-react'
import LoomEmbed from '@/components/LoomEmbed'
import { TRIAL_URL } from '@/lib/startTrial'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Reveal } from './LegendeWeekScroll'
import LegendeMethodScroll from './LegendeMethodScroll'
import styles from './legende-form.module.css'

// Places avec Kevin : à mettre à jour à chaque client signé (et dans le prompt du setter WhatsApp).
export const PLACES_TOTAL = 10
export const PLACES_LEFT = 7
export const INTRO_URL = 'https://intro.co/kevindufraisse?source=intro'
const INTERVIEW_PHOTO = '/legende/kevin-interview.jpg'
/** Client fictif, image générée (fal, Flux) : jamais le visage d'un vrai client ici. */
const CLIENT_PHOTO = '/legende/client-interview.jpg'
const CLIENT_LOGOS = [
  { name: 'Ippon Technologies', src: '/logos/ippon.png' },
  { name: 'Socratiz', src: '/logos/presse-agence.png' },
  { name: 'The Sanctuary Group', src: '/logos/sanctuary.png' },
]

type Plan = { name: string; tagline: string; price: string; per: string; note: string; items: string[]; cta: string; href: 'trial' | 'kevin' | 'hoc'; featured?: string; limited?: boolean }

const copy = {
  fr: {
    badge: 'Le studio de personal branding des dirigeants influents',
    title: ['Une heure par semaine.', 'Tout votre marché vous voit, chaque jour.'],
    intro: 'Kevin vous interviewe dans l’app Empire. L’équipe en tire vos posts LinkedIn, vos reels, vos vidéos YouTube et votre newsletter.',
    places: `${PLACES_LEFT} places restantes sur ${PLACES_TOTAL} avec Kevin`,
    // Les trois objections, de la plus fréquente à la moins fréquente : le temps, la caméra, ce que ça rapporte.
    objections: ['Une heure par semaine, maximum.', 'Pas de studio : votre iPhone et vos écouteurs.', 'Les contacts de chaque post, récupérés pour vous.'],
    apply: 'Candidater · 2 min', seePrices: 'Voir les offres', advisory: 'Ou réservez d’abord une session de conseil avec Kevin',
    proof: [['700M+', 'vues générées pour nos clients'], ['#1', 'Lead Generation France'], ['#55', 'LinkedIn Influence France']] as [string, string][],
    phone: { app: 'Empire', live: 'Interview', formats: ['Interview', 'Tier list', 'Réaction', 'FAQ'], question: 'Question 3 sur 8', topic: 'Pourquoi vos clients trouvent votre prix trop cher', kevin: 'Kevin', you: 'Vous', yourPhone: 'Votre iPhone, l’app Empire', yourEarbuds: ['Vos écouteurs', ', rien d’autre.'] },
    video: 'Kevin vous explique tout en 16 minutes',
    howLabel: 'Chaque semaine', howTitle: 'Vous parlez. Nous faisons le reste.',
    how: [
      ['Nous préparons vos sujets', 'Nous regardons ce qui marche dans votre marché et chez vos concurrents. Vous recevez les sujets de la semaine avant l’interview.'],
      ['Kevin vous interviewe, 1 h maximum', 'En visio, depuis votre iPhone, avec des écouteurs. Pas de studio, pas de texte à apprendre. Vous répondez, c’est tout.'],
      ['L’équipe produit tout', 'Posts LinkedIn, reels, vidéos YouTube longues, newsletter. Écrits et montés à partir de vos mots.'],
      ['Nous publions et récupérons vos contacts', 'Au moins une publication par jour sur 7 réseaux. Chaque post a son lien suivi, chaque contact arrive dans votre espace Empire.'],
    ] as [string, string][],
    methodLabel: 'La méthode Empire', methodTitle: ['Offre, Visibilité, Confiance.', 'Et le marché vient à vous.'],
    methodText: 'Quand les trois côtés tiennent, tout change de prix dans votre entreprise : les clients arrivent déjà convaincus, vous facturez plus cher, les bons candidats postulent sans annonce, les partenaires et les investisseurs vous écrivent. Un an de R&D et plus de 10 000 posts testés pour en arriver là.',
    methodCenter: 'On vient à vous',
    method: [
      ['Offre', 'Nous revoyons ce que vous proposez, à vos clients comme à vos futurs recrues et partenaires, pour que ce soit clair en une phrase pour quelqu’un qui ne vous connaît pas.'],
      ['Visibilité', 'Tout votre marché vous voit, chaque jour, sur 7 réseaux, avec les formats qui font des vues cette semaine.'],
      ['Confiance', 'Vos prospects, vos candidats et vos partenaires ont vu vos vidéos avant de vous écrire. Ils arrivent convaincus, vous n’avez plus à vous présenter.'],
    ] as [string, string][],
    plansLabel: 'Les offres', plansTitle: 'Deux façons de travailler avec nous.',
    growthLabel: 'Ce que les agences de contenu ne font pas',
    growthIntro: 'Les deux offres travaillent votre croissance, pas seulement vos vues :',
    growthItems: ['Optimisation de vos tunnels de vente', 'Pricing de vos offres', 'Lead generation : les contacts de chaque post, récupérés', 'Techniques de prospection', 'Visibilité quotidienne sur 7 réseaux', 'Republication de vos meilleurs posts'],
    plansIncluded: '+ tout le programme de croissance ci-dessus',
    plansNote: 'Les deux offres faites pour vous sont sur candidature, pour douze mois.',
    plans: [
      { name: 'Avec un Head of Content', tagline: 'Nous faisons pour vous, vous choisissez', price: '', per: '', limited: true, note: 'Sur candidature · 12 mois',
        items: ['Un Head of Content formé par Kevin vous interviewe chaque semaine', 'L’équipe écrit et monte vos posts, reels, vidéos et newsletter', 'Vous choisissez dans votre calendrier Empire ce qui part', 'Publication sur 7 réseaux et contacts récupérés'], cta: 'Candidater', href: 'hoc' },
      { name: 'Avec Kevin', tagline: 'Nous faisons tout pour vous', price: '', per: '', note: 'Sur candidature · 12 mois', featured: `${PLACES_LEFT} places restantes sur ${PLACES_TOTAL}`,
        items: ['4 interviews par mois avec Kevin, 1 h maximum chacune', 'Vos sujets préparés chaque semaine à partir de votre marché et de vos concurrents', 'Posts LinkedIn, reels, vidéos YouTube longues et newsletter, écrits et montés par l’équipe', 'Publication chaque jour sur 7 réseaux, et vos meilleurs posts republiés', 'Liens suivis et réponses automatiques en DM Instagram pour récupérer vos contacts', 'Votre offre et votre tunnel de vente retravaillés avec Kevin', 'L’app Empire au complet et le live du lundi'], cta: 'Candidater', href: 'kevin' },
    ] as Plan[],
    clientsLabel: 'Ils nous ont confié leur image',
    selectTitle: `${PLACES_TOTAL} places par an avec Kevin. Nous refusons la plupart des candidatures.`,
    fitTitle: 'C’est pour vous si', notFitTitle: 'Ce n’est pas pour vous si',
    fit: ['Vous avez un avis tranché sur votre métier, et l’envie de le dire.', 'Vous pouvez bloquer une heure par semaine, pendant douze mois.'],
    notFit: ['Vous voulez une production en studio. Ici, tout se filme à l’iPhone.', 'Vous cherchez l’option la moins chère : prenez l’abonnement Empire.', 'Vous n’avez pas encore d’offre à vendre.', 'Vous attendez des résultats en deux semaines.'],
  },
  en: {
    badge: 'The personal branding studio for influential leaders',
    title: ['One hour a week.', 'Your whole market sees you, every day.'],
    intro: 'Kevin interviews you in the Empire app. The team turns it into your LinkedIn posts, reels, YouTube videos and newsletter.',
    places: `${PLACES_LEFT} of ${PLACES_TOTAL} spots left with Kevin`,
    objections: ['One hour a week, at most.', 'No studio: your iPhone and your earphones.', 'The contacts from every post, captured for you.'],
    apply: 'Apply · 2 min', seePrices: 'See the offers', advisory: 'Or book an advisory session with Kevin first',
    proof: [['700M+', 'views generated for our clients'], ['#1', 'Lead Generation France'], ['#55', 'LinkedIn Influence France']] as [string, string][],
    phone: { app: 'Empire', live: 'Interview', formats: ['Interview', 'Tier list', 'Reaction', 'FAQ'], question: 'Question 3 of 8', topic: 'Why your clients think your price is too high', kevin: 'Kevin', you: 'You', yourPhone: 'Your iPhone, the Empire app', yourEarbuds: ['Your earphones', '. Nothing else.'] },
    video: 'Kevin explains everything in 16 minutes',
    howLabel: 'Every week', howTitle: 'Here’s what happens.',
    how: [
      ['We prepare your topics', 'We look at what works in your market and for your competitors. You get the week’s topics before the interview.'],
      ['Kevin interviews you, 1 hour max', 'On a video call, from your iPhone, with earphones. No studio, no script to learn. You answer, that’s it.'],
      ['The team produces everything', 'LinkedIn posts, reels, long YouTube videos, newsletter. Written and edited from your own words.'],
      ['We publish and capture your contacts', 'At least one post a day on 7 networks. Every post has a tracked link, every contact lands in your Empire space.'],
    ] as [string, string][],
    methodLabel: 'The Empire method', methodTitle: ['Offer, Visibility, Trust.', 'And the market comes to you.'],
    methodText: 'When all three sides hold, everything in your company changes price: clients arrive already convinced, you charge more, the right candidates apply without a job ad, partners and investors write to you. One year of R&D and over 10,000 posts tested to get there.',
    methodCenter: 'They come to you',
    method: [
      ['Offer', 'We rework what you put forward, to clients, future hires and partners alike, so it is clear in one sentence to someone who has never heard of you.'],
      ['Visibility', 'Your whole market sees you, every day, on 7 networks, with the formats getting views this week.'],
      ['Trust', 'Your prospects, candidates and partners have watched your videos before they write. They arrive convinced, you no longer have to introduce yourself.'],
    ] as [string, string][],
    plansLabel: 'Our offers', plansTitle: 'Two ways to work with us.',
    growthLabel: 'What content agencies don\u2019t do',
    growthIntro: 'Both offers work on your growth, not just your views:',
    growthItems: ['Sales funnel optimisation', 'Pricing of your offers', 'Lead generation: every post\u2019s contacts, captured', 'Prospecting techniques', 'Daily visibility on 7 networks', 'Republishing of your best posts'],
    plansIncluded: '+ the whole growth program above',
    plansNote: 'Both done-for-you options are by application, for twelve months.',
    plans: [
      { name: 'With a Head of Content', tagline: 'Done for you, you choose', price: '', per: '', limited: true, note: 'By application · 12 months',
        items: ['A Head of Content trained by Kevin interviews you every week', 'The team writes and edits your posts, reels, videos and newsletter', 'You pick in your Empire calendar what goes out', 'Published on 7 networks, contacts captured'], cta: 'Apply', href: 'hoc' },
      { name: 'With Kevin', tagline: 'We do everything for you', price: '', per: '', note: 'By application · 12 months', featured: `${PLACES_LEFT} spots left out of ${PLACES_TOTAL}`,
        items: ['4 interviews a month with Kevin, 1 hour max each', 'Your topics prepared every week from your market and competitors', 'LinkedIn posts, reels, long YouTube videos and newsletter, written and edited by the team', 'Published every day on 7 networks, your best posts republished', 'Tracked links and automatic Instagram DM replies to capture your contacts', 'Your offer and sales funnel reworked with Kevin', 'The full Empire app and the Monday live'], cta: 'Apply', href: 'kevin' },
    ] as Plan[],
    clientsLabel: 'They trusted us with their image',
    selectTitle: `${PLACES_TOTAL} spots a year with Kevin. We turn down most applications.`,
    fitTitle: 'It’s for you if', notFitTitle: 'It’s not for you if',
    fit: ['You have strong opinions about your field, and want to share them.', 'You can block one hour a week, for twelve months.'],
    notFit: ['You want a studio production. Here, everything is shot on an iPhone.', 'You’re looking for the cheapest option: take the Empire subscription.', 'You don’t have an offer to sell yet.', 'You expect results in two weeks.'],
  },
}

function Label({ children }: { children: string }) {
  return <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{children}</p>
}

/** Barres de voix : quelqu'un parle. */
function Voice({ still, active }: { still: boolean; active: boolean }) {
  return <span className={styles.voice + (active ? ' ' + styles.voiceOn : '') + (still ? ' ' + styles.voiceStill : '')} aria-hidden>
    {[0, 1, 2, 3].map(i => <i key={i} style={{ animationDelay: `${i * .13}s` }} />)}
  </span>
}

/**
 * L'interview telle qu'elle se passe : un appel vidéo à deux dans l'app Empire, sur un iPhone. La barre du haut
 * (logo E, « Empire · Interview », les formats) dit qu'on est dans l'app et pas dans FaceTime ; Kevin en haut pose
 * la question, le client en bas répond. Autour, deux flèches disent tout le matériel qu'il faut : le téléphone, et
 * des écouteurs - la flèche des écouteurs tombe sur l'écouteur du client (repère `.earbudMark`, posé en % de la photo).
 */
function InterviewPhone({ l, still }: { l: typeof copy.fr.phone; still: boolean }) {
  return <div className={styles.phoneScene} aria-hidden>
    <p className={styles.callout + ' ' + styles.calloutPhone}>{l.yourPhone}<CalloutArrow flip /></p>
    <p className={styles.callout + ' ' + styles.calloutEarbuds}><span>{l.yourEarbuds[0]}<span className={styles.calloutTail}>{l.yourEarbuds[1]}</span></span></p>
    <EarbudArrow />
    <div className={styles.iphone}>
      <div className={styles.iphoneIsland} />
      <div className={styles.appBar}>
        <span className={styles.appBrand}><span className={styles.appMark}>E</span><b>{l.app}</b><span>· {l.live}</span></span>
        <span className={styles.appRec}><i className={still ? '' : 'animate-pulse'} />42:10</span>
      </div>
      <div className={styles.appFormats}>{l.formats.map((f, i) => <span key={f} className={i === 0 ? styles.appFormatOn : ''}>{f}</span>)}</div>
      <div className={styles.tile + ' ' + styles.tileSpeaking}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={INTERVIEW_PHOTO} alt="" className="absolute inset-0 h-full w-full object-cover object-[40%_30%] saturate-[1.08] contrast-[1.04]" />
        <div className={styles.tileShade} />
      </div>
      <div className={styles.tile}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CLIENT_PHOTO} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" />
        <span className={styles.earbudMark + (still ? '' : ' ' + styles.earbudPulse)} />
        <span className={styles.tileName}><Voice still={still} active={false} />{l.you}</span>
      </div>
      <div className={styles.questionCard}>
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-autopilot"><Voice still={still} active />{l.kevin} · {l.question}</p>
        <p className="mt-1 text-[13px] font-medium leading-snug text-white">{l.topic}</p>
      </div>
    </div>
  </div>
}

/** Flèche des écouteurs : part de la légende, à droite du téléphone, et pointe sur l'écouteur du client. */
function EarbudArrow() {
  return <svg viewBox="0 0 64 40" preserveAspectRatio="none" className={styles.earbudArrow} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M62 3C48 6 26 14 5 34" /><path d="M5 25l0 9 9 -1" />
  </svg>
}

function CalloutArrow({ flip = false }: { flip?: boolean }) {
  return <svg viewBox="0 0 60 44" className={styles.calloutArrow + (flip ? ' ' + styles.calloutArrowFlip : '')} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4c6 22 24 34 52 36" /><path d="M46 32l9 8-10 3" />
  </svg>
}

export default function LegendeMarketing({ lang, onApply }: { lang: 'fr' | 'en'; onApply: (plan?: 'kevin' | 'hoc') => void }) {
  const t = copy[lang]
  const still = usePrefersReducedMotion()
  return <>
    {/* Sur ordinateur, le héros remplit le premier écran et se centre dedans : rien ne dépasse de la ligne de
        flottaison, la bande des preuves commence juste en dessous. */}
    <header className="mx-auto grid max-w-6xl items-center gap-8 px-5 pt-6 sm:px-8 md:min-h-[calc(100svh-88px)] md:grid-cols-[1.25fr_1fr] md:content-center md:pb-10 md:pt-4">
      <div>
        <p className={styles.badge}>{t.badge}</p>
        <h1 className={styles.display}>{t.title[0]} <em>{t.title[1]}</em></h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-neutral-300">{t.intro}</p>
        <ul className="mt-4 space-y-2">
          {t.objections.map(item => <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-white"><Check aria-hidden size={17} className="mt-0.5 shrink-0 text-autopilot" />{item}</li>)}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => onApply()} className={styles.pill}><span className="text-balance">{t.apply}</span><ArrowRight aria-hidden size={15} /></button>
          <a href="#tarifs" className={styles.ghost}>{t.seePrices}</a>
          <span className="text-[13px] text-neutral-400">{t.places}</span>
        </div>
        <a href={INTRO_URL} target="_blank" rel="noopener" className="mt-4 inline-block text-[14px] text-neutral-400 underline underline-offset-4 hover:text-white">{t.advisory}</a>
      </div>
      <InterviewPhone l={t.phone} still={still} />
    </header>

    <section className="mx-auto mt-12 max-w-6xl px-5 sm:px-8" aria-label={t.clientsLabel}>
      <div className="flex flex-col gap-6 border-y border-white/10 py-6 md:flex-row md:items-center md:justify-between">
        <dl className="flex flex-wrap gap-x-10 gap-y-3">
          {t.proof.map(([value, label]) => <div key={label} className="flex items-baseline gap-2.5">
            <dt className={styles.proofValue}>{value}</dt><dd className="text-[13px] text-neutral-400">{label}</dd>
          </div>)}
        </dl>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4" aria-label={t.clientsLabel}>
          {CLIENT_LOGOS.map(logo => <li key={logo.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.name} loading="lazy" className="h-7 w-auto object-contain opacity-70 brightness-0 invert" />
          </li>)}
        </ul>
      </div>
    </section>

    <div id="video" className="mx-auto mt-12 max-w-4xl scroll-mt-20 px-5 sm:px-8">
      <p className="mb-3 text-[14px] text-neutral-400">{t.video}</p>
      {/* L'aperçu de Loom tel quel (Kevin, 18 novembre 2026) : pas d'image ni de bouton maison par-dessus. */}
      <LoomEmbed id="031aba6220874a0d838ac246ce538a88" title={t.video} />
    </div>

    <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-how">
      <Reveal>
        <Label>{t.howLabel}</Label>
        <h2 id="legende-how" className={styles.sectionTitle}>{t.howTitle}</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.map(([title, body], i) => <li key={title} className={styles.step}>
            <span className={styles.number}>0{i + 1}</span>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{body}</p>
          </li>)}
        </ol>
      </Reveal>
    </section>

    <LegendeMethodScroll label={t.methodLabel} title={t.methodTitle as [string, string]} text={t.methodText} items={t.method} center={t.methodCenter} />

    <section id="tarifs" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-5 sm:px-8 md:mt-20" aria-labelledby="legende-plans">
      <Reveal>
        <Label>{t.plansLabel}</Label>
        <h2 id="legende-plans" className={styles.sectionTitle}>{t.plansTitle}</h2>
        {/* Le socle commun des deux offres : la croissance, pas seulement les vues. */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e7c49c]">{t.growthLabel}</p>
          <p className="mt-2 text-[14.5px] text-neutral-300">{t.growthIntro}</p>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {t.growthItems.map(item => <li key={item} className="flex gap-2.5 text-[14.5px] leading-snug text-white">
              <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-autopilot" />{item}
            </li>)}
          </ul>
        </div>
        <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
          {t.plans.map(plan => <div key={plan.name} className={`${styles.plan} ${plan.featured ? styles.planFeatured : ''}`}>
            {plan.featured && <span className={styles.planTag}>{plan.featured}</span>}
            {plan.limited && !plan.featured && <span className={styles.planTagGhost}>{lang === 'fr' ? 'Places limitées' : 'Limited spots'}</span>}
            <h3 className="text-[17px] font-semibold text-white">{plan.name}</h3>
            <p className="text-[14px] text-autopilot">{plan.tagline}</p>
            {plan.price && <p className="mt-4"><span className={styles.planPrice}>{plan.price}</span><span className="text-[14px] text-neutral-400">{plan.per}</span></p>}
            <p className="mt-1 text-[13px] text-neutral-500">{plan.note}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.items.map(item => <li key={item} className="flex gap-2.5 text-[14.5px] leading-snug text-neutral-300">
                <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-autopilot" />{item}
              </li>)}
              <li className="flex gap-2.5 text-[14.5px] font-semibold leading-snug text-[#e7c49c]">{t.plansIncluded}</li>
            </ul>
            {plan.href === 'trial'
              ? <a href={TRIAL_URL} className={`mt-6 ${styles.ghost} justify-center`}>{plan.cta}</a>
              : <button type="button" onClick={() => onApply(plan.href as 'kevin' | 'hoc')} className={`mt-6 ${styles.pill} justify-center`}>{plan.cta}</button>}
          </div>)}
        </div>
        <p className="mt-4 text-[13px] text-neutral-500">{t.plansNote}</p>
      </Reveal>
    </section>

    <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-select">
      <Reveal>
        <h2 id="legende-select" className={styles.sectionTitle}>{t.selectTitle}</h2>
        <div className="mt-8 grid gap-8 border-t border-white/10 pt-6 md:grid-cols-2 md:gap-14">
          {([[t.fitTitle, t.fit, true], [t.notFitTitle, t.notFit, false]] as [string, string[], boolean][]).map(([title, items, yes]) => <div key={title}>
            <h3 className="text-[16px] font-semibold">{title}</h3>
            <ul className="mt-3 space-y-2.5">
              {items.map(item => <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-300">
                <span aria-hidden className={yes ? 'text-autopilot' : 'text-neutral-500'}>{yes ? '✓' : '×'}</span>{item}
              </li>)}
            </ul>
          </div>)}
        </div>
      </Reveal>
    </section>
  </>
}
