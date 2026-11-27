'use client'

import { useEffect, useState } from 'react'
import { fetchFlashPromo } from '@/lib/flash-promo'
import type { PlanId } from '@/lib/plans'

/**
 * Black Friday 2026 (choix de Kevin, 12 novembre 2026) : Scale au prix de
 * Growth, 499 € au lieu de 799 €/mois pendant 12 mois, jusqu'au lundi
 * 30 novembre 23 h 59 heure de Paris.
 *
 * Le paiement vient de l'app : la ligne `scale499` de la table `promotions`
 * (empire-tracking, migration 20261112120000_black_friday_scale_499.sql) porte
 * le même prix, la même durée et la même fin (`ends_at`). Garder les deux
 * d'accord : si l'une change, l'autre aussi.
 *
 * Passé `BLACK_FRIDAY.endsAt`, tout le site repasse seul au plein tarif, même
 * sans redéploiement : le bandeau, le prix barré et le compteur disparaissent
 * à la seconde près dans le navigateur.
 */
export const BLACK_FRIDAY = {
  plan: 'scale' as PlanId,
  /** Le prix d'Empire Club. */
  promoMonthly: 499,
  baseMonthly: 799,
  durationMonths: null as number | null,
  endsAt: Date.parse('2026-11-30T23:59:59+01:00'),
} as const

/** Heure du build, inlinée côté serveur et côté navigateur (next.config.js) :
 *  le premier rendu est le même des deux côtés, donc pas d'écart d'hydratation
 *  si la page a été construite pendant le Black Friday et lue après. */
const BUILD_TIME = Number(process.env.NEXT_PUBLIC_BUILD_TIME) || 0

export function isBlackFriday(now: number): boolean {
  return now <= BLACK_FRIDAY.endsAt
}

/** Le prix mensuel de base d'une formule, Black Friday compris. */
export function blackFridayBase(plan: PlanId, basePrice: number, active: boolean): number {
  return active && plan === BLACK_FRIDAY.plan ? BLACK_FRIDAY.promoMonthly : basePrice
}

/** « 18 j 04:12:33 », ou « 04:12:33 » le dernier jour. */
export function formatBlackFridayLeft(ms: number, fr: boolean): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  const clock = `${pad(h)}:${pad(m)}:${pad(s)}`
  return d > 0 ? `${d}${fr ? ' j' : 'd'} ${clock}` : clock
}

/**
 * `active` : la promo est en cours. `left` : le temps restant en ms (null
 * avant le montage, pour ne pas afficher un compteur faux au premier rendu).
 */
export function useBlackFriday(): { active: boolean; left: number | null } {
  const [active, setActive] = useState(() => isBlackFriday(BUILD_TIME))
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => {
      const remaining = BLACK_FRIDAY.endsAt - Date.now()
      setActive(remaining >= 0)
      setLeft(remaining >= 0 ? remaining : null)
      return remaining >= 0
    }
    if (!tick()) return
    const id = window.setInterval(() => { if (!tick()) window.clearInterval(id) }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return { active, left }
}

/** La durée réelle de la promo, lue en base via promo-status : Kevin la change
 * sans redéploiement (null = à vie ; un nombre = pendant N mois). `undefined`
 * tant qu'on ne sait pas (premier rendu, réseau en panne) : on n'affiche
 * alors aucune durée plutôt qu'une durée fausse. Une seule requête partagée. */
let durationPromise: Promise<number | null | undefined> | null = null
export function useBlackFridayDuration(): number | null | undefined {
  const [months, setMonths] = useState<number | null | undefined>(undefined)
  useEffect(() => {
    durationPromise ||= fetchFlashPromo().then(
      st => (st && st.promo && 'durationMonths' in st.promo ? (st.promo.durationMonths ?? null) : undefined),
      () => undefined,
    )
    let on = true
    durationPromise.then(v => { if (on) setMonths(v) })
    return () => { on = false }
  }, [])
  return months
}

/** « pendant 12 mois » / « à vie », ou '' tant que la durée n'est pas connue. */
export function blackFridayDurationLabel(months: number | null | undefined, fr: boolean): string {
  if (months === undefined || months === null) return fr ? 'à vie' : 'for life'
  return fr ? `pendant ${months} mois` : `for ${months} months`
}
