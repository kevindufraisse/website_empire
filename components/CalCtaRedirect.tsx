'use client'

import { useEffect } from 'react'

function getDecouverteUrl() {
  const params = new URLSearchParams(window.location.search)
  const empFromUrl = params.get('emp')
  if (empFromUrl) {
    sessionStorage.setItem('emp', empFromUrl)
  }

  const emp = empFromUrl || sessionStorage.getItem('emp')
  if (!emp) return '/join-us'

  return `/join-us?emp=${encodeURIComponent(emp)}`
}

export default function CalCtaRedirect() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const trigger = target?.closest('[data-cal-link]')
      if (!trigger) return

      event.preventDefault()
      event.stopPropagation()
      window.location.href = getDecouverteUrl()
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
