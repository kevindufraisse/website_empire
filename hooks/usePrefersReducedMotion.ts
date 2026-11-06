'use client'

import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const getSnapshot = () => window.matchMedia(query).matches
const getServerSnapshot = () => false
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** Keep the first client tree identical to the server, then apply the preference.
 * Branching on the browser preference during hydration replaces the whole page. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
