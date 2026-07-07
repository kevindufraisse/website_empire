'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

const ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

function getRedirectUrl() {
  return ONBOARDING_URL
}

export default function CalCtaRedirect() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const trigger = target?.closest('[data-cal-link]')
      if (!trigger) return

      event.preventDefault()
      event.stopPropagation()

      // sendBeacon so the event survives the navigation that follows
      if (posthog.__loaded) {
        posthog.capture(
          'cta_click',
          {
            cta_text: (trigger.textContent || '').trim().slice(0, 80),
            path: window.location.pathname,
          },
          { transport: 'sendBeacon' }
        )
      }

      window.location.href = getRedirectUrl()
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
