'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { WebinarJamBar, WebinarJamButton, WebinarJamEmbed } from '@/components/WebinarJamRegister'
import { ArrowRight, Check } from 'lucide-react'

const FeaturedInSection = dynamic(() => import('@/components/FeaturedInSection'), {
  ssr: false,
  loading: () => <div className="min-h-[8rem]" aria-hidden />,
})
const AcademyTestimonialsSection = dynamic(
  () => import('@/components/sections/AcademyTestimonialsSection'),
  {
    ssr: false,
    loading: () => <div className="min-h-[20rem]" aria-hidden />,
  },
)

const INCLUDES_FR = [
  { title: 'Formation + replay', desc: 'Personal branding, monétisation de votre audience - et le replay des sessions.' },
  { title: 'Bootcamp 21 jours', desc: 'Un défi par jour. Objectif : publier avec Empire et closer un premier client pour rentabiliser les 500€.' },
  { title: '4 000 crédits Empire (~360€)', desc: 'La monnaie de prod Empire Internet. ≈ ~45 posts LinkedIn/X, ou un mix LinkedIn + Reels Instagram + newsletters - assez pour ~1,5 à 2 mois au rythme Débutant (tous les 2 jours, 7 réseaux).' },
  { title: 'Comment closer', desc: 'Scripts et process pour signer sur la plateforme.' },
  { title: 'Messages de prospection', desc: 'Templates prêts - en plus de ce que votre propre contenu amène.' },
  { title: 'Empire pour vos clients', desc: 'Empire propose les sujets, produit (montage, écriture), diffuse et track. Vous : choisir + être présent au live.' },
]

const INCLUDES_EN = [
  { title: 'Training + replay', desc: 'Personal branding, audience monetization - plus session replays.' },
  { title: '21-day bootcamp', desc: 'One challenge a day. Goal: publish with Empire and close a first client to recoup the €500.' },
  { title: '4,000 Empire credits (~€360)', desc: 'Empire Internet’s production currency. ≈ ~45 LinkedIn/X posts, or a mix of LinkedIn + Instagram Reels + newsletters - enough for ~1.5-2 months at Starter pace (every other day, 7 networks).' },
  { title: 'How to close', desc: 'Scripts and process to sign on the platform.' },
  { title: 'Outreach messages', desc: 'Ready templates - on top of what your own content brings in.' },
  { title: 'Empire for your clients', desc: 'Empire suggests topics, produces (editing, writing), publishes and tracks. You: choose + show up on the live.' },
]

const STEPS_FR = [
  { n: '01', title: 'Venez jeudi', desc: '11h Paris. 45 min. On explique le modèle et on répond aux questions.' },
  { n: '02', title: 'Vous postulez', desc: 'Si ça vous parle, candidature courte. On prend pas tout le monde.' },
  { n: '03', title: 'Vous démarrez', desc: '500€ → replay + 4 000 crédits Empire. Bootcamp 21 jours : publier, monétiser, viser un client pour rentabiliser.' },
]

const STEPS_EN = [
  { n: '01', title: 'Come Thursday', desc: '11am Paris. 45 min. We explain the model and take questions.' },
  { n: '02', title: 'You apply', desc: 'If it fits, short application. We don’t take everyone.' },
  { n: '03', title: 'You start', desc: '€500 → replay + 4,000 Empire credits. 21-day bootcamp: publish, monetize, aim for a client to recoup.' },
]

