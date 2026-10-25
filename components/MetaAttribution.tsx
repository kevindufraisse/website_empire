'use client'

import { useEffect } from 'react'
import { captureAttribution, attributedUrl } from '@/lib/meta'

export default function MetaAttribution() {
  useEffect(() => {
    captureAttribution()
    const follow = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (anchor instanceof HTMLAnchorElement) anchor.href = attributedUrl(anchor.href)
    }
    document.addEventListener('click', follow, true)
    return () => document.removeEventListener('click', follow, true)
  }, [])
  return null
}
