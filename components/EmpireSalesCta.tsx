'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { startFreeTrial } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { CTA_PRIMARY, CTA_SECONDARY, CtaPair } from '@/components/ui/cta'

export default function EmpireSalesCta({ source, showDemo = true }: { source: string; showDemo?: boolean }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    // Choix de Kevin (25 novembre 2026) : la démo en principal, l'essai à côté.
    // Sans démo (`showDemo` à false), l'essai reste seul.
    showDemo ? (
      <CtaPair
        fr={fr}
        demoFirst
        className="text-center"
        primary={
          <a href="/join-us" onClick={() => trackAmplitude('empire_call_clicked', { source })} className={CTA_PRIMARY}>
            {fr ? 'Réserver ma démo' : 'Book my demo'} <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </a>
        }
        secondary={
          <button type="button" onClick={() => {
            trackAmplitude('empire_trial_clicked', { source })
            startFreeTrial()
          }} className={CTA_SECONDARY}>
            {fr ? 'Essai gratuit 7 jours' : '7-day free trial'}
          </button>
        }
      />
    ) : (
      <CtaPair
        fr={fr}
        className="text-center"
        primary={
          <button type="button" onClick={() => {
            trackAmplitude('empire_trial_clicked', { source })
            startFreeTrial()
          }} className={CTA_PRIMARY}>
            {fr ? 'Essai gratuit 7 jours' : '7-day free trial'} <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </button>
        }
      />
    )
  )
}
