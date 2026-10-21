import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError } from '@/lib/systemeio'

export const runtime = 'nodejs'

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

  try {
    const contact = await createOrUpdateContact({ email, locale: 'fr' })
    const tag = body.funnel === 'academy' ? TAGS.academy : TAGS.empire
    // Le contact est enregistré : un tag raté ne doit pas bloquer la vidéo.
    try {
      const tagId = Number(process.env[tag.env]) || (await ensureTagByName(tag.name))
      await addTagToContact(contact.id, tagId)
    } catch (tagErr) {
      console.error('[vsl-email] tag', tag.name, 'contact', contact.id, tagErr)
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: 'Vérifie ton email.' }, { status: 400 })
    }
    console.error('[vsl-email] systemeio', err)
    return NextResponse.json({ error: 'Impossible d’enregistrer ton email. Réessaie.' }, { status: 503 })
  }
}
