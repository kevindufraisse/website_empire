import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError } from '@/lib/systemeio'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const VSL_TAG = 'vsl-video'

// Email demandé après 5 min de vidéo sur /vsl. Le contact part dans
// Systeme.io avec le tag « vsl-video » (créé à la volée s'il manque).
export async function POST(req: NextRequest) {
  let body: { email?: string; company?: string }
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

  if (!process.env.SYSTEMEIO_API_KEY) {
    console.error('[vsl-email] SYSTEMEIO_API_KEY manquante')
    return NextResponse.json({ error: 'Impossible d’enregistrer ton email. Réessaie.' }, { status: 503 })
  }

  try {
    const contact = await createOrUpdateContact({ email, locale: 'fr' })
    const tagId = Number(process.env.SYSTEMEIO_TAG_VSL) || (await ensureTagByName(VSL_TAG))
    await addTagToContact(contact.id, tagId)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: 'Vérifie ton email.' }, { status: 400 })
    }
    console.error('[vsl-email] systemeio', err)
    return NextResponse.json({ error: 'Impossible d’enregistrer ton email. Réessaie.' }, { status: 503 })
  }
}
