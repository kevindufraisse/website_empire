'use client'

import { useState, useEffect } from 'react'
import { getAcademyPricing, type AcademyPricingTier } from '@/lib/cohort-config'

export interface AcademyPricingLive extends AcademyPricingTier {
  /** Hours remaining until next price tier (0 if final tier). */
  hoursLeft: number
  /** Live countdown string "HH:MM:SS" — only meaningful when < 24h remain. */
  countdown: string
  /** True when less than 24 hours until the next price increase. */
  isUrgent: boolean
}

export function useAcademyPricing(): AcademyPricingLive {
  const [tier, setTier] = useState(() => getAcademyPricing())

  useEffect(() => {
    const interval = setInterval(() => {
      setTier(getAcademyPricing())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const hoursLeft = Math.max(0, Math.floor(tier.msUntilNext / 3_600_000))
  const isUrgent = tier.msUntilNext > 0 && tier.msUntilNext < 86_400_000

  const totalSec = Math.max(0, Math.floor(tier.msUntilNext / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const countdown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return { ...tier, hoursLeft, countdown, isUrgent }
}
