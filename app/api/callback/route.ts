import { NextResponse } from 'next/server'
import { notifyLead, type LeadOffer } from '@/lib/lead-notify'

function resolveOffer(raw: unknown): LeadOffer {
  const v = String(raw || '').toLowerCase()
  if (v === 'academy') return 'academy'
  if (v === 'empire') return 'empire'
  if (v === 'legende' || v === 'legend' || v === 'autopilot') return 'legende'
  return 'legende'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, email, phone, budget, emp, status, statut, offer: offerRaw } = body

    // budget optional: YtLeadForm doesn't always send it
    if (!firstName || !email || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const resolvedStatut = statut || status || 'no_booking'
    const offer = resolveOffer(offerRaw)

    await notifyLead({
      offer,
      firstName: String(firstName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      source: 'website-callback-form',
      fields: {
        budget: budget || '',
        emp: emp || '',
        status: resolvedStatut,
        statut: resolvedStatut,
      },
      noteLines: [
        budget ? `- **Budget:** ${budget}` : '',
        `- **Statut RDV:** ${resolvedStatut}`,
        emp ? `- **emp:** ${emp}` : '',
      ].filter(Boolean),
    })

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER

    const isBooked = resolvedStatut === 'RDV confirmé'

    if (wahaUrl && notifyPhone && !isBooked) {
      const message =
        `🔔 Lead ${offer.toUpperCase()} (pas de RDV booké)\n\n` +
        `👤 ${firstName}\n` +
        `📧 ${email}\n` +
        `📱 ${phone}\n` +
        (budget ? `💰 Budget: ${budget}\n` : '') +
        `🏷 Offre: ${offer}\n` +
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

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
