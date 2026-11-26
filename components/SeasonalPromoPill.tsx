'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { startFreeTrial } from '@/lib/startTrial'
import { fetchSeasonalPromo, seasonalPromoText, type SeasonalPromo } from '@/lib/seasonal-promo'

/**
 * Pastille de la promo saisonnière en cours, façon CodeFast (« -43% off with
 * code THANKSGIVING 🦃 ») : fond crème, bord brun, occasion en capitales.
 * Lue dans la table promotions : rien en cours, rien affiché. Un clic lance
 * le même onboarding que le bouton principal du site (pas l'écran « Ta formule »).
 * Pas de lien vers /tarifs : la page n'est pas mise en avant (23 novembre 2026).
 */
export default function SeasonalPromoPill({ className = '', full = false }: { className?: string; full?: boolean }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [promo, setPromo] = useState<SeasonalPromo | null>(null)

  useEffect(() => {
    let alive = true
    fetchSeasonalPromo().then((p) => { if (alive) setPromo(p) })
    return () => { alive = false }
  }, [])

  if (!promo) return null
  const { lead, title } = seasonalPromoText(promo, fr)

  return (
    <button
      type="button"
      title={title}
      data-seasonal-promo={promo.id}
      onClick={() => {
        trackAmplitude('seasonal_promo_clicked', { promo_id: promo.id })
        void startFreeTrial() // même onboarding que « Tester 7 jours gratuitement » ; la promo s'affiche sur la page de prix
      }}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#8B4A1C] bg-[#FDF6E3] px-3 py-0.5 text-[13px] leading-6 text-[#5A2E0E] transition hover:bg-[#F8EBCB] ${className}`}
    >
      <span>{lead}</span>
      <span className={`${full ? '' : 'hidden xl:inline'} font-mono font-bold uppercase tracking-tight`}>{promo.label}</span>
      {promo.emoji && <span aria-hidden>{promo.emoji}</span>}
    </button>
  )
}
