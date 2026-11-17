import { NextRequest, NextResponse } from 'next/server'
import { allowCandidateRequest, deliverCandidateOnce } from '@/lib/head-of-content'
import { contactSlackMessage, readContact } from '@/lib/legende-flow'

export const runtime = 'nodejs'
export const maxDuration = 30

/** Étape 1 de la candidature 1-to-1 : on garde le contact même si la personne s'arrête là. */
export async function POST(req: NextRequest) {
  const error = (status: number) => NextResponse.json({ success: false }, { status })
  const origin = req.headers.get('origin')
  const allowedOrigins = ['https://www.empire-internet.com', 'https://empire-internet.com', req.nextUrl.origin]
  if (origin && !allowedOrigins.includes(origin)) return error(403)
  if (!req.headers.get('content-type')?.includes('application/json')) return error(415)
  let data: unknown
  try {
    const raw = await req.text()
    if (raw.length > 4000) return error(413)
    data = JSON.parse(raw)
  } catch { return error(400) }
  const body = data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null
  const contact = body ? readContact(body) : null
  if (!contact) return error(400)
  if (contact === 'bot') return NextResponse.json({ success: true })
  const token = process.env.ACADEMY_SLACK_BOT_TOKEN
  const channel = process.env.LEGENDE_SLACK_CHANNEL || process.env.ACADEMY_SLACK_CHANNEL
  if (!token || !channel || !/^[CG][A-Z0-9]{8,}$/.test(channel)) {
    console.error('[legende] Slack is not configured')
    return error(503)
  }
  const ip = req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for') || 'unknown'
  if (!allowCandidateRequest('legende-contact:' + ip.split(',')[0].trim())) return error(429)
  try {
    await deliverCandidateOnce(contact, async () => {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(contactSlackMessage(contact, channel)),
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok || (await res.json()).ok !== true) throw new Error('delivery_failed')
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'submission_conflict') return error(409)
    console.error('[legende] contact delivery not confirmed')
    return error(503)
  }
  return NextResponse.json({ success: true })
}
