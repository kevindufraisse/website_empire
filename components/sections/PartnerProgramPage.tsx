'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { partnerPayHref } from '@/lib/partner-festival-pricing'
import { getPlan } from '@/lib/plans'
import { usePartnerFestivalPricing } from '@/hooks/usePartnerFestivalPricing'
import { postitJoinUrl } from '@/lib/postit'
import { WebinarJamBar, WebinarJamButton } from '@/components/WebinarJamRegister'
import AcademyPresentationCta from '@/components/AcademyPresentationCta'
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
      {fr ? `Rejoindre Empire Partners · ${price} €` : `Join Empire Partners · €${price}`}
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

/** Prix du programme cette semaine (le bootcamp seul est cité dessous). Seul prix barré : le palier qui arrive, s'il est plus cher. */
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
        {fr ? 'Empire Partners · un live chaque lundi à 14 h' : 'Empire Partners · a live every Monday at 2 pm'}
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
                {isPast ? (
                  <span className="line-through decoration-neutral-600">{tier.price} €</span>
                ) : (
                  `${tier.price} €`
                )}
              </span>
            </div>
          )
        })}
      </div>

      {nextIsIncrease && pricing.ready && (
        <p className="mt-3 text-[12px] text-neutral-400">
          {fr
            ? `Le prix passe à ${pricing.nextPrice} € ${pricing.tierId === 'live' ? 'vendredi' : 'dimanche'}, dans`
            : `The price goes to €${pricing.nextPrice} on ${pricing.tierId === 'live' ? 'Friday' : 'Sunday'}, in`}{' '}
          <span className="font-mono font-semibold tabular-nums text-academy">
            {priceCountdown(pricing.msUntilNext, fr)}
          </span>
        </p>
      )}

      {/* Comme une billetterie de festival : le prix monte au fil de la semaine.
          Pas de « places limitées » : il n'y a pas de limite réelle. */}
      <p className="mt-3 text-[12px] leading-snug text-neutral-400">
        {fr
          ? 'Comme pour un festival : plus tôt dans la semaine, moins cher. C’est notre façon de remercier ceux qui se décident en premier. Chaque lundi, le prix repart du bas.'
          : 'Like festival tickets: earlier in the week costs less. It’s our way of thanking those who decide first. Every Monday, the price starts low again.'}
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

/* ------------------------------------------------------------------ */
/* La page est un film en 7 séquences. Elle ouvre sur un paradoxe      */
/* (2008 / 2026) et tout le scroll en est la résolution mécanique.      */
/* Chaque séquence finit par un cartouche (la « chute ») qui ouvre la   */
/* suivante. Un seul prix sur toute la page, dans la dernière séquence. */
/* ------------------------------------------------------------------ */

/** Cartouche de narration en bas de séquence : la phrase qui force à lire la suivante. */
function Chute({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 flex items-start gap-3">
      <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-academy/40 text-academy">
        <ArrowDown className="h-3.5 w-3.5" />
      </span>
      <p className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] font-medium leading-snug text-white">
        {children}
      </p>
    </div>
  )
}

/** La phrase à retenir. Posée dans le hero, rappelée après la boîte noire et à la porte. */
function Mantra({ fr }: { fr: boolean }) {
  return (
    <p className="mt-8 border-l-2 border-academy pl-4 text-[18px] font-semibold leading-snug text-white">
      {fr ? 'La machine produit. Toi, tu es le coach.' : 'The machine produces. You are the coach.'}
    </p>
  )
}

function Sequence({
  id,
  label,
  title,
  chute,
  wide = false,
  dark = false,
  children,
}: {
  id?: string
  label: string
  title: React.ReactNode
  chute?: React.ReactNode
  /** Colonne large (démo produit, mur de témoignages). */
  wide?: boolean
  dark?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 border-b border-white/[0.06] py-16 md:py-24 ${dark ? 'bg-[#0a0a0a]' : ''}`}
    >
      <div className="container">
        <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-[40rem]'}`}>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          {children}
          {chute && <Chute>{chute}</Chute>}
        </div>
      </div>
    </section>
  )
}

const WHY_LOOM_ID = '4029ade36c6d435ea579ea1f861d6565'

/** Avis Senja de participants du bootcamp, leurs mots (pas les études de cas
 *  « Draft », rédigées par l'IA de Senja). Même bloc que /join/academy. */
const BOOTCAMP_RESULTS = [
  { name: 'Evelyne', text: 'En seulement 21 jours, j’ai franchi le cap des 100 000 vues et des 1 050 abonnés.' },
  { name: 'Tristan', text: 'J’ai démarré il y a 50 jours et je suis à près d’1 million d’impressions.' },
  { name: 'Caroline', text: 'Mon premier succès : 18K d’impressions. Le maximum jusqu’à présent était 2K !' },
]

/** Vidéo Senja de Marc (Mux), la même que sur /join/academy et /tarifs. */
const MARC_MUX_ID = 'nxgu0275x00yQe01pECaRLhBs02L6udvY4RiEOblhBSsOdc'

