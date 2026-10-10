'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { getPlan } from '@/lib/plans'
import { usePartnerFestivalPricing } from '@/hooks/usePartnerFestivalPricing'
import { WebinarJamBar } from '@/components/WebinarJamRegister'
import FeaturedInSection from '@/components/FeaturedInSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import AcademyProductDemo from '@/components/AcademyProductDemo'
import {
  CtaBlock,
  FestivalPriceBlock,
  PartnerPayLink,
  SectionLabel,
} from '@/components/sections/PartnerProgramPage'

const HOURS_PER_CLIENT = 4

export default function AgencyProgramPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const festival = usePartnerFestivalPricing()
  const clientStarterPrice = getPlan('starter').price
  const [clients, setClients] = useState(5)
  const [fee, setFee] = useState(1000)

  const simulation = useMemo(
    () => ({
      monthlyFees: clients * fee,
      monthlyHours: clients * HOURS_PER_CLIENT,
    }),
    [clients, fee],
  )

  const faqs = fr
    ? [
        {
          q: 'Mes clients doivent-ils acheter leur propre abonnement Empire ?',
          a: `Oui. Chaque client possède son espace et ses crédits de production, à partir de ${clientStarterPrice} € par mois. Cet abonnement est facturé séparément de vos honoraires d’accompagnement.`,
        },
        {
          q: 'Dois-je recruter un copywriter ou un monteur ?',
          a: 'Non. Empire prend en charge la rédaction, le montage, la programmation et le suivi de la production. Votre agence conserve la stratégie, la relation et les validations.',
        },
        {
          q: 'Puis-je utiliser Empire en marque blanche ?',
          a: 'Vous restez l’interlocuteur principal et pouvez intégrer Empire dans votre processus. Les modalités exactes de présentation au client sont expliquées pendant la porte ouverte.',
        },
        {
          q: 'Les 4 heures par mois et les honoraires sont-ils garantis ?',
          a: 'Non. Ce sont des repères indicatifs une fois le système maîtrisé. Le temps et les honoraires réels dépendent de votre offre, de votre équipe et de chaque mission.',
        },
        {
          q: 'Empire fournit-il des clients à mon agence ?',
          a: 'Le programme ne garantit aucune mission. Des opportunités peuvent être proposées selon les besoins du réseau, mais la page est conçue d’abord pour déployer l’offre auprès de votre portefeuille et de vos prospects.',
        },
      ]
    : [
        {
          q: 'Do clients need their own Empire subscription?',
          a: `Yes. Each client has a separate workspace and production credits, starting at €${clientStarterPrice} per month. That subscription is billed separately from your advisory fees.`,
        },
        {
          q: 'Do I need to hire a copywriter or video editor?',
          a: 'No. Empire handles writing, editing, scheduling and production tracking. Your agency keeps strategy, relationships and approvals.',
        },
        {
          q: 'Can I use Empire white-label?',
          a: 'You remain the main client contact and can integrate Empire into your process. The exact client-facing setup is explained during the open house.',
        },
        {
          q: 'Are four hours a month and the fees guaranteed?',
          a: 'No. They are indicative benchmarks once the system is mastered. Actual time and fees depend on your offer, team and each engagement.',
        },
        {
          q: 'Does Empire provide clients to my agency?',
          a: 'The program does not guarantee missions. Opportunities may be shared based on network needs, but this page is designed first for deploying the offer to your portfolio and prospects.',
        },
      ]

  return (
    <main className="relative bg-black pb-40 text-white antialiased">
      <WebinarJamBar buttonText={fr ? "S'inscrire" : 'Register'} />
      <Script
        id="academy-agency-senja"
        src="https://widget.senja.io/widget/2a990f91-6426-436a-b50d-318fc49a7851/platform.js"
        strategy="afterInteractive"
      />

      <section className="relative overflow-hidden border-b border-white/[0.06] pb-14 pt-[4.5rem] md:pb-20 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[44rem] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-academy">
              {fr ? 'Empire · Programme partenaire' : 'Empire · Partner program'}
            </p>
            <p className="mt-1.5 text-[14px] text-neutral-400">
              {fr ? 'Pour les agences, studios et consultants' : 'For agencies, studios and consultants'}
            </p>

            <nav
              aria-label={fr ? 'Choisissez votre parcours' : 'Choose your path'}
              className="mx-auto mt-4 inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] p-0.5"
            >
              <Link
                href="/academy"
                onClick={() => trackAmplitude('academy_audience_selected', { audience: 'reconversion' })}
                className="rounded-full px-3 py-1.5 text-[11px] font-medium text-neutral-500 transition hover:text-neutral-300"
              >
                {fr ? 'Reconversion' : 'Career change'}
              </Link>
              <Link
                href="/academy/agence"
                aria-current="page"
                onClick={() => trackAmplitude('academy_audience_selected', { audience: 'agency' })}
                className="rounded-full bg-white/[0.09] px-3 py-1.5 text-[11px] font-medium text-white"
              >
                {fr ? 'Agence' : 'Agency'}
              </Link>
            </nav>

            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {fr
                ? 'Pilotez le personal branding de tous vos clients. Sans construire une équipe de production.'
                : 'Run personal branding for every client. Without building a production team.'}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? 'Choisissez les sujets, recueillez leur expertise et validez les contenus. Empire rédige, monte, programme et mesure le reste.'
                : 'Choose topics, capture their expertise and approve content. Empire writes, edits, schedules and measures the rest.'}
            </p>

            <div className="mx-auto mt-7 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
              {(fr
                ? [
                    'Un espace séparé pour chaque client.',
                    'LinkedIn, Instagram, TikTok et YouTube.',
                    'Environ 4 h par mois et par client une fois maîtrisé.',
                    'Les formats et mécaniques de viralité inclus.',
                  ]
                : [
                    'A separate workspace for every client.',
                    'LinkedIn, Instagram, TikTok and YouTube.',
                    'About four hours per client per month once mastered.',
                    'Viral formats and mechanics included.',
                  ]
              ).map((line) => (
                <p key={line} className="flex gap-2 text-[13px] text-neutral-400">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <CtaBlock fr={fr} source="agency_hero" audience="agency" />
              <p className="mt-2 text-[12px] text-neutral-500">
                {fr ? 'Déjà convaincu ? Accédez directement au programme.' : 'Already convinced? Join the program directly.'}
              </p>
              <FestivalPriceBlock fr={fr} pricing={festival} />
              <PartnerPayLink fr={fr} source="agency_hero" price={festival.price} audience="agency" />
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label={fr ? 'Navigation de l’offre agence' : 'Agency offer navigation'}
        className="sticky top-[65px] z-40 border-b border-white/[0.08] bg-black/90 backdrop-blur-xl md:top-[73px]"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(fr
              ? [
                  ['#problemes', 'Problèmes'],
                  ['#resultats', 'Résultats'],
                  ['#workflow', 'Workflow'],
                  ['#rentabilite', 'Rentabilité'],
                  ['#activation', 'Activation'],
                  ['#faq', 'FAQ'],
                ]
              : [
                  ['#problemes', 'Problems'],
                  ['#resultats', 'Outcomes'],
                  ['#workflow', 'Workflow'],
                  ['#rentabilite', 'Economics'],
                  ['#activation', 'Activation'],
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
              href="#demo-agence"
              className="ml-auto shrink-0 rounded-lg bg-academy px-3.5 py-2 text-[12px] font-bold text-black transition hover:brightness-110"
            >
              {fr ? 'Voir la démo' : 'See the demo'}
            </a>
          </div>
        </div>
      </nav>

      <section className="w-full border-b border-white/[0.06] bg-black py-4 sm:py-5">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection accent="academy" />
        </div>
      </section>
      <TopCreatorsSection compact accent="academy" />

      <section id="problemes" className="scroll-mt-36 border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>{fr ? 'Le problème agence' : 'The agency problem'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Gérer plusieurs clients transforme vite le contenu en chaîne de production.'
                : 'Managing several clients quickly turns content into a production line.'}
            </h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Plus le portefeuille grandit, plus votre équipe passe du temps à chercher les idées, relancer les clients, rédiger, monter, valider et programmer.'
                : 'As the portfolio grows, your team spends more time finding ideas, chasing clients, writing, editing, approving and scheduling.'}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(fr
                ? [
                    'Les idées et validations sont dispersées.',
                    'La production dépend de plusieurs freelances.',
                    'Chaque client possède son propre ton et ses priorités.',
                    'Les retours ralentissent les calendriers.',
                    'Le reporting prend du temps non facturé.',
                    'Prendre plus de clients finit par réduire la qualité.',
                  ]
                : [
                    'Ideas and approvals are scattered.',
                    'Production depends on several freelancers.',
                    'Every client has a distinct voice and priorities.',
                    'Feedback slows calendars down.',
                    'Reporting consumes unbilled time.',
                    'Taking more clients eventually reduces quality.',
                  ]
              ).map((problem) => (
                <div key={problem} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <p className="text-[14px] leading-relaxed text-neutral-300">{problem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="resultats" className="scroll-mt-36 border-b border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>{fr ? 'Ce qui change' : 'What changes'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Votre équipe se concentre sur les clients. Empire absorbe la production.'
                : 'Your team focuses on clients. Empire absorbs production.'}
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {(fr
                ? [
                    ['Plus de capacité', 'Ajoutez des clients sans reconstruire une équipe de rédaction et de montage.'],
                    ['Moins de coordination', 'Un parcours commun remplace les briefs, fichiers et validations dispersés.'],
                    ['Une offre plus solide', 'La régularité, le suivi et les décisions deviennent votre valeur récurrente.'],
                  ]
                : [
                    ['More capacity', 'Add clients without rebuilding a writing and editing team.'],
                    ['Less coordination', 'One workflow replaces scattered briefs, files and approvals.'],
                    ['A stronger offer', 'Consistency, follow-through and decisions become your recurring value.'],
                  ]
              ).map(([title, description]) => (
                <div key={title} className="rounded-3xl border border-academy/20 bg-academy/[0.055] p-6">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-neutral-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-36 border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>{fr ? 'Toute la production, dans un seul parcours' : 'All production in one workflow'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'De la sélection des sujets au calendrier de chaque client.'
                : 'From topic selection to each client’s calendar.'}
            </h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Vous pilotez les décisions. Le client partage son expertise. Empire transforme la conversation en contenus adaptés à LinkedIn, Instagram, TikTok et YouTube, prêts à valider et à publier.'
                : 'You steer decisions. The client shares expertise. Empire turns the conversation into content adapted for LinkedIn, Instagram, TikTok and YouTube, ready to approve and publish.'}
            </p>
            <AcademyProductDemo fr={fr} />
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>{fr ? 'Un espace par client' : 'One workspace per client'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Chaque mission reste séparée, lisible et pilotable.'
                : 'Every engagement stays separate, clear and manageable.'}
            </h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {(fr
                ? [
                    ['01', 'Sélectionnez les sujets adaptés au client.'],
                    ['02', 'Envoyez son lien pour recueillir son expertise.'],
                    ['03', 'Validez les textes, vidéos et priorités avec lui.'],
                    ['04', 'Retrouvez les contenus, le calendrier et les performances dans son espace.'],
                  ]
                : [
                    ['01', 'Select topics adapted to the client.'],
                    ['02', 'Send their link to capture expertise.'],
                    ['03', 'Approve copy, videos and priorities together.'],
                    ['04', 'Find content, calendar and performance in their workspace.'],
                  ]
              ).map(([number, line]) => (
                <div key={number} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <span className="text-[12px] font-semibold text-academy">{number}</span>
                  <p className="text-[14px] leading-relaxed text-neutral-300">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="rentabilite" className="scroll-mt-36 border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[44rem]">
            <div className="text-center">
              <SectionLabel>{fr ? 'Capacité et rentabilité' : 'Capacity and economics'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr
                  ? 'Que peut représenter cette offre dans votre portefeuille ?'
                  : 'What could this offer represent across your portfolio?'}
              </h2>
            </div>

            <div className="mt-10 space-y-7 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[13px] font-medium text-neutral-400">{fr ? 'Clients accompagnés' : 'Clients supported'}</p>
                  <p className="text-[15px] font-semibold text-white">{clients}</p>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={clients}
                  onChange={(event) => setClients(Number(event.target.value))}
                  className="mt-3 w-full accent-[#fca5a5]"
                />
              </div>

              <div>
                <p className="text-[13px] font-medium text-neutral-400">
                  {fr ? 'Honoraires mensuels indicatifs par client' : 'Indicative monthly fee per client'}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFee(amount)}
                      className={`rounded-xl px-3 py-3 text-[13px] font-semibold transition ${
                        fee === amount
                          ? 'bg-academy text-black'
                          : 'bg-white/[0.04] text-neutral-300 ring-1 ring-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      {amount.toLocaleString(fr ? 'fr-FR' : 'en-US')} €
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/[0.08]">
                  <p className="text-[12px] text-neutral-500">{fr ? 'Honoraires mensuels estimés' : 'Estimated monthly fees'}</p>
                  <p className="mt-1 text-2xl font-semibold text-academy">
                    ~{simulation.monthlyFees.toLocaleString(fr ? 'fr-FR' : 'en-US')} €
                  </p>
                </div>
                <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/[0.08]">
                  <p className="text-[12px] text-neutral-500">{fr ? 'Temps mensuel indicatif' : 'Indicative monthly time'}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">~{simulation.monthlyHours} h</p>
                </div>
              </div>

              <p className="text-[12px] leading-relaxed text-neutral-600">
                {fr
                  ? `Base indicative : ${HOURS_PER_CLIENT} h par mois et par client une fois le système maîtrisé. Chaque client paie séparément son abonnement Empire, à partir de ${clientStarterPrice} € / mois. Les clients et revenus ne sont pas garantis.`
                  : `Indicative base: ${HOURS_PER_CLIENT} hours per client per month once fluent. Each client separately pays for Empire, starting at €${clientStarterPrice} / month. Clients and revenue are not guaranteed.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="activation" className="scroll-mt-36 border-b border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>{fr ? 'Activation agence' : 'Agency activation'}</SectionLabel>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? '1 heure par jour pour déployer l’offre en 21 jours.'
                : '1 hour a day to deploy the offer in 21 days.'}
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {(fr
                ? [
                    ['Semaine 1', 'Construisez l’offre, choisissez un client pilote et créez une première démonstration.'],
                    ['Semaine 2', 'Apprenez les hooks, formats et mécaniques de viralité, puis adaptez-les à chaque réseau.'],
                    ['Semaine 3', 'Organisez l’onboarding et déployez l’offre auprès du portefeuille ou en marque blanche.'],
                  ]
                : [
                    ['Week 1', 'Build the offer, choose a pilot client and create a first demonstration.'],
                    ['Week 2', 'Learn hooks, formats and viral mechanics, then adapt them to each network.'],
                    ['Week 3', 'Organize onboarding and deploy the offer across the portfolio or white-label.'],
                  ]
              ).map(([week, description]) => (
                <div key={week} className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-academy">{week}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-neutral-300">{description}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-neutral-600">
              {fr
                ? 'Le délai de déploiement et les ventes dépendent de votre portefeuille, de votre positionnement et de votre exécution.'
                : 'Deployment time and sales depend on your portfolio, positioning and execution.'}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>{fr ? 'Ils utilisent déjà Empire' : 'They already use Empire'}</SectionLabel>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr ? 'Ce qu’ils disent après avoir utilisé le système.' : 'What they say after using the system.'}
            </h2>
            <div
              className="senja-embed mt-8 w-full"
              data-id="2a990f91-6426-436a-b50d-318fc49a7851"
              data-mode="shadow"
              data-lazyload="false"
              style={{ display: 'block', width: '100%' }}
            />
          </div>
        </div>
      </section>

      <section id="demo-agence" className="scroll-mt-36 border-b border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionLabel>{fr ? 'Démonstration agence' : 'Agency demonstration'}</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr ? 'Voyez le parcours complet jeudi.' : 'See the complete workflow Thursday.'}
              </h2>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-academy/40">
                  <Image src="/founders/kevin.jpg" alt="Kevin Dufraisse" fill sizes="64px" className="object-cover" />
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
                  ? 'Nous vous montrons comment organiser un client, recueillir son expertise, produire ses contenus et suivre l’économie de l’offre.'
                  : 'We show how to organize a client, capture expertise, produce content and understand the offer economics.'}
              </p>
            </div>
            <div className="lg:pt-8">
              <p className="text-[15px] font-medium text-white">
                {fr ? 'Pendant 45 minutes :' : 'In 45 minutes:'}
              </p>
              <ul className="mt-4 space-y-3">
                {(fr
                  ? [
                      'Démonstration réelle du parcours client.',
                      'Répartition précise entre votre agence et Empire.',
                      'Temps, crédits, honoraires et abonnement client.',
                      'Questions en direct sur votre portefeuille.',
                    ]
                  : [
                      'Real demonstration of the client workflow.',
                      'Exact split between your agency and Empire.',
                      'Time, credits, fees and client subscription.',
                      'Live questions about your portfolio.',
                    ]
                ).map((line) => (
                  <li key={line} className="flex gap-3 text-[14px] text-neutral-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtaBlock fr={fr} source="agency_demo" audience="agency" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem] text-center">
            <SectionLabel>{fr ? 'Le programme partenaire' : 'The partner program'}</SectionLabel>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {fr
                ? 'Déployez l’offre avec la méthode, les crédits et la communauté.'
                : 'Deploy the offer with the method, credits and community.'}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-neutral-400">
              {fr
                ? 'Formation et replays, activation de 21 jours, 4 000 crédits, modèles de vente, communauté et rendez-vous partenaires accessibles à vie.'
                : 'Training and replays, 21-day activation, 4,000 credits, sales templates, community and lifetime partner sessions.'}
            </p>
            <div className="mt-8">
              <FestivalPriceBlock fr={fr} pricing={festival} />
            </div>
            <div className="mx-auto mt-3 max-w-md">
              <PartnerPayLink fr={fr} source="agency_program" price={festival.price} audience="agency" />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-36 border-t border-white/[0.06] py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {fr ? 'Les réponses avant la démonstration.' : 'Answers before the demonstration.'}
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
              <CtaBlock fr={fr} source="agency_faq" audience="agency" />
              <p className="mt-5 text-[12px] text-neutral-500">
                {fr ? 'Déjà convaincu ? Déployez directement votre offre.' : 'Already convinced? Deploy your offer directly.'}
              </p>
              <div className="mx-auto mt-3 max-w-md">
                <PartnerPayLink fr={fr} source="agency_faq" price={festival.price} audience="agency" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
