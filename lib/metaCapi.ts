import { createHash } from 'crypto'

/**
 * Envoi Conversions API au pixel Empire. Token dans META_CAPI_TOKEN (Vercel),
 * META_TEST_EVENT_CODE rempli = tout part dans « Événements de test ».
 */

const GRAPH_URL = 'https://graph.facebook.com/v21.0'

export const META_PIXEL_ID =
  process.env.META_PIXEL_ID?.trim() || process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '4393289187663371'

export type CapiEvent = {
  event_name: string
  event_id: string
  event_time?: number
  event_source_url?: string
  action_source?: 'website'
  user_data: Record<string, string | string[] | undefined>
  custom_data?: Record<string, string | number | undefined>
}

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex')

export function hashEmail(email?: string | null): string | undefined {
  const clean = (email || '').trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) ? sha256(clean) : undefined
}

/** Meta veut l'indicatif sans « + » ni zéros : 06… (France) devient 336…. */
export function hashPhone(phone?: string | null): string | undefined {
  let digits = (phone || '').replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.length === 10 && digits.startsWith('0')) digits = `33${digits.slice(1)}`
  return digits.length >= 8 ? sha256(digits) : undefined
}

export async function sendCapiEvent(event: CapiEvent): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const token = process.env.META_CAPI_TOKEN?.trim()
  if (!token) {
    console.warn('[meta-capi] META_CAPI_TOKEN manquant, événement ignoré:', event.event_name)
    return { ok: false, skipped: true }
  }

  const userData = Object.fromEntries(Object.entries(event.user_data).filter(([, v]) => v))
  const customData = event.custom_data
    ? Object.fromEntries(Object.entries(event.custom_data).filter(([, v]) => v !== undefined && v !== ''))
    : undefined

  const body = new URLSearchParams({
    data: JSON.stringify([
      {
        event_name: event.event_name,
        event_id: event.event_id,
        event_time: event.event_time ?? Math.floor(Date.now() / 1000),
        action_source: event.action_source ?? 'website',
        event_source_url: event.event_source_url,
        user_data: userData,
        ...(customData ? { custom_data: customData } : {}),
      },
    ]),
    access_token: token,
  })
  const testCode = process.env.META_TEST_EVENT_CODE?.trim()
  if (testCode) body.set('test_event_code', testCode)

  try {
    const res = await fetch(`${GRAPH_URL}/${META_PIXEL_ID}/events`, { method: 'POST', body })
    if (!res.ok) {
      const error = await res.text()
      console.error('[meta-capi]', event.event_name, res.status, error)
      return { ok: false, error }
    }
    return { ok: true }
  } catch (err) {
    console.error('[meta-capi]', event.event_name, err)
    return { ok: false, error: String(err) }
  }
}
