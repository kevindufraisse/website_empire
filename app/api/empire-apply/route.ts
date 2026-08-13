import { NextResponse } from 'next/server'
import { notifyLead } from '@/lib/lead-notify'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName,
      email,
      phone,
      frequency,
      contentStats,
      contentSkill,
      networks,
      linkedin,
      instagram,
      youtube,
      emp,
    } = body

    if (!firstName || !email || !phone || !frequency || !contentSkill) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const networksList = Array.isArray(networks) ? networks.join(', ') : String(networks || '')

    await notifyLead({
      offer: 'empire',
      firstName: String(firstName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      source: 'website-empire-apply',
      fields: {
        frequency,
        contentStats: contentStats || '',
        contentSkill,
        networks: networksList,
        linkedin: linkedin || '',
        instagram: instagram || '',
        youtube: youtube || '',
        emp: emp || '',
        auditBonus: '15min',
      },
      noteLines: [
        `- **Frequence publication:** ${frequency}`,
        `- **Stats / mois:** ${contentStats || 'n/a'}`,
        `- **A l'aise contenu:** ${contentSkill}`,
        `- **Reseaux:** ${networksList || 'n/a'}`,
        linkedin ? `- **LinkedIn:** ${linkedin}` : '',
        instagram ? `- **Instagram:** ${instagram}` : '',
        youtube ? `- **YouTube:** ${youtube}` : '',
        `- **Bonus:** 15 min audit si selectionne`,
        emp ? `- **emp:** ${emp}` : '',
      ].filter(Boolean),
    })

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER

    if (wahaUrl && notifyPhone) {
      const message =
        `📩 EMPIRE candidature\n\n` +
        `👤 ${firstName}\n` +
        `📧 ${email}\n` +
        `📱 ${phone}\n` +
        `📡 Fréquence: ${frequency}\n` +
        `📊 Stats: ${contentStats || 'n/a'}\n` +
        `🎬 Contenu: ${contentSkill}\n` +
        `🌐 Réseaux: ${networksList || 'n/a'}\n` +
        (linkedin ? `🔗 LinkedIn: ${linkedin}\n` : '') +
        (instagram ? `📸 IG: ${instagram}\n` : '') +
        (youtube ? `▶️ YT: ${youtube}\n` : '') +
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
