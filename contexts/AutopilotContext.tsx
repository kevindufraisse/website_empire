'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface AutopilotContextType {
  autopilot: boolean
  setAutopilot: (value: boolean) => void
  toggle: () => void
}

const AutopilotContext = createContext<AutopilotContextType | undefined>(undefined)

const STORAGE_KEY = 'empire-autopilot'

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [autopilot, setAutopilotState] = useState<boolean>(false)
  const pathname = usePathname()

  // Autopilot is disabled for now — always force copilot mode.
  // Clear any stale localStorage so returning visitors don't get stuck.
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setAutopilotState(false)
  }, [])

  // Sync data-autopilot & data-tier on <html> so CSS (globals.css) can flip
  // --empire-rgb between copilot-green / autopilot-gold / academy-orange
  // without each component needing to be tier-aware.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-autopilot', autopilot ? 'true' : 'false')
    const tier = pathname === '/academy' || pathname === '/candidature'
      ? 'academy'
      : autopilot ? 'autopilot' : 'copilot'
    root.setAttribute('data-tier', tier)
  }, [autopilot, pathname])

  const setAutopilot = useCallback((value: boolean) => {
    setAutopilotState(value)
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
    } catch {}
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'autopilot_toggle',
        autopilot_mode: value,
      })
    }
  }, [])

  const toggle = useCallback(() => {
    setAutopilot(!autopilot)
  }, [autopilot, setAutopilot])

  return (
    <AutopilotContext.Provider value={{ autopilot, setAutopilot, toggle }}>
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
