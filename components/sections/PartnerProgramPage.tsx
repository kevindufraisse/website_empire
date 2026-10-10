'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { partnerPayHref } from '@/lib/partner-festival-pricing'
import { getPlan } from '@/lib/plans'
import { usePartnerFestivalPricing } from '@/hooks/usePartnerFestivalPricing'
import { WebinarJamBar, WebinarJamButton } from '@/components/WebinarJamRegister'
import FeaturedInSection from '@/components/FeaturedInSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import AcademyProductDemo from '@/components/AcademyProductDemo'

type Level = 'debutant' | 'confirme' | 'expert'
export type Audience = 'reconversion' | 'agency'

const RATES: Record<Level, number> = {
  debutant: 500,
  confirme: 1000,
  expert: 2000,
}

const HOURS_PER_CLIENT = 4

function trackOpen(source: string, audience: Audience) {
  trackAmplitude('academy_open_house_clicked', { source, audience })
}

export function PartnerPayLink({
  fr,
  source,
  price,
  audience,
}: {
  fr: boolean
  source: string
  price: number
  audience: Audience
}) {
  return (
    <a
      href={partnerPayHref()}
      onClick={() => trackAmplitude('academy_partner_checkout_clicked', { source, price, audience })}
      className="inline-flex h-11 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-white/20 bg-transparent px-6 text-[14px] font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.04]"
    >
      {fr
        ? audience === 'agency'
          ? `Payer ${price} € et développer mon offre`
          : `Payer ${price} € et lancer mon activité`
        : audience === 'agency'
          ? `Pay €${price} and grow my offer`
          : `Pay €${price} and launch my business`}
      <ArrowRight className="h-4 w-4" />
    </a>
  )
}

/** Ladder 500 → 700 → 800 + compte à rebours jusqu’au prochain palier. */
export function FestivalPriceBlock({
  fr,
  pricing,
}: {
  fr: boolean
  pricing: ReturnType<typeof usePartnerFestivalPricing>
}) {
  const currentIdx = pricing.tiers.findIndex((t) => t.id === pricing.tierId)
  const prev = currentIdx > 0 ? pricing.tiers[currentIdx - 1] : null
  const next = pricing.tiers[currentIdx + 1] ?? null
  // Dimanche (800) : le « suivant » est le reset lundi à 500.
  const nextPrice = next?.price ?? (pricing.tierId === 'last_chance' ? 500 : null)
  const nextLabel = next
    ? (fr ? next.labelFr : next.labelEn)
    : pricing.tierId === 'last_chance'
      ? (fr ? 'Prix du live (lundi)' : 'Live price (Monday)')
      : null

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-academy/30 bg-academy/[0.06] px-4 py-4 text-left">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-academy">
        {fr ? 'Frais d’inscription' : 'Registration fee'}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/[0.03] px-2 py-2.5 text-center ring-1 ring-white/[0.06]">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-600">
            {fr ? 'Avant' : 'Was'}
          </p>
          {prev ? (
            <>
              <p className="mt-1 text-base font-bold tabular-nums text-neutral-600 line-through decoration-neutral-500">
                {prev.price}€
              </p>
              <p className="mt-0.5 text-[9px] leading-tight text-neutral-600 line-through">
                {fr ? prev.labelFr : prev.labelEn}
              </p>
            </>
          ) : (
            <p className="mt-1 text-base font-bold tabular-nums text-neutral-700">—</p>
          )}
        </div>

        <div className="rounded-xl bg-academy px-2 py-2.5 text-center text-black">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-black/60">
            {fr ? 'Maintenant' : 'Now'}
          </p>
          <p className="mt-1 text-base font-extrabold tabular-nums">{pricing.price}€</p>
          <p className="mt-0.5 text-[9px] font-medium leading-tight text-black/70">
            {fr ? pricing.labelFr : pricing.labelEn}
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.03] px-2 py-2.5 text-center ring-1 ring-academy/25">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-academy">
            {fr ? 'Ensuite' : 'Next'}
          </p>
          {nextPrice != null ? (
            <>
              <p className="mt-1 text-base font-bold tabular-nums text-white">{nextPrice}€</p>
              <p className="mt-0.5 text-[9px] leading-tight text-neutral-400">{nextLabel}</p>
            </>
          ) : (
            <p className="mt-1 text-base font-bold tabular-nums text-neutral-700">—</p>
          )}
        </div>
      </div>

      {pricing.ready && pricing.countdown && nextPrice != null ? (
        <p className={`mt-2 text-center text-[12px] ${pricing.isUrgent ? 'font-semibold text-academy' : 'text-neutral-400'}`}>
          {fr
            ? `Une seule fois · dans ${pricing.countdown} → ${nextPrice} €`
            : `One-time · in ${pricing.countdown} → €${nextPrice}`}
        </p>
      ) : (
        <p className="mt-2 text-center text-[12px] text-neutral-500">
          {fr ? 'Paiement unique · une seule fois' : 'One-time payment'}
        </p>
      )}
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
      {children}
    </p>
  )
}

