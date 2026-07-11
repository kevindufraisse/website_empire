// Promo saisonnière — même calendrier et mêmes remises que l'app
// (empire-tracking src/lib/seasonalPromo.ts) et que le bandeau EvergreenPromo.
// Le prix payé reste le prix catalogue : la promo sert à l'affichage
// (prix barré "avant remise") pour rester cohérent avec le bandeau -X%.

export interface SeasonalPromo {
  code: string
  discount: number
}

const SEASONS: { code: string; discount: number; from: [number, number]; to: [number, number] }[] = [
  { code: 'SUMMER', discount: 0.3, from: [6, 21], to: [8, 31] },
  { code: 'RENTREE', discount: 0.25, from: [9, 1], to: [10, 15] },
  { code: 'BFRIDAY', discount: 0.4, from: [11, 15], to: [12, 3] },
  { code: 'NOEL', discount: 0.3, from: [12, 4], to: [1, 10] },
  { code: 'NEWYEAR', discount: 0.25, from: [1, 11], to: [3, 19] },
  { code: 'SPRING', discount: 0.25, from: [3, 20], to: [6, 20] },
]

const mmdd = (m: number, d: number) => m * 100 + d

export function getCurrentSeasonalPromo(now: Date = new Date()): SeasonalPromo {
  const today = mmdd(now.getMonth() + 1, now.getDate())
  for (const s of SEASONS) {
    const from = mmdd(...s.from)
    const to = mmdd(...s.to)
    const inRange = from <= to ? today >= from && today <= to : today >= from || today <= to
    if (inRange) return { code: s.code, discount: s.discount }
  }
  return { code: 'SPRING', discount: 0.25 }
}

/** Prix "avant remise" cohérent avec la remise de saison (ex. 199 / 0.7 → 284) */
export function getAnchorPrice(realPrice: number, promo: SeasonalPromo): number {
  return Math.round(realPrice / (1 - promo.discount))
}
