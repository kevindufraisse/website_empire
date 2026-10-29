import { NextResponse } from 'next/server'

/**
 * Offre du live sur /tarifs (29 octobre 2026) : relais vers le serveur de
 * l'app (`src/lib/liveOffer.cjs`, POST /api/live-offer/visit), qui tient la
 * fenêtre de 72 h par email en base. Même appel que la page de l'app : la
 * première visite ouvre la fenêtre. Le navigateur ne peut pas appeler ce
 * serveur directement (CORS).
 */

const API_URL = (process.env.EMPIRE_API_URL || 'https://graab.me').replace(/\/$/, '')

export async function POST(req: Request) {
  let email = ''
  try {
    const body = await req.json()
    email = String(body?.email || '').trim().toLowerCase().slice(0, 200)
  } catch {
    return NextResponse.json({ state: 'need_email' }, { status: 400 })
  }
  try {
    const res = await fetch(`${API_URL}/api/live-offer/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    })
    const data = await res.json().catch(() => null)
    if (!res.ok || !data) return NextResponse.json({ state: data?.state || 'error' }, { status: res.status === 400 ? 400 : 502 })
    return NextResponse.json({
      state: data.state,
      email: data.email,
      deadline: data.deadline ?? null,
      serverNow: data.serverNow ?? null,
      extension: data.extension ?? null,
    })
  } catch {
    return NextResponse.json({ state: 'error' }, { status: 502 })
  }
}
