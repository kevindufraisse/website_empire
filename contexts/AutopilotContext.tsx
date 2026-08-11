'use client'

import { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AutopilotContextType {
  autopilot: boolean
  setAutopilot: (value: boolean) => void
  toggle: () => void
}

const AutopilotContext = createContext<AutopilotContextType | undefined>(undefined)

/**
 * Tier is derived from the URL only. The old localStorage flag caused gold/green
 * flashes when navigating between Empire, Academy and Légende.
 */
export function AutopilotProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [offerLegende, setOfferLegende] = useState(false)

  useEffect(() => {
    try {
      localStorage.removeItem('empire-autopilot')
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      setOfferLegende(params.get('offer') === 'legende')
    } catch {
      setOfferLegende(false)
    }
  }, [pathname])

  const autopilot =
    pathname === '/legende' ||
    ((pathname === '/join-us' || pathname === '/decouverte') && offerLegende)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-autopilot', autopilot ? 'true' : 'false')
    const tier =
      pathname === '/academy' || pathname === '/candidature'
        ? 'academy'
        : pathname === '/legende' || autopilot
          ? 'autopilot'
          : 'copilot'
    root.setAttribute('data-tier', tier)
  }, [pathname, autopilot])

  // Kept for AutopilotToggle / legacy callers. Navigation owns the tier now.
  const setAutopilot = useCallback((_value: boolean) => {}, [])
  const toggle = useCallback(() => {}, [])

  const value = useMemo(
    () => ({ autopilot, setAutopilot, toggle }),
    [autopilot, setAutopilot, toggle],
  )

  return (
    <AutopilotContext.Provider value={value}>
      {children}
    </AutopilotContext.Provider>
  )
}

export function useAutopilot() {
  const context = useContext(AutopilotContext)
  if (!context) {
    throw new Error('useAutopilot must be used within AutopilotProvider')
  }
  return context
}
