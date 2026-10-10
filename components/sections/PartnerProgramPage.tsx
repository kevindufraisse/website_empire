'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { partnerPayHref } from '@/lib/partner-festival-pricing'
import { usePartnerFestivalPricing } from '@/hooks/usePartnerFestivalPricing'
import { WebinarJamBar, WebinarJamButton } from '@/components/WebinarJamRegister'
import FeaturedInSection from '@/components/FeaturedInSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import AcademyProductDemo from '@/components/AcademyProductDemo'

type Level = 'debutant' | 'confirme' | 'expert'

const RATES: Record<Level, number> = {
  debutant: 500,
  confirme: 1000,
  expert: 2000,
}

const HOURS_PER_CLIENT = 4

function trackOpen(source: string) {
  trackAmplitude('academy_open_house_clicked', { source })
}

function PartnerPayLink({
  fr,
  source,
  price,
}: {
  fr: boolean
  source: string
  price: number
}) {
  return (
    <a
      href={partnerPayHref()}
      onClick={() => trackAmplitude('academy_partner_checkout_clicked', { source, price })}
      className="inline-flex h-11 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-white/20 bg-transparent px-6 text-[14px] font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.04]"
    >
      {fr
        ? `Payer ${price} € et rejoindre le programme`
        : `Pay €${price} and join the program`}
      <ArrowRight className="h-4 w-4" />
    </a>
  )
}

/** Ladder 500 → 700 → 800 + compte à rebours jusqu’au prochain palier. */
function FestivalPriceBlock({
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-academy">
      {children}
    </p>
  )
}

