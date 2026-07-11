'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { trackAmplitude } from '@/lib/amplitude'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function AbVariantTracker({ experiment }: { experiment: string }) {
  useEffect(() => {
    const variant = getCookie('hero_ab')
    if (!variant) return

    // GTM (GA4 backup)
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: 'ab_variant',
      experiment,
      variant,
    })

    // PostHog: exposure event, variant also attached as super property (see PostHogInit)
    if (posthog.__loaded) {
      posthog.capture('experiment_viewed', { experiment, variant })
    }

    // Amplitude: same exposure event (variant is also a super property, see AmplitudeInit)
    trackAmplitude('experiment_viewed', { experiment, variant })
  }, [experiment])

  return null
}
