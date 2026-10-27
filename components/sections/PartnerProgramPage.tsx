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
import { SocialIcons } from '@/components/ui/social-icons'

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
      className="mx-auto inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-academy px-6 text-[14px] font-bold text-black transition hover:brightness-110"
    >
      {fr
        ? audience === 'agency'
          ? `Rejoindre l’Academy · ${price} €`
          : `Rejoindre l’Academy · ${price} €`
        : audience === 'agency'
          ? `Join the Academy · €${price}`
          : `Join the Academy · €${price}`}
      <ArrowRight className="h-4 w-4" />
    </a>
  )
}

/** « 2 j 05:12:09 » au-delà de 24 h, sinon « 05:12:09 ». */
function priceCountdown(ms: number, fr: boolean): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  const clock = `${pad(h)}:${pad(m)}:${pad(sec)}`
  return d > 0 ? `${d} ${fr ? 'j' : 'd'} ${clock}` : clock
}

/** Prix du bootcamp cette semaine. Seul prix barré : le palier qui arrive, s'il est plus cher. */
export function FestivalPriceBlock({
  fr,
  pricing,
}: {
  fr: boolean
  pricing: ReturnType<typeof usePartnerFestivalPricing>
}) {
  const nextIsIncrease = pricing.nextPrice !== null && pricing.nextPrice > pricing.price

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-academy/30 bg-academy/[0.06] px-4 py-4 text-left">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-academy">
        {fr ? 'Bootcamp 21 jours · live chaque mercredi' : '21-day bootcamp · live every Wednesday'}
      </p>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
        {nextIsIncrease && (
          <span className="text-2xl font-bold tabular-nums text-neutral-600 line-through decoration-neutral-500">
            {pricing.nextPrice} €
          </span>
        )}
        <span className="text-4xl font-extrabold tabular-nums text-white">{pricing.price} €</span>
        <span className="text-sm text-neutral-500">{fr ? 'une fois' : 'one-time'}</span>
      </p>

      {/* Trois paliers façon ticketing : le palier courant est mis en avant. */}
      <div className="mt-4 space-y-1.5">
        {pricing.tiers.map((tier, i) => {
          const isCurrent = tier.id === pricing.tierId
          const isPast = i < pricing.tiers.findIndex((t) => t.id === pricing.tierId)
          return (
            <div
              key={tier.id}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                isCurrent ? 'bg-academy/15 ring-1 ring-academy/40' : ''
              }`}
            >
              <span className={`text-[12px] ${isCurrent ? 'font-semibold text-white' : 'text-neutral-500'}`}>
                {fr ? tier.labelFr : tier.labelEn}
                {isCurrent && (
                  <span className="ml-2 rounded bg-academy px-1.5 py-0.5 text-[10px] font-bold text-black">
                    {fr ? 'actuel' : 'current'}
                  </span>
                )}
              </span>
              <span className={`text-[13px] tabular-nums ${isCurrent ? 'font-bold text-white' : 'text-neutral-500'}`}>
                {isPast ? (fr ? 'Complet' : 'Full') : `${tier.price} €`}
              </span>
            </div>
          )
        })}
      </div>

      {nextIsIncrease && pricing.ready && (
        <p className="mt-3 text-[12px] text-neutral-400">
          {fr ? 'Ce palier passe au suivant dans' : 'This tier moves to the next in'}{' '}
          <span className="font-mono font-semibold tabular-nums text-academy">
            {priceCountdown(pricing.msUntilNext, fr)}
          </span>
        </p>
      )}

      <p className="mt-3 text-[12px] leading-snug text-neutral-500">
        {fr
          ? 'Le live d’onboarding est chaque mercredi. Inscris-toi avant mercredi pour démarrer cette semaine.'
          : 'The onboarding live is every Wednesday. Register before Wednesday to start this week.'}
      </p>
      <p className="mt-1.5 text-[12px] text-neutral-500">
        {fr ? 'Accès immédiat, à ton rythme. Pas d’abonnement.' : 'Instant access, at your own pace. No subscription.'}
      </p>
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

const ACADEMY_PLATFORMS = [
  { name: 'LinkedIn', Icon: SocialIcons.linkedin },
  { name: 'Instagram', Icon: SocialIcons.instagram },
  { name: 'TikTok', Icon: SocialIcons.tiktok },
  { name: 'YouTube', Icon: SocialIcons.youtube },
  { name: 'X', Icon: SocialIcons.twitter },
  { name: 'Threads', Icon: SocialIcons.threads },
  { name: 'Facebook', Icon: SocialIcons.facebook },
  { name: 'Newsletter', Icon: SocialIcons.newsletter },
]

export function AcademyPlatformLogos({ fr }: { fr: boolean }) {
  return (
    <div className="mx-auto mt-5 flex w-fit max-w-full flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 sm:flex-row sm:gap-4">
      <span className="shrink-0 text-[11px] font-medium text-neutral-500">
        {fr ? '7 réseaux + newsletter' : '7 networks + newsletter'}
      </span>
      <div className="flex items-center justify-center gap-3">
        {ACADEMY_PLATFORMS.map(({ name, Icon }) => (
          <span
            key={name}
            role="img"
            aria-label={name}
            title={name}
            className="flex h-5 w-5 items-center justify-center"
          >
            <Icon />
          </span>
        ))}
      </div>
    </div>
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
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/[0.08] px-6 text-white transition hover:border-white/60 hover:bg-white/[0.14] ${
        fullWidth ? 'w-full' : 'mx-auto w-full max-w-md'
      }`}
    >
      <span className="text-[15px] font-bold leading-snug">
        {fr ? "S'inscrire aux portes ouvertes" : 'Register for the open house'}
      </span>
      <span className="text-[11px] font-medium text-neutral-400">
        {fr ? '· Gratuit' : '· Free'}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0" />
    </WebinarJamButton>
  )
}

/** Stack de valeur (Russell Brunson) : chaque élément porte une valeur indicative,
 *  la somme donne le « total » barré face au prix du bootcamp. `value: null`
 *  = avantage sans valeur fixe (missions), affiché « Variable » et exclu du total. */
type ValueLine = { label: string; value: number | null }
type ValueGroup = { title: string; lines: ValueLine[] }

const VALUE_STACK: Record<'fr' | 'en', ValueGroup[]> = {
  fr: [
    {
      title: 'Le bootcamp',
      lines: [
        { label: 'Bootcamp de 21 jours accessible immédiatement (début après paiement)', value: 1497 },
        { label: 'Accès à vie à la communauté de créateurs', value: 497 },
        { label: 'Mises à jour et nouveautés offertes', value: 197 },
      ],
    },
    {
      title: 'Les lives et les crédits',
      lines: [
        { label: 'Live chaque mercredi (1 an)', value: 1997 },
        { label: '6 h de replays à suivre', value: 497 },
        { label: '4 000 crédits offerts pour utiliser Empire (la machine à contenu)', value: 297 },
        { label: 'Certification Empire (or, argent, bronze)', value: 497 },
      ],
    },
    {
      title: 'Pour produire',
      lines: [
        { label: 'Templates viraux directement dans votre calendrier', value: 297 },
        { label: 'Partage (secret) des posts les plus efficaces chaque semaine', value: 997 },
      ],
    },
    {
      title: 'Pour trouver des clients',
      lines: [
        { label: 'Ajout dans l’annuaire', value: 197 },
        { label: 'Réception de missions venant du site', value: null },
        { label: 'Cours « comment trouver des clients Empire »', value: 497 },
        { label: 'Page de paiement incluse', value: 197 },
      ],
    },
    {
      title: 'Pour vendre',
      lines: [
        { label: 'Templates de closing', value: 297 },
        { label: 'Templates de setting', value: 297 },
      ],
    },
  ],
  en: [
    {
      title: 'The bootcamp',
      lines: [
        { label: '21-day bootcamp, accessible immediately (starts after payment)', value: 1497 },
        { label: 'Lifetime access to the creators’ community', value: 497 },
        { label: 'Updates and new features included', value: 197 },
      ],
    },
    {
      title: 'Lives and credits',
      lines: [
        { label: 'Live every Wednesday (1 year)', value: 1997 },
        { label: '6 hours of replays to follow', value: 497 },
        { label: '4,000 free credits to use Empire (the content machine)', value: 297 },
        { label: 'Empire certification (gold, silver, bronze)', value: 497 },
      ],
    },
    {
      title: 'To produce',
      lines: [
        { label: 'Viral templates directly in your calendar', value: 297 },
        { label: 'Secret share of the most effective posts each week', value: 997 },
      ],
    },
    {
      title: 'To find clients',
      lines: [
        { label: 'Added to the directory', value: 197 },
        { label: 'Missions from the site', value: null },
        { label: '« How to find Empire clients » course', value: 497 },
        { label: 'Payment page included', value: 197 },
      ],
    },
    {
      title: 'To sell',
      lines: [
        { label: 'Closing templates', value: 297 },
        { label: 'Setting templates', value: 297 },
      ],
    },
  ],
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
          a: `Non. La présentation enregistrée est gratuite. Vous pouvez regarder le replay immédiatement ou choisir une session, dont l’horaire est affiché dans votre fuseau lors de l’inscription. Le bootcamp (actuellement ${festival.price} €) se paie ensuite : 297 € le lundi, 397 € le mardi, 497 € à partir du mercredi. Lundi, il repart à 297 €.`,
        },
        {
          q: 'Que se passe-t-il après le paiement ?',
          a: 'Vous créez votre compte avec l’email du paiement, et le bootcamp s’ouvre tout de suite : les 21 vidéos, les replays et la communauté. Vous avancez à votre rythme, sans cohorte ni date à tenir.',
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
          a: `Yes. The recorded presentation is free. Watch the replay immediately or choose a session; its time is shown in your time zone when you register. The bootcamp (currently €${festival.price}) is paid after: €297 on Monday, €397 on Tuesday, €497 from Wednesday. Monday resets to €297.`,
        },
        {
          q: 'What happens after payment?',
          a: 'You create your account with the payment email, and the bootcamp opens right away: the 21 videos, the replays and the community. You move at your own pace, with no cohort or deadline.',
        },
      ]

  return (
    <main className="relative bg-black pb-40 text-white antialiased">
      <Script
        id="academy-partner-senja"
        src="https://widget.senja.io/widget/2a990f91-6426-436a-b50d-318fc49a7851/platform.js"
        strategy="lazyOnload"
      />
      <WebinarJamBar buttonText={fr ? "S'inscrire" : 'Register'} />

      {/* Hero : texte d’origine, densifié pour passer au-dessus de la barre WJ */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-[4.5rem] pb-12 md:pt-20 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[40rem] text-center">
            <nav
              aria-label={fr ? 'Choisissez votre parcours' : 'Choose your path'}
              className="mx-auto mb-5 inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] p-0.5"
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
                  : 'Devenez Content Operator pour entrepreneurs en 21 jours.'
                : agency
                  ? 'Add a personal-branding offer to your agency. Without hiring a production team.'
                  : 'Become a Content Operator for entrepreneurs in 21 days.'}
            </h1>
            {!agency && (
              <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white sm:text-xl">
                {fr
                  ? 'Gagnez 3 000 € par mois en 6 h par semaine, en accompagnant des entrepreneurs avec Empire.'
                  : 'Earn €3,000 a month in 6 hours a week, coaching entrepreneurs with Empire.'}
              </p>
            )}
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <PartnerPayLink fr={fr} source="hero" price={festival.price} audience={audience} />
              <CtaBlock fr={fr} source="hero" audience={audience} />
              <FestivalPriceBlock fr={fr} pricing={festival} />
            </div>
            <dl className="mx-auto mt-6 grid max-w-2xl grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.08] py-4">
              {(fr
                ? [
                    ['21 jours', 'pour maîtriser le système'],
                    ['~4 h', 'par mois et par client*'],
                    ['500–2 000 €', 'd’honoraires indicatifs'],
                  ]
                : [
                    ['21 days', 'to master the system'],
                    ['~4 hrs', 'per month, per client*'],
                    ['€500–2,000', 'indicative monthly fees'],
                  ]
              ).map(([value, label]) => (
                <div key={value} className="px-2 sm:px-4">
                  <dt className="text-[15px] font-semibold text-white sm:text-lg">{value}</dt>
                  <dd className="mt-1 text-[10px] leading-snug text-neutral-500 sm:text-[11px]">{label}</dd>
                </div>
              ))}
            </dl>
            <p className="mx-auto mt-2 max-w-xl text-[10px] leading-relaxed text-neutral-600">
              {fr
                ? '*Une fois le système maîtrisé, hors apprentissage, installation et prospection. Honoraires variables selon la mission et le client.'
                : '*Once fluent, excluding training, setup and outreach. Fees vary by engagement and client.'}
            </p>
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
              href={partnerPayHref()}
              className="ml-auto shrink-0 rounded-lg bg-academy px-3.5 py-2 text-[12px] font-bold text-black transition hover:brightness-110"
            >
              {fr ? 'Rejoindre l’Academy' : 'Join the Academy'}
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

            <div className="mt-10 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                  {fr ? 'Sans infrastructure' : 'Without infrastructure'}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {fr ? 'Vous vendez votre temps de production.' : 'You sell production time.'}
                </h3>
                <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-neutral-500">
                  {(fr
                    ? [
                        'Trouver les sujets et écrire chaque publication.',
                        'Monter les vidéos et gérer les fichiers.',
                        'Multiplier les heures à chaque nouveau client.',
                      ]
                    : [
                        'Find topics and write every post.',
                        'Edit videos and manage all the files.',
                        'Add more hours with every new client.',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden className="text-neutral-700">-</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-academy/25 bg-academy/[0.055] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-academy">
                  {fr ? 'Avec Empire' : 'With Empire'}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {fr ? 'Vous vendez le pilotage et la régularité.' : 'You sell leadership and consistency.'}
                </h3>
                <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-neutral-300">
                  {(fr
                    ? [
                        'Vous choisissez les priorités avec le client.',
                        'Empire rédige, monte et organise la production.',
                        'Votre temps reste centré sur la relation et les décisions.',
                      ]
                    : [
                        'You choose priorities with the client.',
                        'Empire writes, edits and organizes production.',
                        'Your time stays focused on relationships and decisions.',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
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

            <div className="mt-10 border-y border-white/[0.08]">
              <p className="py-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-academy">
                {fr ? 'Concrètement, avec un client' : 'In practice, with one client'}
              </p>
              {(fr
                ? [
                    ['01', 'Préparer', 'Vous sélectionnez les sujets adaptés à son expertise et à ses priorités.'],
                    ['02', 'Échanger', 'Vous guidez la session pour l’aider à exprimer ses meilleures idées.'],
                    ['03', 'Valider', 'Vous relisez les contenus produits par Empire et centralisez les retours.'],
                    ['04', 'Piloter', 'Vous organisez le calendrier et suivez ce qui fonctionne.'],
                  ]
                : [
                    ['01', 'Prepare', 'Select topics adapted to their expertise and priorities.'],
                    ['02', 'Interview', 'Guide the session so they can express their strongest ideas.'],
                    ['03', 'Approve', 'Review content produced by Empire and centralize feedback.'],
                    ['04', 'Lead', 'Organize the calendar and track what works.'],
                  ]
              ).map(([number, title, description]) => (
                <div key={number} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-white/[0.08] py-5 sm:grid-cols-[2.5rem_7rem_1fr]">
                  <span className="text-[12px] font-semibold text-academy">{number}</span>
                  <p className="text-[15px] font-semibold text-white">{title}</p>
                  <p className="col-start-2 text-[14px] leading-relaxed text-neutral-500 sm:col-start-auto">{description}</p>
                </div>
              ))}
            </div>
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
                      hl: '4 h par mois et par client',
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
                      hl: 'four hours per client per month',
                    },
                    {
                      t: 'Your clients',
                      d: 'You find them through content, referrals and outreach. Empire may offer missions, but does not guarantee them.',
                    },
                  ]
              ).map((row) => (
                <div key={row.t} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <dt className="text-[15px] font-semibold text-white">{row.t}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-neutral-400">
                    {'hl' in row && row.hl ? (
                      <>
                        {row.d.split(row.hl)[0]}
                        <strong className="font-semibold text-white">{row.hl}</strong>
                        {row.d.split(row.hl)[1]}
                      </>
                    ) : row.d}
                  </dd>
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
                <PartnerPayLink fr={fr} source="simulation" price={festival.price} audience={audience} />
                <div className="mt-3"><CtaBlock fr={fr} source="simulation" audience={audience} fullWidth /></div>
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
                  {fr ? 'Je vous montre le parcours, étape par étape.' : 'I’ll show you the workflow, step by step.'}
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
                ? 'Dans cette présentation enregistrée, je vous montre le fonctionnement du programme. Regardez le replay immédiatement ou choisissez une session. L’horaire affiché à l’inscription est celui de votre fuseau. Pour vos questions, répondez à l’email de confirmation.'
                : 'This recorded presentation shows how the program works. Watch the replay immediately or choose a session. Registration times are shown in your time zone. For questions, reply to your confirmation email.'}
                </p>
              </div>

              <div className="lg:pt-8">
                <p className="text-[15px] font-medium text-white">
                  {fr ? 'En un peu plus d’une heure, vous allez voir :' : 'In just over an hour, you’ll see:'}
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
                    ? 'Dès la première semaine, vous pouvez sélectionner un client pilote dans votre portefeuille, créer ses premiers contenus dans Empire et lui présenter cette nouvelle offre.'
                    : 'Vous commencez à publier et à prospecter dès la première semaine. Vous adaptez des formats issus de « Mes posts les plus viraux », créez vos contenus dans Empire et présentez votre offre à de vrais prospects.'
                  : agency
                    ? 'In week one, you can select a pilot client from your portfolio, create their first content in Empire and present the new offer.'
                    : 'You start publishing and reaching out in week one. You adapt formats from “My most viral posts,” create content in Empire and present your offer to real prospects.'}
              </p>
              <p className="font-medium text-neutral-200">
                {fr
                  ? agency
                    ? 'Vous apprenez en déployant - sur votre agence ou sur un premier client pilote.'
                    : 'Vous apprenez en faisant - et votre personal branding devient votre première vitrine.'
                  : agency
                    ? 'You learn by deploying - on your agency or with a first pilot client.'
                    : 'You learn by doing - and your personal brand becomes your first showcase.'}
              </p>
              <p>
                {fr
                  ? agency
                    ? 'L’objectif au jour 21 : disposer d’une offre claire, d’un processus maîtrisé et d’une démonstration concrète à présenter à vos clients existants.'
                    : 'L’objectif au jour 21 : maîtriser la plateforme et être prêt à convertir un premier client - avec une offre claire, des contenus publiés, une prospection lancée et le processus d’accompagnement en main.'
                  : agency
                    ? 'The day-21 goal: have a clear offer, a mastered workflow and a concrete demonstration to present to existing clients.'
                    : 'The day-21 goal: master the platform and be ready to convert a first client - with a clear offer, published content, active outreach and a working client-delivery process.'}
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
                        t: 'Semaine 1 - Construire l’offre agence',
                        d: 'Vous choisissez le positionnement, identifiez un client pilote et créez une première démonstration avec Empire.',
                      },
                      {
                        t: 'Semaine 2 - Installer la production',
                        d: 'Vous maîtrisez les sujets, les validations, la création et le calendrier pour livrer une prestation régulière.',
                      },
                      {
                        t: 'Semaine 3 - Déployer sur le portefeuille',
                        d: 'Vous apprenez à présenter l’offre, organiser l’onboarding et la proposer à vos clients existants ou en marque blanche.',
                      },
                    ]
                  : [
                      {
                        t: 'Semaine 1 - Publier et prospecter immédiatement',
                        d: 'Vous configurez Empire, clarifiez votre offre, adaptez vos premiers formats, publiez et lancez vos premières conversations avec des prospects.',
                      },
                      {
                        t: 'Semaine 2 - Comprendre la viralité et produire',
                        d: 'Vous apprenez les hooks, formats et mécaniques de viralité, puis adaptez vos contenus aux 7 réseaux.',
                      },
                      {
                        t: 'Semaine 3 - Devenir prêt pour un premier client',
                        d: 'Vous apprenez à présenter votre accompagnement, conduire l’entretien, organiser la prestation et ouvrir votre page consultant.',
                      },
                    ]
                : agency
                  ? [
                      {
                        t: 'Week 1 - Build the agency offer',
                        d: 'Choose the positioning, identify a pilot client and create a first demonstration with Empire.',
                      },
                      {
                        t: 'Week 2 - Install production',
                        d: 'Master topics, approvals, creation and scheduling to deliver a consistent service.',
                      },
                      {
                        t: 'Week 3 - Deploy across the portfolio',
                        d: 'Learn to present the offer, organize onboarding and sell it to existing clients or white-label partners.',
                      },
                    ]
                  : [
                      {
                        t: 'Week 1 - Publish and reach out immediately',
                        d: 'Set up Empire, clarify your offer, adapt your first formats, publish and start your first prospect conversations.',
                      },
                      {
                        t: 'Week 2 - Understand virality and produce',
                        d: 'Learn hooks, formats and viral mechanics, then adapt your content across all 7 networks.',
                      },
                      {
                        t: 'Week 3 - Become first-client ready',
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
                ? 'La communauté vous aide à avancer et à débloquer vos questions. La formation, les replays et la communauté sont inclus dans le bootcamp et restent accessibles à vie. Les rendez-vous partenaires viennent avec le statut partenaire.'
                : 'The community helps you move forward and unblock questions. Training, replays and community are included in the bootcamp with lifetime access. Partner sessions come with partner status.'}
            </p>
          </div>
        </div>
      </section>

      {/* Le bootcamp, puis le statut partenaire proposé après le paiement */}
      <section className="border-y border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
            <SectionLabel>{fr ? 'Le programme' : 'The program'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Ce que vous recevez'
                : 'Everything you get'}
            </h2>
            <p className="mt-5 text-[17px] font-medium text-white">
              {fr
                ? `Cette semaine : ${festival.price} €, payés une fois.`
                : `This week: €${festival.price}, paid once.`}
            </p>
            <p className="mt-2 text-[14px] text-neutral-500">
              {fr
                ? '297 € le lundi · 397 € le mardi · 497 € dès le mercredi · retour à 297 € chaque lundi.'
                : '€297 on Monday · €397 on Tuesday · €497 from Wednesday · back to €297 every Monday.'}
            </p>
            <div className="mt-8 space-y-7">
              {VALUE_STACK[fr ? 'fr' : 'en'].map((group) => (
                <div key={group.title}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-academy">{group.title}</p>
                  <ul className="mt-3 space-y-2.5">
                    {group.lines.map((line) => (
                      <li key={line.label} className="flex items-start gap-2.5 text-[14px] leading-snug text-neutral-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                        <span className="flex-1">{line.label}</span>
                        <span className="shrink-0 tabular-nums text-white/70">
                          {line.value === null ? (fr ? 'Selon mission' : 'Varies') : `${line.value.toLocaleString('fr-FR')} €`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-academy/25 bg-academy/[0.06] px-5 py-4">
              <p className="flex items-center justify-between text-[14px]">
                <span className="text-neutral-400">{fr ? 'Valeur totale' : 'Total value'}</span>
                <span className="font-semibold tabular-nums text-neutral-500 line-through decoration-neutral-600">
                  {VALUE_STACK[fr ? 'fr' : 'en']
                    .reduce((s, g) => s + g.lines.reduce((a, l) => a + (l.value ?? 0), 0), 0)
                    .toLocaleString('fr-FR')} €
                </span>
              </p>
              <p className="mt-2 flex items-center justify-between text-[17px]">
                <span className="font-semibold text-white">{fr ? 'Aujourd’hui' : 'Today'}</span>
                <span className="text-2xl font-extrabold tabular-nums text-academy">{festival.price} €</span>
              </p>
            </div>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <PartnerPayLink fr={fr} source="program" price={festival.price} audience={audience} />
              <CtaBlock fr={fr} source="program" audience={audience} />
            </div>

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
              <PartnerPayLink fr={fr} source="faq" price={festival.price} audience={audience} />
              <div className="mt-3"><CtaBlock fr={fr} source="faq" audience={audience} /></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
