import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError } from '@/lib/systemeio'

export const runtime = 'nodejs'
export const maxDuration = 120

// Capture only: this tag is separate from the workshop and booking workflows.
const DEMO_TAG = 'empire-demo-requested'
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
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!firstName || firstName.length > 100 || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ code: 'invalid_fields' }, { status: 400 })
  }
  if (!process.env.SYSTEMEIO_API_KEY) {
    return NextResponse.json({ code: 'unavailable' }, { status: 503 })
  }

  try {
    const tagId = await ensureTagByName(DEMO_TAG)
    const contact = await createOrUpdateContact({ firstName, email, locale: body.locale === 'en' ? 'en' : 'fr' }, { lookupTimeoutMs: 40000 })
    await addTagToContact(contact.id, tagId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[demo-email] Capture failed', error instanceof Error ? error.name : 'UnknownError')
    return NextResponse.json({ code: error instanceof ValidationError ? 'invalid_fields' : 'unavailable' }, { status: error instanceof ValidationError ? 400 : 503 })
  }
}
