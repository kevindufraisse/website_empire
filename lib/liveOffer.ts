'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Offre du live affichée sur les cartes de /tarifs (29 octobre 2026, choix de
 * Kevin : « comme sur ElevenLabs, et avec le lien »). Seulement quand on
 * arrive par le lien du live (`/tarifs?offer=live&email=…`).
 * Montants : miroir de LIVE_OFFER (app, src/lib/liveOffer.ts et .cjs).
 * Le paiement reste celui de l'app (`/join/internet?offer=live`), qui
 * revérifie la fenêtre en base et applique le coupon.
 */

export type LivePlan = 'growth' | 'scale'

export const LIVE_OFFER = {
  discountMonthly: 300,
  discountMonths: 3,
  plans: {
    growth: { listMonthly: 499, monthly: 199 },
    scale: { listMonthly: 799, monthly: 499 },
  },
} as const

export function isLivePlan(plan: string): plan is LivePlan {
  return plan === 'growth' || plan === 'scale'
}

const EMAIL_KEY = 'empire_live_offer_email_v1'
const APP_LIVE_URL = 'https://app.empire-internet.com/join/internet'

export function cleanEmail(value: string | null | undefined): string {
  const email = String(value || '').trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : ''
}

export function liveCheckoutUrl(email: string, plan: LivePlan) {
  const url = new URL(APP_LIVE_URL)
  url.searchParams.set('offer', 'live')
  url.searchParams.set('email', email)
  url.searchParams.set('plan', plan)
  url.searchParams.set('lang', 'fr')
  return url.toString()
}

/** Fenêtre ouverte : date de fin ramenée à l'horloge du navigateur. */
export type LiveWindow = { email: string; endsAt: number }

type Status = 'off' | 'need_email' | 'loading' | 'open' | 'expired'

function readStoredEmail() {
  try { return cleanEmail(window.localStorage.getItem(EMAIL_KEY)) } catch { return '' }
}

function storeEmail(email: string) {
  try { window.localStorage.setItem(EMAIL_KEY, email) } catch { /* navigation privée */ }
}

export function useLiveOffer() {
  const [status, setStatus] = useState<Status>('off')
  const [live, setLive] = useState<LiveWindow | null>(null)
  const [error, setError] = useState('')

  const check = useCallback(async (raw: string) => {
    const email = cleanEmail(raw)
    if (!email) { setError('email'); return }
    setError('')
    setStatus('loading')
    try {
      const res = await fetch('/api/live-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => null)
      storeEmail(email)
      if (data?.state === 'open' && data.deadline) {
        const skew = data.serverNow ? Date.parse(data.serverNow) - Date.now() : 0
        setLive({ email, endsAt: Date.parse(data.deadline) - skew })
        setStatus('open')
      } else if (data?.state === 'expired') {
        setLive(null)
        setStatus('expired')
      } else {
        // Serveur muet : on garde les prix habituels, sans message d'erreur.
        setLive(null)
        setStatus('off')
      }
    } catch {
      setLive(null)
      setStatus('off')
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('offer') !== 'live') return
    const email = cleanEmail(params.get('email')) || readStoredEmail()
    if (email) check(email)
    else setStatus('need_email')
  }, [check])

  // À la fin des 72 h, les cartes repassent aux prix habituels.
  useEffect(() => {
    if (!live) return
    const left = live.endsAt - Date.now()
    if (left <= 0) { setLive(null); setStatus('expired'); return }
    const t = window.setTimeout(() => { setLive(null); setStatus('expired') }, Math.min(left, 2 ** 31 - 1))
    return () => window.clearTimeout(t)
  }, [live])

  return { status, live, error, check }
}

/** « 47 h 12 min » ou « 12 min 05 s », relu chaque seconde. */
export function useCountdown(endsAt: number | null | undefined) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!endsAt) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [endsAt])
  if (!endsAt) return ''
  const s = Math.max(0, Math.floor((endsAt - now) / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min ${String(sec).padStart(2, '0')} s`
}
