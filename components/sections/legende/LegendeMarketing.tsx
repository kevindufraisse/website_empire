'use client'

import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import LoomEmbed from '@/components/LoomEmbed'
import { TRIAL_URL } from '@/lib/startTrial'
import { useReveal } from '@/hooks/useReveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Reveal } from './LegendeWeekScroll'
import styles from './legende-form.module.css'

// Places avec Kevin : à mettre à jour à chaque client signé (et dans le prompt du setter WhatsApp).
export const PLACES_TOTAL = 10
export const PLACES_LEFT = 7
export const INTRO_URL = 'https://intro.co/kevindufraisse?source=intro'
const INTERVIEW_PHOTO = '/legende/kevin-interview.jpg'
const CLIENT_LOGOS = [
  { name: 'Ippon Technologies', src: '/logos/ippon.png' },
  { name: 'Socratiz', src: '/logos/presse-agence.png' },
  { name: 'The Sanctuary Group', src: '/logos/sanctuary.png' },
]

type Plan = { name: string; tagline: string; price: string; per: string; note: string; items: string[]; cta: string; href: 'trial' | 'kevin' | 'hoc'; featured?: string }

const copy = {
  fr: {
    badge: `Done for you · ${PLACES_LEFT} places restantes sur ${PLACES_TOTAL}`,
    title: ['Vous parlez une heure par semaine.', 'Nous publions pour vous tous les jours.'],
    intro: 'Kevin vous interviewe en visio, depuis votre iPhone, avec vos écouteurs. De cette heure, l’équipe tire vos posts LinkedIn, vos reels, vos vidéos YouTube et votre newsletter, les publie chaque jour sur 7 réseaux et récupère les contacts qu’ils vous apportent.',
    zero: 'Vous ne tournez rien. Vous n’écrivez rien. Vous ne publiez rien.',
    apply: 'Candidater', seePrices: 'Voir les tarifs', advisory: 'Ou réservez d’abord une session de conseil avec Kevin',
    proof: [['700M+', 'vues générées pour nos clients'], ['#1', 'Lead Generation France'], ['#55', 'LinkedIn Influence France']] as [string, string][],
    phone: { live: 'Interview', week: 'Semaine 12', question: 'Question 3 sur 8', topic: 'Pourquoi vos clients trouvent votre prix trop cher', you: 'Vous' },
    video: 'Kevin vous explique tout en 16 minutes',
    howLabel: 'Chaque semaine', howTitle: 'Vous parlez. Nous faisons le reste.',
    how: [
      ['Nous préparons vos sujets', 'Nous regardons ce qui marche dans votre marché et chez vos concurrents. Vous recevez les sujets de la semaine avant l’interview.'],
      ['Kevin vous interviewe, 1 h maximum', 'En visio, depuis votre iPhone, avec des écouteurs. Pas de studio, pas de texte à apprendre. Vous répondez, c’est tout.'],
      ['L’équipe produit tout', 'Posts LinkedIn, reels, vidéos YouTube longues, newsletter. Écrits et montés à partir de vos mots.'],
      ['Nous publions et récupérons vos contacts', 'Au moins une publication par jour sur 7 réseaux. Chaque post a son lien suivi, chaque contact arrive dans votre espace Empire.'],
    ] as [string, string][],
    resultsLabel: 'Résultats', resultsTitle: 'Ils sont devenus la référence de leur marché.',
    results: [
      { name: 'Evelyne Guitard', role: 'Formatrice', result: '0 → 100 000 vues', detail: 'en 21 jours', photo: '/case-studies/evelyne-guitard.jpg' },
      { name: 'Deborah Guillotin', role: 'MyES France', result: '0 → 10 000 abonnés', detail: 'en moins d’un mois', photo: '/case-studies/deborah-guillotin.png' },
      { name: 'Marguerite Demoures', role: 'Stratégie LinkedIn', result: 'Pipeline commercial ×2', detail: 'en un mois', photo: '/case-studies/marguerite-demoures.png' },
      { name: 'Olivier Sarezinski', role: 'Gérant associé', result: 'Plusieurs freelances → 1 h', detail: 'par semaine', photo: '/case-studies/olivier-sarezinski.jpg' },
    ],
    methodLabel: 'La méthode Empire', methodTitle: ['Offre, Visibilité, Confiance.', 'Les ventes au centre.'],
    methodText: 'Un an de R&D et plus de 10 000 posts testés nous ont appris une chose : des vues sans ventes ne servent à rien. Nous travaillons les trois côtés en même temps.',
    methodCenter: 'Ventes',
    method: [
      ['Offre', 'Nous revoyons votre offre pour qu’elle se vende à tous les profils de clients, pas seulement à ceux qui vous connaissent déjà.'],
      ['Visibilité', 'Tout votre marché vous voit, chaque jour, sur 7 réseaux, avec les formats qui font des vues cette semaine.'],
      ['Confiance', 'Vos prospects ont vu vos vidéos avant de vous appeler. Ils arrivent convaincus. Vous vendez sans décrocher le téléphone.'],
    ] as [string, string][],
    plansLabel: 'Tarifs', plansTitle: 'Trois façons de travailler avec nous.',
    plansNote: 'Les deux offres faites pour vous sont sur candidature, pour douze mois, réservées aux entreprises qui réalisent au moins 300 000 € de chiffre d’affaires par an.',
    plans: [
      { name: 'Empire', tagline: 'Vous faites vous-même', price: 'dès 199 €', per: '/mois', note: 'Sans engagement',
        items: ['Les sujets et les formats de la semaine dans l’app', 'Vous filmez, l’app monte et publie sur 7 réseaux', 'Un live chaque lundi avec Kevin'], cta: 'Commencer', href: 'trial' },
      { name: 'Avec un Head of Content', tagline: 'Nous faisons pour vous, vous choisissez', price: '1 000 – 3 000 €', per: '/mois', note: 'Sur candidature · 12 mois',
        items: ['Un Head of Content formé par Kevin vous interviewe chaque semaine', 'L’équipe écrit et monte vos posts, reels, vidéos et newsletter', 'Vous choisissez dans votre calendrier Empire ce qui part', 'Publication sur 7 réseaux et contacts récupérés'], cta: 'Candidater', href: 'hoc' },
      { name: 'Avec Kevin', tagline: 'Nous faisons tout pour vous', price: '4 500 €', per: '/mois', note: 'Sur candidature · 12 mois', featured: `${PLACES_LEFT} places restantes sur ${PLACES_TOTAL}`,
        items: ['4 interviews par mois avec Kevin, 1 h maximum chacune', 'Vos sujets préparés chaque semaine à partir de votre marché et de vos concurrents', 'Posts LinkedIn, reels, vidéos YouTube longues et newsletter, écrits et montés par l’équipe', 'Publication chaque jour sur 7 réseaux, et vos meilleurs posts republiés', 'Liens suivis et réponses automatiques en DM Instagram pour récupérer vos contacts', 'Votre offre et votre tunnel de vente retravaillés avec Kevin', 'L’app Empire au complet et le live du lundi'], cta: 'Candidater', href: 'kevin' },
    ] as Plan[],
    clientsLabel: 'Ils nous ont confié leur image',
    selectTitle: `${PLACES_TOTAL} places par an avec Kevin. Nous refusons la plupart des candidatures.`,
    fitTitle: 'C’est pour vous si', notFitTitle: 'Ce n’est pas pour vous si',
    fit: ['Votre entreprise réalise au moins 300 000 € de chiffre d’affaires par an.', 'Vous avez un avis tranché sur votre métier, et l’envie de le dire.', 'Vous pouvez bloquer une heure par semaine, pendant douze mois.'],
    notFit: ['Vous voulez une production en studio. Ici, tout se filme à l’iPhone.', 'Vous cherchez l’option la moins chère : prenez l’abonnement Empire.', 'Vous n’avez pas encore d’offre à vendre.', 'Vous attendez des résultats en deux semaines.'],
  },
  en: {
    badge: `Done for you · ${PLACES_LEFT} spots left out of ${PLACES_TOTAL}`,
    title: ['You talk 1 hour a week.', 'We publish for you every day.'],
    intro: 'Kevin interviews you on a video call, from your iPhone, with your earphones. From that hour, the team writes your LinkedIn posts, edits your reels and YouTube videos, drafts your newsletter, publishes every day on 7 networks and captures the contacts it brings you.',
    zero: 'You don’t film anything. You don’t write anything. You don’t publish anything.',
    apply: 'Apply', seePrices: 'See pricing', advisory: 'Or book an advisory session with Kevin first',
    proof: [['700M+', 'views generated for our clients'], ['#1', 'Lead Generation France'], ['#55', 'LinkedIn Influence France']] as [string, string][],
    phone: { live: 'Interview', week: 'Week 12', question: 'Question 3 of 8', topic: 'Why your clients think your price is too high', you: 'You' },
    video: 'Kevin explains everything in 16 minutes',
    howLabel: 'Every week', howTitle: 'Here’s what happens.',
    how: [
      ['We prepare your topics', 'We look at what works in your market and for your competitors. You get the week’s topics before the interview.'],
      ['Kevin interviews you, 1 hour max', 'On a video call, from your iPhone, with earphones. No studio, no script to learn. You answer, that’s it.'],
      ['The team produces everything', 'LinkedIn posts, reels, long YouTube videos, newsletter. Written and edited from your own words.'],
      ['We publish and capture your contacts', 'At least one post a day on 7 networks. Every post has a tracked link, every contact lands in your Empire space.'],
    ] as [string, string][],
    resultsLabel: 'Results', resultsTitle: 'They became the reference in their market.',
    results: [
      { name: 'Evelyne Guitard', role: 'Trainer', result: '0 → 100,000 views', detail: 'in 21 days', photo: '/case-studies/evelyne-guitard.jpg' },
      { name: 'Deborah Guillotin', role: 'MyES France', result: '0 → 10,000 followers', detail: 'in under a month', photo: '/case-studies/deborah-guillotin.png' },
      { name: 'Marguerite Demoures', role: 'LinkedIn strategy', result: 'Sales pipeline ×2', detail: 'in one month', photo: '/case-studies/marguerite-demoures.png' },
      { name: 'Olivier Sarezinski', role: 'Managing partner', result: 'Several freelancers → 1 h', detail: 'a week', photo: '/case-studies/olivier-sarezinski.jpg' },
    ],
    methodLabel: 'The Empire method', methodTitle: ['Offer, Visibility, Trust.', 'Sales in the middle.'],
    methodText: 'One year of R&D and over 10,000 posts tested taught us one thing: views without sales are useless. We work on all three sides at once.',
    methodCenter: 'Sales',
    method: [
      ['Offer', 'We rework your offer so it sells to every kind of client, not just the ones who already know you.'],
      ['Visibility', 'Your whole market sees you, every day, on 7 networks, with the formats getting views this week.'],
      ['Trust', 'Your prospects have watched your videos before they call. They arrive convinced, you sell without picking up the phone.'],
    ] as [string, string][],
    plansLabel: 'Pricing', plansTitle: 'Three ways to work with us.',
    plansNote: 'Both done-for-you options are by application, for twelve months, for companies making at least €300,000 in revenue a year.',
    plans: [
      { name: 'Empire', tagline: 'You do it yourself', price: 'from €199', per: '/month', note: 'Cancel anytime',
        items: ['This week’s topics and formats in the app', 'You film, the app edits and publishes on 7 networks', 'A live session with Kevin every Monday'], cta: 'Start', href: 'trial' },
      { name: 'With a Head of Content', tagline: 'Done for you, you choose', price: '€1,000 – €3,000', per: '/month', note: 'By application · 12 months',
        items: ['A Head of Content trained by Kevin interviews you every week', 'The team writes and edits your posts, reels, videos and newsletter', 'You pick in your Empire calendar what goes out', 'Published on 7 networks, contacts captured'], cta: 'Apply', href: 'hoc' },
      { name: 'With Kevin', tagline: 'We do everything for you', price: '€4,500', per: '/month', note: 'By application · 12 months', featured: `${PLACES_LEFT} spots left out of ${PLACES_TOTAL}`,
        items: ['4 interviews a month with Kevin, 1 hour max each', 'Your topics prepared every week from your market and competitors', 'LinkedIn posts, reels, long YouTube videos and newsletter, written and edited by the team', 'Published every day on 7 networks, your best posts republished', 'Tracked links and automatic Instagram DM replies to capture your contacts', 'Your offer and sales funnel reworked with Kevin', 'The full Empire app and the Monday live'], cta: 'Apply', href: 'kevin' },
    ] as Plan[],
    clientsLabel: 'They trusted us with their image',
    selectTitle: `${PLACES_TOTAL} spots a year with Kevin. We turn down most applications.`,
    fitTitle: 'It’s for you if', notFitTitle: 'It’s not for you if',
    fit: ['Your company makes at least €300,000 in revenue a year.', 'You have strong opinions about your field, and want to share them.', 'You can block one hour a week, for twelve months.'],
    notFit: ['You want a studio production. Here, everything is shot on an iPhone.', 'You’re looking for the cheapest option: take the Empire subscription.', 'You don’t have an offer to sell yet.', 'You expect results in two weeks.'],
  },
}

