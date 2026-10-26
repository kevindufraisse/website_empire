'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { startFreeTrial, TRIAL_TERMS_FR, TRIAL_TERMS_EN } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'

export default function EmpireSalesCta({ source }: { source: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => {
          trackAmplitude('empire_trial_clicked', { source })
          startFreeTrial()
        }} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-empire px-7 py-3.5 text-base font-bold text-black shadow-[0_0_24px_rgb(var(--empire-rgb)_/_0.2)] transition hover:brightness-110">
          {fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial'} <span className="ml-2" aria-hidden>→</span>
        </button>
        <a href="/demo" onClick={() => trackAmplitude('empire_demo_clicked', { source })} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/5">
          {fr ? 'Demander une démo' : 'Request a demo'}
        </a>
      </div>
      <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-neutral-400">
        {fr ? TRIAL_TERMS_FR : TRIAL_TERMS_EN} {fr ? 'Carte bancaire requise.' : 'Card required.'}
      </p>
    </div>
  )
}
