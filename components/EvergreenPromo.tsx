'use client'

import { useEffect, useState, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const STORAGE_KEY = 'empire_promo'
const FP_KEY = 'empire_fp'

type Promo = {
  id: string
  code: string
  discount: string
  labelFr: string
  labelEn: string
  emoji: string
}

function getSeasonalPromo(date: Date): Promo {
  const m = date.getMonth()
  const d = date.getDate()

  if ((m === 5 && d >= 21) || m === 6 || (m === 7 && d <= 31))
    return { id: 'summer-2026', code: 'SUMMER', discount: '-30%', labelFr: 'Offre été', labelEn: 'Summer deal', emoji: '☀️' }
  if (m === 8 || (m === 9 && d <= 15))
    return { id: 'rentree-2026', code: 'RENTREE', discount: '-25%', labelFr: 'Offre rentrée', labelEn: 'Back to school', emoji: '🎒' }
  if ((m === 10 && d >= 15) || (m === 11 && d <= 3))
    return { id: 'bf-2026', code: 'BFRIDAY', discount: '-40%', labelFr: 'Black Friday', labelEn: 'Black Friday', emoji: '🖤' }
  if ((m === 11 && d >= 4) || (m === 0 && d <= 10))
    return { id: 'winter-2026', code: 'NOEL', discount: '-30%', labelFr: 'Offre hiver', labelEn: 'Winter deal', emoji: '❄️' }
  if ((m === 0 && d >= 11) || m === 1 || (m === 2 && d <= 19))
    return { id: 'newyear-2026', code: 'NEWYEAR', discount: '-25%', labelFr: 'Nouvelle année', labelEn: 'New year deal', emoji: '🎆' }
  return { id: 'spring-2026', code: 'SPRING', discount: '-25%', labelFr: 'Offre printemps', labelEn: 'Spring deal', emoji: '🌱' }
}

function getBrowserFingerprint(): string {
  try {
    const stored = localStorage.getItem(FP_KEY)
    if (stored) return stored

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    let canvasHash = ''
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('fp', 2, 2)
      canvasHash = canvas.toDataURL().slice(-32)
    }

    const components = [
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      canvasHash,
    ].join('|')

    let hash = 0
    for (let i = 0; i < components.length; i++) {
      hash = ((hash << 5) - hash + components.charCodeAt(i)) | 0
    }
    const fp = 'fp_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36)
    localStorage.setItem(FP_KEY, fp)
    return fp
  } catch {
    return 'fp_' + Math.random().toString(36).slice(2)
  }
}

function formatTime(ms: number) {
  if (ms <= 0) return null
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function EvergreenPromo({ variant = 'hero' }: { variant?: 'hero' | 'header' }) {
  const { lang } = useLanguage()
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [promo, setPromo] = useState<Promo | null>(null)
  const [ready, setReady] = useState(false)
  const deadlineRef = useRef<number | null>(null)

  useEffect(() => {
    const currentPromo = getSeasonalPromo(new Date())
    const fingerprint = getBrowserFingerprint()

    async function init() {
      let deadlineMs: number | null = null

      // Try server first
      try {
        const res = await fetch('/api/promo-deadline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ promoId: currentPromo.id, fingerprint }),
        })
        const data = await res.json()
        if (data.expired) {
          setReady(true)
          return
        }
        if (data.deadline) {
          deadlineMs = new Date(data.deadline).getTime()
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ promoId: currentPromo.id, deadline: deadlineMs }))
        }
      } catch {
        // Server unreachable: fall back to localStorage
      }

      // Fallback to localStorage if server didn't return
      if (!deadlineMs) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) {
            const data = JSON.parse(raw)
            if (data.promoId === currentPromo.id) {
              if (Date.now() > data.deadline) {
                setReady(true)
                return
              }
              deadlineMs = data.deadline
            }
          }
        } catch {}

        if (!deadlineMs) {
          const extra = 12 + Math.floor(Math.random() * 36)
          deadlineMs = Date.now() + 23 * 3600_000 + extra * 60_000
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ promoId: currentPromo.id, deadline: deadlineMs }))
        }
      }

      deadlineRef.current = deadlineMs
      setPromo(currentPromo)
      setReady(true)
    }

    init()
  }, [])

  useEffect(() => {
    if (!ready || !promo || deadlineRef.current === null) return

    const tick = () => {
      const remaining = (deadlineRef.current ?? 0) - Date.now()
      if (remaining <= 0) {
        setTimeLeft(null)
        setPromo(null)
        return
      }
      setTimeLeft(formatTime(remaining))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [ready, promo])

  if (!ready || !promo || !timeLeft) return null

  const label = lang === 'fr' ? promo.labelFr : promo.labelEn
  const expireLabel = lang === 'fr' ? 'Expire dans' : 'Expires in'

  if (variant === 'header') {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5">
        <span className="text-xs leading-none">{promo.emoji}</span>
        <span className="text-[13px] font-bold text-empire whitespace-nowrap">
          {promo.discount}
        </span>
        <span className="text-neutral-600">·</span>
        <span className="font-mono text-[13px] font-bold tabular-nums text-white whitespace-nowrap">{timeLeft}</span>
      </div>
    )
  }

  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex items-center gap-3 rounded-full border border-empire/30 bg-empire/[0.08] px-4 py-2 backdrop-blur-sm">
        <span className="text-sm">{promo.emoji}</span>
        <span className="text-sm font-semibold text-white">
          {label} {promo.discount}
        </span>
        <span className="text-xs text-neutral-400">—</span>
        <span className="text-[11px] text-neutral-400">{expireLabel}</span>
        <span className="font-mono text-sm font-bold tabular-nums text-empire">{timeLeft}</span>
      </div>
    </div>
  )
}