function CtaBlock({
  fr,
  source,
  fullWidth = false,
}: {
  fr: boolean
  source: string
  /** Aligné sur la largeur du bloc parent (ex. simulation). */
  fullWidth?: boolean
}) {
  return (
    <WebinarJamButton
      onClick={() => trackOpen(source)}
      className={`inline-flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-academy px-6 py-3.5 text-black transition hover:brightness-110 ${
        fullWidth ? 'w-full' : 'mx-auto w-full max-w-md'
      }`}
    >
      <span className="inline-flex items-center gap-2 text-[15px] font-bold leading-snug">
        {fr ? 'S’inscrire à la porte ouverte' : 'Register for the open house'}
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
          a: 'Vous créez votre compte, recevez 4 000 crédits pour développer votre marque personnelle, accédez à « Mes posts les plus viraux », à la formation et à la communauté à vie, puis ouvrez votre page consultant pour encaisser vos clients.',
        },
        {
          q: 'Pourquoi une sélection ?',
          a: 'Nous vérifions que le programme correspond à votre projet et que vous avez la disponibilité nécessaire pour apprendre et accompagner vos clients.',
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
          a: 'You create your account, get training and Slack, receive 4,000 credits to practice, then open your consultant page to charge clients (Starter / Growth / Scale).',
        },
        {
          q: 'Why is there a selection?',
          a: 'We check the program fits your goals and that you have time to learn and support clients.',
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
              {fr ? 'Pour les freelances et les agences' : 'For freelancers and agencies'}
            </p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {fr
                ? 'Accompagnez plus de clients. Sans produire tous leurs contenus.'
                : 'Support more clients. Without producing all their content.'}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? 'Vos clients savent qu’ils doivent publier, mais manquent de temps, d’équipe et de méthode. Vous devenez leur interlocuteur stratégique. Empire écrit, monte, programme et suit les résultats.'
                : 'Your clients want to show up on LinkedIn, Instagram or YouTube. You support them. Empire writes, edits, schedules and tracks results.'}
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <CtaBlock fr={fr} source="hero" />
              <p className="mt-2 text-[12px] text-neutral-500">
                {fr ? 'Déjà convaincu ? Rejoignez directement.' : 'Already convinced? Join right away.'}
              </p>
              <FestivalPriceBlock fr={fr} pricing={festival} />
              <PartnerPayLink fr={fr} source="hero" price={festival.price} />
            </div>
          </div>
        </div>
      </section>

      {/* Même preuve que la home : presse puis créateurs / influenceurs */}
      <section className="w-full border-b border-white/[0.06] bg-black py-4 sm:py-5">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection accent="academy" />
        </div>
      </section>
      <TopCreatorsSection compact accent="academy" />

      {/* Opportunité marché : douleur prouvée + valeur économique du modèle */}
      <section className="border-b border-white/[0.06] py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>{fr ? 'L’opportunité' : 'The opportunity'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Le contenu est devenu un canal de vente. Sa production reste le goulot d’étranglement.'
                : 'Content has become a sales channel. Production is still the bottleneck.'}
            </h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Les entrepreneurs n’ont pas besoin d’être convaincus de publier. Ils ont besoin de quelqu’un qui transforme leur expertise en contenus réguliers, sans leur demander de coordonner une équipe entière.'
                : 'Entrepreneurs do not need convincing that they should publish. They need someone who turns their expertise into consistent content without making them coordinate an entire team.'}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {(fr
                ? [
                    ['54 %', 'des équipes B2B manquent de ressources pour leur contenu.'],
                    ['74 %', 'disent que le contenu leur génère de la demande ou des leads.'],
                    ['95 %', 'des acheteurs B2B deviennent plus réceptifs à la prospection après un contenu expert de qualité.'],
                  ]
                : [
                    ['54%', 'of B2B teams lack the resources they need for content.'],
                    ['74%', 'say content generates demand or leads for them.'],
                    ['95%', 'of hidden B2B buyers become more receptive to outreach after strong thought leadership.'],
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
                href="https://contentmarketinginstitute.com/b2b-research/b2b-content-marketing-trends-research-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
              >
                Content Marketing Institute, 2025
              </a>
              {' · '}
              <a
                href="https://www.edelman.com/insights/hidden-buyer-b2b"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
              >
                Edelman x LinkedIn, 2025
              </a>
            </p>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {fr ? 'Le modèle traditionnel' : 'The traditional model'}
                </p>
                <h3 className="mt-3 text-xl font-semibold">
                  {fr ? 'Assembler et coordonner quatre métiers.' : 'Assemble and coordinate four specialists.'}
                </h3>
                <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {(fr
                    ? [
                        ['Conseil et stratégie', '531 € / jour'],
                        ['Conception-rédaction', '411 € / jour'],
                        ['Community management', '405 € / jour'],
                        ['Vidéo et motion design', '420 € / jour'],
                      ]
                    : [
                        ['Consulting and strategy', '€531 / day'],
                        ['Copywriting', '€411 / day'],
                        ['Community management', '€405 / day'],
                        ['Video and motion design', '€420 / day'],
                      ]
                  ).map(([role, rate]) => (
                    <div key={role} className="flex items-center justify-between gap-4 py-3 text-[14px]">
                      <span className="text-neutral-400">{role}</span>
                      <span className="shrink-0 font-medium text-neutral-200">{rate}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[15px] font-medium text-white">
                  {fr
                    ? '4 jours par métier : environ 7 068 € / mois.'
                    : 'Four days per specialist: approximately €7,068 / month.'}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-600">
                  {fr
                    ? 'À 5 jours chacun : 8 835 €, avant les outils et le temps de coordination.'
                    : 'At five days each: €8,835, before tools and coordination time.'}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-academy/30 bg-academy/[0.07] p-6 sm:p-7">
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-academy/10 blur-3xl" />
                <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-academy">
                  {fr ? 'Le modèle Empire Partner' : 'The Empire Partner model'}
                </p>
                <h3 className="relative mt-3 text-xl font-semibold">
                  {fr
                    ? 'Une offre premium portée par une seule personne.'
                    : 'A premium offer delivered by one person.'}
                </h3>
                <ul className="relative mt-6 space-y-4">
                  {(fr
                    ? [
                        'Vous gérez la relation, la stratégie et les décisions avec le client.',
                        'Empire rédige, monte, programme et mesure la production.',
                        'Le client achète un accompagnement cohérent au lieu de piloter quatre prestataires.',
                        'Vous pouvez vendre une prestation complète sans recruter une équipe de production.',
                      ]
                    : [
                        'You own the client relationship, strategy and decisions.',
                        'Empire writes, edits, schedules and measures production.',
                        'The client buys one coherent service instead of managing four vendors.',
                        'You can sell a complete service without hiring a production team.',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-3 text-[14px] leading-relaxed text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" strokeWidth={2.5} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="relative mt-7 rounded-xl border border-academy/20 bg-black/25 px-4 py-3 text-[13px] leading-relaxed text-neutral-300">
                  {fr
                    ? 'L’opportunité : apporter la valeur d’une équipe, avec la charge opérationnelle d’un accompagnement.'
                    : 'The opportunity: deliver the value of a team with the operating load of one advisory relationship.'}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-neutral-600">
              {fr ? 'TJM moyens de freelances expérimentés en France :' : 'Average day rates for experienced freelancers in France:'}{' '}
              <a
                href="https://www.malt.fr/t/barometre-tarifs/communication/community-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
              >
                {fr ? 'communication' : 'communication'}
              </a>
              {' · '}
              <a
                href="https://www.malt.fr/t/barometre-tarifs/image-son"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-neutral-400"
              >
                Malt 2026
              </a>
              . {fr ? 'Exemple indicatif, hors outils et coordination.' : 'Illustrative example, excluding tools and coordination.'}
            </p>
          </div>
        </div>
      </section>

      {/* Portes ouvertes + témoignages, placés haut dans la page */}
      <section id="portes-ouvertes" className="scroll-mt-28 border-b border-white/[0.06] py-16 md:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
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
              <p className="mt-6 text-[15px] font-medium text-white">
                {fr ? 'Pendant 45 minutes, vous allez voir :' : 'In 45 minutes, you’ll see:'}
              </p>
              <ul className="mt-4 space-y-3">
                {(fr
                  ? [
                      'Comment un partenaire accompagne un client dans Empire.',
                      'Ce que vous faites et ce que la plateforme prend en charge.',
                      'Comment fonctionnent les missions, la rémunération et les crédits.',
                      'Comment se déroule la formation et comment candidater.',
                    ]
                  : [
                      'How a partner supports a client inside Empire.',
                      'What you do vs what the platform handles.',
                      'How missions, pay and credits work.',
                      'How training works and how to apply.',
                    ]
                ).map((line) => (
                  <li key={line} className="flex gap-3 text-[14px] text-neutral-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" strokeWidth={2.5} />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] text-neutral-400">
                {fr
                  ? 'L’objectif : que vous puissiez décider si ce fonctionnement correspond à votre activité.'
                  : 'Goal: decide whether this model fits your business.'}
              </p>
              <div className="mt-8">
                <CtaBlock fr={fr} source="section" />
              </div>
              <p className="mt-4 text-[13px] text-neutral-600">
                {fr
                  ? `Après le live, vous pouvez rejoindre tout de suite — frais d’inscription : ${festival.price} €.`
                  : `After the live, you can join right away — registration fee: €${festival.price}.`}
              </p>
            </div>
            <div className="min-h-[24rem] lg:sticky lg:top-28">
              <div
                className="senja-embed w-full"
                data-id="2a990f91-6426-436a-b50d-318fc49a7851"
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: 'block', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problème client */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div>
              <SectionLabel>{fr ? 'Le besoin' : 'The need'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Votre prochain client a déjà des choses à raconter.'
                  : 'Your next client already has things to say.'}
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
                <p>
                  {fr
                    ? 'Il connaît son métier. Il a des expériences, des convictions et des conseils à partager.'
                    : 'They know their craft. They have experience, opinions and advice worth sharing.'}
                </p>
                <p>
                  {fr
                    ? 'Mais quand il faut choisir un sujet, se filmer et publier régulièrement, ça passe après tout le reste.'
                    : 'But picking a topic, filming and publishing regularly always comes after everything else.'}
                </p>
                <p>
                  {fr
                    ? 'Vous le connaissez peut-être déjà. C’est ce client qui vous dit : « Il faudrait vraiment que je m’occupe de mon LinkedIn. » Ou cet entrepreneur qui enregistre trois vidéos, puis ne publie plus pendant deux mois.'
                    : 'You may already know them. The client who says “I really should get on LinkedIn.” Or the founder who records three videos, then disappears for two months.'}
                </p>
                <p className="font-medium text-neutral-200">
                  {fr
                    ? 'Ce qui lui manque, c’est quelqu’un pour s’en occuper avec lui. Quelqu’un qui lui pose les bonnes questions, l’aide à choisir ses sujets et fait avancer les choses chaque semaine.'
                    : 'What’s missing is someone to handle it with them. Someone who asks the right questions, helps choose topics and moves things forward every week.'}
                </p>
                <p className="text-white">
                  {fr
                    ? 'C’est votre rôle en tant que partenaire Empire.'
                    : 'That’s your role as an Empire partner.'}
                </p>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/webinar/kevin-justin-welsh.jpg"
                  alt={fr ? 'Kevin Dufraisse avec Justin Welsh' : 'Kevin Dufraisse with Justin Welsh'}
                  fill
                  sizes="(max-width: 1024px) 28rem, 40vw"
                  className="object-cover object-center"
                />
              </div>
              <p className="mt-3 text-center text-[12px] text-neutral-500 lg:text-left">
                Kevin Dufraisse · Justin Welsh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vous / Empire */}
      <section className="border-y border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>{fr ? 'Le modèle' : 'The model'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Vous vous occupez du client. Empire s’occupe de la production.'
                  : 'You handle the client. Empire handles production.'}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-neutral-400">
                {fr
                  ? 'Habituellement, accompagner un client sur ses contenus signifie aussi gérer la rédaction, le montage et les publications. Avec Empire, vous disposez d’un système pour réaliser cette partie du travail.'
                  : 'Usually, supporting a client on content also means writing, editing and publishing. With Empire, you get a system that covers that part of the work.'}
              </p>
            </div>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {fr ? 'Vous' : 'You'}
                </p>
                <ul className="mt-4 space-y-3">
                  {(fr
                    ? [
                        'Échangez avec le client pour recueillir ses idées.',
                        'Choisissez les sujets avec lui.',
                        'Validez les contenus et suivez les résultats.',
                      ]
                    : [
                        'Talk with the client to gather their ideas.',
                        'Choose topics with them.',
                        'Approve content and track results.',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-snug text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Empire
                </p>
                <ul className="mt-4 space-y-3">
                  {(fr
                    ? [
                        'Propose des sujets et des formats.',
                        'Rédige les publications et monte les vidéos.',
                        'Programme les contenus et suit leurs performances.',
                      ]
                    : [
                        'Suggests topics and formats.',
                        'Writes posts and edits videos.',
                        'Schedules content and tracks performance.',
                      ]
                  ).map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-snug text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-10 text-center text-[15px] leading-relaxed text-neutral-400">
              {fr
                ? 'Vous restez l’interlocuteur du client. Vous utilisez Empire pour l’aider à construire sa présence en ligne.'
                : 'You stay the client’s point of contact. You use Empire to help them build their online presence.'}
            </p>
            <p className="mt-4 text-center text-[15px] font-medium text-white">
              {fr
                ? 'Le repère, une fois le système pris en main : environ 4 heures par mois et par client, hors apprentissage, installation et prospection.'
                : 'Benchmark once you’re fluent: about 4 hours per month per client, excluding training, setup and outreach.'}
            </p>
          </div>
        </div>
      </section>

      {/* Parcours produit réel */}
      <section className="border-b border-white/[0.06] py-20 md:py-28">
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
      <section id="simulation" className="scroll-mt-28 border-y border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
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
                  ? 'Voici les repères de rémunération mensuelle par client :'
                  : 'Here are monthly earnings benchmarks per client:'}
              </p>
            </div>

            <dl className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {(fr
                ? [
                    {
                      t: 'Débutant · Environ 500 €',
                      d: 'Vous prenez en main la méthode et réalisez vos premières missions. Repère : ~4 h / mois / client.',
                    },
                    {
                      t: 'Confirmé · 1 000 € ou plus',
                      d: 'Vous maîtrisez l’accompagnement et savez orienter le client.',
                    },
                    {
                      t: 'Expert · Environ 2 000 €',
                      d: 'Vous apportez une expertise et des résultats clients démontrés.',
                    },
                  ]
                : [
                    {
                      t: 'Beginner · About €500',
                      d: 'You’re learning the method and running first missions. Benchmark: ~4 h / month / client.',
                    },
                    {
                      t: 'Solid · €1,000 or more',
                      d: 'You run the support well and know how to steer the client.',
                    },
                    {
                      t: 'Expert · About €2,000',
                      d: 'You bring expertise and proven client results.',
                    },
                  ]
              ).map((row) => (
                <div key={row.t} className="py-5">
                  <dt className="text-[16px] font-semibold text-white">{row.t}</dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-neutral-500">{row.d}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-center text-[12px] text-neutral-600">
              {fr
                ? 'Ces montants dépendent de votre expérience, de la mission et du client. Ils sont indiqués avant frais, charges et impôts.'
                : 'Amounts depend on experience, mission and client. Figures are before fees, costs and tax.'}
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
                <CtaBlock fr={fr} source="simulation" fullWidth />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamp */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
            <SectionLabel>{fr ? 'Formation' : 'Training'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Vous apprenez d’abord à l’utiliser pour vous.'
                : 'You learn to use it on yourself first.'}
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.6] text-neutral-400">
              <p>
                {fr
                  ? 'Pour accompagner un client avec Empire, vous devez savoir utiliser le système. C’est le rôle du bootcamp de 21 jours.'
                  : 'To support a client with Empire, you need to know the system. That’s what the 21-day bootcamp is for.'}
              </p>
              <p>
                {fr
                  ? 'Vous appliquez la méthode à vos propres comptes avec 4 000 crédits. Vous repartez des contenus qui ont déjà performé dans « Mes posts les plus viraux », créez les vôtres dans Empire et publiez pour développer votre marque personnelle.'
                  : 'You apply the method to your own accounts with 4,000 credits. You adapt proven content from “My most viral posts,” create your own in Empire and publish to grow your personal brand.'}
              </p>
              <p className="font-medium text-neutral-200">
                {fr
                  ? 'Votre personal branding devient aussi votre vitrine.'
                  : 'Your personal brand becomes your showcase too.'}
              </p>
              <p>
                {fr
                  ? 'Les prospects peuvent découvrir votre approche, voir vos contenus et comprendre ce que vous pourriez réaliser pour eux. Cela vous aide à créer des conversations, à développer les recommandations et à soutenir votre prospection.'
                  : 'Prospects can see your approach, your content and what you could do for them. That fuels conversations, referrals and outreach.'}
              </p>
              <p className="text-white">
                {fr
                  ? 'La méthode est conçue pour viser jusqu’à 1 million de vues dès le premier mois. Le résultat dépend de votre exécution, de vos sujets et des plateformes.'
                  : 'The method is designed to aim for up to one million views in the first month. Results depend on your execution, topics and platforms.'}
              </p>
            </div>

            <h3 className="mt-12 text-xl font-semibold tracking-tight">
              {fr ? '21 jours pour prendre le système en main.' : '21 days to get fluent with the system.'}
            </h3>
            <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {(fr
                ? [
                    {
                      t: 'Semaine 1 — Positionnement et prospection',
                      d: 'Vous posez votre offre, commencez vos premières conversations et adaptez des formats issus de « Mes posts les plus viraux ».',
                    },
                    {
                      t: 'Semaine 2 — Créer et publier avec Empire',
                      d: 'Vous utilisez vos crédits pour produire vos propres contenus, publier régulièrement et construire votre preuve.',
                    },
                    {
                      t: 'Semaine 3 — Transformer votre visibilité en clients',
                      d: 'Vous apprenez à présenter votre accompagnement, conduire l’entretien et ouvrir votre page consultant.',
                    },
                  ]
                : [
                    {
                      t: 'Week 1 — Positioning and outreach',
                      d: 'Shape your offer, start your first sales conversations and adapt formats from “My most viral posts.”',
                    },
                    {
                      t: 'Week 2 — Create and publish with Empire',
                      d: 'Use your credits to produce your own content, publish consistently and build proof.',
                    },
                    {
                      t: 'Week 3 — Turn visibility into clients',
                      d: 'Learn to present your service, run the interview and open your consultant page.',
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
                    'Le bootcamp de 21 jours.',
                    'La communauté, le Slack et les rendez-vous partenaires accessibles à vie.',
                    'Les templates de prospection et les méthodes de vente.',
                    'Les sujets, formats et processus d’accompagnement.',
                    '« Mes posts les plus viraux » pour repartir de formats qui fonctionnent.',
                    '4 000 crédits pour développer votre marque personnelle dès le premier mois.',
                    'Votre page consultant pour encaisser l’accompagnement de vos clients.',
                  ]
                : [
                    'Full training and replays.',
                    'The 21-day bootcamp.',
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
              <PartnerPayLink fr={fr} source="program" price={festival.price} />
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
                ? 'Des missions peuvent également être proposées par Empire selon les besoins du réseau, votre profil et votre disponibilité. L’admission ne garantit pas de mission.'
                : 'Missions may also be proposed by Empire based on network needs, your profile and availability. Admission does not guarantee a mission.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-t border-white/[0.06] py-20 md:py-28">
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
              <CtaBlock fr={fr} source="faq" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
