import { NextResponse } from 'next/server'
import { notifyLead } from '@/lib/lead-notify'
import {
  startWaSetterConversation,
  labelFrequency,
  labelStats,
  labelSkill,
  labelNetworks,
} from '@/lib/wa-setter'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      intent,
      frequency,
      contentStats,
      contentSkill,
      networks,
      linkedin,
      instagram,
      youtube,
      emp,
      lang,
    } = body

    if (!firstName || !email || !phone || !intent) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const intentLabels: Record<string, string> = {
      delegate: 'Déléguer sa marque personnelle à un expert',
      career: 'Se reconvertir en expert en viralité',
      grow: 'Utiliser le système pour développer sa marque personnelle',
    }
    const intentLabel = intentLabels[String(intent)] || String(intent)
    const networksList = Array.isArray(networks) ? networks.join(', ') : String(networks || '')
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

    await notifyLead({
      offer: 'empire',
      firstName: fullName,
      email: String(email).trim(),
      phone: String(phone).trim(),
      source: 'website-empire-apply',
      fields: {
        intent: intentLabel,
        frequency: frequency || '',
        contentStats: contentStats || '',
        contentSkill: contentSkill || '',
        networks: networksList,
        linkedin: linkedin || '',
        instagram: instagram || '',
        youtube: youtube || '',
        emp: emp || '',
        auditBonus: '15min',
      },
      noteLines: [
        `- **Objectif:** ${intentLabel}`,
        frequency ? `- **Frequence publication:** ${frequency}` : '',
        contentStats ? `- **Stats / mois:** ${contentStats}` : '',
        contentSkill ? `- **A l'aise contenu:** ${contentSkill}` : '',
        networksList ? `- **Reseaux:** ${networksList}` : '',
        linkedin ? `- **LinkedIn:** ${linkedin}` : '',
        instagram ? `- **Instagram:** ${instagram}` : '',
        youtube ? `- **YouTube:** ${youtube}` : '',
        `- **Bonus:** 15 min audit si selectionne`,
        emp ? `- **emp:** ${emp}` : '',
      ].filter(Boolean),
    })

    await startWaSetterConversation({
      phone: String(phone).trim(),
      firstName: fullName,
      source: 'website-empire-apply',
      lang: typeof lang === 'string' ? lang : 'fr',
      lead: {
        email: String(email).trim(),
        intent: intentLabel,
        frequency: frequency ? labelFrequency(frequency) : '',
        contentStats: contentStats ? labelStats(contentStats) : '',
        contentSkill: contentSkill ? labelSkill(contentSkill) : '',
        networks: networks ? labelNetworks(networks) : '',
        linkedin,
        instagram,
        youtube,
      },
    })

    const wahaUrl = process.env.WAHA_API_URL
    const wahaSession = process.env.WAHA_SESSION || 'default'
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER

    if (wahaUrl && notifyPhone) {
      const message =
        `📩 EMPIRE candidature\n\n` +
        `👤 ${fullName}\n` +
        `📧 ${email}\n` +
        `📱 ${phone}\n` +
        `🎯 Objectif: ${intentLabel}\n` +
        (frequency ? `📡 Fréquence: ${frequency}\n` : '') +
        (contentStats ? `📊 Stats: ${contentStats}\n` : '') +
        (contentSkill ? `🎬 Contenu: ${contentSkill}\n` : '') +
        (networksList ? `🌐 Réseaux: ${networksList}\n` : '') +
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
