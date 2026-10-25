"use client"
import { useCallback } from 'react'
import CookiePreferences from './CookiePreferences'
import { Consent } from '@/lib/marketingConsent'
import { captureAttribution } from '@/lib/meta'
export default function MarketingConsent() {
  const changed = useCallback((c: Consent | null) => {
    if (!c?.marketing) return
    captureAttribution()
    if (document.getElementById('empire-consented-gtm')) return
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []; w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    const script = document.createElement('script'); script.id = 'empire-consented-gtm'; script.async = true
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MJCWGM8D'; document.head.appendChild(script)
  }, [])
  return <CookiePreferences onChange={changed} />
}
