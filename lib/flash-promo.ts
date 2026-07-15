// Promo flash par visiteur — deadline persistée côté app Empire (table
// promo_deadlines : fingerprint + IP + email) via l'edge function promo-status.
// Le rapprochement par IP garde le même compte à rebours entre le site
// marketing et app.empire-internet.com.

export const FLASH_PROMO_ID = 'scale499'
export const PROMO_STATUS_URL = 'https://aaaaktbefgvyokfrzrmb.supabase.co/functions/v1/promo-status'

const FP_KEY = 'empire_fp'

export function getBrowserFingerprint(): string {
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

export interface FlashPromoStatus {
  deadline: string
  expired: boolean
  promo: { plan: string; promoMonthly: number; baseMonthly: number }
}

export async function fetchFlashPromo(): Promise<FlashPromoStatus | null> {
  try {
    const res = await fetch(PROMO_STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promoId: FLASH_PROMO_ID, fingerprint: getBrowserFingerprint() }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.deadline) return null
    return data as FlashPromoStatus
  } catch {
    return null
  }
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
