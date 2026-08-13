import { NextResponse } from 'next/server'
import { createFolkPerson } from '@/lib/folk'

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

    const webhookUrl =
      process.env.CALLBACK_WEBHOOK_URL ||
      'https://hook.eu1.make.com/kte7swdmp4hvdqe06hnq43nv3h1w9qnt'

    const payload = {
      firstName,
      email,
      phone,
      frequency,
      contentStats: contentStats || '',
      contentSkill,
      networks: networksList,
      linkedin: linkedin || '',
      instagram: instagram || '',
      youtube: youtube || '',
      emp: emp || '',
      timestamp: new Date().toISOString(),
      source: 'empire-application',
      offer: 'empire',
      auditBonus: '15min',
    }

    await createFolkPerson({
      firstName: String(firstName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      description: `Candidature Empire - ${new Date().toLocaleDateString('fr-FR')}`,
      noteMarkdown: [
        '## Candidature Empire (site)',
        '',
        `- **Frequence publication:** ${frequency}`,
        `- **Stats / mois:** ${contentStats || 'n/a'}`,
        `- **A l'aise contenu:** ${contentSkill}`,
        `- **Reseaux:** ${networksList || 'n/a'}`,
        linkedin ? `- **LinkedIn:** ${linkedin}` : '',
        instagram ? `- **Instagram:** ${instagram}` : '',
        youtube ? `- **YouTube:** ${youtube}` : '',
        `- **Bonus:** 15 min audit si selectionne`,
        emp ? `- **emp:** ${emp}` : '',
        `- **source:** website /postuler`,
      ]
        .filter(Boolean)
        .join('\n'),
    }).catch((err) => console.error('[empire-apply] folk', err))

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    }

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER

    if (wahaUrl && notifyPhone) {
      const message =
        `📩 Candidature Empire\n\n` +
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
