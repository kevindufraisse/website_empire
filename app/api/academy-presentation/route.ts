import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError, ContactLookupError } from '@/lib/systemeio'

export const runtime = 'nodejs'
export const maxDuration = 60

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Demande de la présentation PDF « Content Operator » depuis /academy.
// Le tag déclenche la séquence côté Systeme.io ; créé à la volée s'il manque.
const TAG = { name: 'PRESENTATION_CO_DEMANDEE', env: 'SYSTEMEIO_TAG_PRESENTATION_CO' } as const

export async function POST(req: NextRequest) {
  let body: { firstName?: string; email?: string; company?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Pot de miel : un robot remplit ce champ invisible.
  if (String(body.company || '').trim()) {
    return NextResponse.json({ success: true })
  }

  const email = String(body.email || '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }
  const firstName = String(body.firstName || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80)

  if (!process.env.SYSTEMEIO_API_KEY) {
    console.error('[academy-presentation] SYSTEMEIO_API_KEY manquante')
    return NextResponse.json({ error: 'Impossible d’enregistrer ton email. Réessaie.' }, { status: 503 })
  }

  // Le PDF s'ouvre tout de suite ; l'enregistrement finit après la réponse
  // (Systeme.io met ~17 s à retrouver un contact existant).
  waitUntil(saveLead(email, firstName))
  return NextResponse.json({ success: true })
}

async function saveLead(email: string, firstName: string) {
  const startedAt = Date.now()
  try {
    const contact = await createOrUpdateContact(
      { email, ...(firstName ? { firstName } : {}), locale: 'fr' },
      { lookupTimeoutMs: 40000 },
    )
    try {
      const tagId = Number(process.env[TAG.env]) || (await ensureTagByName(TAG.name))
      await addTagToContact(contact.id, tagId)
    } catch (tagErr) {
      console.error('[academy-presentation] tag', TAG.name, 'contact', contact.id, tagErr)
      return
    }
    console.log('[academy-presentation] ok', Date.now() - startedAt, 'ms')
  } catch (err) {
    if (err instanceof ValidationError) {
      console.warn('[academy-presentation] email refusé par Systeme.io', email, err.message)
      return
    }
    if (err instanceof ContactLookupError) {
      console.error('[academy-presentation] contact existant introuvable', email, err.message)
      return
    }
    console.error('[academy-presentation]', err)
  }
}
