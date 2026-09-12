import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, ensureTagByName, ValidationError } from '@/lib/systemeio'
import { notifyLead } from '@/lib/lead-notify'
import { startWaSetterConversation } from '@/lib/wa-setter'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const COMMUNITY_TAG_ID = 2173710
const COMMUNITY_LIVE_TAG_ID = 2173711
const TRUNK_ZERO: Record<string, number> = { '33': 9, '32': 9, '41': 9, '44': 10 }

function toWhatsAppPhone(countryCode: string, raw: string): string {
  const original = String(raw || '').trim()
  if (!original) return ''
  const hadPlus = original.startsWith('+') || original.startsWith('00')
  let p = original.replace(/[^\d+]/g, '')
  if (p.startsWith('00')) p = p.slice(2)
  if (p.startsWith('+')) p = p.slice(1)
  if (!hadPlus && p.startsWith('0') && p.length === 10) p = `33${p.slice(1)}`
  const cc = countryCode.replace(/\D/g, '')
  if (!hadPlus && cc && !p.startsWith(cc)) {
    let national = p
    if (national.startsWith('0')) national = national.slice(1)
    p = `${cc}${national}`
  }
  for (const [code, digits] of Object.entries(TRUNK_ZERO)) {
    if (p.startsWith(`${code}0`) && p.length === code.length + 1 + digits) {
      return code + p.slice(code.length + 1)
    }
  }
  return p
}

export async function POST(req: NextRequest) {
  let body: {
    firstName?: string
    email?: string
    phone?: string
    countryCode?: string
    lang?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const firstName = String(body.firstName || '').trim().slice(0, 40)
  const email = String(body.email || '').trim().toLowerCase()
  const lang = body.lang === 'en' ? 'en' : 'fr'
  const isEn = lang === 'en'
  const phone = toWhatsAppPhone(body.countryCode || '+33', body.phone || '')

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: isEn ? 'Missing details' : 'Il manque des infos' },
      { status: 400 },
    )
  }
  const name = firstName || email.split('@')[0] || 'Prospect'
  if (!phone || phone.length < 8) {
    return NextResponse.json(
      { error: isEn ? 'Invalid phone number' : 'Numéro invalide' },
      { status: 400 },
    )
  }

  if (!process.env.SYSTEMEIO_API_KEY) {
    return NextResponse.json({ error: 'Systeme.io non configuré' }, { status: 503 })
  }

  try {
    const contact = await createOrUpdateContact({
      email,
      firstName: name,
      phoneNumber: `+${phone}`,
      locale: lang,
    })
    const slackTag = Number(process.env.SYSTEMEIO_TAG_COMMUNITY) || COMMUNITY_TAG_ID || await ensureTagByName('community_slack')
    const liveTag = Number(process.env.SYSTEMEIO_TAG_COMMUNITY_LIVE) || COMMUNITY_LIVE_TAG_ID || await ensureTagByName('community_live')
    await addTagToContact(contact.id, slackTag)
    await addTagToContact(contact.id, liveTag)
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: isEn ? 'Check your email.' : 'Vérifie ton email.' },
        { status: 400 },
      )
    }
    console.error('[community-live] systemeio', err)
    return NextResponse.json(
      { error: isEn ? 'Could not save your number.' : 'Impossible d’enregistrer le numéro.' },
      { status: 500 },
    )
  }

  await notifyLead({
    offer: 'empire',
    firstName: name,
    email,
    phone,
    source: 'website-community',
    fields: {
      status: 'live_hebdo',
      lang,
    },
    noteLines: [
      '- **Source:** communauté Slack /communaute',
      '- **Oui au live hebdo** — voir quel plan',
      `- **Tel:** ${phone}`,
    ],
  }).catch((err) => console.error('[community-live] notifyLead', err))

  await startWaSetterConversation({
    phone,
    firstName: name,
    source: 'website-community',
    lang,
    lead: {
      email,
      wantLive: 'oui — live hebdo avec Kevin pour créer du contenu et voir le plan',
      intent: 'live communauté',
      situation: "vient d'entrer dans la communauté Slack",
    },
  })

  return NextResponse.json({ success: true })
}
