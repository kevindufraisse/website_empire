'use client'

import { useEffect } from 'react'

// hero_ab "pricing" variant: the funnel is pay-first, so every CTA that would
// send the visitor to the app onboarding (hero, header, final CTA, sticky bar)
// scrolls to the pricing section instead. Mounted only on /hero-pricing.
export default function PricingVariantCtaRedirect() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest?.('a[href*="app.empire-internet.com/onboarding"]')
      if (!link) return
      e.preventDefault()
      e.stopPropagation()
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Capture phase: runs before the link's own click handlers and navigation
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [])

  return null
}
