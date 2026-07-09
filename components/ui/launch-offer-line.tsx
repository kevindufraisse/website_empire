'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'
import { SPOTS_ENABLED, SPOTS_LABEL_FR, SPOTS_LABEL_EN } from '@/lib/launch-offer'

/** Ligne d'urgence affichée sous les CTA quand l'offre de lancement est active. */
export function LaunchOfferLine({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()

  if (!LAUNCH_OFFER_ACTIVE || !SPOTS_ENABLED) return null

  return (
    <p className={`text-xs font-semibold text-empire ${className}`}>
      {lang === 'fr' ? SPOTS_LABEL_FR : SPOTS_LABEL_EN}
    </p>
  )
}
