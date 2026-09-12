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
  /** Skip Make/Slack (enrichment only - avoids double pings). */
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

function trimUrlToken(raw: string): string {
  return raw
    .trim()
    .replace(/^[<(["']+/, '')
    .replace(/[>)\]"',;.!?]+$/, '')
}

function extractUrls(raw: string): string[] {
  if (!raw) return []

  const seen = new Set<string>()
  const out: string[] = []

  const push = (candidate: string) => {
    const cleaned = trimUrlToken(candidate)
    const normalized = normalizeFolkUrl(cleaned)
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    out.push(normalized)
  }

  const fromHttp = raw.match(/https?:\/\/[^\s<>"']+/gi) || []
  for (const candidate of fromHttp) push(candidate)

  // Also support plain domains pasted from chat (without scheme)
  const fromBareDomains = raw.match(/\b(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s<>"']*)?/gi) || []
  for (const candidate of fromBareDomains) push(candidate)

  return out
}

function collectProfileUrls(fields?: Record<string, unknown>): string[] {
  if (!fields) return []
  const keys = [
    'linkedin',
    'instagram',
    'youtube',
    'tiktok',
    'url',
    'social_link',
    'socialLink',
    'links',
    'message',
    'text',
  ]
  const seen = new Set<string>()
  const out: string[] = []
  for (const key of keys) {
    for (const normalized of extractUrls(strField(fields, key))) {
      if (seen.has(normalized)) continue
      seen.add(normalized)
      out.push(normalized)
    }
  }

  // Fallback: scan additional text-like fields without touching unrelated keys.
  if (!out.length) {
    for (const [key, value] of Object.entries(fields)) {
      if (!/(url|link|message|text|caption|post)/i.test(key)) continue
      if (typeof value !== 'string') continue
      for (const normalized of extractUrls(value)) {
        if (seen.has(normalized)) continue
        seen.add(normalized)
        out.push(normalized)
      }
    }
  }

  return out
}

type SocialKind = 'linkedin' | 'instagram' | 'tiktok' | 'youtube_short' | 'youtube' | 'other'

type SocialDetection = {
  kind: SocialKind
  key: string
  checkLabel?: string
  shortId?: string
}

type SocialSignals = {
  checks: string[]
  platforms: string[]
  duplicateYouTubeShortIds: string[]
}

function hostWithoutWww(urlObj: URL): string {
  return urlObj.hostname.toLowerCase().replace(/^www\./, '')
}

function classifySocialUrl(url: string): SocialDetection {
  try {
    const urlObj = new URL(url)
    const host = hostWithoutWww(urlObj)
    const path = urlObj.pathname.replace(/\/+$/, '')
    const parts = path.split('/').filter(Boolean)

    if (host.includes('linkedin.com') || host === 'lnkd.in') {
      const slug = parts[0] || host
      return {
        kind: 'linkedin',
        key: `linkedin:${slug.toLowerCase()}`,
        checkLabel: 'OK LinkedIn',
      }
    }

    if (host.includes('instagram.com') || host === 'instagr.am') {
      const slug = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : parts[0] || host
      return {
        kind: 'instagram',
        key: `instagram:${slug.toLowerCase()}`,
        checkLabel: 'OK Instagram',
      }
    }

    if (host.includes('tiktok.com')) {
      const slug =
        parts.length >= 3 && parts[1] === 'video'
          ? `${parts[0]}/video/${parts[2]}`
          : parts.join('/') || host
      return {
        kind: 'tiktok',
        key: `tiktok:${slug.toLowerCase()}`,
        checkLabel: 'OK TikTok',
      }
    }

    if ((host === 'youtube.com' || host === 'm.youtube.com') && parts[0] === 'shorts' && parts[1]) {
      const shortId = parts[1].toLowerCase()
      return {
        kind: 'youtube_short',
        key: `youtube-short:${shortId}`,
        checkLabel: 'OK YouTube Short',
        shortId,
      }
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
      const videoId =
        host === 'youtu.be'
          ? parts[0]
          : urlObj.searchParams.get('v') || (parts[0] === 'embed' ? parts[1] : null)

      if (videoId) {
        return {
          kind: 'youtube',
          key: `youtube:${videoId.toLowerCase()}`,
          checkLabel: 'OK YouTube',
        }
      }
    }
  } catch {
    // URL already normalized upstream; best effort only.
  }

  return { kind: 'other', key: url }
}

function buildSocialSignals(urls: string[]): SocialSignals {
  const checks: string[] = []
  const platforms = new Set<string>()
  const seen = new Set<string>()
  const duplicateYouTubeShortIds = new Set<string>()

  for (const url of urls) {
    const detection = classifySocialUrl(url)
    if (detection.kind === 'other') continue

    if (seen.has(detection.key)) {
      if (detection.kind === 'youtube_short' && detection.shortId) {
        duplicateYouTubeShortIds.add(detection.shortId)
      }
      continue
    }

    seen.add(detection.key)
    platforms.add(detection.kind)
    if (detection.checkLabel) checks.push(detection.checkLabel)
  }

  return {
    checks,
    platforms: [...platforms],
    duplicateYouTubeShortIds: [...duplicateYouTubeShortIds],
  }
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
  const profileUrls = collectProfileUrls(fields)
  const socialSignals = buildSocialSignals(profileUrls)

  // Never ping Make/Slack without an email - avoids empty webhook bundles.
  if (!email) {
    console.warn('[lead-notify] skip - missing email', { offer, source })
    return
  }

  if (socialSignals.checks.length) {
    console.log('[lead-notify] social links detected', {
      offer,
      source,
      checks: socialSignals.checks,
      totalUrls: profileUrls.length,
    })
  }

  if (socialSignals.duplicateYouTubeShortIds.length) {
    console.log('[lead-notify] duplicate YouTube short ignored (direct reaction kept)', {
      offer,
      source,
      duplicates: socialSignals.duplicateYouTubeShortIds,
    })
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
    socialChecks: socialSignals.checks.join(' | '),
    socialPlatforms: socialSignals.platforms.join(','),
    socialLinksCount: profileUrls.length,
    duplicateYouTubeShortIds: socialSignals.duplicateYouTubeShortIds.join(','),
    directShortReaction: socialSignals.duplicateYouTubeShortIds.length > 0,
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
    phone ? `- **Tel:** ${phone}` : '',
    profileUrls[0] ? `- **LinkedIn / URL:** ${profileUrls[0]}` : '',
    socialSignals.checks.length ? `- **Checks liens:** ${socialSignals.checks.join(' · ')}` : '',
    socialSignals.duplicateYouTubeShortIds.length
      ? `- **Shorts dupliqués ignorés:** ${socialSignals.duplicateYouTubeShortIds.join(', ')} (réaction directe conservée)`
      : '',
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
