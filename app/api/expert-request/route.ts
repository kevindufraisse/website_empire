import { NextRequest, NextResponse } from 'next/server'

/**
 * Option « Expert Empire Partners » de /tarifs (29 octobre 2026) : relais vers
 * le serveur de l'app (`src/lib/expertRequest.cjs`), qui enregistre la demande,
 * compte les places du mois et prévient Marc par email. Le navigateur ne peut
 * pas appeler ce serveur directement (CORS), d'où ce relais côté serveur.
 */

const API_URL = (process.env.EMPIRE_API_URL || 'https://graab.me').replace(/\/$/, '')

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/expert-request/availability`, { cache: 'no-store' })
    const data = res.ok ? await res.json() : null
    return NextResponse.json({ total: data?.total ?? null, left: data?.left ?? null })
  } catch {
    return NextResponse.json({ total: null, left: null })
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.EXPERT_REQUEST_SECRET
  if (!secret) return NextResponse.json({ error: 'Demande impossible pour le moment' }, { status: 503 })
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
  const pick = (key: string, max: number) => String(body[key] ?? '').trim().slice(0, max)
  const email = pick('email', 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }
  try {
    const res = await fetch(`${API_URL}/api/expert-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': secret },
      body: JSON.stringify({ email, name: pick('name', 120), phone: pick('phone', 40), plan: pick('plan', 40) }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return NextResponse.json({ error: data.error || 'Demande impossible pour le moment' }, { status: res.status })
    return NextResponse.json({ ok: true, waitlist: Boolean(data.waitlist) })
  } catch {
    return NextResponse.json({ error: 'Demande impossible pour le moment' }, { status: 502 })
  }
}
