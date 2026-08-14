/**
 * Unified lead fan-out: Make webhook (+ Slack) + Folk CRM.
 * Always includes `offer`: academy | empire | legende
 */

import { createFolkPerson } from '@/lib/folk'

export type LeadOffer = 'academy' | 'empire' | 'legende'

export type LeadNotifyInput = {
  offer: LeadOffer
  firstName: string
  email: string
  phone?: string
  /** Extra fields forwarded to Make / Slack */
  fields?: Record<string, unknown>
  /** Markdown note body for Folk (without the offer header) */
  noteLines?: string[]
  source?: string
  /** Skip Folk create (e.g. enrichment after a partial signup). */
  skipFolk?: boolean
  /** Skip Make/Slack (enrichment only — avoids double pings). */
  skipWebhook?: boolean
}

const OFFER_LABEL: Record<LeadOffer, string> = {
  academy: 'ACADEMY',
  empire: 'EMPIRE',
  legende: 'LEGENDE',
}

function webhookUrl() {
  return (
    process.env.CALLBACK_WEBHOOK_URL ||
    'https://hook.eu1.make.com/kte7swdmp4hvdqe06hnq43nv3h1w9qnt'
  )
}

export async function notifyLead(input: LeadNotifyInput): Promise<void> {
  const offer = input.offer
  const firstName = String(input.firstName || '').trim()
  const email = String(input.email || '').trim()
  const phone = input.phone ? String(input.phone).trim() : ''
  const source = input.source || `website-${offer}`
  const timestamp = new Date().toISOString()

  // Never ping Make/Slack without an email — avoids empty webhook bundles.
  if (!email) {
    console.warn('[lead-notify] skip — missing email', { offer, source })
    return
  }

  const payload = {
    offer,
    offerLabel: OFFER_LABEL[offer],
    firstName,
    email,
    phone: phone || undefined,
    timestamp,
    source,
    ...(input.fields || {}),
  }

  // 1) Make → Slack
  if (!input.skipWebhook) {
    const url = webhookUrl()
    if (url) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.error('[lead-notify] webhook failed', offer, err))
    }
  }

  // 2) Folk
  if (input.skipFolk) return

  const noteMarkdown = [
    `## Lead ${OFFER_LABEL[offer]} (site)`,
    '',
    `- **Offre:** ${offer}`,
    ...(input.noteLines || []),
    `- **source:** ${source}`,
  ].join('\n')

  await createFolkPerson({
    firstName,
    email,
    phone: phone || undefined,
    description: `${OFFER_LABEL[offer]} - ${new Date().toLocaleDateString('fr-FR')}`,
    noteMarkdown,
  }).catch((err) => console.error('[lead-notify] folk failed', offer, err))
}