const FAQ_FR = [
  {
    q: 'C’est quoi les 4 000 crédits Empire ?',
    a: 'C’est la monnaie de production d’Empire Internet (posts, reels, newsletters, etc.). 4 000 crédits ≈ 360€ (réf. Débutant : 2 200 crédits à 199€/mois). En volume : ~45 posts LinkedIn/X, ou un mix LinkedIn + Reels Instagram + newsletters - grosso modo 1,5 à 2 mois au rythme « tous les 2 jours » sur les 7 réseaux. Ils sont sur VOTRE compte pour publier, montrer votre savoir-faire et closer. Client signé = son propre compte, crédits à part (dès ~199€/mois).',
  },
  {
    q: 'On apprend aussi à monétiser ?',
    a: 'Oui. Formation + bootcamp 21 jours : personal branding, monétisation de votre audience, et objectif concret - publier avec Empire et viser un premier client dans les 21 jours pour rentabiliser les 500€.',
  },
  {
    q: 'Les 4 h / mois / client, c’est pour quoi ?',
    a: 'Pas pour inventer les sujets - Empire les propose. Vous choisissez avec le client, puis vous êtes présent pendant le live. Prod, montage, écriture, publication : Empire. Au début ça prend un peu plus le temps que vous montez.',
  },
  {
    q: 'Je facture combien ? Exemple concret ?',
    a: 'En moyenne ~500€ pour ~4 h / mois par client (plus si vous le souhaitez). Avec 6 clients : ~3 000€ / mois. Le client reçoit stratégie + contenus produits via Empire. Des nouveaux clients peuvent aussi vous être proposés gratuitement.',
  },
  {
    q: 'Les 500€, c’est l’entrée ou ce que je facture ?',
    a: 'Les deux existent, mais ce n’est pas la même chose. 500€ d’entrée = replay + 4 000 crédits Empire pour vous. À côté, vous facturez en moyenne ~500€ / mois / client pour ~4 h de travail (plus si vous voulez).',
  },
  {
    q: 'Shopify, Canva, Lemlist - pourquoi ?',
    a: 'Pour situer le schéma : un outil qui fait la prod lourde, vous qui choisissez et restez présents avec le client. Avec Empire, c’est ça pour le personal branding - pas une promesse de « fenêtre qui se ferme demain ».',
  },
  {
    q: 'Je dois venir aux portes ouvertes ?',
    a: 'Oui, c’est le début. Chaque jeudi 11h (Paris), 45 min, questions en direct.',
  },
]

const FAQ_EN = [
  {
    q: 'What are the 4,000 Empire credits?',
    a: 'Empire Internet’s production currency (posts, reels, newsletters, etc.). 4,000 credits ≈ €360 (Starter: 2,200 credits at €199/mo). In volume: ~45 LinkedIn/X posts, or a mix of LinkedIn + Instagram Reels + newsletters - roughly 1.5-2 months at “every other day” pace across 7 networks. They sit on YOUR account to publish, show your craft, and close. Signed client = their own account, separate credits (from ~€199/mo).',
  },
  {
    q: 'Do we also learn monetization?',
    a: 'Yes. Training + 21-day bootcamp: personal branding, monetizing your audience, and a concrete goal - publish with Empire and aim for a first client within 21 days to recoup the €500.',
  },
  {
    q: 'What are the 4 h / month / client for?',
    a: 'Not inventing topics - Empire suggests them. You choose with the client, then you’re present on the live. Production, editing, writing, publishing: Empire. At the start it takes a bit longer while you ramp up.',
  },
  {
    q: 'How much do I charge? Concrete example?',
    a: 'On average ~€500 for ~4 h / month per client (more if you want). With 6 clients: ~€3,000 / month. Client gets strategy + content produced via Empire. New clients can also be proposed to you for free.',
  },
  {
    q: 'Is the €500 the entry fee or what I charge?',
    a: 'Both exist, but they’re different. €500 entry = replay + 4,000 Empire credits for you. Separately, you bill on average ~€500 / month / client for ~4 h of work (more if you want).',
  },
  {
    q: 'Why Shopify, Canva, Lemlist?',
    a: 'To frame the pattern: a tool does heavy production, you choose and stay present with the client. With Empire, that’s personal branding - not a “window closes tomorrow” pitch.',
  },
  {
    q: 'Do I have to come to the open house?',
    a: 'Yes, that’s the start. Every Thursday 11am (Paris), 45 min, live Q&A.',
  },
]

