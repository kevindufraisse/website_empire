import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOrUpdateContact, addTagsToContact } from '@/lib/systemeio'

export const runtime = 'nodejs'

interface WebinarBody {
  prenom?: string
  email?: string
  telephone?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/**
 * Best-effort backup write to Supabase. Never throws - failures are logged
 * and ignored so the user response isn't blocked by a backup outage.
 */
async function backupToSupabase(args: {
  email: string
  prenom: string
  telephone: string
  systemeContactId: number
  req: NextRequest
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !serviceKey) return

  try {
    const supabaseAdmin = createClient(url, serviceKey)
    const { error } = await supabaseAdmin
      .from('webinar_leads')
      .upsert(
        {
          email: args.email,
          first_name: args.prenom,
          phone: args.telephone || null,
          source: 'webinar_methode_gourou',
          systeme_contact_id: args.systemeContactId,
          user_agent: args.req.headers.get('user-agent'),
          ip: args.req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        },
        { onConflict: 'email,source', ignoreDuplicates: false },
      )
    if (error) console.error('[POST /api/webinar] supabase upsert failed', error)
  } catch (err) {
    console.error('[POST /api/webinar] supabase backup failed', err)
  }
}

export async function POST(req: NextRequest) {
  let body: WebinarBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const prenom = (body.prenom || '').trim()
  const telephone = (body.telephone || '').trim()

  if (!prenom) {
    return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  try {
    const contact = await createOrUpdateContact({
      email,
      firstName: prenom,
      phoneNumber: telephone || undefined,
      locale: 'fr',
    })

    const tagEnv = process.env.SYSTEMEIO_TAG_WEBINAR
    if (tagEnv) {
      const tagIds = tagEnv.split(',').map(Number).filter(Boolean)
      if (tagIds.length) {
        await addTagsToContact(contact.id, tagIds)
      }
    }

    await backupToSupabase({
      email,
      prenom,
      telephone,
      systemeContactId: contact.id,
      req,
    })

    return NextResponse.json({ success: true, contactId: contact.id })
  } catch (err) {
    console.error('[POST /api/webinar] systemeio failed', err)
    return NextResponse.json({ error: 'Erreur serveur, réessaie.' }, { status: 500 })
  }
}
