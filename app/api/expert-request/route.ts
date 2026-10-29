import { NextResponse } from 'next/server'

/**
 * Option « Expert Empire Partners » du panier de /tarifs (29 octobre 2026) :
 * les places du mois, lues sur le serveur de l'app (`src/lib/expertRequest.cjs`).
 * La demande elle-même part au retour du paiement, depuis l'app. Le navigateur
 * ne peut pas appeler ce serveur directement (CORS), d'où ce relais.
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
