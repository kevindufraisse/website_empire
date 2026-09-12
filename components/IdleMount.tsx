'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Monte les widgets non critiques après le premier paint.
 * requestIdleCallback évite de voler le main thread pendant le chargement
 * de la page ; le timeout garantit qu'ils arrivent quand même.
 */
export default function IdleMount({
  children,
  timeout = 2500,
}: {
  children: ReactNode
  timeout?: number
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const ric = window.requestIdleCallback
    if (ric) {
      const id = ric(() => setReady(true), { timeout })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setReady(true), Math.min(timeout, 1200))
    return () => window.clearTimeout(id)
  }, [timeout])

  if (!ready) return null
  return <>{children}</>
}
