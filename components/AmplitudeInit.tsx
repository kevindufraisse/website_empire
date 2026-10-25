"use client"
import { useEffect } from 'react'
import { initAmplitude } from '@/lib/amplitude'
import { CONSENT_EVENT } from '@/lib/marketingConsent'
export default function AmplitudeInit() {
  useEffect(() => { initAmplitude(); window.addEventListener(CONSENT_EVENT, initAmplitude); return () => window.removeEventListener(CONSENT_EVENT, initAmplitude) }, [])
  return null
}
