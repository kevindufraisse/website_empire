/**
 * Prix festival hebdo du programme partenaire (/academy).
 *
 * Semaine Europe/Paris, reset chaque lundi 00:00 :
 * - Lun 00:00 → Jeu 18:00 : 500 €  (prix du live — on peut venir jeudi 11h et payer encore à 500)
 * - Jeu 18:00 → Dim 00:00 : 700 €  (après le live)
 * - Dim 00:00 → Lun 00:00 : 800 €  (dernière chance)
 *
 * Miroir côté app : `partnerFestivalPricingFor` dans
 * empire-tracking/src/lib/waSetter.cjs (checkout Stripe).
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
    price: 500,
    labelFr: 'Prix du live',
    labelEn: 'Live price',
  },
  {
    id: 'after_live',
    price: 700,
    labelFr: 'Après le live',
    labelEn: 'After the live',
  },
  {
    id: 'last_chance',
    price: 800,
    labelFr: 'Dernière chance',
    labelEn: 'Last chance',
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

  const THU_18 = 3 * 24 * 60 + 18 * 60 // Thursday 18:00
  const SUN_00 = 6 * 24 * 60 // Sunday 00:00

  let tier: PartnerFestivalTier
  let nextAt: Date

  if (minutesSinceMonday < THU_18) {
    tier = PARTNER_FESTIVAL_TIERS[0]
    const thu = addParisDays(p.year, p.month, p.day, 4 - p.weekday)
    nextAt = parisWallToUtc(thu.year, thu.month, thu.day, 18, 0, 0)
  } else if (minutesSinceMonday < SUN_00) {
    tier = PARTNER_FESTIVAL_TIERS[1]
    const sun = addParisDays(p.year, p.month, p.day, 7 - p.weekday)
    nextAt = parisWallToUtc(sun.year, sun.month, sun.day, 0, 0, 0)
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
    nextLabelFr: isLast ? 'Prix du live (lundi)' : next.labelFr,
    nextLabelEn: isLast ? 'Live price (Monday)' : next.labelEn,
    msUntilNext: Math.max(0, nextAt.getTime() - now.getTime()),
    tiers: PARTNER_FESTIVAL_TIERS,
  }
}

export function partnerPayHref(): string {
  return (
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173/join/academy?offer=partner'
      : 'https://app.empire-internet.com/join/academy?offer=partner'
  )
}
