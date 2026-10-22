import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { hashEmail, sendCapiEvent } from '@/lib/metaCapi'

export const runtime = 'nodejs'

// Purchase n'est jamais accepté ici : il part du webhook Stripe uniquement.
const ALLOWED_EVENTS = new Set(['ViewContent', 'JPO_Watch50', 'CompleteRegistration', 'InitiateCheckout'])
const CUSTOM_KEYS = ['content_name', 'content_category', 'source', 'value', 'currency'] as const
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

// app.empire-internet.com envoie InitiateCheckout ici.
const ORIGIN_RE = /^https:\/\/([a-z0-9-]+\.)*empire-internet\.com$|^http:\/\/localhost(:\d+)?$/

function cors(origin: string | null): Record<string, string> {
  if (!origin || !ORIGIN_RE.test(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function str(v: unknown, max = 500): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get('origin')) })
}

export async function POST(req: NextRequest) {
  const headers = cors(req.headers.get('origin'))
  const body = await req.json().catch(() => null)
  const name = str(body?.event_name, 50)
  const eventId = str(body?.event_id, 100)
  if (!name || !ALLOWED_EVENTS.has(name) || !eventId) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400, headers })
  }

  const sourceUrl = str(body?.event_source_url, 1000)
  let eventSourceUrl: string | undefined
  try {
    if (sourceUrl && new URL(sourceUrl).hostname.endsWith('empire-internet.com')) eventSourceUrl = sourceUrl
  } catch {
    eventSourceUrl = undefined
  }

  const attr = (body?.attribution && typeof body.attribution === 'object' ? body.attribution : {}) as Record<string, unknown>
  const fbc = str(attr.fbc, 300)
  const fbp = str(attr.fbp, 300)

  const custom = (body?.custom_data && typeof body.custom_data === 'object' ? body.custom_data : {}) as Record<string, unknown>
  const customData: Record<string, string | number | undefined> = {}
  for (const k of CUSTOM_KEYS) {
    const v = custom[k]
    if (typeof v === 'number' && Number.isFinite(v)) customData[k] = v
    else customData[k] = str(v, 200)
  }
  for (const k of UTM_KEYS) customData[k] = str(attr[k], 200)

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined

  waitUntil(
    sendCapiEvent({
      event_name: name,
      event_id: eventId,
      event_source_url: eventSourceUrl,
      user_data: {
        client_ip_address: ip,
        client_user_agent: str(req.headers.get('user-agent'), 500),
        fbc: fbc?.startsWith('fb.') ? fbc : undefined,
        fbp: fbp?.startsWith('fb.') ? fbp : undefined,
        em: hashEmail(str(body?.email, 200)),
      },
      custom_data: customData,
    }),
  )

  return NextResponse.json({ ok: true }, { headers })
}