/** Marc (celui qui a traversé, avec le badge de transparence), puis les
 *  participants du bootcamp, présentés pour ce qu'ils sont : des résultats
 *  sur leur propre compte. */
function PartnerProofInner({ fr }: { fr: boolean }) {
  if (!fr) return null
  return (
    <div className="max-w-[40rem]">
      <p className="mt-12 text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">Un partenaire raconte</p>
      <div className="mt-5 grid items-start gap-6 sm:grid-cols-[240px_1fr]">
        <video
          src={`https://stream.mux.com/${MARC_MUX_ID}/medium.mp4`}
          poster={`https://image.mux.com/${MARC_MUX_ID}/thumbnail.jpg?time=10`}
          controls
          playsInline
          preload="none"
          className="mx-auto aspect-[9/16] w-full max-w-[240px] rounded-2xl border border-white/15 bg-black object-cover"
        />
        <div className="space-y-4 text-[16px] leading-[1.6] text-neutral-400">
          <p className="text-[18px] leading-relaxed text-white">
            « Je faisais quatre heures de coaching, payé 500 euros. […] Ça me demandait très peu de charge de travail. En 1,5 jour, j’avais déjà généré 1 500 euros. »
          </p>
          <p>
            Marc a accompagné les premiers clients Empire : il leur montrait l’app et les aidait à repérer les sujets viraux de leur niche, en complément de son activité.
          </p>
          <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-neutral-400">
            <span className="font-semibold text-white">Transparence :</span> Marc Dufraisse est mon frère. Ses premiers clients, c’est moi qui les lui apportais, pour vérifier que le service tenait en 4 heures. Aujourd’hui, les missions venant du site ne sont pas garanties.
          </div>
        </div>
      </div>

      <p className="mt-12 text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
        Ce que le bootcamp a donné à des participants
      </p>
      <div className="mt-5 space-y-3">
        {BOOTCAMP_RESULTS.map((r) => (
          <figure key={r.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <blockquote className="text-[16px] leading-relaxed text-white">« {r.text} »</blockquote>
            <figcaption className="mt-2 text-[13px] text-neutral-500">{r.name}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-neutral-500">Résultats sur leur propre compte, ils varient selon chacun.</p>
    </div>
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
        { label: 'Un live chaque lundi à 14 h', value: null },
        { label: '6 h de replays à suivre', value: 497 },
        { label: '4 000 crédits offerts pour utiliser Empire (la machine à contenu)', value: 297 },
        { label: 'Un certificat Empire (or, argent ou bronze) selon les vues de tes contenus, à montrer à tes clients', value: 497 },
      ],
    },
    {
      title: 'Pour produire',
      lines: [
        { label: 'Des modèles de posts viraux, directement dans ton calendrier', value: 297 },
        { label: 'Les posts qui marchent le mieux, chaque semaine', value: 997 },
      ],
    },
    {
      title: 'Pour trouver des clients',
      lines: [
        { label: 'Ajout dans l’annuaire', value: 197 },
        { label: 'Des missions venant du site, sans garantie', value: null },
        { label: 'Cours « comment trouver des clients Empire »', value: 497 },
        { label: 'Page de paiement incluse', value: 197 },
      ],
    },
    {
      title: 'Pour vendre',
      lines: [
        { label: 'Modèles de messages pour vendre ton accompagnement', value: 297 },
        { label: 'Modèles de messages pour décrocher des rendez-vous', value: 297 },
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
        { label: 'A live every Monday at 2 pm', value: null },
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
        { label: 'Missions from the site, not guaranteed', value: null },
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

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
    >
      {children}
    </a>
  )
}

/** Une heure de la boîte noire : ce que fait le partenaire, dans l'ordre réel du parcours Empire. */
function Hour({ when, title, children }: { when: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-white/[0.08] py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-academy">{when}</p>
      <div>
        <p className="text-[16px] font-semibold text-white">{title}</p>
        <div className="mt-2 text-[15px] leading-relaxed text-neutral-400">{children}</div>
      </div>
    </div>
  )
}

export default function PartnerProgramPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const t = (frText: string, enText: string) => (fr ? frText : enText)
  const festival = usePartnerFestivalPricing()
  const clientStarterPrice = getPlan('starter').price
  const audience: Audience = 'reconversion'
  const [level, setLevel] = useState<Level>('debutant')
  const [hours, setHours] = useState(12)

  const sim = useMemo(() => {
    const clients = Math.max(1, Math.floor(hours / HOURS_PER_CLIENT))
    const rate = RATES[level]
    return { clients, monthly: clients * rate, rate }
  }, [level, hours])

  const faqs = fr
    ? [
        {
          q: 'Je dois savoir monter des vidéos ou rédiger des posts ?',
          a: 'Empire prend en charge cette production. Tu apprends à accompagner le client, orienter ses contenus et les valider.',
        },
        {
          q: 'Je peux utiliser Empire avec mes clients actuels ?',
          a: 'Oui. Le programme s’adresse aux freelances et aux agences qui souhaitent accompagner des entrepreneurs dans leur présence en ligne.',
        },
        {
          q: 'Le temps et les revenus annoncés sont garantis ?',
          a: 'Ce sont des repères. Le temps réel et la rémunération dépendent de la mission, de ta maîtrise du système et de tes clients.',
        },
        {
          q: 'Les portes ouvertes sont payantes ?',
          a: 'Non. La présentation enregistrée est gratuite : tu regardes le replay tout de suite ou tu choisis une session, dont l’horaire est affiché dans ton fuseau à l’inscription. Empire Partners se paie ensuite, au prix affiché plus haut.',
        },
        {
          q: 'Que se passe-t-il après le paiement ?',
          a: 'Tu crées ton compte avec l’email du paiement, et le bootcamp s’ouvre tout de suite : les 21 vidéos, les replays et la communauté. Tu avances à ton rythme, sans date de démarrage à attendre.',
        },
        {
          q: 'Et après les 4 000 crédits ?',
          a: 'Tu as accès aux crédits partenaire, à un tarif réservé aux membres du programme.',
        },
        {
          q: 'Combien paie mon client ?',
          a: 'Exemple : ton client paie 699 € par mois, 500 € pour toi et 199 € pour Empire. Tu fixes ton prix, ta part arrive directement sur ton compte.',
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
          q: 'Are the time and earnings guaranteed?',
          a: 'They’re benchmarks. Real time and pay depend on the mission, how well you run the system, and your clients.',
        },
        {
          q: 'Is the open house free?',
          a: 'Yes. The recorded presentation is free: watch the replay immediately or choose a session, its time is shown in your time zone when you register. Empire Partners is paid after, at the price shown above.',
        },
        {
          q: 'What happens after payment?',
          a: 'You create your account with the payment email, and the bootcamp opens right away: the 21 videos, the replays and the community. You move at your own pace, with no start date to wait for.',
        },
        {
          q: 'What happens after the 4,000 credits?',
          a: 'You keep using Empire at cost.',
        },
        {
          q: 'How much does my client pay?',
          a: 'Example: your client pays €699 a month, €500 for you and €199 for Empire. You set your price, and your share goes straight to your account.',
        },
      ]

  return (
    <main className="relative bg-black pb-40 text-white antialiased">
      <Script
        id="academy-partner-senja"
        src="https://widget.senja.io/widget/2a990f91-6426-436a-b50d-318fc49a7851/platform.js"
        strategy="lazyOnload"
      />
      <WebinarJamBar buttonText={t("S'inscrire", 'Register')} />

      {/* Séquence 1 · Cold open : le paradoxe 2008 / 2026. Pas de prix, pas de
          paliers, pas de sommaire. Le bouton principal fait descendre. */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-[4.5rem] pb-12 md:pt-20 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[44rem] text-center">
            <nav
              aria-label={t('Choisis ton parcours', 'Choose your path')}
              className="mx-auto mb-5 inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] p-0.5"
            >
              {(
                [
                  { id: 'reconversion' as const, href: '/academy', label: t('Reconversion', 'Career change') },
                  { id: 'agency' as const, href: '/academy/agence', label: t('Agence', 'Agency') },
                ]
              ).map((option) => (
                <Link
                  key={option.id}
                  href={option.href}
                  aria-current={audience === option.id ? 'page' : undefined}
                  onClick={() => trackAmplitude('academy_audience_selected', { audience: option.id })}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                    audience === option.id ? 'bg-white/[0.09] text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </nav>

            {/* Un seul nom (29 octobre 2026) : la phrase n'apparaît qu'ici. */}
            <p className="mt-4 text-[13px] font-semibold text-academy">
              {t('Empire Partners, le programme partenaire d’Empire', 'Empire Partners, Empire’s partner program')}
            </p>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {t(
                '2008 : les chefs d’entreprise payaient un gamin de 19 ans pour installer WordPress. 2026 : ils paient la personne qui les fait publier.',
                '2008: business owners paid a 19-year-old to install WordPress. 2026: they pay the person who gets them publishing.',
              )}
            </h1>
            <div className="mx-auto mt-6 max-w-xl space-y-3 text-[17px] leading-relaxed text-neutral-400">
              <p>
                {t(
                  'Plus personne ne paie pour un site aujourd’hui. Mais un dirigeant paie chaque mois la personne qui l’oblige à publier : exemple, 699 € par mois, dont 500 € pour elle.',
                  'Nobody pays for a website anymore. But a business owner pays, every month, the person who makes them publish: for example €699 a month, €500 of which is theirs.',
                )}
              </p>
              <p className="font-medium text-white">
                {t(
                  'Et exactement comme en 2008, tu n’as besoin de savoir ni écrire, ni monter, ni coder. La machine produit. Toi, tu es le coach.',
                  'And exactly like in 2008, you don’t need to know how to write, edit or code. The machine produces. You are the coach.',
                )}
              </p>
            </div>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <a
                href="#mecanisme"
                onClick={() => trackAmplitude('academy_mechanism_clicked', { source: 'hero' })}
                className="mx-auto inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-academy px-6 text-[15px] font-bold text-black transition hover:brightness-110"
              >
                {t('Comprendre le mécanisme', 'Understand the mechanism')}
                <ArrowDown className="h-4 w-4" />
              </a>
              <CtaBlock fr={fr} source="hero" audience={audience} />
            </div>
          </div>
        </div>
      </section>

      {/* Barre sticky : pas de sommaire, pas de prix. Un seul bouton, gratuit. */}
      <nav
        aria-label={t('Portes ouvertes', 'Open house')}
        className="sticky top-[65px] z-40 border-b border-white/[0.08] bg-black/90 backdrop-blur-xl md:top-[73px]"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 py-2">
            <p className="truncate text-[12px] font-medium text-neutral-400">Empire Partners</p>
            <WebinarJamButton
              onClick={() => trackOpen('sticky', audience)}
              className="shrink-0 rounded-lg bg-academy px-3.5 py-2 text-[12px] font-bold text-black transition hover:brightness-110"
            >
              {t('Portes ouvertes · Gratuit', 'Open house · Free')}
            </WebinarJamButton>
          </div>
        </div>
      </nav>

      {/* Séquence 2 · L'incident déclencheur : pourquoi un patron paie, alors
          que les outils existent. La salle de sport. */}
      <Sequence
        id="mecanisme"
        label={t('Pourquoi il paie', 'Why they pay')}
        title={t(
          'Pourquoi un patron paierait-il ça, alors que ChatGPT existe ?',
          'Why would a business owner pay for that, when ChatGPT exists?',
        )}
        chute={t(
          'Dans le personal branding, la machine s’appelle Empire. Et le coach que les dirigeants cherchent, c’est toi.',
          'In personal branding, the machine is called Empire. And the coach business owners are looking for is you.',
        )}
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
          {t('Sources :', 'Sources:')}{' '}
          <SourceLink href="https://sdi-pme.fr/actus_et_ressources/etat-des-lieux-des-tpe-trimestre-4-et-bilan-2025/">SDI, 2025</SourceLink>
          {' · '}
          <SourceLink href="https://contentmarketinginstitute.com/b2b-research/b2b-content-marketing-trends-research-2025">
            Content Marketing Institute, 2025
          </SourceLink>
        </p>
        <div className="mt-8 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
          <p>
            {t(
              'Le dirigeant le sait. Il voit un concurrent moins bon que lui signer les contrats, parce que le concurrent publie et que lui ne publie pas. Il a essayé ChatGPT. Il a pris un abonnement à un outil. Et rien n’est sorti, parce que choisir un sujet, se filmer et publier passe après tout le reste, tous les soirs.',
              'The owner knows it. They watch a less competent competitor sign the contracts, because the competitor publishes and they don’t. They tried ChatGPT. They subscribed to a tool. And nothing came out, because picking a topic, filming and publishing comes after everything else, every single evening.',
            )}
          </p>
          <p>
            {t(
              'Une salle de sport a toutes les machines pour 30 € par mois. Les gens paient quand même un coach. Pas pour qu’il soulève la barre à leur place : parce que sans rendez-vous fixe avec un humain, ils n’y vont pas.',
              'A gym has every machine for €30 a month. People still pay a coach. Not so the coach lifts the bar for them: because without a fixed appointment with a human, they don’t show up.',
            )}
          </p>
          <p className="font-medium text-white">
            {t(
              'Le coach ne produit rien. Il choisit l’exercice, il regarde, il corrige, et il revient la semaine d’après. C’est ce métier-là qu’une machine ne remplace pas.',
              'The coach produces nothing. They pick the exercise, watch, correct, and come back the next week. That is the job a machine doesn’t replace.',
            )}
          </p>
        </div>
      </Sequence>

      {/* Séquence 3 · La boîte noire : les 4 heures d'un client, dans l'ordre
          réel du parcours Empire. La preuve (presse, créateurs, démo) arrive
          au moment où la machine tourne, pas en intro. */}
      <Sequence
        id="mission"
        label={t('La boîte noire', 'The black box')}
        title={t(
          'Comment quelqu’un qui ne sait ni écrire ni monter se fait payer 500 € par mois. Les 4 heures, une par une.',
          'How someone who can’t write or edit gets paid €500 a month. The 4 hours, one by one.',
        )}
        chute={t(
          'C’est tout le mécanisme. Reste une question : combien ça fait, pour toi ?',
          'That is the whole mechanism. One question remains: what does it add up to, for you?',
        )}
        wide
        dark
      >
        <p className="mt-5 max-w-[40rem] text-[14px] text-neutral-500">
          {t(
            'Repère, une fois le système en main : environ 4 heures par mois et par client, hors apprentissage, installation et prospection.',
            'Benchmark once fluent: about four hours per month per client, excluding training, setup and outreach.',
          )}
        </p>

        <div className="mt-8 max-w-[40rem] border-b border-white/[0.08]">
          <Hour when={t('Heure 1', 'Hour 1')} title={t('L’entretien. Tu n’écris pas un mot.', 'The interview. You don’t write a word.')}>
            {t(
              'Tu choisis dans Empire les sujets adaptés à son expertise, tu lui envoies le lien, tu guides la session. Le dirigeant parle de son métier pendant une heure. Tu poses les questions, c’est tout.',
              'In Empire, you pick the topics that fit their expertise, send them the link, and guide the session. The owner talks about their craft for an hour. You ask the questions, that’s all.',
            )}
          </Hour>
          <Hour when={t('0 h pour toi', '0 h for you')} title={t('Empire produit.', 'Empire produces.')}>
            {t(
              'L’entretien devient ses contenus : posts, vidéos courtes, carrousels, newsletter, déclinés sur 7 réseaux et rangés dans son calendrier. Tu n’as rien rédigé, rien monté.',
              'The interview becomes their content: posts, short videos, carousels, newsletter, adapted to 7 networks and placed in their calendar. You wrote nothing, edited nothing.',
            )}
          </Hour>
        </div>

        {/* La machine, en preuve : réseaux, presse, créateurs, démo réelle. */}
        <div className="[&>div]:mx-0">
          <AcademyPlatformLogos fr={fr} />
        </div>
        <div className="mt-8 border-y border-white/[0.06] py-4 sm:py-5">
          <FeaturedInSection accent="academy" />
        </div>
        <TopCreatorsSection compact accent="academy" />
        <div className="mt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
            {t('Le parcours, dans Empire', 'The workflow in Empire')}
          </p>
          <AcademyProductDemo fr={fr} />
        </div>

        <div className="mt-12 max-w-[40rem] border-b border-white/[0.08]">
          <Hour when={t('Heure 2', 'Hour 2')} title={t('Tu tranches.', 'You decide.')}>
            {t(
              'Tu ne crées rien. Tu relis ce qu’Empire a produit, tu gardes les meilleurs contenus, tu renvoies tes retours. Le client valide, ça part.',
              'You create nothing. You review what Empire produced, keep the best pieces, send your feedback. The client approves, it goes out.',
            )}
          </Hour>
          <Hour when={t('Heures 3 et 4', 'Hours 3 and 4')} title={t('Le suivi, le reste du mois.', 'The follow-through, for the rest of the month.')}>
            {t(
              'Tu tiens le calendrier, tu regardes ce qui a marché, tu prépares l’entretien suivant. C’est le rendez-vous fixe. Tant que tu le tiens, le client publie.',
              'You run the calendar, look at what worked, prepare the next interview. That is the fixed appointment. As long as you keep it, the client publishes.',
            )}
          </Hour>
        </div>
        <Mantra fr={fr} />
      </Sequence>

      {/* Séquence 4 · Point médian : le simulateur, puis le choc d'honnêteté.
          C'est le seul endroit où la non-garantie est dite, et elle est signée. */}
      <Sequence
        id="simulation"
        label={t('Pour toi', 'For you')}
        title={t('Qu’est-ce que ça représente pour toi ?', 'What does it add up to, for you?')}
      >
        <p className="mt-6 text-[16px] leading-[1.6] text-neutral-400">
          {t(
            'Voici précisément ce que paie le client et ce qui reste à ta charge, avant de simuler.',
            'Here is exactly what the client pays and what remains your responsibility, before you estimate.',
          )}
        </p>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          {(fr
            ? [
                {
                  t: 'Tes honoraires',
                  d: 'Tu fixes le prix de ton accompagnement. Repères indicatifs : environ 500 € par client au démarrage, puis 1 000 € ou plus avec l’expérience.',
                },
                {
                  t: 'La production Empire',
                  d: `Ton client paie un seul montant chaque mois sur ta page : ton accompagnement plus son abonnement Empire (à partir de ${clientStarterPrice} € / mois). Ta part arrive directement sur ton compte Stripe.`,
                },
                {
                  t: 'Ton temps',
                  d: 'Une fois le système maîtrisé, le repère est d’environ 4 h par mois et par client. L’apprentissage, l’installation et la prospection sont en plus.',
                  hl: '4 h par mois et par client',
                },
                {
                  t: 'Tes clients',
                  d: 'Tu les trouves grâce à ton contenu, tes recommandations et ta prospection.',
                },
              ]
            : [
                {
                  t: 'Your fees',
                  d: 'You set the price of your support. Benchmarks: around €500 when starting, then €1,000 or more with experience.',
                },
                {
                  t: 'Empire production',
                  d: `Your client pays one amount each month on your page: your support plus their Empire subscription (from €${clientStarterPrice} / month). Your share goes straight to your Stripe account.`,
                },
                {
                  t: 'Your time',
                  d: 'Once fluent, the benchmark is about four hours per client per month. Training, setup and outreach are additional.',
                  hl: 'four hours per client per month',
                },
                {
                  t: 'Your clients',
                  d: 'You find them through content, referrals and outreach.',
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
        <p className="mt-4 text-[12px] text-neutral-600">
          {t(
            'Tes honoraires dépendent de ton expérience, de la mission et du client. Ils sont indiqués avant frais, charges et impôts.',
            'Your fees depend on experience, mission and client. Figures are before fees, costs and tax.',
          )}
        </p>

        <div className="mt-12">
          <h3 className="text-xl font-semibold tracking-tight">{t('Fais ta simulation.', 'Run your simulation.')}</h3>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-[13px] font-medium text-neutral-400">{t('Ton niveau', 'Your level')}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'debutant' as const, label: t('Débutant', 'Beginner') },
                    { id: 'confirme' as const, label: t('Confirmé', 'Solid') },
                    { id: 'expert' as const, label: t('Expert', 'Expert') },
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
                <p className="text-[13px] font-medium text-neutral-400">{t('Ta disponibilité', 'Your availability')}</p>
                <p className="text-[14px] font-semibold text-white">
                  {hours} h / {t('mois', 'month')}
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
                {t(
                  'Combien d’heures par mois veux-tu consacrer à tes clients ?',
                  'How many hours per month do you want to spend with clients?',
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] px-5 py-5 ring-1 ring-white/[0.08]">
              <p className="text-[13px] font-medium text-neutral-400">{t('Ton résultat', 'Your result')}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[12px] text-neutral-500">{t('Clients accompagnés', 'Clients supported')}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{sim.clients}</p>
                </div>
                <div>
                  <p className="text-[12px] text-neutral-500">{t('Honoraires mensuels estimés', 'Estimated monthly fees')}</p>
                  <p className="mt-1 text-2xl font-semibold text-academy">
                    {fr ? `~${sim.monthly.toLocaleString('fr-FR')} €` : `~€${sim.monthly.toLocaleString('en-US')}`}
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

          {/* Le coup de tonnerre : dit une fois, au moment où le lecteur rêve. */}
          <div className="mt-10 rounded-2xl border border-white/20 bg-black px-6 py-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {t('La vérité que personne d’autre ne te dira', 'The truth nobody else will tell you')}
            </p>
            <div className="mt-4 space-y-3 text-[16px] leading-[1.6] text-white">
              <p>
                {t(
                  'Je ne te garantis pas un seul client. Si tu cherches un bouton magique sans jamais parler à un humain, ferme cette page.',
                  'I don’t guarantee you a single client. If you are looking for a magic button without ever talking to a human, close this page.',
                )}
              </p>
              <p>
                {t(
                  'En revanche, des dirigeants qui ont besoin de publier, il y en a partout. Mon travail pendant 21 jours : t’apprendre à aller les voir, et te faire travailler ta propre marque pour qu’ils te trouvent aussi.',
                  'On the other hand, business owners who need to publish are everywhere. My job for 21 days: teach you how to go and see them, and get you working on your own brand so they find you too.',
                )}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-academy/40">
                <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" fill sizes="36px" className="object-cover" />
              </div>
              <p className="text-[13px] text-neutral-500">
                <span className="font-semibold text-white">Kevin Dufraisse</span>
                {t(' · Fondateur d’Empire Internet', ' · Founder of Empire Internet')}
              </p>
            </div>
          </div>

          <div className="mt-8 w-full">
            <CtaBlock fr={fr} source="simulation" audience={audience} fullWidth />
          </div>
        </div>
      </Sequence>

      {/* Séquence 5 · Les preuves vivantes : le mentor, puis ceux qui l'ont fait. */}
      <Sequence
        id="pourquoi"
        label={t('Les preuves vivantes', 'Living proof')}
        title={t('Qui est derrière, et qui l’a déjà fait.', 'Who is behind it, and who already did it.')}
        wide
      >
        <div className="max-w-[40rem]">
          <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/50">
            <iframe
              src={`https://www.loom.com/embed/${WHY_LOOM_ID}?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_title=true`}
              title={t('Pourquoi Empire Partners, par Kevin', 'Why Empire Partners, by Kevin')}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="mt-8 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
            <p>
              {t(
                'J’étais en échec scolaire, et tout le monde pensait que je ne ferais rien de ma vie. À 19 ans, j’ai découvert WordPress. Les entrepreneurs voulaient tous un site pour se faire voir : c’était le personal branding de l’époque. Cet outil m’a lancé dans l’entrepreneuriat.',
                'I was failing at school, and everyone thought I would amount to nothing. At 19, I discovered WordPress. Every entrepreneur wanted a website to get noticed: it was the personal branding of the time. That tool got me into entrepreneurship.',
              )}
            </p>
            <p>
              {t(
                'Empire Partners, c’est ce que j’aurais voulu trouver à 19 ans : un réseau, et une compétence qui ne sera pas remplacée. Comprendre la psychologie humaine et les algorithmes, pour aider des entrepreneurs à se faire connaître dans un monde incertain.',
                'Empire Partners is what I wish I had found at 19: a network, and a skill that won’t be replaced. Understanding human psychology and algorithms, to help entrepreneurs get known in an uncertain world.',
              )}
            </p>
            <p className="font-medium text-white">
              {t(
                'Tu ne travailles pas pour moi. Tes clients te paient toi, tu fixes ton prix, et ta part arrive directement sur ton compte. Moi, je gagne quand ton client utilise Empire. On gagne ensemble.',
                'You don’t work for me. Your clients pay you, you set your price, and your share lands directly in your account. I earn when your client uses Empire. We win together.',
              )}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-academy/40">
              <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" fill sizes="44px" className="object-cover" />
            </div>
            <p className="text-[13px] text-neutral-500">
              <span className="font-semibold text-white">Kevin Dufraisse</span>
              {t(' · Fondateur d’Empire Internet, depuis Lisbonne', ' · Founder of Empire Internet, from Lisbon')}
            </p>
          </div>
        </div>

        <PartnerProofInner fr={fr} />

        <div className="mt-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
            {t('Ce qu’ils disent après avoir utilisé le système', 'What they say after using the system')}
          </p>
          <div
            className="senja-embed mt-6 w-full"
            data-id="2a990f91-6426-436a-b50d-318fc49a7851"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block', width: '100%' }}
          />
        </div>
      </Sequence>

      {/* Séquence 6 · Le camp d'entraînement : 21 jours, un seul but. */}
      <Sequence
        id="formation"
        label={t('Le camp d’entraînement', 'The training camp')}
        title={t('21 jours, un seul but : ton premier client.', '21 days, one goal: your first client.')}
        chute={t(
          'Au jour 21 : une offre claire, des contenus publiés, une prospection lancée. Il reste une question : combien ça coûte.',
          'On day 21: a clear offer, published content, active outreach. One question left: what it costs.',
        )}
        dark
      >
        <dl className="mt-8 grid max-w-md grid-cols-2 divide-x divide-white/[0.08] border-y border-white/[0.08] py-4">
          {(fr
            ? [
                ['21 jours', 'pour maîtriser le système'],
                ['~1 h', 'par jour, à ton rythme'],
              ]
            : [
                ['21 days', 'to master the system'],
                ['~1 hr', 'a day, at your own pace'],
              ]
          ).map(([value, label]) => (
            <div key={value} className="px-2 sm:px-4">
              <dt className="text-[15px] font-semibold text-white sm:text-lg">{value}</dt>
              <dd className="mt-1 text-[10px] leading-snug text-neutral-500 sm:text-[11px]">{label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
          <p>
            {t(
              'Ce n’est pas une formation à terminer avant de commencer. Chaque jour, en environ 1 heure, tu réalises une action qui fait avancer ta maîtrise d’Empire, ton contenu ou ta prospection. Tu publies et tu prospectes dès la première semaine.',
              'This is not a course you finish before you start. Each day, in about 1 hour, you complete one action that advances your Empire skills, your content or your outreach. You publish and reach out from week one.',
            )}
          </p>
          <p className="font-medium text-neutral-200">
            {t(
              'Tu apprends en faisant, et ton personal branding devient ta première vitrine.',
              'You learn by doing, and your personal brand becomes your first showcase.',
            )}
          </p>
        </div>

        <div className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {(fr
            ? [
                {
                  t: 'Jours 1 à 7 - Prendre Empire en main, publier, prospecter',
                  d: 'Tu configures Empire, clarifies ton offre, adaptes tes premiers formats issus de « Mes posts les plus viraux », publies et lances tes premières conversations avec des prospects.',
                },
                {
                  t: 'Jours 8 à 14 - Comprendre la viralité et produire',
                  d: 'Tu apprends les hooks, formats et mécaniques de viralité, puis adaptes tes contenus aux 7 réseaux.',
                },
                {
                  t: 'Jours 15 à 21 - Signer le premier client',
                  d: 'Tu apprends à présenter ton accompagnement, conduire l’entretien, organiser la prestation et ouvrir ta page de paiement.',
                },
              ]
            : [
                {
                  t: 'Days 1 to 7 - Get Empire in hand, publish, reach out',
                  d: 'Set up Empire, clarify your offer, adapt your first formats from “My most viral posts,” publish and start your first prospect conversations.',
                },
                {
                  t: 'Days 8 to 14 - Understand virality and produce',
                  d: 'Learn hooks, formats and viral mechanics, then adapt your content across all 7 networks.',
                },
                {
                  t: 'Days 15 to 21 - Sign the first client',
                  d: 'Learn to present your service, run the interview, organize delivery and open your payment page.',
                },
              ]
          ).map((row) => (
            <div key={row.t} className="py-5">
              <p className="text-[15px] font-semibold text-white">{row.t}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-500">{row.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">
          {t(
            'Certains participants obtiennent dès la première semaine des contenus à forte portée, des conversations avec des prospects, voire un premier client. Ces résultats varient selon ton exécution, ton marché, tes sujets et ta régularité.',
            'Some participants see high-reach content, prospect conversations or even a first client in week one. Results vary with your execution, market, topics and consistency.',
          )}
        </p>
        <p className="mt-6 text-[14px] text-neutral-500">
          {t(
            'La communauté t’aide à avancer et à débloquer tes questions. La formation, les replays et la communauté sont inclus dans le bootcamp et restent accessibles à vie. Un live chaque lundi à 14 h avec Empire Partners.',
            'The community helps you move forward and unblock questions. Training, replays and community are included in the bootcamp with lifetime access. A live every Monday at 2 pm with Empire Partners.',
          )}
        </p>
        {/* À côté de la communauté : le live gratuit Post it like it's hot,
            ouvert à tous (inscription sur la page Systeme.io de POSTIT_URL). */}
        <a
          href={postitJoinUrl('academy')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAmplitude('academy_postit_clicked', { source: 'community' })}
          className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-4 py-3.5 transition hover:border-white/25"
        >
          <span>
            <span className="block text-[14px] font-semibold text-white">Post it like it’s hot</span>
            <span className="mt-0.5 block text-[13px] text-neutral-400">
              {t(
                'Le live gratuit, chaque lundi à 14 h : on trouve ton prochain contenu viral, en direct.',
                'The free live, every Monday at 2 pm: we find your next viral post, live.',
              )}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-academy">
            {t("S'inscrire", 'Register')}
            <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      </Sequence>

      {/* Séquence 7 · La porte : le seul endroit de la page où il y a un prix.
          Le mécanisme festival est expliqué une fois (dans FestivalPriceBlock),
          les 14 jours sont sous le bouton, les portes ouvertes servent de filet. */}
      <Sequence
        id="porte"
        label={t('La porte', 'The door')}
        title={t('Ce que ça coûte, et ce que tu reçois.', 'What it costs, and what you get.')}
      >
        <p className="mt-6 text-[16px] leading-[1.6] text-neutral-400">
          {t(
            'Ces frais d’inscription, c’est comme dans une école : ils paient le bootcamp, les 4 000 crédits et le temps que j’y mets. Je travaille sur Empire depuis un an et demi.',
            'This registration fee is like at a school: it pays for the bootcamp, the 4,000 credits and the time I put in. I’ve been building Empire for a year and a half.',
          )}
          <span className="text-[13px] text-neutral-500"> — Kevin</span>
        </p>

        <div className="mt-8">
          <FestivalPriceBlock fr={fr} pricing={festival} />
        </div>

        <div className="mt-10 space-y-7">
          {VALUE_STACK[fr ? 'fr' : 'en'].map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-academy">{group.title}</p>
              <ul className="mt-3 space-y-2.5">
                {group.lines.map((line) => (
                  <li key={line.label} className="flex items-start gap-2.5 text-[14px] leading-snug text-neutral-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                    <span className="flex-1">{line.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex w-full flex-col items-center gap-3">
          <PartnerPayLink fr={fr} source="program" price={festival.price} audience={audience} />
          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-white/[0.03] px-5 py-4">
            <p className="text-[15px] font-semibold text-white">
              {t('14 jours pour changer d’avis.', '14 days to change your mind.')}
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-neutral-400">
              {t(
                'Remboursé à 100 %, tant que tu n’as produit aucun contenu ni utilisé de crédit.',
                '100% refunded, as long as you haven’t produced any content or used any credit.',
              )}
            </p>
          </div>
        </div>
        <Mantra fr={fr} />

        {/* Le filet : les portes ouvertes, gratuites. `#portes-ouvertes` est la
            cible des boutons quand WebinarJam est coupé. */}
        <div id="portes-ouvertes" className="mt-16 scroll-mt-28 border-t border-white/[0.08] pt-12">
          <SectionLabel>{t('Pas encore prêt ?', 'Not ready yet?')}</SectionLabel>
          <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('Viens voir le parcours, étape par étape. C’est gratuit.', 'Come and see the workflow, step by step. It’s free.')}
          </h3>
          <div className="mt-6 flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-academy/40">
              <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">Kevin Dufraisse</p>
              <p className="text-[13px] text-neutral-500">{t('Fondateur d’Empire Internet', 'Founder of Empire Internet')}</p>
            </div>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed text-neutral-400">
            {t(
              'Dans cette présentation enregistrée, je te montre le fonctionnement du programme. Regarde le replay tout de suite ou choisis une session. L’horaire affiché à l’inscription est celui de ton fuseau. Pour tes questions, réponds à l’email de confirmation.',
              'This recorded presentation shows how the program works. Watch the replay immediately or choose a session. Registration times are shown in your time zone. For questions, reply to your confirmation email.',
            )}
          </p>
          <ul className="mt-5 space-y-3">
            {(fr
              ? [
                  'Comment un partenaire accompagne un client dans Empire.',
                  'Ce que tu fais et ce que la plateforme prend en charge.',
                  'Comment fonctionnent les missions, la rémunération et les crédits.',
                  'Comment se déroule la formation et comment rejoindre Empire Partners.',
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
            <CtaBlock fr={fr} source="section" audience={audience} fullWidth />
          </div>
        </div>
      </Sequence>

      {/* FAQ, réduite aux questions que les 7 séquences n'ont pas traitées. */}
      <section id="faq" className="scroll-mt-28 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('Quelques réponses avant de nous rencontrer.', 'A few answers before we meet.')}
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

            {/* La présentation PDF, une seule fois sur la page (jamais sous les
                boutons d'inscription), puis WhatsApp pour le reste. */}
            <div className="mx-auto mt-8 max-w-md">
              <AcademyPresentationCta fr={fr} source="faq" />
            </div>
            <p className="mt-5 text-center text-[14px] text-neutral-400">
              {t('Une autre question ? ', 'Another question? ')}
              <a
                href="https://wa.me/33665427470"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAmplitude('academy_whatsapp_clicked', { source: 'faq' })}
                className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {t('Écris à Kevin sur WhatsApp', 'Message Kevin on WhatsApp')}
              </a>
            </p>

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
