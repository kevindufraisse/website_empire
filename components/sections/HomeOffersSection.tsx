'use client'

import { ArrowRight, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import PlanCards from '@/components/pricing/PlanCards'
import { trackAmplitude } from '@/lib/amplitude'

/**
 * Les formules Empire sur l'accueil (ancre `#offres`). Le détail et le
 * comparatif vivent sur `/tarifs`. Le programme partenaire n'a qu'une ligne
 * discrète en bas : c'est une autre offre, elle ne se range pas à côté.
 */
export default function HomeOffersSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  if (autopilot) return null

  return (
    <section id="offres" className="relative w-full scroll-mt-20 bg-black py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{fr ? 'Tarifs' : 'Pricing'}</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {fr ? 'Choisis ton rythme de publication.' : 'Pick your publishing pace.'}
        </h2>

        <div className="mt-12">
          <PlanCards location="home" />
        </div>

        <div className="mx-auto mt-8 flex max-w-md flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="/tarifs"
              onClick={() => trackAmplitude('home_offers_compare_clicked')}
              className="inline-flex items-center gap-1 text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              {fr ? 'Le détail des formules et la comparaison' : 'Plan details and comparison'}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="/vsl"
              onClick={() => trackAmplitude('home_offers_workshop_clicked')}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white"
            >
              <Play className="h-3.5 w-3.5" />
              {fr ? 'Le workshop gratuit (1 h 26)' : 'The free workshop (1h26)'}
            </a>
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-neutral-500">
          {fr ? 'Tu accompagnes des clients (freelance, consultant, agence) ? ' : 'You coach clients (freelancer, consultant, agency)? '}
          <a
            href="/academy"
            onClick={() => trackAmplitude('home_offers_partner_clicked')}
            className="text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-white"
          >
            {fr ? 'Le programme partenaire' : 'The partner program'}
          </a>
        </p>
      </div>
    </section>
  )
}
