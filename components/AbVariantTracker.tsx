'use client'

import { useEffect } from 'react'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function AbVariantTracker({ experiment }: { experiment: string }) {
  useEffect(() => {
    const variant = getCookie('hero_ab')
    if (!variant) return
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: 'ab_variant',
      experiment,
      variant,
    })
  }, [experiment])

  return null
}
