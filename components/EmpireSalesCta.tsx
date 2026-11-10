'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { startFreeTrial } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { CTA_PRIMARY, CTA_SECONDARY, CtaPair } from '@/components/ui/cta'

export default function EmpireSalesCta({ source, showDemo = true }: { source: string; showDemo?: boolean }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <CtaPair
      fr={fr}
      className="text-center"
      primary={
        <button type="button" onClick={() => {
          trackAmplitude('empire_trial_clicked', { source })
          startFreeTrial()
        }} className={CTA_PRIMARY}>
          {fr ? 'Tester 7 jours gratuitement' : 'Start my 7-day free trial'} <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </button>
      }
      secondary={showDemo && (
        <a href="/demo" onClick={() => trackAmplitude('empire_demo_clicked', { source })} className={CTA_SECONDARY}>
          {fr ? 'Demander une démo' : 'Request a demo'}
        </a>
      )}
    />
  )
}
