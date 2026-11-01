import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, ValidationError } from '@/lib/systemeio'

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
  try {
    const contact = await createOrUpdateContact({ email, locale: body.locale === 'en' ? 'en' : 'fr' }, { lookupTimeoutMs: 40000 })
    const configured = Number(process.env.SYSTEMEIO_TAG_HOME_GATE)
    const tagId = Number.isSafeInteger(configured) && configured > 0 ? configured : HOME_GATE_TAG
    await addTagToContact(contact.id, tagId)
    // Acknowledge registration only after the workflow tag has been applied.
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[home-masterclass] Registration failed', error instanceof Error ? error.name : 'UnknownError')
    return NextResponse.json({ code: error instanceof ValidationError ? 'invalid_fields' : 'unavailable' }, { status: error instanceof ValidationError ? 400 : 502 })
  }
}
