'use client'

import { TRIAL_URL } from '@/lib/startTrial'
import { ReactNode } from 'react'
import posthog from 'posthog-js'
import { trackAmplitude, withAmplitudeDeviceId } from '@/lib/amplitude'

/** Inscription Empire. */
export const ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

/** CTA principal Empire : inscription avec l’intention d’essai conservée. */
export const APPLY_URL = TRIAL_URL

// CTA principal : l’essai gratuit. Capture le clic dans PostHog avant la navigation.
export default function OnboardingLink({
  className,
  children,
  href = APPLY_URL,
}: {
  className?: string
  children: ReactNode
  /** Override destination. Default = free trial signup. */
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
