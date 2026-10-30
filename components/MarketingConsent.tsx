"use client"
import { useCallback, useEffect } from 'react'
import CookiePreferences from './CookiePreferences'
import { Consent } from '@/lib/marketingConsent'
import { captureAttribution } from '@/lib/meta'

function loadGtm() {
  if (document.getElementById('empire-gtm')) return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []; w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script'); script.id = 'empire-gtm'; script.async = true
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MJCWGM8D'; document.head.appendChild(script)
}

export default function MarketingConsent() {
  useEffect(() => { captureAttribution(); loadGtm() }, [])
  const changed = useCallback((_c: Consent | null) => {}, [])
  return <CookiePreferences onChange={changed} />
}
