/**
 * AddCal.co API client (v1.0.0).
 * Docs: https://addcal.co/docs
 *
 * Authentication: Bearer token in `Authorization` header.
 * Base URL: https://addcal.co
 *
 * All functions are server-only - do not import from a client component.
 */

const API_BASE = 'https://addcal.co'

function getApiKey(): string | null {
  return process.env.ADDCAL_API_KEY || null
}

function authHeaders(): HeadersInit {
  const key = getApiKey()
  if (!key) throw new Error('ADDCAL_API_KEY missing')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${key}`,
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  { timeoutMs = 10000 }: { timeoutMs?: number } = {},
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers || {}) },
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`addcal ${res.status} on ${path}: ${text}`)
    }

    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddCalCreatePayload {
  title: string
  /** Format: `YYYY-MM-DD HH:mm:ss`. */
  date_start: string
  date_end: string
  timezone?: string
  description?: string
  location?: string
  is_virtual?: boolean
  is_all_day?: boolean
  organiser_name?: string
  organiser_email?: string
  /** Minutes before the event when the reminder fires. */
  reminder_before?: number
  busy_type?: 'busy' | 'free'
  short_link?: string
  internal_name?: string
  calendar_uid?: string
  calendar_name?: string
}

export interface AddCalEvent {
  uid: string
  public_id: string
  calendar_uid: string
  short_link: string | null
  title: string
  description: string | null
  location: string | null
  date_start: string
  date_end: string
  timezone: string | null
  /** Public link to the event landing page (Google/Apple/Outlook/…). */
  public_url: string
  internal_name?: string | null
}

export interface AddCalEventResponse {
  data: AddCalEvent
  links: {
    event_page: string
    google: string
    apple: string
    outlook: string
    outlook_web: string
    yahoo: string
    office365: string
    ics: string
    manual: string
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Creates an event in AddCal. Returns the event data plus a `links` object
 * with platform-specific "Add to Calendar" URLs (Google, Apple, Outlook…).
 */
export async function createEvent(
  payload: AddCalCreatePayload,
): Promise<AddCalEventResponse> {
  return request<AddCalEventResponse>('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
