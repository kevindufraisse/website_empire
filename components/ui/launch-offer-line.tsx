'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'
import {
  SPOTS_ENABLED,
  SPOTS_LEFT,
  OFFER_DEADLINE_LABEL_FR,
  OFFER_DEADLINE_LABEL_EN,
  OFFER_DISCOUNT_LABEL,
} from '@/lib/launch-offer'

/** Ligne d'urgence affichée sous les CTA quand l'offre de lancement est active. */
export function LaunchOfferLine({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()

  if (!LAUNCH_OFFER_ACTIVE) return null

  const fr = lang === 'fr'
  const deadline = fr ? OFFER_DEADLINE_LABEL_FR : OFFER_DEADLINE_LABEL_EN

  return (
    <p className={`text-xs font-semibold text-empire ${className}`}>
      🔥{' '}
      {fr
        ? `Offre de lancement ${OFFER_DISCOUNT_LABEL} jusqu'au ${deadline}`
        : `Launch offer ${OFFER_DISCOUNT_LABEL} until ${deadline}`}
      {SPOTS_ENABLED && (
        <span className="text-neutral-400 font-medium">
          {' '}· {SPOTS_LEFT} {fr ? 'places restantes ce mois' : 'spots left this month'}
        </span>
      )}
    </p>
  )
}
