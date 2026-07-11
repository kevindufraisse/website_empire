'use client'

import { useEffect } from 'react'
import { initAmplitude, setAmplitudeSuperProperties } from '@/lib/amplitude'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function AmplitudeInit() {
  useEffect(() => {
    // Attach the A/B variant to every event before init so even the first
    // autocaptured events (page view, session start) carry it.
    const variant = getCookie('hero_ab')
    if (variant) {
      setAmplitudeSuperProperties({ hero_ab: variant })
    }
    initAmplitude()
  }, [])

  return null
}
