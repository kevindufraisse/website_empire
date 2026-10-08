'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { WebinarJamBar, WebinarJamButton, WebinarJamEmbed } from '@/components/WebinarJamRegister'

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
  label,
}: {
  fr: boolean
  source: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <WebinarJamButton
        onClick={() => trackOpen(source)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-academy px-8 py-3.5 text-[15px] font-semibold text-black transition hover:brightness-110"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </WebinarJamButton>
      <p className="text-center text-[13px] text-neutral-500">
        {fr
          ? 'Gratuit · Chaque jeudi à 11 h (Paris) · 45 minutes en direct'
          : 'Free · Every Thursday 11am (Paris) · 45 minutes live'}
      </p>
    </div>
  )
}

export default function PartnerProgramPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
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
          a: 'Non. L’inscription au live est gratuite. Le droit d’entrée de 500 € concerne le programme partenaire, après admission.',
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
          a: 'Yes. The live session is free. The €500 entry fee is for the partner program, after admission.',
        },
        {
          q: 'Why is there a selection?',
          a: 'We check the program fits your goals and that you have time to learn and support clients.',
        },
      ]

  return (
    <main className="relative bg-black pb-32 text-white antialiased">
      <WebinarJamBar buttonText={fr ? "S'inscrire" : 'Register'} />

      {/* Hero événement */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(252,165,165,0.12),transparent)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[40rem] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-academy">
              {fr ? 'Empire · Programme partenaire' : 'Empire · Partner program'}
            </p>
            <p className="mt-3 text-[14px] text-neutral-400">
              {fr ? 'Pour les freelances et les agences' : 'For freelancers and agencies'}
            </p>
            <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {fr
                ? 'Accompagnez plus de clients. Sans produire tous leurs contenus.'
                : 'Support more clients. Without producing all their content.'}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.55] text-neutral-300">
              {fr
                ? 'Vos clients veulent être présents sur LinkedIn, Instagram ou YouTube. Vous les accompagnez. Empire écrit, monte, programme et suit les résultats.'
                : 'Your clients want to show up on LinkedIn, Instagram or YouTube. You support them. Empire writes, edits, schedules and tracks results.'}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-500">
              {fr
                ? 'Découvrez comment utiliser Empire Internet pour développer la présence en ligne de vos clients et être rémunéré pour cet accompagnement.'
                : 'See how to use Empire Internet to grow your clients’ online presence - and get paid for that support.'}
            </p>
            <div className="mt-10">
              <CtaBlock
                fr={fr}
                source="hero"
                label={fr ? 'Découvrir le programme aux portes ouvertes' : 'See the program at the open house'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problème client */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-[38rem]">
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
                ? 'Le repère, une fois le système pris en main : environ 4 heures par mois et par client, à adapter au périmètre de la mission.'
                : 'Benchmark once you’re fluent: about 4 hours per month per client, adjusted to the mission scope.'}
            </p>
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

              <div className="mt-10">
                <CtaBlock
                  fr={fr}
                  source="simulation"
                  label={fr ? 'Voir comment ça fonctionne en direct' : 'See how it works live'}
                />
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
                  ? 'Vous appliquez la méthode à vos propres comptes. Vous publiez, observez les réactions et apprenez à orienter la production.'
                  : 'You apply the method on your own accounts. You publish, watch what works and learn to steer production.'}
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
                  ? 'Vous n’avez pas besoin d’une grande audience pour commencer. Être prêt à publier est fortement recommandé.'
                  : 'You don’t need a big audience to start. Being ready to publish is strongly recommended.'}
              </p>
            </div>

            <h3 className="mt-12 text-xl font-semibold tracking-tight">
              {fr ? '21 jours pour prendre le système en main.' : '21 days to get fluent with the system.'}
            </h3>
            <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {(fr
                ? [
                    {
                      t: 'Semaine 1 — Comprendre et créer',
                      d: 'Les fondamentaux de la viralité, les angles, les formats et vos premiers contenus avec Empire.',
                    },
                    {
                      t: 'Semaine 2 — Publier et vous rendre visible',
                      d: 'Vous pratiquez sur vos comptes et commencez à engager des conversations avec de futurs clients.',
                    },
                    {
                      t: 'Semaine 3 — Accompagner un client',
                      d: 'Vous apprenez à conduire l’entretien, choisir les sujets et suivre les contenus et leurs résultats.',
                    },
                  ]
                : [
                    {
                      t: 'Week 1 — Understand and create',
                      d: 'Virality basics, angles, formats and your first content with Empire.',
                    },
                    {
                      t: 'Week 2 — Publish and get visible',
                      d: 'You practice on your accounts and start conversations with future clients.',
                    },
                    {
                      t: 'Week 3 — Support a client',
                      d: 'You learn the interview, topic selection and how to track content and results.',
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
                ? 'Un défi par jour, des ressources pour pratiquer et une certification Empire selon les compétences démontrées.'
                : 'One challenge a day, practice resources and an Empire certification based on demonstrated skills.'}
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
                ? 'Le droit d’entrée est de 500 €, payé une fois à l’admission.'
                : 'The entry fee is €500, paid once at admission.'}
            </p>
            <ul className="mt-8 space-y-3">
              {(fr
                ? [
                    'La formation complète et les replays.',
                    'Le bootcamp de 21 jours.',
                    'Les templates de prospection et les méthodes de vente.',
                    'Les sujets, formats et processus d’accompagnement.',
                    'L’accès au réseau Empire Partners.',
                    '4 000 crédits personnels pour apprendre, tester et préparer vos démonstrations.',
                  ]
                : [
                    'Full training and replays.',
                    'The 21-day bootcamp.',
                    'Outreach templates and sales methods.',
                    'Topics, formats and support process.',
                    'Access to the Empire Partners network.',
                    '4,000 personal credits to learn, test and prep demos.',
                  ]
              ).map((line) => (
                <li key={line} className="flex gap-3 text-[15px] leading-snug text-neutral-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] leading-relaxed text-neutral-500">
              {fr
                ? 'Chaque client dispose de son propre espace Empire. Les crédits nécessaires à sa production sont financés séparément.'
                : 'Each client has their own Empire account. Credits for their production are billed separately.'}
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

      {/* Portes ouvertes Kevin */}
      <section id="portes-ouvertes" className="scroll-mt-28 py-20 md:py-28">
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
                <CtaBlock
                  fr={fr}
                  source="section"
                  label={fr ? 'Réserver ma place aux portes ouvertes' : 'Book my open house seat'}
                />
              </div>
              <p className="mt-4 text-[13px] text-neutral-600">
                {fr
                  ? 'L’admission au programme se fait ensuite sur candidature.'
                  : 'Program admission is by application after that.'}
              </p>
            </div>
            <div className="lg:sticky lg:top-28">
              <WebinarJamEmbed fr={fr} />
            </div>
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
              <CtaBlock
                fr={fr}
                source="faq"
                label={fr ? 'Participer aux prochaines portes ouvertes' : 'Join the next open house'}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
