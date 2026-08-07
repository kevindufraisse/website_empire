'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

export default function PostHogInit() {
  const pathname = usePathname()

  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return

    posthog.init(POSTHOG_KEY, {
      api_host: 'https://eu.i.posthog.com',
      // Pageviews are captured manually on route change (see effect below)
      capture_pageview: false,
      persistence: 'localStorage+cookie',
    })

    // Expose for inline scripts (e.g. Cal.com embed callbacks on booking pages)
    ;(window as unknown as { posthog?: typeof posthog }).posthog = posthog
  }, [])

  useEffect(() => {
    if (!POSTHOG_KEY) return
    posthog.capture('$pageview')
  }, [pathname])

  return null
}
