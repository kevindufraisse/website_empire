import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateContact, addTagToContact, ValidationError } from '@/lib/systemeio'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const FALLBACK_INVITE =
  'https://join.slack.com/t/empire-community/shared_invite/zt-48r5is0lz-MiYTUfVBYgNymUbb56h_6g'
const COMMUNITY_TAG_ID = 2173710

async function inviteOnSlack(email: string): Promise<{
  invited: boolean
  inviteUrl: string
}> {
  const base = (process.env.WA_SETTER_API_URL || '').replace(/\/$/, '')
  const secret = process.env.WA_SETTER_SECRET
  if (!base || !secret) return { invited: false, inviteUrl: FALLBACK_INVITE }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    const resp = await fetch(`${base}/api/slack/community-email-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-wa-setter-secret': secret,
      },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    const data = (await resp.json().catch(() => ({}))) as {
      invited?: boolean
      inviteUrl?: string
    }
    return {
      invited: Boolean(data.invited),
      inviteUrl: data.inviteUrl || FALLBACK_INVITE,
    }
  } catch (err) {
    clearTimeout(timer)
    console.error('[community-join] slack invite', err)
    return { invited: false, inviteUrl: FALLBACK_INVITE }
  }
}

async function tagInSysteme(email: string, locale: string): Promise<number> {
  if (!process.env.SYSTEMEIO_API_KEY) {
    throw new Error('Systeme.io non configuré')
  }
  const contact = await createOrUpdateContact({ email, locale })
  const tagId = Number(process.env.SYSTEMEIO_TAG_COMMUNITY) || COMMUNITY_TAG_ID
  await addTagToContact(contact.id, tagId)
  return contact.id
}

export async function POST(req: NextRequest) {
  let body: { email?: string; company?: string; lang?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (String(body.company || '').trim()) {
    return NextResponse.json({ success: true, inviteUrl: FALLBACK_INVITE })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const lang = body.lang === 'en' ? 'en' : 'fr'
  const isEn = lang === 'en'

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: isEn ? 'Invalid email' : 'Email invalide' },
      { status: 400 },
    )
  }

  let contactId: number
  let slack: Awaited<ReturnType<typeof inviteOnSlack>>
  try {
    ;[contactId, slack] = await Promise.all([
      tagInSysteme(email, lang),
      inviteOnSlack(email),
    ])
  } catch (err) {
    if (err instanceof ValidationError) {
      console.warn('[community-join] systemeio validation', err.message)
      return NextResponse.json(
        { error: isEn ? 'Check your email.' : 'Vérifie ton email.' },
        { status: 400 },
      )
    }
    console.error('[community-join] systemeio', err)
    return NextResponse.json(
      { error: isEn ? 'Could not save your email. Try again.' : 'Impossible d’enregistrer ton email. Réessaie.' },
      { status: 503 },
    )
  }

  return NextResponse.json({
    success: true,
    contactId,
    invited: slack.invited,
    inviteUrl: slack.inviteUrl,
  })
}
