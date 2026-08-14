import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOrUpdateContact, addTagsToContact, ValidationError } from '@/lib/systemeio'
import { notifyLead } from '@/lib/lead-notify'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const SITUATION_LABEL: Record<string, string> = {
  salarie: 'Salarié',
  indep: 'Indépendant / freelance',
  etudiant: 'Étudiant',
  createur: 'Créateur de contenu',
  autre: 'Autre',
}

const CONTENT_LABEL: Record<string, string> = {
  jamais: 'Pas encore',
  parfois: 'De temps en temps',
  regulier: 'Régulièrement',
}

function parseTagIds(raw: string | undefined): number[] {
  if (!raw) return []
  return raw.split(',').map(Number).filter(Boolean)
}

/** English contacts get the `_EN` tag when it exists, else the base one. */
function localizedTagIds(baseKey: string, isEn: boolean): number[] {
  const localized = isEn ? parseTagIds(process.env[`${baseKey}_EN`]) : []
  return localized.length ? localized : parseTagIds(process.env[baseKey])
}

function emailFirstName(email: string): string {
  const local = email.split('@')[0] || 'Prospect'
  return local.replace(/[._+].*$/, '').slice(0, 40) || 'Prospect'
}

/**
 * Best-effort backup write to Supabase. Never throws - it only exists to keep an
 * ordered queue we can read positions from, so an outage must not block signup.
 */
async function backupToSupabase(args: {
  email: string
  firstName: string
  phone: string | null
  linkedin: string | null
  situation: string | null
  contentLevel: string | null
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
          phone: args.phone,
          linkedin: args.linkedin,
          situation: args.situation,
          content_level: args.contentLevel,
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
    } else {
      // Enrich partial signup with later answers (ignore empty overlays).
      const patch: Record<string, string | number | null> = {}
      if (args.firstName) patch.first_name = args.firstName
      if (args.phone) patch.phone = args.phone
      if (args.linkedin) patch.linkedin = args.linkedin
      if (args.situation) patch.situation = args.situation
      if (args.contentLevel) patch.content_level = args.contentLevel
      if (args.systemeContactId) patch.systeme_contact_id = args.systemeContactId
      if (Object.keys(patch).length) {
        await supabaseAdmin.from('academy_waitlist').update(patch).eq('id', row.id)
      }
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

async function parseJsonBody(req: NextRequest): Promise<Record<string, unknown>> {
  const text = await req.text()
  if (!text.trim()) return {}
  return JSON.parse(text) as Record<string, unknown>
}

export async function POST(req: NextRequest) {
  let body: {
    firstName?: string
    email?: string
    phone?: string
    linkedin?: string
    situation?: string
    contentLevel?: string
    lang?: string
    emp?: string
    /** true = step 1 only (email / coords). Still notifies Slack + Folk. */
    partial?: boolean
  }
  try {
    body = (await parseJsonBody(req)) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const phone = (body.phone || '').trim()
  const linkedin = (body.linkedin || '').trim()
  const situation = (body.situation || '').trim()
  const contentLevel = (body.contentLevel || '').trim()
  const isEn = body.lang === 'en'
  const lang = isEn ? 'en' : 'fr'
  const emp = body.emp?.trim() || null
  const partial = Boolean(body.partial)

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const firstName = (body.firstName || '').trim() || emailFirstName(email)

  if (phone && phone.replace(/\D/g, '').length < 8) {
    return NextResponse.json({ error: 'Téléphone invalide' }, { status: 400 })
  }
  if (situation && !SITUATION_LABEL[situation]) {
    return NextResponse.json({ error: 'Situation invalide' }, { status: 400 })
  }
  if (contentLevel && !CONTENT_LABEL[contentLevel]) {
    return NextResponse.json({ error: 'Niveau contenu invalide' }, { status: 400 })
  }

  const situationLabel = situation ? SITUATION_LABEL[situation] : ''
  const contentLabel = contentLevel ? CONTENT_LABEL[contentLevel] : ''
  const status = partial ? 'partial' : 'complete'

  try {
    const contact = await createOrUpdateContact({
      email,
      firstName,
      phoneNumber: phone || undefined,
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
      phone: phone || null,
      linkedin: linkedin || null,
      situation: situation || null,
      contentLevel: contentLevel || null,
      lang,
      systemeContactId: contact.id,
      emp,
      req,
    })

    // First touch → Slack + Folk. Later enrichment (after 3min flush) → silent DB only.
    await notifyLead({
      offer: 'academy',
      firstName,
      email,
      phone: phone || undefined,
      source: 'website-academy-waitlist',
      skipFolk: alreadyRegistered,
      skipWebhook: alreadyRegistered,
      fields: {
        status,
        lang,
        emp: emp || '',
        position: position ?? null,
        systemeContactId: contact.id,
        linkedin: linkedin || '',
        situation: situation || '',
        situationLabel: situationLabel || '',
        contentLevel: contentLevel || '',
        contentLabel: contentLabel || '',
        partial,
      },
      noteLines: [
        partial ? '- **Statut:** partiel (timer / abandon)' : '- **Statut:** candidature complète',
        phone ? `- **Tel:** ${phone}` : '',
        linkedin ? `- **LinkedIn:** ${linkedin}` : '',
        situationLabel ? `- **Situation:** ${situationLabel}` : '',
        contentLabel ? `- **Contenu:** ${contentLabel}` : '',
        `- **Lang:** ${lang}`,
        position != null ? `- **Position file:** #${position}` : '',
        emp ? `- **emp:** ${emp}` : '',
        `- **Systeme.io contact:** ${contact.id}`,
      ].filter(Boolean),
    }).catch((err) => console.error('[academy-waitlist] notifyLead', err))

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER

    // WhatsApp only once (first touch), to avoid double pings on enrichment.
    if (wahaUrl && notifyPhone && !alreadyRegistered) {
      const message =
        `🎓 ACADEMY - ${partial ? 'lead partiel' : 'candidature'}\n\n` +
        `👤 ${firstName}\n` +
        `📧 ${email}\n` +
        (phone ? `📱 ${phone}\n` : '') +
        (linkedin ? `🔗 ${linkedin}\n` : '') +
        (situationLabel ? `💼 ${situationLabel}\n` : '') +
        (contentLabel ? `🎬 Contenu: ${contentLabel}\n` : '') +
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
      partial,
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