function Label({ children }: { children: string }) {
  return <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{children}</p>
}

/** Un iPhone en appel vidéo : Kevin plein écran, toi en vignette, la question en cours. */
function InterviewPhone({ l, still }: { l: typeof copy.fr.phone; still: boolean }) {
  return <div className={styles.iphone} aria-hidden>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={INTERVIEW_PHOTO} alt="" className="absolute inset-0 h-full w-full object-cover object-[38%_center]" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75" />
    <div className={styles.iphoneIsland} />
    <div className="absolute inset-x-4 top-12 flex items-center justify-between text-[11px] font-semibold text-white">
      <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full bg-red-500 ${still ? '' : 'animate-pulse'}`} />{l.live} · 42:10
      </span>
      <span className="rounded-full bg-black/45 px-2.5 py-1 backdrop-blur">{l.week}</span>
    </div>
    <div className="absolute right-4 top-[5.5rem] grid h-24 w-[4.5rem] place-items-center rounded-xl border border-white/25 bg-neutral-800/90 text-[11px] font-semibold text-neutral-300">{l.you}</div>
    <div className="absolute inset-x-4 bottom-6 rounded-2xl bg-black/55 p-3.5 backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-autopilot">{l.question}</p>
      <p className="mt-1 text-[13px] font-medium leading-snug text-white">{l.topic}</p>
    </div>
  </div>
}

/** Le triangle se trace une fois quand il arrive à l'écran, sans bloquer le défilement. */
function Triangle({ labels, center }: { labels: string[]; center: string }) {
  const [ref, inView] = useReveal('-80px')
  const still = usePrefersReducedMotion()
  const on = still || inView
  const pts: [number, number][] = [[200, 40], [360, 316], [40, 316]]
  return <div ref={ref} className="mx-auto w-full max-w-[300px]">
    <svg viewBox="-30 0 460 370" className="w-full overflow-visible" aria-hidden>
      <motion.polygon points={pts.map(p => p.join(',')).join(' ')} fill="rgba(212,165,116,.07)" stroke="#d4a574" strokeWidth="2" strokeLinejoin="round"
        initial={still ? false : { pathLength: 0, opacity: 0 }} animate={on ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.1, ease: [.22, 1, .36, 1] }} />
      {pts.map(([x, y], i) => <g key={i}>
        <motion.circle cx={x} cy={y} r="8" fill="#d4a574" initial={still ? false : { scale: 0 }} animate={on ? { scale: 1 } : {}}
          style={{ transformOrigin: `${x}px ${y}px` }} transition={{ delay: .35 + i * .2, duration: .4 }} />
        <text x={x} y={i === 0 ? y - 22 : y + 40} textAnchor={i === 1 ? 'end' : i === 2 ? 'start' : 'middle'} dx={i === 1 ? 18 : i === 2 ? -18 : 0} className={styles.triangleLabel}>{labels[i]}</text>
      </g>)}
      <motion.text x="200" y="222" textAnchor="middle" className={styles.triangleCenter} initial={still ? false : { opacity: 0 }} animate={on ? { opacity: 1 } : {}} transition={{ delay: 1, duration: .5 }}>{center}</motion.text>
    </svg>
  </div>
}

export default function LegendeMarketing({ lang, onApply }: { lang: 'fr' | 'en'; onApply: (plan?: 'kevin' | 'hoc') => void }) {
  const t = copy[lang]
  const still = usePrefersReducedMotion()
  return <>
    <header className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-10 sm:px-8 md:grid-cols-[1.25fr_1fr] md:pt-16">
      <div>
        <p className={styles.badge}>{t.badge}</p>
        <h1 className={styles.display}>{t.title[0]} <em>{t.title[1]}</em></h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-neutral-300">{t.intro}</p>
        <p className="mt-3 text-[15px] font-semibold text-white">{t.zero}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => onApply()} className={styles.pill}>{t.apply}<ArrowRight aria-hidden size={15} /></button>
          <a href="#tarifs" className={styles.ghost}>{t.seePrices}</a>
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
      <LoomEmbed facade poster={INTERVIEW_PHOTO} id="031aba6220874a0d838ac246ce538a88" title={t.video} />
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

    <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-results">
      <Reveal>
        <Label>{t.resultsLabel}</Label>
        <h2 id="legende-results" className={styles.sectionTitle}>{t.resultsTitle}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.results.map(r => <li key={r.name} className={styles.step + ' flex items-center gap-4 lg:block'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.photo} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-full object-cover object-top ring-2 ring-autopilot/60 lg:mb-4" />
            <div>
              <p className={styles.resultValue}>{r.result}</p>
              <p className="text-[14px] text-neutral-400">{r.detail}</p>
              <p className="mt-2 text-[14px] font-semibold text-white">{r.name}</p>
              <p className="text-[13px] text-neutral-500">{r.role}</p>
            </div>
          </li>)}
        </ul>
      </Reveal>
    </section>

    <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-method">
      <Reveal>
        <Label>{t.methodLabel}</Label>
        <h2 id="legende-method" className={styles.sectionTitle}>{t.methodTitle[0]} <em className="italic text-autopilot">{t.methodTitle[1]}</em></h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-neutral-300">{t.methodText}</p>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-[300px_1fr] md:gap-14">
          <Triangle labels={t.method.map(([name]) => name)} center={t.methodCenter} />
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {t.method.map(([name, body]) => <li key={name} className="py-5">
              <h3 className={styles.methodName}>{name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{body}</p>
            </li>)}
          </ol>
        </div>
      </Reveal>
    </section>

    <section id="tarifs" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-5 sm:px-8 md:mt-20" aria-labelledby="legende-plans">
      <Reveal>
        <Label>{t.plansLabel}</Label>
        <h2 id="legende-plans" className={styles.sectionTitle}>{t.plansTitle}</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {t.plans.map(plan => <div key={plan.name} className={`${styles.plan} ${plan.featured ? styles.planFeatured : ''}`}>
            {plan.featured && <span className={styles.planTag}>{plan.featured}</span>}
            <h3 className="text-[17px] font-semibold text-white">{plan.name}</h3>
            <p className="text-[14px] text-autopilot">{plan.tagline}</p>
            <p className="mt-4"><span className={styles.planPrice}>{plan.price}</span><span className="text-[14px] text-neutral-400">{plan.per}</span></p>
            <p className="mt-1 text-[13px] text-neutral-500">{plan.note}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.items.map(item => <li key={item} className="flex gap-2.5 text-[14.5px] leading-snug text-neutral-300">
                <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-autopilot" />{item}
              </li>)}
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
