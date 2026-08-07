// Source unique des packs Empire. Importé par la section pricing et par le quiz
// d'orientation pour qu'un changement de prix ou de volume ne dérive jamais
// entre les deux.

export const APP_ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

export type PlanId = 'starter' | 'growth' | 'scale'
export type BillingId = 'monthly' | 'quarterly' | 'yearly'

export type Plan = {
  id: PlanId
  price: number
  credits: number
  /** Volume mensuel affiché, déjà formaté (ex. '~89'). */
  contents: string
  highlighted?: boolean
}

export const PLAN_LABELS: Record<PlanId, { fr: string; en: string }> = {
  starter: { fr: 'Débutant', en: 'Starter' },
  growth: { fr: 'Intermédiaire', en: 'Intermediate' },
  scale: { fr: 'Expert', en: 'Expert' },
}

export const PLANS: Plan[] = [
  { id: 'starter', price: 199, credits: 2200, contents: '~22' },
  { id: 'growth', price: 499, credits: 6600, contents: '~89', highlighted: true },
  { id: 'scale', price: 799, credits: 12000, contents: '~177' },
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
