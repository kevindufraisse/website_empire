'use client'

import { ReactNode } from 'react'
import posthog from 'posthog-js'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'

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
    const ctaText = (e.currentTarget.textContent || '').trim().slice(0, 80)
    if (posthog.__loaded) {
      posthog.capture(
        'cta_click',
        {
          cta_text: ctaText,
          path: window.location.pathname,
        },
        { transport: 'sendBeacon' }
      )
    }
    trackAmplitude('cta_click', { cta_text: ctaText, path: window.location.pathname })
    // Pass the Amplitude device id so the app session merges with this one
    e.currentTarget.href = withAmplitudeDeviceId(ONBOARDING_URL)
  }

  return (
    <a href={ONBOARDING_URL} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
