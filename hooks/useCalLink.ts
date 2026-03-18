'use client'

import { useState, useEffect } from 'react'

const BASE_CAL_LINK = 'team/empire-internet/audit-empire'

export function useCalLink() {
  const [calLink, setCalLink] = useState(BASE_CAL_LINK)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emp = params.get('emp')
    if (emp) {
      sessionStorage.setItem('emp', emp)
    }
    const stored = emp || sessionStorage.getItem('emp')
    if (stored) {
      setCalLink(`${BASE_CAL_LINK}?emp=${encodeURIComponent(stored)}`)
    }
  }, [])

  return calLink
}

export function getEmpParam(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('emp') || new URLSearchParams(window.location.search).get('emp')
}
