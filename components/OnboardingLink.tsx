'use client'

import { ReactNode } from 'react'
import posthog from 'posthog-js'

export const ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

// Main CTA: direct link to the app onboarding (no Cal.com booking).
// Captures the click in PostHog before the navigation (sendBeacon survives it).
export default function OnboardingLink({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (posthog.__loaded) {
      posthog.capture(
        'cta_click',
        {
          cta_text: (e.currentTarget.textContent || '').trim().slice(0, 80),
          path: window.location.pathname,
        },
        { transport: 'sendBeacon' }
      )
    }
  }

  return (
    <a href={ONBOARDING_URL} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
