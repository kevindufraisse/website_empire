/**
 * Systeme.io public API client.
 * Docs: https://developer.systeme.io/reference/api
 *
 * Authentication: header `X-API-Key`.
 * Base URL: https://api.systeme.io/api
 *
 * Notes:
 * - All env vars are read at call time (never at module load) so Next.js
 *   doesn't crash at build if they're missing in some environments.
 * - All functions are server-only (do not import from a client component).
 */

const API_BASE = 'https://api.systeme.io/api'

function getApiKey(): string | null {
  return process.env.SYSTEMEIO_API_KEY || null
}

function authHeaders(): HeadersInit {
  const key = getApiKey()
  if (!key) throw new Error('SYSTEMEIO_API_KEY missing')
  return {
    'Content-Type': 'application/json',
    'X-API-Key': key,
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  { retries = 2, timeoutMs = 8000 }: { retries?: number; timeoutMs?: number } = {},
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: { ...authHeaders(), ...(init.headers || {}) },
        signal: controller.signal,
      })
      clearTimeout(timer)

      // 409 = contact already exists with that email — not an error for us.
      if (res.status === 409) {
        const text = await res.text().catch(() => '')
        throw new ConflictError(text || 'conflict')
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`systeme.io ${res.status} on ${path}: ${text}`)
      }

      // 204 = no content
      if (res.status === 204) return undefined as T
      return (await res.json()) as T
    } catch (err) {
      clearTimeout(timer)
      lastError = err
      if (err instanceof ConflictError) throw err
      if (attempt === retries) break
      await new Promise(r => setTimeout(r, 250 * (attempt + 1)))
    }
  }
  throw lastError
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SystemeContactPayload {
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  locale?: string
  /** Custom fields defined in your Systeme.io account, by `slug`. */
  fields?: Array<{ slug: string; value: string }>
}

export interface SystemeContact {
  id: number
  email: string
  firstName?: string
  lastName?: string
  locale?: string
}

export interface SystemeTag {
  id: number
  name: string
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Create a contact, or return the existing one if the email already exists.
 * Systeme.io returns 409 on duplicates — we resolve it via a list lookup.
 */
export async function createOrUpdateContact(
  payload: SystemeContactPayload,
): Promise<SystemeContact> {
  try {
    return await request<SystemeContact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    if (err instanceof ConflictError) {
      const existing = await findContactByEmail(payload.email)
      if (existing) return existing
    }
    throw err
  }
}

export async function findContactByEmail(email: string): Promise<SystemeContact | null> {
  const params = new URLSearchParams({ email })
  const data = await request<{ items: SystemeContact[] }>(
    `/contacts?${params.toString()}`,
    { method: 'GET' },
  )
  return data.items?.[0] ?? null
}

export async function addTagToContact(contactId: number, tagId: number): Promise<void> {
  await request<void>(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tagId }),
  })
}

export async function addTagsToContact(
  contactId: number,
  tagIds: number[],
): Promise<void> {
  // Sequential — Systeme.io rate limits parallel writes per contact.
  for (const tagId of tagIds) {
    if (!tagId || Number.isNaN(tagId)) continue
    try {
      await addTagToContact(contactId, tagId)
    } catch (err) {
      console.error('[systemeio] addTag failed', { contactId, tagId, err })
    }
  }
}

export async function listAllTags(): Promise<SystemeTag[]> {
  const all: SystemeTag[] = []
  let page = 1
  // Defensive cap so we never loop forever.
  while (page <= 50) {
    const data = await request<{ items: SystemeTag[] }>(`/tags?page=${page}`)
    if (!data.items?.length) break
    all.push(...data.items)
    if (data.items.length < 25) break
    page++
  }
  return all
}
