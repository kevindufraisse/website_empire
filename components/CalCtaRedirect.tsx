'use client'

import { useEffect } from 'react'

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
      window.location.href = getRedirectUrl()
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
