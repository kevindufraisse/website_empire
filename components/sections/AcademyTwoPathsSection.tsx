'use client'

import { ArrowRight, Check } from 'lucide-react'
import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Le métier partenaire - pas deux voies. Explique quoi, pourquoi, comment gagner.
 */
export default function AcademyTwoPathsSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const jobPoints = fr
    ? [
        'Les entrepreneurs ont besoin d’être visibles - ils n’ont pas le temps de produire',
        'Vous les aidez à choisir quoi dire et vous êtes présent pendant le live',
        'Empire propose les sujets, écrit, monte, publie et track',
        'Pas besoin d’inventer les sujets ni de monter une équipe de prod',
      ]
    : [
        'Entrepreneurs need visibility - they don’t have time to produce',
        'You help them choose what to say and you’re present on the live',
        'Empire suggests topics, writes, edits, publishes and tracks',
        'No need to invent topics or hire a production team',
      ]

  const opportunity = fr
    ? [
        { value: '~500€', hint: 'pour ~4 h / mois / client (plus si vous voulez)' },
        { value: '4h', hint: 'de travail par mois et par client, une fois lancé' },
        { value: '+3 000€', hint: '/ mois avec 6 clients (~500€ × 6)' },
        { value: 'Gratuit', hint: 'nouveaux clients proposés - sans frais d’apport' },
      ]
    : [
        { value: '~€500', hint: 'for ~4 h / month / client (more if you want)' },
        { value: '4h', hint: 'of work per month per client once you’re live' },
        { value: '+€3,000', hint: '/ month with 6 clients (~€500 × 6)' },
        { value: 'Free', hint: 'new clients proposed - no referral fee' },
      ]

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0f0f0f] to-black py-20 md:py-28">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-academy">
              {fr ? 'Le métier' : 'The job'}
            </p>
            <h2 className="mb-4 text-balance text-3xl font-bold leading-tight md:text-5xl">
              {fr
                ? 'Accompagner des entrepreneurs sur leur personal branding'
                : 'Support entrepreneurs on their personal branding'}
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
              {fr
                ? 'Pas un job salarié. Une activité où vous facturez chaque mois - avec Empire qui fait la prod lourde. Les nouveaux clients peuvent vous être proposés gratuitement.'
                : 'Not a salaried job. A business you bill every month - with Empire doing the heavy production. New clients can be proposed to you for free.'}
            </p>
          </div>

          <ul className="mb-14 space-y-0 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {jobPoints.map((line) => (
              <li key={line} className="flex gap-3 py-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-academy" strokeWidth={2.5} />
                <span className="text-[15px] leading-snug text-neutral-300">{line}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-academy">
              {fr ? 'Pourquoi c’est une opportunité' : 'Why it’s an opportunity'}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-400">
              {fr
                ? 'L’IA produit plus vite que jamais - ce qui manque, c’est quelqu’un qui oriente le client. Ce métier se paie cher aux US. En Europe, la demande monte et peu de gens le vendent correctement.'
                : 'AI produces faster than ever - what’s missing is someone who steers the client. This role pays well in the US. In Europe, demand is rising and few people sell it properly.'}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {opportunity.map((item) => (
              <div key={item.value} className="text-center">
                <p className="text-2xl font-bold tracking-tight text-white md:text-[1.75rem]">
                  {item.value}
                </p>
                <p className="mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-snug text-neutral-500">
                  {item.hint}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-lg text-center text-[13px] leading-relaxed text-neutral-500">
            {fr
              ? 'Après la formation + certification : vous pouvez rejoindre Empire Partners. On propose les clients. Vous choisissez et êtes au live. Empire produit.'
              : 'After training + certification: you can join Empire Partners. We propose clients. You choose and show up on the live. Empire produces.'}
          </p>

          <div className="mt-8 text-center">
            <AcademyWaitlistCta
              source="two-paths"
              className="inline-flex items-center gap-2 rounded-xl bg-academy px-8 py-4 text-lg font-bold text-black shadow-[0_0_30px_rgba(252,165,165,0.3)] transition-all hover:brightness-110"
              sublabel={
                <p className="mt-2 text-xs text-neutral-400">
                  {fr
                    ? 'Gratuit · Jeudi 11h (Paris) · 45 min'
                    : 'Free · Thursday 11am (Paris) · 45 min'}
                </p>
              }
            >
              {fr ? 'Voir les portes ouvertes' : 'See the open house'} <ArrowRight size={18} />
            </AcademyWaitlistCta>
          </div>
        </div>
      </div>
    </section>
  )
}
