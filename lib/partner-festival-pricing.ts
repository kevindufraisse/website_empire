/**
 * Prix hebdo du bootcamp Academy (/academy), l'entrée du programme partenaire.
 * Le statut partenaire est proposé juste après le paiement, dans l'app
 * (/join/academy, upsell en un clic) : le site ne vend que le bootcamp.
 *
 * Semaine Europe/Paris, reset chaque lundi 00:00 (le lundi, l'onboarding
 * de la cohorte démarre — tout le monde commence ensemble) :
 * - Lun 00:00 → Mar 00:00 : 297 €  (onboarding du lundi, prix le plus bas)
 * - Mar 00:00 → Mer 00:00 : 397 €
 * - Mer 00:00 → Lun 00:00 : 497 €  (live du mercredi passé)
 *
 * Miroir côté app : `BOOTCAMP_WEEKLY_TIERS` dans
 * empire-tracking/src/lib/waSetter.cjs (montant réel du checkout Stripe).
 */

export type PartnerTierId = 'live' | 'after_live' | 'last_chance'

export type PartnerFestivalTier = {
  id: PartnerTierId
  price: number
  labelFr: string
  labelEn: string
}

export const PARTNER_FESTIVAL_TIERS: PartnerFestivalTier[] = [
  {
    id: 'live',
    price: 297,
    labelFr: 'Early · lundi',
    labelEn: 'Early · Monday',
  },
  {
    id: 'after_live',
    price: 397,
    labelFr: 'Late · mardi',
    labelEn: 'Late · Tuesday',
  },
  {
    id: 'last_chance',
    price: 497,
    labelFr: 'Very late · mercredi',
    labelEn: 'Very late · Wednesday',
  },
]

export type PartnerFestivalPricing = {
  price: number
  tierId: PartnerTierId
  labelFr: string
  labelEn: string
  nextPrice: number | null
  nextLabelFr: string | null
  nextLabelEn: string | null
  /** Ms until next bump (or until Monday reset when on last_chance). */
  msUntilNext: number
  tiers: PartnerFestivalTier[]
}

type ParisParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  weekday: number // 1=Mon … 7=Sun (ISO)
}

function parisParts(date: Date): ParisParts {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  })
  const map: Record<string, string> = {}
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = part.value
  }
  const weekdayMap: Record<string, number> = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekdayMap[map.weekday] ?? 1,
  }
}

/** Instant UTC corresponding to a wall-clock time in Europe/Paris. */
function parisWallToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
): Date {
  let guess = Date.UTC(year, month - 1, day, hour - 1, minute, second)
  for (let i = 0; i < 4; i++) {
    const p = parisParts(new Date(guess))
    const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
    const desired = Date.UTC(year, month - 1, day, hour, minute, second)
    guess += desired - asIfUtc
  }
  return new Date(guess)
}

function addParisDays(year: number, month: number, day: number, delta: number) {
  const utc = Date.UTC(year, month - 1, day) + delta * 86_400_000
  const d = new Date(utc)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
}

export function getPartnerFestivalPricing(now: Date = new Date()): PartnerFestivalPricing {
  const p = parisParts(now)
  // Minutes since Monday 00:00 Paris
  const minutesSinceMonday =
    (p.weekday - 1) * 24 * 60 + p.hour * 60 + p.minute + p.second / 60

  const TUE_00 = 1 * 24 * 60 // Tuesday 00:00
  const WED_00 = 2 * 24 * 60 // Wednesday 00:00

  let tier: PartnerFestivalTier
  let nextAt: Date

  if (minutesSinceMonday < TUE_00) {
    tier = PARTNER_FESTIVAL_TIERS[0]
    const tue = addParisDays(p.year, p.month, p.day, 2 - p.weekday)
    nextAt = parisWallToUtc(tue.year, tue.month, tue.day, 0, 0, 0)
  } else if (minutesSinceMonday < WED_00) {
    tier = PARTNER_FESTIVAL_TIERS[1]
    const wed = addParisDays(p.year, p.month, p.day, 3 - p.weekday)
    nextAt = parisWallToUtc(wed.year, wed.month, wed.day, 0, 0, 0)
  } else {
    tier = PARTNER_FESTIVAL_TIERS[2]
    const mon = addParisDays(p.year, p.month, p.day, 8 - p.weekday)
    nextAt = parisWallToUtc(mon.year, mon.month, mon.day, 0, 0, 0)
  }

  const idx = PARTNER_FESTIVAL_TIERS.findIndex((t) => t.id === tier.id)
  const next = PARTNER_FESTIVAL_TIERS[idx + 1] ?? PARTNER_FESTIVAL_TIERS[0]
  const isLast = tier.id === 'last_chance'

  return {
    price: tier.price,
    tierId: tier.id,
    labelFr: tier.labelFr,
    labelEn: tier.labelEn,
    nextPrice: next.price,
    nextLabelFr: isLast ? 'Early · lundi' : next.labelFr,
    nextLabelEn: isLast ? 'Early · Monday' : next.labelEn,
    msUntilNext: Math.max(0, nextAt.getTime() - now.getTime()),
    tiers: PARTNER_FESTIVAL_TIERS,
  }
}

export function partnerPayHref(): string {
  return (
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173/join/academy'
      : 'https://app.empire-internet.com/join/academy'
  )
}