export function CtaBlock({
  fr,
  source,
  audience,
  fullWidth = false,
}: {
  fr: boolean
  source: string
  audience: Audience
  /** Aligné sur la largeur du bloc parent (ex. simulation). */
  fullWidth?: boolean
}) {
  return (
    <WebinarJamButton
      onClick={() => trackOpen(source, audience)}
      className={`inline-flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-academy px-6 py-3.5 text-black transition hover:brightness-110 ${
        fullWidth ? 'w-full' : 'mx-auto w-full max-w-md'
      }`}
    >
      <span className="inline-flex items-center gap-2 text-[15px] font-bold leading-snug">
        {fr
          ? audience === 'agency'
            ? 'Voir le modèle agence jeudi'
            : 'Voir comment lancer mon activité jeudi'
          : audience === 'agency'
            ? 'See the agency model Thursday'
            : 'See how to launch Thursday'}
        <ArrowRight className="h-4 w-4 shrink-0" />
      </span>
      <span className="text-[11px] font-medium text-black/60">
        {fr
          ? 'Gratuit · Chaque jeudi à 11 h (Paris) · 45 minutes'
          : 'Free · Every Thursday 11am (Paris) · 45 minutes'}
      </span>
    </WebinarJamButton>
  )
}

export default function PartnerProgramPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const festival = usePartnerFestivalPricing()
  const clientStarterPrice = getPlan('starter').price
  const audience: Audience = 'reconversion'
  const [level, setLevel] = useState<Level>('debutant')
  const [hours, setHours] = useState(12)
  const agency = false

  const sim = useMemo(() => {
    const clients = Math.max(1, Math.floor(hours / HOURS_PER_CLIENT))
    const rate = RATES[level]
    return { clients, monthly: clients * rate, rate }
  }, [level, hours])

  const faqs = fr
    ? [
        {
          q: 'Dois-je savoir monter des vidéos ou rédiger des posts ?',
          a: 'Empire prend en charge cette production. Vous apprenez à accompagner le client, orienter ses contenus et les valider.',
        },
        {
          q: 'Puis-je utiliser Empire avec mes clients actuels ?',
          a: 'Oui. Le programme s’adresse aux freelances et aux agences qui souhaitent accompagner des entrepreneurs dans leur présence en ligne.',
        },
        {
          q: 'Les 4 heures et les revenus annoncés sont-ils garantis ?',
          a: 'Ce sont des repères. Le temps réel et la rémunération dépendent de la mission, de votre maîtrise du système et de vos clients.',
        },
        {
          q: 'Les portes ouvertes sont-elles payantes ?',
          a: `Non. Le live du jeudi est gratuit. Les frais d’inscription au programme (actuellement ${festival.price} €) se paient ensuite — 500 € jusqu’au jeudi soir, puis 700 €, puis 800 € le dimanche. Lundi, le cycle repart à 500 €.`,
        },
        {
          q: 'Que se passe-t-il après le paiement ?',
          a: 'Vous rejoignez directement le programme : création du compte, 4 000 crédits pour développer votre marque personnelle, accès à « Mes posts les plus viraux », à la formation et à la communauté à vie, puis ouverture de votre page consultant pour encaisser vos clients.',
        },
      ]
    : [
        {
          q: 'Do I need to edit videos or write posts?',
          a: 'Empire handles that production. You learn to support the client, steer their content, and approve it.',
        },
        {
          q: 'Can I use Empire with my current clients?',
          a: 'Yes. The program is for freelancers and agencies who want to help entrepreneurs with their online presence.',
        },
        {
          q: 'Are the 4 hours and earnings guaranteed?',
          a: 'They’re benchmarks. Real time and pay depend on the mission, how well you run the system, and your clients.',
        },
        {
          q: 'Is the open house free?',
          a: `Yes. Thursday’s live is free. The registration fee (currently €${festival.price}) is paid after — €500 until Thursday evening, then €700, then €800 on Sunday. Monday resets to €500.`,
        },
        {
          q: 'What happens after payment?',
          a: 'You join the program directly: create your account, get 4,000 credits to build your personal brand, access training and the lifetime community, then open your consultant page to charge clients.',
        },
      ]

  return (
    <main className="relative bg-black pb-40 text-white antialiased">
      <WebinarJamBar buttonText={fr ? "S'inscrire" : 'Register'} />
      <Script
        id="academy-partner-senja"
        src="https://widget.senja.io/widget/2a990f91-6426-436a-b50d-318fc49a7851/platform.js"
        strategy="afterInteractive"
      />

      {/* Hero : texte d’origine, densifié pour passer au-dessus de la barre WJ */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-[4.5rem] pb-12 md:pt-20 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[40rem] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-academy">
              {fr ? 'Empire · Programme partenaire' : 'Empire · Partner program'}
            </p>
            <p className="mt-1.5 text-[14px] text-neutral-400">
              {fr
                ? agency
                  ? 'Pour les agences, studios et consultants'
                  : 'Pour une reconversion ou une nouvelle activité'
                : agency
                  ? 'For agencies, studios and consultants'
                  : 'For a career change or a new business'}
            </p>

            <nav
              aria-label={fr ? 'Choisissez votre parcours' : 'Choose your path'}
              className="mx-auto mt-4 inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] p-0.5"
            >
              {(
                [
                  {
                    id: 'reconversion' as const,
                    href: '/academy',
                    label: fr ? 'Reconversion' : 'Career change',
                  },
                  {
                    id: 'agency' as const,
                    href: '/academy/agence',
                    label: fr ? 'Agence' : 'Agency',
                  },
                ]
              ).map((option) => (
                <Link
                  key={option.id}
                  href={option.href}
                  aria-current={audience === option.id ? 'page' : undefined}
                  onClick={() => trackAmplitude('academy_audience_selected', { audience: option.id })}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                    audience === option.id
                      ? 'bg-white/[0.09] text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </nav>

            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {fr
                ? agency
                  ? 'Ajoutez une offre de personal branding à votre agence. Sans recruter une équipe de production.'
                  : 'Lancez votre activité de personal branding. Empire produit, vous pilotez.'
                : agency
                  ? 'Add a personal-branding offer to your agency. Without hiring a production team.'
                  : 'Launch your personal-branding business. Empire produces, you lead.'}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? agency
                  ? 'Vous gardez la stratégie, la relation et les décisions avec vos clients. Empire propose les sujets, rédige, monte et programme les contenus pour déployer cette offre auprès de votre portefeuille.'
                  : 'Pendant 21 jours, avancez environ 1 heure par jour pour construire votre offre, publier, prospecter et maîtriser Empire. L’objectif : être prêt à vendre et accompagner un premier client.'
                : agency
                  ? 'You keep strategy, client relationships and decisions. Empire suggests topics, writes, edits and schedules content so you can deploy the offer across your portfolio.'
                  : 'For 21 days, spend about 1 hour a day building your offer, publishing, reaching out and mastering Empire. The goal: become ready to sell and support a first client.'}
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <CtaBlock fr={fr} source="hero" audience={audience} />
              <p className="mt-2 text-[12px] text-neutral-500">
                {fr ? 'Déjà convaincu ? Rejoignez directement.' : 'Already convinced? Join right away.'}
              </p>
              <FestivalPriceBlock fr={fr} pricing={festival} />
              <PartnerPayLink fr={fr} source="hero" price={festival.price} audience={audience} />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation locale : reste accessible pendant la lecture de la page */}
      <nav
        aria-label={fr ? 'Navigation du programme partenaire' : 'Partner program navigation'}
        className="sticky top-[65px] z-40 border-b border-white/[0.08] bg-black/90 backdrop-blur-xl md:top-[73px]"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(fr
              ? [
                  ['#opportunite', 'Opportunité'],
                  ['#mission', 'Mission'],
                  ['#parcours', 'Fonctionnement'],
                  ['#simulation', 'Revenus'],
                  ['#formation', 'Formation'],
                  ['#faq', 'FAQ'],
                ]
              : [
                  ['#opportunite', 'Opportunity'],
                  ['#mission', 'Mission'],
                  ['#parcours', 'How it works'],
                  ['#simulation', 'Earnings'],
                  ['#formation', 'Training'],
                  ['#faq', 'FAQ'],
                ]
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="shrink-0 rounded-lg px-3 py-2 text-[12px] font-medium text-neutral-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                {label}
              </a>
            ))}
            <a
              href="#portes-ouvertes"
              className="ml-auto shrink-0 rounded-lg bg-academy px-3.5 py-2 text-[12px] font-bold text-black transition hover:brightness-110"
            >
              {fr ? 'Live gratuit' : 'Free live'}
            </a>
          </div>
        </div>
      </nav>

      {/* Même preuve que la home : presse puis créateurs / influenceurs */}
      <section className="w-full border-b border-white/[0.06] bg-black py-4 sm:py-5">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection accent="academy" />
        </div>
      </section>
      <TopCreatorsSection compact accent="academy" />

      {/* Opportunité et besoin client, dans un seul argument */}
      <section id="opportunite" className="scroll-mt-36 border-b border-white/[0.06] py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>{fr ? 'L’opportunité' : 'The opportunity'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? agency
                  ? 'Vos clients ont besoin de créer de la demande. Mais ils n’arrivent pas à publier seuls.'
                  : 'Les entreprises ont besoin de visibilité. Peu arrivent à publier seules.'
                : agency
                  ? 'Your clients need to create demand. But they struggle to publish on their own.'
                  : 'Businesses need visibility. Few manage to publish consistently on their own.'}
            </h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? agency
                  ? 'Quand le chiffre d’affaires ralentit, vos clients cherchent plus de visibilité et de conversations commerciales. Le personal branding devient une offre complémentaire naturelle pour votre agence.'
                  : 'Ce décalage crée une activité concrète : accompagner des entrepreneurs qui ont l’expertise, mais ni le temps, ni l’équipe, ni la méthode pour la transformer en contenus réguliers.'
                : agency
                  ? 'When revenue slows, your clients need more visibility and sales conversations. Personal branding becomes a natural complementary offer for your agency.'
                  : 'That gap creates a real business: supporting entrepreneurs who have expertise, but lack the time, team and method to turn it into consistent content.'}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {(fr
                ? [
                    ['56 %', 'des TPE interrogées ont vu leur chiffre d’affaires baisser en 2025.'],
                    ['74 %', 'des entreprises B2B disent que le contenu génère de la demande ou des leads.'],
                  ]
                : [
                    ['56%', 'of surveyed French small businesses saw revenue decline in 2025.'],
                    ['74%', 'of B2B companies say content generates demand or leads.'],
                  ]
              ).map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-academy/20 bg-academy/[0.055] p-5">
                  <p className="text-3xl font-semibold tracking-tight text-academy">{value}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-400">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-neutral-600">
              {fr ? 'Sources :' : 'Sources:'}{' '}
              <a
                href="https://sdi-pme.fr/actus_et_ressources/etat-des-lieux-des-tpe-trimestre-4-et-bilan-2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
              >
                SDI, 2025
              </a>
              {' · '}
              <a
                href="https://contentmarketinginstitute.com/b2b-research/b2b-content-marketing-trends-research-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
              >
                Content Marketing Institute, 2025
              </a>
            </p>

            <div className="mt-8 rounded-2xl border border-academy/20 bg-academy/[0.045] px-5 py-4 sm:px-6">
              <p className="text-[15px] font-medium text-white">
                {fr
                  ? 'Votre prochain client a déjà des choses à raconter.'
                  : 'Your next client already has things to say.'}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-400">
                {fr
                  ? 'Il connaît son métier, mais choisir un sujet, se filmer et publier régulièrement passe après tout le reste. Ce qui lui manque, c’est quelqu’un qui pose les bonnes questions, choisit les priorités avec lui et fait avancer les choses chaque semaine.'
                  : 'They know their craft, but choosing topics, recording and publishing consistently comes after everything else. What they need is someone who asks the right questions, sets priorities with them and keeps things moving every week.'}
              </p>
              <p className="mt-3 text-[14px] font-medium text-white">
                {fr ? 'C’est votre rôle en tant que partenaire Empire.' : 'That is your role as an Empire partner.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Mission du partenaire, sans répéter le détail de production */}
      <section id="mission" className="scroll-mt-36 border-y border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
            <SectionLabel>{fr ? 'Votre mission' : 'Your mission'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? agency
                  ? 'Faire avancer la présence de vos clients, chaque semaine.'
                  : 'Devenez la personne qui les fait enfin publier.'
                : agency
                  ? 'Move your clients’ online presence forward every week.'
                  : 'Become the person who finally gets them publishing.'}
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Vous transformez l’expertise du client en décisions : les bons sujets, les priorités, les retours et la régularité. Empire exécute la production en arrière-plan.'
                : 'You turn the client’s expertise into decisions: the right topics, priorities, feedback and consistency. Empire executes production in the background.'}
            </p>
            <p className="mt-4 text-[16px] font-medium leading-relaxed text-white">
              {fr
                ? 'Vous ne vendez pas des posts. Vous vendez le suivi qui fait enfin publier le client.'
                : 'You are not selling posts. You are selling the follow-through that finally gets the client publishing.'}
            </p>
            <p className="mt-6 text-[13px] leading-relaxed text-neutral-600">
              {fr
                ? 'Repère une fois le système pris en main : environ 4 heures par mois et par client, hors apprentissage, installation et prospection.'
                : 'Benchmark once fluent: about four hours per month per client, excluding training, setup and outreach.'}
            </p>
          </div>
        </div>
      </section>

      {/* Parcours produit réel */}
      <section id="parcours" className="scroll-mt-36 border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>{fr ? 'Le parcours, dans Empire' : 'The workflow in Empire'}</SectionLabel>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'De la sélection des sujets au calendrier du client.'
                : 'From topic selection to the client calendar.'}
            </h2>
            <AcademyProductDemo fr={fr} />
          </div>
        </div>
      </section>

      {/* Objection */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? '« Pourquoi mon client ne prendrait-il pas Empire directement ? »'
                : '“Why wouldn’t my client just take Empire directly?”'}
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
              <p>{fr ? 'Il le peut.' : 'They can.'}</p>
              <p>
                {fr
                  ? 'Mais utiliser une plateforme et avoir quelqu’un qui vous accompagne chaque semaine sont deux choses différentes.'
                  : 'But using a platform and having someone support you every week are two different things.'}
              </p>
              <p>
                {fr
                  ? 'Votre client peut manquer de temps, hésiter sur ce qu’il veut raconter ou repousser ses enregistrements.'
                  : 'Your client may lack time, hesitate on what to say, or keep postponing recordings.'}
              </p>
              <p className="font-medium text-neutral-200">
                {fr
                  ? 'Vous apportez le suivi, le contexte et les décisions qui font avancer sa présence en ligne.'
                  : 'You bring the follow-through, context and decisions that move their presence forward.'}
              </p>
              <p className="text-white">
                {fr
                  ? 'Empire vous aide à réaliser la prestation. La relation avec le client, c’est vous.'
                  : 'Empire helps you deliver the work. The client relationship is yours.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rémunération + simu */}
      <section id="simulation" className="scroll-mt-36 border-y border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>{fr ? 'Votre activité' : 'Your business'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Qu’est-ce que cela peut représenter pour votre activité ?'
                  : 'What could this mean for your business?'}
              </h2>
              <p className="mt-5 text-[16px] text-neutral-400">
                {fr
                  ? 'Avant de simuler vos revenus, voici précisément ce que paie le client et ce qui reste à votre charge.'
                  : 'Before estimating revenue, here is exactly what the client pays and what remains your responsibility.'}
              </p>
            </div>

            <dl className="mt-10 grid gap-3 sm:grid-cols-2">
              {(fr
                ? [
                    {
                      t: 'Vos honoraires',
                      d: 'Vous fixez le prix de votre accompagnement. Repères indicatifs : environ 500 € au démarrage, puis 1 000 € ou plus avec l’expérience.',
                    },
                    {
                      t: 'La production Empire',
                      d: `Le client paie séparément son abonnement de production, à partir de ${clientStarterPrice} € / mois. Ce montant ne vient pas réduire vos honoraires.`,
                    },
                    {
                      t: 'Votre temps',
                      d: 'Une fois le système maîtrisé, le repère est d’environ 4 h par mois et par client. L’apprentissage, l’installation et la prospection sont en plus.',
                    },
                    {
                      t: 'Vos clients',
                      d: 'Vous les trouvez grâce à votre contenu, vos recommandations et votre prospection. Empire peut proposer des missions, sans les garantir.',
                    },
                  ]
                : [
                    {
                      t: 'Your fees',
                      d: 'You set the price of your support. Benchmarks: around €500 when starting, then €1,000 or more with experience.',
                    },
                    {
                      t: 'Empire production',
                      d: `The client separately pays for production, starting at €${clientStarterPrice} / month. This does not reduce your fees.`,
                    },
                    {
                      t: 'Your time',
                      d: 'Once fluent, the benchmark is about four hours per client per month. Training, setup and outreach are additional.',
                    },
                    {
                      t: 'Your clients',
                      d: 'You find them through content, referrals and outreach. Empire may offer missions, but does not guarantee them.',
                    },
                  ]
              ).map((row) => (
                <div key={row.t} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <dt className="text-[15px] font-semibold text-white">{row.t}</dt>
                  <dd className="mt-2 text-[13px] leading-relaxed text-neutral-500">{row.d}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-center text-[12px] text-neutral-600">
              {fr
                ? 'Vos honoraires dépendent de votre expérience, de la mission et du client. Ils sont indiqués avant frais, charges et impôts.'
                : 'Your fees depend on experience, mission and client. Figures are before fees, costs and tax.'}
            </p>

            <div className="mt-14">
              <h3 className="text-center text-xl font-semibold tracking-tight">
                {fr ? 'Faites votre simulation.' : 'Run your simulation.'}
              </h3>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-[13px] font-medium text-neutral-400">
                    {fr ? 'Votre niveau' : 'Your level'}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'debutant' as const, label: fr ? 'Débutant' : 'Beginner' },
                        { id: 'confirme' as const, label: fr ? 'Confirmé' : 'Solid' },
                        { id: 'expert' as const, label: fr ? 'Expert' : 'Expert' },
                      ]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLevel(opt.id)}
                        className={`rounded-xl px-3 py-3 text-[13px] font-semibold transition ${
                          level === opt.id
                            ? 'bg-academy text-black'
                            : 'bg-white/[0.04] text-neutral-300 ring-1 ring-white/10 hover:bg-white/[0.07]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium text-neutral-400">
                      {fr ? 'Votre disponibilité' : 'Your availability'}
                    </p>
                    <p className="text-[14px] font-semibold text-white">
                      {hours} h / {fr ? 'mois' : 'month'}
                    </p>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={40}
                    step={4}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="mt-3 w-full accent-[#fca5a5]"
                  />
                  <p className="mt-2 text-[12px] text-neutral-600">
                    {fr
                      ? 'Combien d’heures par mois souhaitez-vous consacrer à vos clients ?'
                      : 'How many hours per month do you want to spend with clients?'}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] px-5 py-5 ring-1 ring-white/[0.08]">
                  <p className="text-[13px] font-medium text-neutral-400">
                    {fr ? 'Votre résultat' : 'Your result'}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[12px] text-neutral-500">
                        {fr ? 'Clients accompagnés' : 'Clients supported'}
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-white">{sim.clients}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-500">
                        {fr ? 'Honoraires mensuels estimés' : 'Estimated monthly fees'}
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-academy">
                        {fr
                          ? `~${sim.monthly.toLocaleString('fr-FR')} €`
                          : `~€${sim.monthly.toLocaleString('en-US')}`}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-neutral-600">
                    {fr
                      ? `Base indicative : ${HOURS_PER_CLIENT} h par mois et par client · ~${sim.rate} € / client. Le calcul suppose que les clients sont déjà signés.`
                      : `Indicative base: ${HOURS_PER_CLIENT} h per month per client · ~€${sim.rate} / client. Assumes clients are already signed.`}
                  </p>
                </div>
              </div>

              <div className="mt-10 w-full">
                <CtaBlock fr={fr} source="simulation" audience={audience} fullWidth />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* La preuve valide la projection, puis la porte ouverte devient la conclusion */}
      <section className="border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div>
              <SectionLabel>{fr ? 'Ils sont passés par Empire' : 'They use Empire'}</SectionLabel>
              <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Ce qu’ils disent après avoir utilisé le système.'
                  : 'What they say after using the system.'}
              </h2>
              <div
                className="senja-embed mt-8 w-full"
                data-id="2a990f91-6426-436a-b50d-318fc49a7851"
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div id="portes-ouvertes" className="mt-16 scroll-mt-36 border-t border-white/[0.08] pt-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionLabel>{fr ? 'Portes ouvertes' : 'Open house'}</SectionLabel>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {fr ? 'Je vous montre tout ça jeudi.' : 'I’ll show you all of this on Thursday.'}
                </h2>

                <div className="mt-6 flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-academy/40">
                    <Image
                      src="/founders/kevin.jpg"
                      alt="Kevin Dufraisse"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-white">Kevin Dufraisse</p>
                    <p className="text-[13px] text-neutral-500">
                      {fr ? 'Fondateur d’Empire Internet' : 'Founder of Empire Internet'}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[16px] leading-relaxed text-neutral-400">
                  {fr
                    ? 'Avec Marc, nous organisons des portes ouvertes pour vous montrer le fonctionnement du programme et répondre à vos questions.'
                    : 'With Marc, we run open houses to show how the program works and answer your questions.'}
                </p>
              </div>

              <div className="lg:pt-8">
                <p className="text-[15px] font-medium text-white">
                  {fr ? 'Pendant 45 minutes, vous allez voir :' : 'In 45 minutes, you’ll see:'}
                </p>
                <ul className="mt-4 space-y-3">
                  {(fr
                    ? [
                        'Comment un partenaire accompagne un client dans Empire.',
                        'Ce que vous faites et ce que la plateforme prend en charge.',
                        'Comment fonctionnent les missions, la rémunération et les crédits.',
                        'Comment se déroule la formation et comment rejoindre le programme.',
                      ]
                    : [
                        'How a partner supports a client inside Empire.',
                        'What you do vs what the platform handles.',
                        'How missions, pay and credits work.',
                        'How training works and how to join the program.',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-3 text-[14px] text-neutral-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" strokeWidth={2.5} />
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <CtaBlock fr={fr} source="section" audience={audience} />
                </div>
                <p className="mt-4 text-[13px] text-neutral-600">
                  {fr
                    ? `Gratuit · Chaque jeudi à 11 h (Paris) · Après le live, inscription au programme : ${festival.price} €.`
                    : `Free · Every Thursday at 11am Paris · After the live, program registration: €${festival.price}.`}
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamp */}
      <section id="formation" className="scroll-mt-36 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
            <SectionLabel>{fr ? 'Formation' : 'Training'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? agency
                  ? '1 heure par jour pour déployer votre offre en 21 jours.'
                  : '1 heure par jour. 1 action concrète. Pendant 21 jours.'
                : agency
                  ? '1 hour a day to deploy your offer in 21 days.'
                  : '1 hour a day. 1 concrete action. For 21 days.'}
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
              <p>
                {fr
                  ? agency
                    ? 'Ce n’est pas une formation passive. Chaque jour, vous consacrez environ 1 heure à une action autonome pour structurer l’offre, maîtriser Empire et installer votre processus de production.'
                    : 'Ce n’est pas une formation passive à terminer avant de commencer. Le bootcamp est autonome et à votre rythme : chaque jour, vous réalisez en environ 1 heure une action qui fait avancer votre maîtrise d’Empire, votre contenu ou votre prospection.'
                  : agency
                    ? 'This is not a passive course. Each day, spend about 1 hour on one self-paced action to structure the offer, master Empire and install your production workflow.'
                    : 'This is not a passive course you have to finish before getting started. The bootcamp is self-paced and action-based: each day, you spend about 1 hour completing one step that advances your Empire skills, content or outreach.'}
              </p>
              <p>
                {fr
                  ? agency
                    ? 'Dès la première semaine, vous pouvez sélectionner un client pilote dans votre portefeuille, créer les premiers contenus avec vos 4 000 crédits et lui présenter cette nouvelle offre.'
                    : 'Vous commencez à publier et à prospecter dès la première semaine. Avec vos 4 000 crédits, vous adaptez des formats issus de « Mes posts les plus viraux », créez vos contenus dans Empire et présentez votre offre à de vrais prospects.'
                  : agency
                    ? 'In week one, you can select a pilot client from your portfolio, create the first content with your 4,000 credits and present the new offer.'
                    : 'You start publishing and reaching out in week one. With your 4,000 credits, you adapt formats from “My most viral posts,” create content in Empire and present your offer to real prospects.'}
              </p>
              <p className="font-medium text-neutral-200">
                {fr
                  ? agency
                    ? 'Vous apprenez en déployant — sur votre agence ou sur un premier client pilote.'
                    : 'Vous apprenez en faisant — et votre personal branding devient votre première vitrine.'
                  : agency
                    ? 'You learn by deploying — on your agency or with a first pilot client.'
                    : 'You learn by doing — and your personal brand becomes your first showcase.'}
              </p>
              <p>
                {fr
                  ? agency
                    ? 'L’objectif au jour 21 : disposer d’une offre claire, d’un processus maîtrisé et d’une démonstration concrète à présenter à vos clients existants.'
                    : 'L’objectif au jour 21 : maîtriser la plateforme et être prêt à convertir un premier client — avec une offre claire, des contenus publiés, une prospection lancée et le processus d’accompagnement en main.'
                  : agency
                    ? 'The day-21 goal: have a clear offer, a mastered workflow and a concrete demonstration to present to existing clients.'
                    : 'The day-21 goal: master the platform and be ready to convert a first client — with a clear offer, published content, active outreach and a working client-delivery process.'}
              </p>
              <p className="text-white">
                {fr
                  ? agency
                    ? 'Certaines agences peuvent présenter ou vendre l’offre dès la première semaine. Ce résultat n’est pas garanti : il dépend de votre portefeuille, de votre exécution et de votre positionnement.'
                    : 'Certains participants peuvent obtenir dès la première semaine des contenus à forte portée, des conversations avec des prospects, voire un premier client. Ce ne sont pas des résultats garantis : ils varient selon votre exécution, votre marché, vos sujets et votre régularité.'
                  : agency
                    ? 'Some agencies may present or sell the offer in week one. This is not guaranteed: results depend on your portfolio, execution and positioning.'
                    : 'Some participants may see high-reach content, prospect conversations or even a first client in week one. These outcomes are not guaranteed: results vary with your execution, market, topics and consistency.'}
              </p>
            </div>

            <h3 className="mt-12 text-xl font-semibold tracking-tight">
              {fr ? 'Votre progression, une action par jour.' : 'Your progress, one action a day.'}
            </h3>
            <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {(fr
                ? agency
                  ? [
                      {
                        t: 'Semaine 1 — Construire l’offre agence',
                        d: 'Vous choisissez le positionnement, identifiez un client pilote et créez une première démonstration avec Empire.',
                      },
                      {
                        t: 'Semaine 2 — Installer la production',
                        d: 'Vous maîtrisez les sujets, les validations, la création et le calendrier pour livrer une prestation régulière.',
                      },
                      {
                        t: 'Semaine 3 — Déployer sur le portefeuille',
                        d: 'Vous apprenez à présenter l’offre, organiser l’onboarding et la proposer à vos clients existants ou en marque blanche.',
                      },
                    ]
                  : [
                      {
                        t: 'Semaine 1 — Publier et prospecter immédiatement',
                        d: 'Vous configurez Empire, clarifiez votre offre, adaptez vos premiers formats, publiez et lancez vos premières conversations avec des prospects.',
                      },
                      {
                        t: 'Semaine 2 — Maîtriser la production dans Empire',
                        d: 'Vous utilisez vos crédits pour créer plus vite, publier régulièrement, lire les premiers signaux et construire une preuve visible de votre savoir-faire.',
                      },
                      {
                        t: 'Semaine 3 — Devenir prêt pour un premier client',
                        d: 'Vous apprenez à présenter votre accompagnement, conduire l’entretien, organiser la prestation et ouvrir votre page consultant.',
                      },
                    ]
                : agency
                  ? [
                      {
                        t: 'Week 1 — Build the agency offer',
                        d: 'Choose the positioning, identify a pilot client and create a first demonstration with Empire.',
                      },
                      {
                        t: 'Week 2 — Install production',
                        d: 'Master topics, approvals, creation and scheduling to deliver a consistent service.',
                      },
                      {
                        t: 'Week 3 — Deploy across the portfolio',
                        d: 'Learn to present the offer, organize onboarding and sell it to existing clients or white-label partners.',
                      },
                    ]
                  : [
                      {
                        t: 'Week 1 — Publish and reach out immediately',
                        d: 'Set up Empire, clarify your offer, adapt your first formats, publish and start your first prospect conversations.',
                      },
                      {
                        t: 'Week 2 — Master production in Empire',
                        d: 'Use your credits to create faster, publish consistently, read the first signals and build visible proof of your skills.',
                      },
                      {
                        t: 'Week 3 — Become first-client ready',
                        d: 'Learn to present your service, run the interview, organize delivery and open your consultant page.',
                      },
                    ]
              ).map((row) => (
                <div key={row.t} className="py-5">
                  <p className="text-[15px] font-semibold text-white">{row.t}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-500">{row.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[14px] text-neutral-500">
              {fr
                ? 'Chaque semaine, la communauté vous aide à avancer et à débloquer vos questions. La formation, les replays, le Slack et les rendez-vous partenaires restent accessibles à vie.'
                : 'Every week, the community helps you move forward and unblock questions. Training, replays, Slack and partner sessions remain available for life.'}
            </p>
          </div>
        </div>
      </section>

      {/* Inclus 500€ */}
      <section className="border-y border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
            <SectionLabel>{fr ? 'Le programme' : 'The program'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Ce que comprend le programme partenaire.'
                : 'What’s included in the partner program.'}
            </h2>
            <p className="mt-5 text-[17px] font-medium text-white">
              {fr
                ? `Frais d’inscription actuels : ${festival.price} €, payés une fois.`
                : `Current registration fee: €${festival.price}, paid once.`}
            </p>
            <p className="mt-2 text-[14px] text-neutral-500">
              {fr
                ? '500 € jusqu’au jeudi soir · 700 € après le live · 800 € le dimanche · retour à 500 € chaque lundi.'
                : '€500 until Thursday evening · €700 after the live · €800 on Sunday · back to €500 every Monday.'}
            </p>
            <ul className="mt-8 space-y-3">
              {(fr
                ? [
                    'La formation complète et les replays.',
                    'Le bootcamp autonome : 1 action concrète par jour, environ 1 h / jour pendant 21 jours.',
                    'La communauté, le Slack et les rendez-vous partenaires accessibles à vie.',
                    'Les templates de prospection et les méthodes de vente.',
                    'Les sujets, formats et processus d’accompagnement.',
                    '« Mes posts les plus viraux » pour repartir de formats qui fonctionnent.',
                    '4 000 crédits pour développer votre marque personnelle dès le premier mois.',
                    'Votre page consultant pour encaisser l’accompagnement de vos clients.',
                  ]
                : [
                    'Full training and replays.',
                    'The self-paced bootcamp: 1 concrete action a day, about 1 hour/day for 21 days.',
                    'Lifetime access to the community, Slack and partner sessions.',
                    'Outreach templates and sales methods.',
                    'Topics, formats and support process.',
                    '“My most viral posts” to adapt formats that already work.',
                    '4,000 credits to grow your personal brand in the first month.',
                    'Your consultant page to charge clients for support.',
                  ]
              ).map((line) => (
                <li key={line} className="flex gap-3 text-[15px] leading-snug text-neutral-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PartnerPayLink fr={fr} source="program" price={festival.price} audience={audience} />
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-neutral-500">
              {fr
                ? 'Chaque client dispose de son propre espace Empire. Son abonnement (crédits de production) se paie à part, sur votre page.'
                : 'Each client has their own Empire account. Their subscription (production credits) is billed separately on your page.'}
            </p>

            <h3 className="mt-12 text-xl font-semibold tracking-tight">
              {fr ? 'Et les clients ?' : 'And clients?'}
            </h3>
            <p className="mt-4 text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Vous pouvez développer votre portefeuille grâce à votre contenu, aux recommandations et à la prospection.'
                : 'You can grow your book through your content, referrals and outreach.'}
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Des missions peuvent également être proposées par Empire selon les besoins du réseau, votre profil et votre disponibilité. Le programme ne garantit pas de mission.'
                : 'Missions may also be proposed by Empire based on network needs, your profile and availability. The program does not guarantee a mission.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-36 border-t border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Quelques réponses avant de nous rencontrer.'
                  : 'A few answers before we meet.'}
              </h2>
            </div>
            <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {faqs.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="cursor-pointer list-none text-[15px] font-semibold tracking-tight text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {item.q}
                      <span className="mt-0.5 text-neutral-600 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 text-[14px] leading-relaxed text-neutral-500">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-16 text-center">
              <CtaBlock fr={fr} source="faq" audience={audience} />
              <p className="mt-5 text-[12px] text-neutral-500">
                {fr ? 'Déjà convaincu ? Vous pouvez rejoindre directement.' : 'Already convinced? You can join directly.'}
              </p>
              <div className="mx-auto mt-3 max-w-md">
                <PartnerPayLink fr={fr} source="faq" price={festival.price} audience={audience} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
