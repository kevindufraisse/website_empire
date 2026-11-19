'use client'

import { useLanguage } from '@/contexts/LanguageContext'

/**
 * La formule, lisible, juste après la preuve : elle n'est plus dans le hero.
 * Statique et sans animation (pas de coût au scroll).
 */
export default function FormulaSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <section className="w-full bg-black px-4 py-10 sm:py-14" aria-label={fr ? 'La formule' : 'The formula'}>
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-empire">{fr ? 'La formule' : 'The formula'}</p>
        <div className="mt-5 rounded-2xl border border-white/15 bg-[#0d0d0d] px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex flex-col items-center leading-none text-base font-extrabold tracking-tight text-white sm:text-xl">
            <div className="whitespace-nowrap">
              {fr ? 'Message' : 'Message'} <span className="px-1 font-medium text-neutral-500">×</span> Format <span className="px-1 font-medium text-neutral-500">×</span> {fr ? 'Diffusion' : 'Distribution'}
            </div>
            <div className="my-2 h-px w-full bg-white/30" />
            <div className="whitespace-nowrap">
              {fr ? 'Temps' : 'Time'} <span className="px-1 font-medium text-neutral-500">+</span> {fr ? 'Coût' : 'Cost'}
            </div>
          </div>
        </div>
        <p className="mt-4 text-base font-semibold text-white sm:text-lg">= {fr ? 'Visibilité' : 'Visibility'} <span className="text-empire">→ {fr ? 'Clients' : 'Clients'}</span></p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          {fr ? 'Il ne manque que ton message : le reste est prêt, la suite de la page te montre comment.' : 'Only your message is missing: the rest is ready, the rest of the page shows how.'}
        </p>
      </div>
    </section>
  )
}
