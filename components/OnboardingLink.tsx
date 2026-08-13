'use client'

import { ReactNode } from 'react'
import posthog from 'posthog-js'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'

/** App onboarding (installer le système) — no self-serve purchase. */
export const ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

/** Primary Empire CTA: apply / candidacy (no prices, no checkout). */
export const APPLY_URL = '/postuler'

// Main CTA: candidacy form. Captures the click in PostHog before navigation.
export default function OnboardingLink({
  className,
  children,
  href = APPLY_URL,
}: {
  className?: string
  children: ReactNode
  /** Override destination. Default = apply form. Pass ONBOARDING_URL to install the system. */
  href?: string
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const ctaText = (e.currentTarget.textContent || '').trim().slice(0, 80)
    if (posthog.__loaded) {
      posthog.capture(
        'cta_click',
        {
          cta_text: ctaText,
          path: window.location.pathname,
          href,
        },
        { transport: 'sendBeacon' }
      )
    }
    trackAmplitude('cta_click', { cta_text: ctaText, path: window.location.pathname, href })
    if (href.startsWith('http')) {
      e.currentTarget.href = withAmplitudeDeviceId(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
