/**
 * Unified lead fan-out: Make webhook (+ Slack) + Folk CRM.
 * Always includes `offer`: academy | empire | legende
 */

import { createFolkPerson, normalizeFolkUrl } from '@/lib/folk'

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

function strField(fields: Record<string, unknown> | undefined, key: string): string {
  const v = fields?.[key]
  if (v == null || v === '') return ''
  return String(v).trim()
}

function collectProfileUrls(fields?: Record<string, unknown>): string[] {
  if (!fields) return []
  const keys = ['linkedin', 'instagram', 'youtube', 'url', 'social_link', 'socialLink']
  const seen = new Set<string>()
  const out: string[] = []
  for (const key of keys) {
    const normalized = normalizeFolkUrl(strField(fields, key))
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized)
      out.push(normalized)
    }
  }
  return out
}

function buildFolkDescription(offer: LeadOffer, fields?: Record<string, unknown>): string {
  const parts = [OFFER_LABEL[offer]]
  const status = strField(fields, 'status')
  const partial = fields?.partial === true
  if (status === 'complete' || status === 'partial') {
    parts.push(status === 'partial' ? 'partiel' : 'complet')
  } else if (partial) {
    parts.push('partiel')
  }
  const situation = strField(fields, 'situationLabel') || strField(fields, 'situation')
  if (situation) parts.push(situation)
  parts.push(new Date().toLocaleDateString('fr-FR'))
  return parts.join(' · ')
}

export async function notifyLead(input: LeadNotifyInput): Promise<void> {
  const offer = input.offer
  const firstName = String(input.firstName || '').trim()
  const email = String(input.email || '').trim()
  const phone = input.phone ? String(input.phone).trim() : ''
  const source = input.source || `website-${offer}`
  const timestamp = new Date().toISOString()
  const fields = input.fields || {}

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
    ...fields,
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

  const profileUrls = collectProfileUrls(fields)
  const noteMarkdown = [
    `## Lead ${OFFER_LABEL[offer]} (site)`,
    '',
    `- **Offre:** ${offer}`,
    phone ? `- **Tel:** ${phone}` : '',
    profileUrls[0] ? `- **LinkedIn / URL:** ${profileUrls[0]}` : '',
    ...(input.noteLines || []),
    `- **Source:** ${source}`,
    `- **Date:** ${new Date().toLocaleString('fr-FR')}`,
  ]
    .filter(Boolean)
    .join('\n')

  await createFolkPerson({
    firstName,
    email,
    phone: phone || undefined,
    urls: profileUrls,
    description: buildFolkDescription(offer, fields),
    noteMarkdown,
  }).catch((err) => console.error('[lead-notify] folk failed', offer, err))
}