function trackOpen(source: string) {
  trackAmplitude('academy_open_house_clicked', { source })
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
      {children}
    </p>
  )
}

export default function AgencyOpenHousePage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const includes = fr ? INCLUDES_FR : INCLUDES_EN
  const steps = fr ? STEPS_FR : STEPS_EN
  const faqs = fr ? FAQ_FR : FAQ_EN

  const exampleRows = fr
    ? [
        { label: 'Vous facturez (moyenne)', value: '~500€ / mois / client - plus si vous voulez' },
        { label: 'Votre temps', value: '~4 h / mois / client : choisir les sujets + être au live' },
        { label: 'Avec 6 clients', value: '~3 000€ / mois' },
        { label: 'Nouveaux clients', value: 'Proposés gratuitement' },
        { label: 'Empire fait', value: 'Propose les sujets, écrit, monte, publie, track' },
      ]
    : [
        { label: 'You bill (average)', value: '~€500 / month / client - more if you want' },
        { label: 'Your time', value: '~4 h / month / client: choose topics + be on the live' },
        { label: 'With 6 clients', value: '~€3,000 / month' },
        { label: 'New clients', value: 'Proposed to you for free' },
        { label: 'Empire does', value: 'Suggests topics, writes, edits, publishes, tracks' },
      ]

  return (
    <main className="relative bg-black pb-32 text-white antialiased [text-rendering:optimizeLegibility]">
      <WebinarJamBar buttonText={fr ? "S'inscrire" : 'Register'} />

      {/* Hero - un écran, beaucoup d’air */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(252,165,165,0.16),transparent_55%)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[40rem] text-center">
            <SectionLabel>
              {fr ? 'Portes ouvertes · chaque jeudi 11h (Paris)' : 'Open house · every Thursday 11am (Paris)'}
            </SectionLabel>

            <h1 className="mt-6 text-balance text-[2.1rem] font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-[3.25rem]">
              {fr ? (
                <>
                  Accompagnez des entrepreneurs
                  <br className="hidden sm:block" /> dans leur{' '}
                  <span className="text-academy">personal branding</span>
                </>
              ) : (
                <>
                  Help entrepreneurs
                  <br className="hidden sm:block" /> with their{' '}
                  <span className="text-academy">personal branding</span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? 'Empire propose les sujets et produit tout. Vous n’avez pas à les inventer : vous choisissez avec le client, puis vous êtes présent pendant le live.'
                : 'Empire suggests the topics and produces everything. You don’t invent them: you choose with the client, then you’re present on the live.'}
            </p>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-neutral-500">
              {fr
                ? 'Découvrez comment proposer ce service à vos clients - ou lancer votre propre agence - lors de nos portes ouvertes.'
                : 'See how to offer this to your clients - or launch your own agency - at our open house.'}
            </p>

            <div className="mt-10 flex flex-col items-center gap-3">
              <WebinarJamButton
                onClick={() => trackOpen('hero')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-academy px-8 py-3.5 text-[15px] font-semibold text-black transition duration-300 hover:scale-[1.02]"
              >
                {fr ? 'Découvrir le modèle jeudi à 11h' : 'See the model Thursday at 11am'}
                <ArrowRight className="h-4 w-4" />
              </WebinarJamButton>
              <p className="text-[13px] text-neutral-500">
                {fr ? 'Gratuit · 45 minutes · Questions en direct' : 'Free · 45 minutes · Live Q&A'}
              </p>
            </div>

            <nav
              aria-label={fr ? 'Sur cette page' : 'On this page'}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-neutral-500"
            >
              {[
                { href: '#pour-qui', label: fr ? 'Pour qui' : 'For who' },
                { href: '#gains', label: fr ? 'Combien gagner' : 'Earnings' },
                { href: '#modele', label: fr ? 'Le modèle' : 'The model' },
                { href: '#portes-ouvertes', label: fr ? 'Inscription' : 'Register' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.08] bg-[#0a0a0a]/80 py-12 md:py-14">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              {
                value: fr ? '+3 000€' : '+€3,000',
                hint: fr
                  ? '/ mois avec 6 clients (~500€ / client en moyenne)'
                  : '/ month with 6 clients (~€500 / client on average)',
              },
              {
                value: '4h',
                hint: fr
                  ? 'de travail par mois et par client - une fois lancé'
                  : 'of work per month per client - once you’re live',
              },
              {
                value: fr ? '~500€' : '~€500',
                hint: fr
                  ? 'en moyenne pour ces 4 h (plus si vous le souhaitez)'
                  : 'on average for those 4 h (more if you want)',
              },
              {
                value: fr ? 'Gratuit' : 'Free',
                hint: fr
                  ? 'nouveaux clients proposés - sans frais d’apport'
                  : 'new clients proposed - no referral fee',
              },
            ].map((item) => (
              <div key={item.hint} className="text-center">
                <p className="text-[1.85rem] font-semibold tracking-tight text-white md:text-[2.1rem]">
                  {item.value}
                </p>
                <p className="mx-auto mt-2 max-w-[15rem] text-[13px] leading-snug text-neutral-500">
                  {item.hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="scroll-mt-28 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>{fr ? 'Pour qui' : 'Who it’s for'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Si vous voulez vendre du personal branding - sans monter une usine de prod'
                  : 'If you want to sell personal branding - without building a production factory'}
              </h2>
            </div>
            <ul className="mt-12 space-y-0 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {(fr
                ? [
                    { yes: true, t: 'Freelance, consultant, coach' , d: 'Vous voulez une offre claire à facturer chaque mois, sans recruter des monteurs.' },
                    { yes: true, t: 'Créateur ou community qui veut passer côté business', d: 'Vous savez déjà parler contenu. Là vous vendez le service aux entrepreneurs.' },
                    { yes: true, t: 'Quelqu’un qui lance (ou a) une petite agence', d: 'Vous gardez la relation client. Empire sort les posts, reels, newsletters.' },
                    { yes: false, t: 'Pas pour vous si…', d: 'Vous cherchez un job salarié, ou une franchise clé en main sans closer vous-même.' },
                  ]
                : [
                    { yes: true, t: 'Freelancer, consultant, coach', d: 'You want a clear monthly offer to bill - without hiring editors.' },
                    { yes: true, t: 'Creator or community person going B2B', d: 'You already get content. Now you sell the service to entrepreneurs.' },
                    { yes: true, t: 'Someone starting (or running) a small agency', d: 'You keep the client relationship. Empire ships posts, reels, newsletters.' },
                    { yes: false, t: 'Not for you if…', d: 'You want a salaried job, or a turnkey franchise without closing yourself.' },
                  ]
              ).map((row) => (
                <li key={row.t} className="grid gap-1 py-5 sm:grid-cols-[1.1fr_1.4fr] sm:gap-6">
                  <p className={`text-[15px] font-semibold ${row.yes ? 'text-white' : 'text-neutral-500'}`}>
                    {row.t}
                  </p>
                  <p className="text-[14px] leading-relaxed text-neutral-400">{row.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gains + marché */}
      <section id="gains" className="scroll-mt-28 bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>{fr ? 'Combien gagner' : 'What you can earn'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Entre +3 000€ / mois avec 6 clients'
                  : 'From +€3,000 / month with 6 clients'}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.55] text-neutral-400">
                {fr
                  ? 'Environ 4 h / mois / client une fois lancé : choisir les sujets proposés par Empire et être présent au live. Vous facturez ~500€ en moyenne (plus si vous voulez). Nouveaux clients proposés gratuitement. Aux États-Unis, c’est l’un des métiers les plus recherchés.'
                  : 'About 4 h / month / client once live: choose topics Empire suggests and show up on the live. You bill ~€500 on average (more if you want). New clients proposed for free. In the US, it’s one of the most sought-after roles.'}
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/[0.08]">
              <div className="border-b border-white/[0.08] px-6 py-4">
                <p className="text-[13px] font-semibold text-white">
                  {fr ? 'Ordres de grandeur' : 'Ballpark'}
                </p>
              </div>
              <dl>
                {(fr
                  ? [
                      { clients: '1 client (~500€)', margin: '~500€ / mois', note: '~4 h : choisir + live · Empire produit' },
                      { clients: '3 clients', margin: '~1 500€ / mois', note: '~12 h / mois au total' },
                      { clients: '6 clients', margin: '~3 000€ / mois', note: '~24 h / mois · sans recruter de prod' },
                    ]
                  : [
                      { clients: '1 client (~€500)', margin: '~€500 / month', note: '~4 h: choose + live · Empire produces' },
                      { clients: '3 clients', margin: '~€1,500 / month', note: '~12 h / month total' },
                      { clients: '6 clients', margin: '~€3,000 / month', note: '~24 h / month · no production team' },
                    ]
                ).map((row, i, arr) => (
                  <div
                    key={row.clients}
                    className={`grid gap-1 px-6 py-5 sm:grid-cols-[1fr_1fr] sm:items-baseline sm:gap-4 ${
                      i < arr.length - 1 ? 'border-b border-white/[0.06]' : ''
                    }`}
                  >
                    <div>
                      <dt className="text-[14px] font-medium text-white">{row.clients}</dt>
                      <p className="mt-1 text-[12px] text-neutral-500">{row.note}</p>
                    </div>
                    <dd className="text-[18px] font-semibold tracking-tight text-academy sm:text-right">
                      {row.margin}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mt-8 text-center text-[13px] leading-relaxed text-neutral-500">
              {fr
                ? 'Entrée à 500€ : replay + 4 000 crédits Empire pour publier sur vous et closer. Le marché personal branding en Europe : ~417 M$ (2025).'
                : '€500 entry: replay + 4,000 Empire credits to publish on yourself and close. Europe personal branding market: ~$417M (2025).'}
            </p>
          </div>
        </div>
      </section>

      {/* Modèle */}
      <section id="modele" className="scroll-mt-28 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>{fr ? 'Le modèle' : 'The model'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Empire fait le lourd. Vous choisissez et vous êtes là.'
                  : 'Empire does the heavy lifting. You choose and show up.'}
              </h2>
              <p className="mt-5 text-[17px] leading-[1.55] text-neutral-300">
                {fr
                  ? 'Pas besoin d’inventer les sujets ni de monter les contenus. Empire propose. Vous validez avec le client. Puis vous êtes présent pendant le live.'
                  : 'No need to invent topics or edit content. Empire suggests. You validate with the client. Then you’re present on the live.'}
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {fr ? 'Empire' : 'Empire'}
                </p>
                <ul className="mt-4 space-y-3">
                  {(fr
                    ? [
                        'Propose les sujets (vous n’avez pas à les trouver)',
                        'Écriture des posts, scripts, newsletters',
                        'Montage des vidéos / reels',
                        'Publication et suivi des perfs',
                      ]
                    : [
                        'Suggests topics (you don’t have to find them)',
                        'Writes posts, scripts, newsletters',
                        'Edits videos / reels',
                        'Publishes and tracks performance',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-snug text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {fr ? 'Vous' : 'You'}
                </p>
                <ul className="mt-4 space-y-3">
                  {(fr
                    ? [
                        'Choisir les sujets avec le client',
                        'Être présent pendant le live',
                        'Garder la relation et closer',
                      ]
                    : [
                        'Choose topics with the client',
                        'Be present on the live',
                        'Own the relationship and close',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-snug text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exemple - liste type iOS / Instagram clarity */}
            <div className="mt-12 overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/[0.08]">
              <div className="border-b border-white/[0.08] px-6 py-4">
                <p className="text-[13px] font-semibold text-white">
                  {fr ? 'Exemple concret (1 client)' : 'Concrete example (1 client)'}
                </p>
              </div>
              <dl>
                {exampleRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid gap-1 px-6 py-4 sm:grid-cols-[0.9fr_1.1fr] sm:gap-6 ${
                      i < exampleRows.length - 1 ? 'border-b border-white/[0.06]' : ''
                    }`}
                  >
                    <dt className="text-[13px] text-neutral-500">{row.label}</dt>
                    <dd className="text-[15px] font-medium leading-snug text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mt-8 text-center text-[13px] leading-relaxed text-neutral-500">
              {fr
                ? 'Comme Shopify pour le dropshipping ou Lemlist pour l’outbound : l’outil produit, vous orientez. Ici, pour le personal branding.'
                : 'Like Shopify for dropshipping or Lemlist for outbound: the tool produces, you steer. Here, for personal branding.'}
            </p>
          </div>
        </div>
      </section>

      {/* Votre image - fond légèrement différent, texte centré large */}
      <section id="vous" className="scroll-mt-28 bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem] text-center">
            <SectionLabel>{fr ? 'Votre image' : 'Your brand'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Vous commencez par votre propre image'
                : 'You start with your own brand'}
            </h2>
            <p className="mt-6 text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? 'Les 4 000 crédits Empire Internet, c’est de la prod pour VOUS : LinkedIn, Instagram, newsletters… Assez pour ~1,5 à 2 mois au rythme Débutant (tous les 2 jours). Vous publiez, vous monétisez votre audience, vous montrez le savoir-faire - et dans le bootcamp 21 jours, l’objectif c’est de closer un premier client pour rentabiliser les 500€.'
                : 'The 4,000 Empire Internet credits are production for YOU: LinkedIn, Instagram, newsletters… Enough for ~1.5-2 months at Starter pace (every other day). You publish, monetize your audience, show the craft - and in the 21-day bootcamp, the goal is to close a first client to recoup the €500.'}
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-neutral-500">
              {fr
                ? 'Ensuite seulement : un client = son propre compte Empire (crédits à part). Votre contenu travaille aussi - vous n’attendez pas uniquement des templates de prospection.'
                : 'Only then: a client = their own Empire account (separate credits). Your content works too - you’re not waiting only on outreach templates.'}
            </p>
          </div>
        </div>
      </section>

      {/* Kevin - photos plein cadre, légendes discrètes */}
      <section id="kevin" className="scroll-mt-28 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem] text-center">
            <SectionLabel>Kevin Dufraisse</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr ? 'Qui vous forme' : 'Who trains you'}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? 'Moi, Kevin. J’ai passé un an sur les process de Justin Welsh et Matt Gray, et j’ai travaillé avec eux. J’étais Top 50 LinkedIn France. C’est cette méthode qu’on vous transmet - avec Empire pour produire.'
                : 'Me, Kevin. I spent a year on Justin Welsh and Matt Gray’s processes, and I worked with them. I was Top 50 LinkedIn France. That’s the method we teach - with Empire to produce.'}
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4">
            <figure className="overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/5] sm:aspect-[4/3]">
                <Image
                  src="/webinar/kevin-justin-welsh.jpg"
                  alt="Kevin et Justin Welsh"
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 480px"
                />
              </div>
              <figcaption className="mt-3 text-center text-[13px] text-neutral-500">
                Kevin + Justin Welsh
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/5] sm:aspect-[4/3]">
                <Image
                  src="/webinar/kevin-matt-gray.png"
                  alt="Kevin et Matt Gray"
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover object-[center_28%]"
                  sizes="(max-width: 640px) 100vw, 480px"
                />
              </div>
              <figcaption className="mt-3 text-center text-[13px] text-neutral-500">
                Kevin + Matt Gray
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Includes - grille aérée, sans boîtes lourdes */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem] text-center">
            <SectionLabel>{fr ? 'Entrée' : 'Entry'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr ? 'Ce qu’il y a dans les 500€' : 'What’s in the €500'}
            </h2>
          </div>
          <ul className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {includes.map((item, i) => (
              <li key={item.title}>
                <p className="font-mono text-[12px] text-academy/80">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 text-[16px] font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="border-y border-white/[0.06]">
        <AcademyTestimonialsSection />
        <p className="mx-auto -mt-6 mb-16 max-w-xl px-4 text-center text-[12px] leading-relaxed text-neutral-600">
          {fr
            ? 'Retours de personnes passées par Empire / la formation - pas tous partenaires agence.'
            : 'Feedback from people who went through Empire / the training - not all agency partners.'}
        </p>
      </div>

      {/* Steps - timeline claire */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem] text-center">
            <SectionLabel>{fr ? 'Process' : 'Process'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr ? 'Les 3 étapes' : 'The 3 steps'}
            </h2>
          </div>
          <ol className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li key={step.n} className="text-center md:text-left">
                <p className="font-mono text-[13px] font-medium text-academy">{step.n}</p>
                <p className="mt-3 text-[18px] font-semibold tracking-tight text-white">
                  {step.title}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Inscription - split Instagram-clean */}
      <section
        id="portes-ouvertes"
        className="scroll-mt-28 border-t border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28"
      >
        <div className="container">
          <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionLabel>{fr ? 'Inscription' : 'Register'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr ? 'Jeudi 11h - portes ouvertes' : 'Thursday 11am - open house'}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.55] text-neutral-300">
                {fr
                  ? '45 min. Le métier, le modèle d’argent, ce que ça demande vraiment. Questions en direct. Ensuite candidature si ça matche.'
                  : '45 min. The job, the money model, what it really takes. Live Q&A. Then apply if it fits.'}
              </p>
              <ul className="mt-8 space-y-3">
                {(fr
                  ? [
                      'Comment accompagner un entrepreneur (votre rôle vs Empire)',
                      'Votre image d’abord, puis les clients',
                      'Exemple de marge et temps réel',
                      'Questions en direct',
                    ]
                  : [
                      'How to support an entrepreneur (your role vs Empire)',
                      'Your brand first, then clients',
                      'Real margin and time example',
                      'Live Q&A',
                    ]
                ).map((line) => (
                  <li key={line} className="flex gap-3 text-[14px] text-neutral-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" strokeWidth={2.5} />
                    {line}
                  </li>
                ))}
              </ul>
              <WebinarJamButton
                onClick={() => trackOpen('section')}
                className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-academy px-7 py-3 text-[14px] font-semibold text-black transition duration-300 hover:scale-[1.02]"
              >
                {fr ? 'Je m’inscris' : 'I’m in'}
                <ArrowRight className="h-4 w-4" />
              </WebinarJamButton>
            </div>
            <div className="lg:sticky lg:top-28">
              <WebinarJamEmbed fr={fr} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>

      {/* FAQ - accordéon fin */}
      <section id="faq" className="scroll-mt-28 border-t border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr ? 'Questions' : 'Questions'}
              </h2>
            </div>
            <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {faqs.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="cursor-pointer list-none text-[15px] font-semibold tracking-tight text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {item.q}
                      <span className="mt-0.5 text-neutral-600 transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 text-[14px] leading-relaxed text-neutral-500">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-[22px] font-semibold tracking-tight text-white">
                {fr ? 'On se retrouve jeudi ?' : 'See you Thursday?'}
              </p>
              <WebinarJamButton
                onClick={() => trackOpen('footer')}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-academy px-8 py-3.5 text-[15px] font-semibold text-black transition duration-300 hover:scale-[1.02]"
              >
                {fr ? 'Découvrir le modèle jeudi à 11h' : 'See the model Thursday at 11am'}
                <ArrowRight className="h-4 w-4" />
              </WebinarJamButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
