'use client'

import { useEffect, useState } from 'react'
import {
  getPartnerFestivalPricing,
  type PartnerFestivalPricing,
} from '@/lib/partner-festival-pricing'

export type PartnerFestivalLive = PartnerFestivalPricing & {
  countdown: string
  isUrgent: boolean
  /** False until after mount — countdown must not SSR (hydration mismatch). */
  ready: boolean
}

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(totalSec / 86_400)
  const h = Math.floor((totalSec % 86_400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (d > 0) {
    return `${d}j ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function usePartnerFestivalPricing(): PartnerFestivalLive {
  // Prix / palier : stables à la seconde près → OK en SSR.
  // Compte à rebours : uniquement après mount (sinon mismatch serveur/client).
  const [pricing, setPricing] = useState(() => getPartnerFestivalPricing())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setPricing(getPartnerFestivalPricing())
    setReady(true)
    const id = setInterval(() => setPricing(getPartnerFestivalPricing()), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    ...pricing,
    countdown: ready ? formatCountdown(pricing.msUntilNext) : '',
    isUrgent: ready && pricing.msUntilNext > 0 && pricing.msUntilNext < 86_400_000,
    ready,
  }
}
