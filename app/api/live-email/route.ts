import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, findContactByEmail } from '@/lib/systemeio'

export const runtime = 'nodejs'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const TAG_ID = Number(process.env.SYSTEMEIO_TAG_WEBINAR) || 2017685

  try {
    const contact = await createOrUpdateContact({ email, locale: 'fr' })

    try {
      await addTagToContact(contact.id, TAG_ID)
    } catch (tagErr) {
      console.error('[POST /api/live-email] tag already present or failed', tagErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/live-email] failed', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
