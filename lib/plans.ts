// Source unique des packs Empire. Importé par la section pricing et par le quiz
// d'orientation pour qu'un changement de prix ou de volume ne dérive jamais
// entre les deux.

export const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

export type PlanId = 'starter' | 'growth' | 'scale'
export type BillingId = 'monthly' | 'quarterly' | 'yearly'

// Le volume se dépense à la pièce produite, à un tarif fixe par format (une
// newsletter coûte quatre fois un Reel) : le nombre de contenus dépend donc du
// mix choisi par le client. On affiche l'unité que le produit débite vraiment -
// la session d'enregistrement - et le volume qu'elle génère tous formats
// activés. `sessions` donne une fourchette : le bas correspond à des sessions
// complètes, le haut à des mix plus légers.
export type Plan = {
  id: PlanId
  price: number
  credits: number
  /** Sessions d'enregistrement par mois, formaté (ex. '3 à 4'). */
  sessions: string
  /** Contenus par mois pour la cadence ci-dessous, arrondi. */
  contents: number
  /**
   * Cadence par format plutôt qu'un total quotidien : « 4 contenus par jour »
   * fait fuir, « 2 posts et 2 Reels par semaine » se visualise. Les trois paliers
   * s'expriment sur la même unité - la semaine - sinon ils ne se comparent pas ;
   * seul le volume LinkedIn et Reels change, la newsletter reste hebdomadaire.
   */
  rhythmFr: string
  rhythmEn: string
  highlighted?: boolean
}

export const PLAN_LABELS: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: 'Débutant', en: 'Starter' },
  growth: { fr: 'Intermédiaire', en: 'Intermediate' },
  scale: { fr: 'Expert', en: 'Expert' },
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    price: 199,
    credits: 2200,
    sessions: '1 à 2',
    contents: 20,
    rhythmFr: '2 posts LinkedIn, 2 Reels et 1 newsletter par semaine',
    rhythmEn: '2 LinkedIn posts, 2 Reels and 1 newsletter a week',
  },
  {
    id: 'growth',
    price: 499,
    credits: 6600,
    sessions: '3 à 4',
    contents: 45,
    rhythmFr: '5 posts LinkedIn, 5 Reels et 1 newsletter par semaine',
    rhythmEn: '5 LinkedIn posts, 5 Reels and 1 newsletter a week',
    highlighted: true,
  },
  {
    id: 'scale',
    price: 799,
    credits: 12000,
    sessions: '6 à 8',
    contents: 85,
    rhythmFr: '10 posts LinkedIn, 10 Reels et 1 newsletter par semaine',
    rhythmEn: '10 LinkedIn posts, 10 Reels and 1 newsletter a week',
  },
]

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
