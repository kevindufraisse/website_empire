import { countryPhone } from './legende-phone'
import { normalizeCandidatePhone } from './candidate-phone'
import { revenueBands, requestKind, type RevenueBand, scopes, timings, decisions } from './legende'

const text = (v: unknown) => typeof v === 'string' ? v.trim() : ''
const has = <T extends object>(options: T, key: unknown): key is Extract<keyof T, string> =>
  typeof key === 'string' && Object.prototype.hasOwnProperty.call(options, key)

export type Outcome = 'legende' | 'review' | 'alternative' | 'consultation'
export function readIntake(data: Record<string, unknown>) {
  if (text(data.website)) return 'bot'
  const submissionId = text(data.submissionId)
  const name = text(data.name), email = text(data.email).toLowerCase()
  const phone = data.phoneCountry === undefined ? normalizeCandidatePhone(text(data.phone)) : countryPhone(text(data.phone), data.phoneCountry)?.number
  const goal = text(data.goal), obstacle = text(data.obstacle), tried = text(data.tried)
  const { scope, timing, decision, action } = data
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(submissionId)) return null
  if (!name || name.length > 100 || /[\r\n]/.test(name) || !phone || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  if (![goal, obstacle, tried].every(s => s.length > 0 && s.length <= 800)) return null
  if (!has(scopes, scope) || !has(timings, timing) || (action !== 'apply' && action !== 'consultation')) return null

  let revenueBand: RevenueBand | undefined
  let decisionLabel: string | undefined
  let company: string | undefined
  let kind: Outcome = 'review'
  if (scope !== 'personal') {
    company = text(data.company)
    if (!company || company.length > 140 || !has(decisions, decision)) return null
    decisionLabel = decisions[decision].fr
    if (data.revenueBand !== 'unknown') {
      revenueBand = revenueBands.find(band => band.minimum === data.revenueBand)
      if (!revenueBand) return null
      kind = requestKind(revenueBand) === 'legende' ? 'legende' : 'alternative'
    }
  }
  if (action === 'consultation') {
    if (kind !== 'alternative') return null
    kind = 'consultation'
  }
  return { submissionId, name, email, phone, scope, goal, obstacle, tried, timing, company, decisionLabel, revenueBand, kind }
}

type Intake = Exclude<ReturnType<typeof readIntake>, null | 'bot'>

const titles: Record<Outcome, string> = {
  legende: 'Légende · Appel proposé',
  review: 'Légende · À examiner pour un rappel',
  alternative: 'Légende · Orienté vers Better Call Kevin',
  consultation: 'Better Call Kevin · Séance à 500 € demandée',
}

export function intakeSlackMessage(a: Intake, channel: string) {
  const title = titles[a.kind]
  const details = [
    [a.name, a.email, a.phone].join('\n'),
    [scopes[a.scope].fr, a.company, a.decisionLabel].filter(Boolean).join('\n'),
    'Objectif\n' + a.goal,
    'Blocage actuel\n' + a.obstacle,
    'Déjà essayé et résultat\n' + a.tried,
    'Démarrage souhaité\n' + timings[a.timing].fr,
    ...(a.scope === 'personal' ? [] : ['CA HT sur les 12 derniers mois\n' + (a.revenueBand?.fr ?? 'Inconnu')]),
  ]
  return { channel, client_msg_id: a.submissionId, text: title, mrkdwn: false, unfurl_links: false, unfurl_media: false,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title } },
      ...details.map(value => ({ type: 'section', text: { type: 'plain_text', text: value, emoji: false } })),
    ] }
}
