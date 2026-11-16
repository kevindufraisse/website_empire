import { NextRequest, NextResponse } from 'next/server'
import { allowCandidateRequest, deliverCandidateOnce } from '@/lib/head-of-content'
import { legendeSlackMessage, readApplication } from '@/lib/legende'
import { intakeSlackMessage, readIntake } from '@/lib/legende-intake'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const error = (status: number) => NextResponse.json({ success: false }, { status })
  const origin = req.headers.get('origin')
  const allowedOrigins = ['https://www.empire-internet.com', 'https://empire-internet.com', req.nextUrl.origin]
  if (origin && !allowedOrigins.includes(origin)) return error(403)
  if (!req.headers.get('content-type')?.includes('application/json')) return error(415)
  if (Number(req.headers.get('content-length') || 0) > 12000) return error(413)
  let data: unknown
  try {
    const raw = await req.text()
    if (raw.length > 12000) return error(413)
    data = JSON.parse(raw)
  } catch { return error(400) }

  const body = data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null
  if (body?.version !== undefined && body.version !== 2) return error(400)
  const application = body?.version === 2 ? readIntake(body) : readApplication(data)
  if (!application) return error(400)
  if (application === 'bot') return NextResponse.json(body?.version === 2 ? { success: true, kind: 'review' } : { success: true })
  const token = process.env.ACADEMY_SLACK_BOT_TOKEN
  const channel = process.env.LEGENDE_SLACK_CHANNEL || process.env.ACADEMY_SLACK_CHANNEL
  if (!token || !channel || !/^[CG][A-Z0-9]{8,}$/.test(channel)) {
    console.error('[legende] Slack is not configured')
    return error(503)
  }
  const ip = req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for') || 'unknown'
  if (!allowCandidateRequest('legende:' + ip.split(',')[0].trim())) return error(429)

  try {
    await deliverCandidateOnce(application, async () => {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify('phone' in application ? intakeSlackMessage(application, channel) : legendeSlackMessage(application, channel)),
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok || (await res.json()).ok !== true) throw new Error('delivery_failed')
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'submission_conflict') return error(409)
    console.error('[legende] Slack delivery not confirmed')
    return error(503)
  }

  const booking = application.kind === 'consultation' ? process.env.BETTER_CALL_KEVIN_BOOKING_URL : undefined
  let bookingUrl: string | undefined
  if (booking) {
    try {
      const url = new URL(booking)
      if (url.protocol === 'https:' && !url.username && !url.password) bookingUrl = url.href
    } catch { /* A consultation can still be arranged by email. */ }
  }
  return NextResponse.json({ success: true, kind: application.kind, bookingUrl })
}
