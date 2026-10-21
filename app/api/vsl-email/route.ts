import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError, ContactLookupError } from '@/lib/systemeio'

export const runtime = 'nodejs'
export const maxDuration = 60

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TAGS = {
  empire: { name: 'vsl-video', env: 'SYSTEMEIO_TAG_VSL' },
  academy: { name: 'academy-vsl', env: 'SYSTEMEIO_TAG_ACADEMY_VSL' },
} as const

// Email demandé avant la vidéo : /vsl (tunnel Empire, tag « vsl-video ») et
// /partenaire (tunnel Academy, tag « academy-vsl »). Tag créé à la volée s'il manque.
export async function POST(req: NextRequest) {
  let body: { email?: string; company?: string; funnel?: string }
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

  // Systeme.io met ~17 s à retrouver un contact existant : la vidéo s'ouvre
  // tout de suite, l'enregistrement finit après la réponse.
  const tag = body.funnel === 'academy' ? TAGS.academy : TAGS.empire
  waitUntil(saveLead(email, tag))
  return NextResponse.json({ success: true })
}

async function saveLead(email: string, tag: (typeof TAGS)[keyof typeof TAGS]) {
  const startedAt = Date.now()
  try {
    const contact = await createOrUpdateContact({ email, locale: 'fr' })
    try {
      const tagId = Number(process.env[tag.env]) || (await ensureTagByName(tag.name))
      await addTagToContact(contact.id, tagId)
    } catch (tagErr) {
      console.error('[vsl-email] tag', tag.name, 'contact', contact.id, tagErr)
      return
    }
    console.log('[vsl-email] ok', tag.name, Date.now() - startedAt, 'ms')
  } catch (err) {
    if (err instanceof ValidationError) {
      console.warn('[vsl-email] email refusé par Systeme.io', email, err.message)
    } else if (err instanceof ContactLookupError) {
      console.error('[vsl-email] contact existant, tag non posé', err)
    } else {
      console.error('[vsl-email] systemeio', err)
    }
  }
}
