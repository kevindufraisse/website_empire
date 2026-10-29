// Source unique des packs Empire. Importé par la section pricing et par le quiz
// d'orientation pour qu'un changement de prix ou de rythme ne dérive jamais
// entre les deux.

export const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

export type PlanId = 'starter' | 'growth' | 'scale'
export type BillingId = 'monthly' | 'quarterly' | 'yearly'

// Le volume vendu, c'est la présence sur les 7 réseaux, pas un compteur de
// formats. Starter : tous les 2 jours. Growth : tous les jours. Scale : 2 fois
// par jour. Le mix (Reels / LinkedIn / newsletter) est au choix du client.
export type Plan = {
  id: PlanId
  price: number
  credits: number
  rhythmFr: string
  rhythmEn: string
  highlighted?: boolean
}

export const PLAN_LABELS: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: 'Starter', en: 'Starter' },
  growth: { fr: 'Growth', en: 'Growth' },
  scale: { fr: 'Scale', en: 'Scale' },
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    price: 199,
    credits: 2200,
    rhythmFr: 'Vous postez tous les 2 jours',
    rhythmEn: 'You post every other day',
  },
  {
    id: 'growth',
    price: 499,
    credits: 6600,
    rhythmFr: 'Vous postez tous les jours',
    rhythmEn: 'You post every day',
    highlighted: true,
  },
  {
    id: 'scale',
    price: 799,
    credits: 12000,
    rhythmFr: 'Vous postez 2 fois par jour',
    rhythmEn: 'You post twice a day',
  },
]

// Coût en crédits d'un contenu dans l'app (`CREDIT_COSTS` de server.cjs) :
// un reel de la rafale = coupe 15 + sous-titres Submagic 150 + accroche 30.
export const CONTENT_CREDITS = { reel: 195, post: 85, newsletter: 115 }

// Ce que les crédits du mois permettent, format par format : « jusqu'à 11 reels
// OU 25 posts », jamais additionnés (15 reels + 15 posts + 2 newsletters
// demandaient 4 430 crédits sur une formule qui en verse 2 200).
export const PLAN_DELIVERABLES: Record<PlanId, { reels: number; posts: number; newsletters: number }> =
  Object.fromEntries(
    PLANS.map((p) => [p.id, {
      reels: Math.floor(p.credits / CONTENT_CREDITS.reel),
      posts: Math.floor(p.credits / CONTENT_CREDITS.post),
      newsletters: Math.floor(p.credits / CONTENT_CREDITS.newsletter),
    }]),
  ) as Record<PlanId, { reels: number; posts: number; newsletters: number }>

// Recharge à la consommation de l'app (`src/lib/payg.ts`, `payg_25`).
export const PAYG_RECHARGE = { euros: 25, credits: 200 }

// Les recharges à la consommation de l'app (`src/lib/payg.ts`, PAYG_PACKS),
// ouvertes par /join/empire?plan=payg&pack=<id>.
export const PAYG_PACKS = [
  { id: 'payg_25', euros: 25, credits: 200 },
  { id: 'payg_50', euros: 50, credits: 420 },
  { id: 'payg_100', euros: 100, credits: 900 },
] as const

// Équipe : de 2 à 20 places sur /join/empire (`seats`) ; au-delà, l'offre
// agence et entreprise (crédits illimités) se fait sur devis.
export const MAX_SELF_SERVE_SEATS = 20

export const APP_JOIN_URL = 'https://app.empire-internet.com/join/empire'

export const BILLING_PERIODS: {
  id: BillingId
  discount: number
  months: number
  labelFr: string
  labelEn: string
}[] = [
  { id: 'monthly', discount: 0, months: 1, labelFr: 'Mensuel', labelEn: 'Monthly' },
  { id: 'quarterly', discount: 0.12, months: 3, labelFr: 'Trimestriel', labelEn: 'Quarterly' },
  { id: 'yearly', discount: 0.18, months: 12, labelFr: 'Annuel', labelEn: 'Yearly' },
]

export function getPlan(id: PlanId): Plan {
  return PLANS.find(p => p.id === id) ?? PLANS[1]
}

export function volumeDiscount(seats: number): number {
  if (seats >= 10) return 0.20
  if (seats >= 5) return 0.15
  if (seats >= 3) return 0.10
  return 0
}

export function combinedDiscount(billing: BillingId, seats: number): number {
  const billingD = BILLING_PERIODS.find(b => b.id === billing)?.discount ?? 0
  const volumeD = volumeDiscount(seats)
  return 1 - (1 - billingD) * (1 - volumeD)
}

export function finalPrice(base: number, billing: BillingId, seats: number): number {
  return Math.round(base * (1 - combinedDiscount(billing, seats)))
}
