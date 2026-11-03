import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createOrUpdateContact, addTagToContact } from '@/lib/systemeio'

export const runtime = 'nodejs'
export const maxDuration = 120

// Restore the existing homepage tag. The delivery automation in Systeme.io
// must be attached to empire_home_gate; do not use the VSL or demo-request tags.
const HOME_GATE_TAG = 2179856
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    const input = await req.json()
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid body')
    body = input
  } catch {
    return NextResponse.json({ code: 'invalid_fields' }, { status: 400 })
  }
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ success: true })
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ code: 'invalid_fields' }, { status: 400 })
  }
  if (!process.env.SYSTEMEIO_API_KEY) {
    return NextResponse.json({ code: 'unavailable' }, { status: 503 })
  }
  // Answer at once: Systeme.io can take up to 40 s to find an existing contact.
  // The contact and the empire_home_gate tag are saved after the response.
  waitUntil(register(email, body.locale === 'en' ? 'en' : 'fr'))
  return NextResponse.json({ success: true })
}

async function register(email: string, locale: 'fr' | 'en') {
  try {
    const contact = await createOrUpdateContact({ email, locale }, { lookupTimeoutMs: 40000 })
    const configured = Number(process.env.SYSTEMEIO_TAG_HOME_GATE)
    const tagId = Number.isSafeInteger(configured) && configured > 0 ? configured : HOME_GATE_TAG
    await addTagToContact(contact.id, tagId)
  } catch (error) {
    console.error('[home-masterclass] Registration failed', error instanceof Error ? error.name : 'UnknownError')
  }
}
