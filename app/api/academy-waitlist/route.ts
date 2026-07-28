import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOrUpdateContact, addTagsToContact, ValidationError } from '@/lib/systemeio'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function parseTagIds(raw: string | undefined): number[] {
  if (!raw) return []
  return raw.split(',').map(Number).filter(Boolean)
}

/** English contacts get the `_EN` tag when it exists, else the base one. */
function localizedTagIds(baseKey: string, isEn: boolean): number[] {
  const localized = isEn ? parseTagIds(process.env[`${baseKey}_EN`]) : []
  return localized.length ? localized : parseTagIds(process.env[baseKey])
}

/**
 * Best-effort backup write to Supabase. Never throws — it only exists to keep an
 * ordered queue we can read positions from, so an outage must not block signup.
 */
async function backupToSupabase(args: {
  email: string
  firstName: string
  lang: string
  systemeContactId: number | null
  emp: string | null
  req: NextRequest
}): Promise<{ position: number | null; alreadyRegistered: boolean }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !serviceKey) return { position: null, alreadyRegistered: false }

  try {
    const supabaseAdmin = createClient(url, serviceKey)

    // Re-submitting keeps the original queue position.
    const { data: existing } = await supabaseAdmin
      .from('academy_waitlist')
      .select('id, created_at')
      .eq('email', args.email)
      .maybeSingle()

    let row = existing

    if (!row) {
      const { data, error } = await supabaseAdmin
        .from('academy_waitlist')
        .insert({
          first_name: args.firstName,
          email: args.email,
          lang: args.lang,
          source: 'academy_waitlist',
          systeme_contact_id: args.systemeContactId,
          emp: args.emp,
          user_agent: args.req.headers.get('user-agent'),
          ip: args.req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        })
        .select('id, created_at')
        .single()

      if (error) throw error
      row = data
    }

    const { count } = await supabaseAdmin
      .from('academy_waitlist')
      .select('id', { count: 'exact', head: true })
      .lte('created_at', row!.created_at)

    return { position: count ?? null, alreadyRegistered: !!existing }
  } catch (err) {
    console.error('[POST /api/academy-waitlist] supabase backup failed', err)
    return { position: null, alreadyRegistered: false }
  }
}

export async function POST(req: NextRequest) {
  let body: { firstName?: string; email?: string; lang?: string; emp?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const firstName = (body.firstName || '').trim()
  const email = (body.email || '').trim().toLowerCase()
  const isEn = body.lang === 'en'
  const lang = isEn ? 'en' : 'fr'
  const emp = body.emp?.trim() || null

  if (!firstName) {
    return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  try {
    const contact = await createOrUpdateContact({
      email,
      firstName,
      locale: lang,
    })

    const tagIds = [
      ...localizedTagIds('SYSTEMEIO_TAG_ACADEMY_WAITLIST', isEn),
      ...parseTagIds(
        isEn ? process.env.SYSTEMEIO_TAG_LANG_EN : process.env.SYSTEMEIO_TAG_LANG_FR,
      ),
    ]

    if (tagIds.length) {
      await addTagsToContact(contact.id, tagIds)
    }

    const { position, alreadyRegistered } = await backupToSupabase({
      email,
      firstName,
      lang,
      systemeContactId: contact.id,
      emp,
      req,
    })

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER

    if (wahaUrl && notifyPhone && !alreadyRegistered) {
      const message =
        `🎓 ACADEMY — liste d'attente\n\n` +
        `👤 ${firstName}\n` +
        `📧 ${email}\n` +
        (position ? `🪧 #${position} dans la file\n` : '') +
        `🕐 ${new Date().toLocaleString('fr-FR')}`

      await fetch(`${wahaUrl}/api/sendText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `${notifyPhone}@c.us`,
          text: message,
          session: wahaSession,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      contactId: contact.id,
      position,
      alreadyRegistered,
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      console.warn('[POST /api/academy-waitlist] email rejected by systeme.io', email)
      return NextResponse.json(
        {
          error: isEn
            ? "This email address doesn't seem to exist. Check for a typo."
            : "Cette adresse email semble ne pas exister. Vérifiez qu'il n'y a pas de faute.",
        },
        { status: 400 },
      )
    }
    console.error('[POST /api/academy-waitlist] systemeio failed', err)
    return NextResponse.json({ error: 'Erreur serveur, réessaie.' }, { status: 500 })
  }
}
