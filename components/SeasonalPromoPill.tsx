'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { fetchSeasonalPromo, seasonalPromoText, type SeasonalPromo } from '@/lib/seasonal-promo'

/**
 * Pastille de la promo saisonnière en cours (« -38 % sur Scale · Black Friday 🖤 »).
 * Lue dans la table promotions : rien en cours, rien affiché. Jamais sur
 * /join/empire ni sur les liens d'offre uniques (offre du live, partenaire…).
 */
export default function SeasonalPromoPill({ location, className = '' }: { location: 'header' | 'tarifs'; className?: string }) {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [promo, setPromo] = useState<SeasonalPromo | null>(null)

  useEffect(() => {
    let alive = true
    fetchSeasonalPromo().then((p) => { if (alive) setPromo(p) })
    return () => { alive = false }
  }, [])

  if (!promo) return null
  const { lead, occasion } = seasonalPromoText(promo, fr)
  const plan = promo.plan.charAt(0).toUpperCase() + promo.plan.slice(1)
  const title = fr
    ? `${promo.label} : ${plan} à ${promo.promoMonthly} €/mois au lieu de ${promo.baseMonthly} €${promo.durationMonths ? ` pendant ${promo.durationMonths} mois` : ''}`
    : `${promo.label}: €${promo.promoMonthly}/mo instead of €${promo.baseMonthly}${promo.durationMonths ? ` for ${promo.durationMonths} months` : ''}`

  // Sur /tarifs, les cartes gardent le prix catalogue : la pastille dit le prix
  // réellement payé (le paiement applique la remise, essai compris).
  if (location === 'tarifs') {
    return (
      <p
        data-seasonal-promo={promo.id}
        className={`mx-auto inline-flex flex-col items-center justify-center rounded-2xl border border-empire/50 bg-empire/10 px-4 py-2 text-sm text-white sm:flex-row sm:gap-x-1.5 sm:rounded-full sm:py-1.5 ${className}`}
      >
        <span className="font-bold text-empire">{occasion}</span>
        <span className="hidden sm:inline">·</span>
        <span>{title.replace(/^[^:]+:\s*/, '')}</span>
      </p>
    )
  }

  return (
    <a
      href="/tarifs"
      title={title}
      data-seasonal-promo={promo.id}
      onClick={() => trackAmplitude('seasonal_promo_clicked', { promo_id: promo.id, location })}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-empire/50 bg-empire/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-empire/20 xl:text-sm ${className}`}
    >
      <span>{lead}</span>
      <span className="hidden font-bold text-empire xl:inline">· {occasion}</span>
      <span className="xl:hidden">{promo.emoji || ''}</span>
    </a>
  )
}
