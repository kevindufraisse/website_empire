'use client'

import { Infinity as InfinityIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyHowItWorksSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const steps = fr
    ? [
        {
          title: 'Portes ouvertes',
          desc: 'Jeudi 11h (Paris), 45 min. On explique le métier, le modèle d’argent, ce que ça demande vraiment.',
        },
        {
          title: 'Formation 21 jours',
          desc: 'Un défi par jour. Vous publiez avec la méthode Empire. 15 min/jour.',
        },
        {
          title: 'Certification Empire',
          desc: 'Bronze, Argent ou Or selon vos résultats. Badge LinkedIn officiel.',
        },
        {
          title: 'Missions partenaires',
          desc: 'Nouveaux clients proposés. Vous choisissez les sujets + live. Empire produit.',
        },
      ]
    : [
        {
          title: 'Open house',
          desc: 'Thursday 11am (Paris), 45 min. We explain the job, the money model, what it really takes.',
        },
        {
          title: '21-day training',
          desc: 'One challenge a day. You publish with the Empire method. 15 min/day.',
        },
        {
          title: 'Empire certification',
          desc: 'Bronze, Silver or Gold based on your results. Official LinkedIn badge.',
        },
        {
          title: 'Partner missions',
          desc: 'New clients proposed. You choose topics + live. Empire produces.',
        },
      ]

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] py-14 md:py-20">
      <div className="container relative z-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-block rounded-full border border-academy/30 bg-academy/10 px-4 py-2">
              <p className="text-sm font-bold text-academy">
                {fr ? 'COMMENT ÇA MARCHE' : 'HOW IT WORKS'}
              </p>
            </div>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              {fr ? (
                <>
                  4 étapes pour lancer le <span className="text-academy">métier</span>
                </>
              ) : (
                <>
                  4 steps to start the <span className="text-academy">craft</span>
                </>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-academy text-sm font-bold text-black">
                  {i + 1}
                </span>
                <p className="mt-3 text-base font-bold leading-snug text-white">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-academy/25 bg-gradient-to-br from-academy/10 to-white/[0.02] p-5 md:p-7">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-academy text-black">
                <InfinityIcon size={14} strokeWidth={3} />
              </span>
              <h3 className="text-base font-bold text-white md:text-lg">
                {fr
                  ? 'Et après : le réseau Empire Partners'
                  : 'And after: the Empire Partners network'}
              </h3>
              <span className="whitespace-nowrap rounded-full border border-academy/30 bg-academy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-academy">
                {fr ? 'À vie · gratuit' : 'For life · free'}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-400 md:text-base">
              {fr
                ? 'Formats, analyses et mises à jour de la méthode à vie. C’est aussi là que passent les missions clients.'
                : 'Formats, breakdowns and method updates for life. It’s also where client missions are posted.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
