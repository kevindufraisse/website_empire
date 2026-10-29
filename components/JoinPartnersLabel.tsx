'use client'

import { usePartnerFestivalPricing } from '@/hooks/usePartnerFestivalPricing'

/** « Rejoindre Empire Partners · 500 € » : le prix du jour (500 / 600 / 700 €),
 *  pour les boutons d'en-tête et de pied de page des pages /academy. */
export default function JoinPartnersLabel({ fr }: { fr: boolean }) {
  const { price } = usePartnerFestivalPricing()
  return <>{fr ? `Rejoindre Empire Partners · ${price} €` : `Join Empire Partners · €${price}`}</>
}
