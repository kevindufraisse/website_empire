'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { getCalApi } from '@calcom/embed-react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

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

    // Expose for inline scripts (e.g. Cal.com embed callbacks)
    ;(window as unknown as { posthog?: typeof posthog }).posthog = posthog

    // Attach the A/B variant to every event of this visitor
    const variant = getCookie('hero_ab')
    if (variant) {
      posthog.register({ hero_ab: variant })
    }

    // Conversion: Cal.com booking confirmed (popup embeds share this namespace)
    ;(async () => {
      const cal = await getCalApi({ namespace: 'audit-empire' })
      cal('on', {
        action: 'bookingSuccessful',
        callback: () => posthog.capture('cal_booking_confirmed'),
      })
    })()
  }, [])

  useEffect(() => {
    if (!POSTHOG_KEY) return
    posthog.capture('$pageview')
  }, [pathname])

  return null
}
