// Promo saisonnière (Black Friday, Noël, soldes d'été…), lue dans la table
// `promotions` de l'app par l'edge function promo-status (`current: true`).
// La pastille ne montre que la promo que le paiement applique vraiment
// (Scale à 499 € au lieu de 799 €). Rien en cours = rien affiché.
// Une occasion s'active depuis /admin/promos.

import { PROMO_STATUS_URL } from '@/lib/flash-promo'

export interface SeasonalPromo {
  id: string
  label: string
  emoji: string | null
  plan: 'starter' | 'growth' | 'scale'
  promoMonthly: number
  baseMonthly: number
  durationMonths: number | null
  endsAt: string
}

let cached: Promise<SeasonalPromo | null> | null = null

export function fetchSeasonalPromo(): Promise<SeasonalPromo | null> {
  if (!cached) {
    cached = fetch(PROMO_STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: true, channel: 'website' }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const p = data?.promo
        if (!p || !Number.isFinite(p.promoMonthly) || !Number.isFinite(p.baseMonthly)) return null
        if (Date.parse(p.endsAt) <= Date.now()) return null
        return p as SeasonalPromo
      })
      .catch(() => null)
  }
  return cached
}

const PLAN_NAME: Record<SeasonalPromo['plan'], string> = { starter: 'Starter', growth: 'Growth', scale: 'Scale' }

/** Remise arrondie vers le bas : jamais plus que la vraie (499 / 799 = -37,5 % → -37 %). */
export function seasonalPromoPercent(p: SeasonalPromo): number {
  return Math.floor((1 - p.promoMonthly / p.baseMonthly) * 100)
}

export function seasonalPromoText(p: SeasonalPromo, fr: boolean): { lead: string; title: string } {
  const plan = PLAN_NAME[p.plan]
  const pct = seasonalPromoPercent(p)
  const months = p.durationMonths
  return {
    lead: fr ? `-${pct} % sur ${plan}` : `-${pct}% on ${plan}`,
    title: fr
      ? `${p.label} : ${plan} à ${p.promoMonthly} €/mois au lieu de ${p.baseMonthly} €${months ? ` pendant ${months} mois` : ''}`
      : `${p.label}: ${plan} at €${p.promoMonthly}/mo instead of €${p.baseMonthly}${months ? ` for ${months} months` : ''}`,
  }
}
