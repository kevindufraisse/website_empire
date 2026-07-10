'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const STORAGE_KEY = 'empire_promo'
const DEADLINE_HOURS = 23
const DEADLINE_EXTRA_MIN_RANGE = [12, 47] as const

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

function getOrCreateDeadline(promoId: string): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.promoId === promoId) {
        if (Date.now() > data.deadline) return null
        return data.deadline
      }
    }
    const extraMin =
      DEADLINE_EXTRA_MIN_RANGE[0] +
      Math.floor(Math.random() * (DEADLINE_EXTRA_MIN_RANGE[1] - DEADLINE_EXTRA_MIN_RANGE[0] + 1))
    const deadline = Date.now() + DEADLINE_HOURS * 3600_000 + extraMin * 60_000
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ promoId, deadline }))
    return deadline
  } catch {
    return Date.now() + DEADLINE_HOURS * 3600_000
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

export default function EvergreenPromo() {
  const { lang } = useLanguage()
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [promo, setPromo] = useState<Promo | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const currentPromo = getSeasonalPromo(new Date())
    const deadline = getOrCreateDeadline(currentPromo.id)
    if (!deadline) {
      setReady(true)
      return
    }
    setPromo(currentPromo)

    const tick = () => {
      const remaining = deadline - Date.now()
      if (remaining <= 0) {
        setTimeLeft(null)
        setPromo(null)
        return
      }
      setTimeLeft(formatTime(remaining))
    }
    tick()
    setReady(true)
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!ready || !promo || !timeLeft) return null

  const label = lang === 'fr' ? promo.labelFr : promo.labelEn
  const expireLabel = lang === 'fr' ? 'Expire dans' : 'Expires in'

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
