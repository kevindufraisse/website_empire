export const revenueBands = [
  { minimum: 0, fr: 'Moins de 100 000 €', en: 'Under €100,000' },
  { minimum: 100_000, fr: 'De 100 000 € à moins de 300 000 €', en: '€100,000 to under €300,000' },
  { minimum: 300_000, fr: 'De 300 000 € à moins de 500 000 €', en: '€300,000 to under €500,000' },
  { minimum: 500_000, fr: 'De 500 000 € à moins de 1 million d’euros', en: '€500,000 to under €1 million' },
  { minimum: 1_000_000, fr: '1 million d’euros ou plus', en: '€1 million or more' },
] as const

export type RevenueBand = typeof revenueBands[number]
export type RequestKind = 'legende' | 'consultation'

export function requestKind(band: RevenueBand): RequestKind {
  return band.minimum >= 300_000 ? 'legende' : 'consultation'
}

type Application = {
  submissionId: string
  revenueBand: RevenueBand
  kind: RequestKind
  name: string
  email: string
  project: string
}
const trim = (value: unknown) => typeof value === 'string' ? value.trim() : ''

export function readApplication(body: unknown): Application | 'bot' | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const data = body as Record<string, unknown>
  if (trim(data.website)) return 'bot'
  const submissionId = trim(data.submissionId)
  const revenueBand = revenueBands.find(band => band.minimum === data.revenueBand)
  const name = trim(data.name), email = trim(data.email).toLowerCase(), project = trim(data.project)
  if (!revenueBand || data.kind !== requestKind(revenueBand)) return null
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(submissionId)) return null
  if (!name || name.length > 100 || /[\r\n]/.test(name) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  if (!project || project.length > 1200) return null
  return { submissionId, kind: requestKind(revenueBand), revenueBand, name, email, project }
}

export function legendeSlackMessage(application: Application, channel: string) {
  const annual = application.kind === 'legende'
  const title = annual ? 'Légende · Candidature à examiner' : 'Better Call Kevin · Demande de conseil'
  const details = [
    application.name + '\n' + application.email,
    'CA HT déclaré · 12 derniers mois\n' + application.revenueBand.fr,
    ...(annual ? [] : ['Séance demandée · 30 minutes à 500 €']),
    application.project,
  ]
  return {
    channel, client_msg_id: application.submissionId,
    text: title, mrkdwn: false, unfurl_links: false, unfurl_media: false,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title } },
      ...details.map(text => ({ type: 'section', text: { type: 'plain_text', text, emoji: false } })),
    ],
  }
}
