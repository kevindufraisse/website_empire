import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName,
      email,
      phone,
      hoursPerWeek,
      contentSkill,
      alreadyPublishing,
      emp,
    } = body

    if (!firstName || !email || !phone || !hoursPerWeek || !contentSkill) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const webhookUrl =
      process.env.CALLBACK_WEBHOOK_URL ||
      'https://hook.eu1.make.com/kte7swdmp4hvdqe06hnq43nv3h1w9qnt'

    const payload = {
      firstName,
      email,
      phone,
      hoursPerWeek,
      contentSkill,
      alreadyPublishing: alreadyPublishing || '',
      emp: emp || '',
      timestamp: new Date().toISOString(),
      source: 'empire-application',
      offer: 'empire',
    }

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
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
        `⏱ Temps/semaine: ${hoursPerWeek}\n` +
        `🎬 Contenu: ${contentSkill}\n` +
        (alreadyPublishing ? `📡 Publie déjà: ${alreadyPublishing}\n` : '') +
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
