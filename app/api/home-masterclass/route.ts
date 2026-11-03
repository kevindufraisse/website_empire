import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError, ContactLookupError } from '@/lib/systemeio'

export const runtime = 'nodejs'
export const maxDuration = 120

// L'automatisation d'envoi de la masterclass dans Systeme.io est attachée au
// tag « empire_home_gate » (id 2179856). Ne pas utiliser les tags VSL ou démo.
const HOME_GATE_TAG = 2179856
const HOME_GATE_TAG_NAME = 'empire_home_gate'
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

  // Réponse immédiate : l'inscription Systeme.io (parfois 15 à 40 s pour un
  // contact existant) se termine après la réponse. L'email part via
  // l'automatisation Systeme.io déclenchée par le tag.
  waitUntil(register(email, body.locale === 'en' ? 'en' : 'fr').catch(() => {}))
  return NextResponse.json({ success: true })
}

async function register(email: string, locale: 'fr' | 'en') {
  const startedAt = Date.now()
  try {
    const contact = await createOrUpdateContact({ email, locale }, { lookupTimeoutMs: 60000 })
    const configured = Number(process.env.SYSTEMEIO_TAG_HOME_GATE)
    const tagId = Number.isSafeInteger(configured) && configured > 0 ? configured : HOME_GATE_TAG
    try {
      await addTagToContact(contact.id, tagId)
    } catch (tagErr) {
      // Id introuvable ou changé : on retrouve le tag par son nom.
      console.error('[home-masterclass] tag id', tagId, 'failed, retrying by name', tagErr)
      await addTagToContact(contact.id, await ensureTagByName(HOME_GATE_TAG_NAME))
    }
    console.log('[home-masterclass] ok', Date.now() - startedAt, 'ms')
  } catch (error) {
    if (error instanceof ValidationError) console.warn('[home-masterclass] email refusé par Systeme.io', error.message)
    else if (error instanceof ContactLookupError) console.error('[home-masterclass] contact existant introuvable, tag non posé', error)
    else console.error('[home-masterclass] registration failed', error)
    throw error
  }
}
