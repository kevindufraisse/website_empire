import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOrUpdateContact, addTagsToContact } from '@/lib/systemeio'

export const runtime = 'nodejs'

interface WebinarBody {
  prenom?: string
  email?: string
  telephone?: string
  ref?: string
  problematique?: string
}

const REF_TAG_MAP: Record<string, string | undefined> = {
  marc: process.env.SYSTEMEIO_TAG_WEBINAR_MARC,
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
  problematique: string
  systemeContactId: number
  source: string
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
          problematique: args.problematique || null,
          source: args.source,
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
  const ref = (body.ref || '').trim().toLowerCase()
  const problematique = (body.problematique || '').trim()

  if (!prenom) {
    return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const source = ref ? `webinar_${ref}` : 'webinar_methode_gourou'
  console.log(`[POST /api/webinar] ref="${ref}" source="${source}" email="${email}"`)


  try {
    const contact = await createOrUpdateContact({
      email,
      firstName: prenom,
      phoneNumber: telephone || undefined,
      locale: 'fr',
    })

    const refTagEnv = ref ? REF_TAG_MAP[ref] : undefined
    const baseTagEnv = process.env.SYSTEMEIO_TAG_WEBINAR
    const allTagIds: number[] = []

    if (baseTagEnv) {
      allTagIds.push(...baseTagEnv.split(',').map(Number).filter(Boolean))
    }
    if (refTagEnv) {
      allTagIds.push(...refTagEnv.split(',').map(Number).filter(Boolean))
    }

    if (allTagIds.length) {
      await addTagsToContact(contact.id, allTagIds)
    }

    await backupToSupabase({
      email,
      prenom,
      telephone,
      problematique,
      systemeContactId: contact.id,
      source,
      req,
    })

    return NextResponse.json({ success: true, contactId: contact.id })
  } catch (err) {
    console.error('[POST /api/webinar] systemeio failed', err)
    return NextResponse.json({ error: 'Erreur serveur, réessaie.' }, { status: 500 })
  }
}
