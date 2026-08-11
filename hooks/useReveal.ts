'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * Reveal-on-scroll trigger for sections that can unmount and come back, typically
 * the ones hidden behind `if (autopilot) return null`.
 *
 * framer-motion's `useInView` observes whatever `ref.current` holds when its effect
 * first runs, and never re-observes. A section that gets detached by the tier toggle
 * and later re-rendered ends up with a brand-new node nobody watches, so it stays at
 * its `initial` opacity forever - a full-height block of empty background.
 *
 * A callback ref runs again on every node change, so the observer always follows the
 * element that is actually on screen.
 */
export function useReveal(margin = '-100px') {
  const [inView, setInView] = useState(false)
  const disconnect = useRef<(() => void) | null>(null)

  const ref = useCallback(
    (node: Element | null) => {
      disconnect.current?.()
      disconnect.current = null
      if (!node) return

      if (typeof IntersectionObserver === 'undefined') {
        setInView(true)
        return
      }

      const observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            setInView(true)
            observer.disconnect()
            disconnect.current = null
          }
        },
        { rootMargin: margin }
      )
      observer.observe(node)
      disconnect.current = () => observer.disconnect()
    },
    [margin]
  )

  return [ref, inView] as const
}
