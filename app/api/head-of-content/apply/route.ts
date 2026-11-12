import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createFolkPerson } from '@/lib/folk'
import { allowCandidateRequest, candidateSlackPayload, candidateSummary, deliverCandidateOnce, validateCandidate } from '@/lib/head-of-content'

export const runtime = 'nodejs'
export const maxDuration = 30
const ORIGINS = new Set(['https://empire-internet.com', 'https://www.empire-internet.com'])
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const development = process.env.NODE_ENV !== 'production'
  if (origin && !ORIGINS.has(origin) && !(development && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))) return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 })
  if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Format invalide.' }, { status: 415 })
  if (Number(req.headers.get('content-length') || 0) > 12000) return NextResponse.json({ error: 'Candidature trop longue.' }, { status: 413 })
  let body: unknown
  try {
    const raw = await req.text()
    if (raw.length > 12000) return NextResponse.json({ error: 'Candidature trop longue.' }, { status: 413 })
    body = JSON.parse(raw)
  } catch { return NextResponse.json({ error: 'Candidature invalide.' }, { status: 400 }) }
  const validation = validateCandidate(body)
  if ('honeypot' in validation) return NextResponse.json({ success: true })
  if ('error' in validation) return NextResponse.json(validation, { status: 400 })
  const token = process.env.ACADEMY_SLACK_BOT_TOKEN, channel = process.env.ACADEMY_SLACK_CHANNEL
  if (!token || !channel || !/^[CG][A-Z0-9]{8,}$/.test(channel)) {
    console.error('[head-of-content] Slack delivery is not configured')
    return NextResponse.json({ error: 'Les candidatures sont momentanément indisponibles. Réessaie dans un instant.' }, { status: 503 })
  }
  const ip = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!allowCandidateRequest(ip)) return NextResponse.json({ error: 'Trop de tentatives. Réessaie dans 15 minutes.' }, { status: 429, headers: { 'Retry-After': '900' } })
  const c = validation.candidate
  try {
    await deliverCandidateOnce(c, async () => {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateSlackPayload(c, channel)), signal: AbortSignal.timeout(12000),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok || result.ok !== true) {
        console.error('[head-of-content] Slack rejected delivery', res.status, String(result.error || 'invalid_response').slice(0, 80))
        throw new Error('delivery_failed')
      }
      // All answers are delivered to the private Slack channel before success.
      // Folk is a second copy; description also holds answers if note creation fails.
      // This intake deliberately does not start the paid Academy sales automation.
      waitUntil(createFolkPerson({
        firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone,
        urls: c.profileUrl ? [c.profileUrl] : [], description: candidateSummary(c), noteMarkdown: candidateSummary(c),
      }).then(person => { if (!person) console.error('[head-of-content] CRM backup failed', c.submissionId) })
        .catch(() => console.error('[head-of-content] CRM backup failed', c.submissionId)))
    })
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    if (err instanceof Error && err.message === 'submission_conflict') return NextResponse.json({ error: 'Cette candidature a déjà été envoyée. Recharge la page pour en créer une nouvelle.' }, { status: 409 })
    return NextResponse.json({ error: 'L’envoi n’a pas pu être confirmé. Tes réponses sont conservées dans le formulaire : réessaie dans un instant.' }, { status: 503 })
  }
}
