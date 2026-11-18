'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

/** Dernier appel des pages d'entrée : « Devenir partenaire » a quitté le header. */
export default function PartnerFinalCta() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <section aria-labelledby="partner-final-title" className="border-t border-white/10 bg-black py-14 md:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-neutral-500">{fr ? 'Devenir partenaire' : 'Become a partner'}</p>
          <h2 id="partner-final-title" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {fr ? 'Tu préfères en faire ton métier ?' : 'Would you rather make it your job?'}
          </h2>
          <p className="mt-3 text-neutral-400">
            {fr ? 'Empire forme des Head of Content pour accompagner des entrepreneurs.' : 'Empire trains Heads of Content to work with entrepreneurs.'}
          </p>
        </div>
        <a href="/academy" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-white/40">
          {fr ? 'Devenir partenaire' : 'Become a partner'}<ArrowRight aria-hidden className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
