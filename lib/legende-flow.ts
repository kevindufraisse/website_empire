import { countryPhone } from './legende-phone'
import { revenueBands, timings, type RevenueBand } from './legende'

/**
 * Candidature 1-to-1 en fenêtre, façon iClosed : les coordonnées partent dès l'étape 1
 * (contact enregistré même si la personne abandonne), le projet à l'étape 2, puis le calendrier.
 */
export const plans = {
  kevin: { fr: 'Avec Kevin · 4 500 €/mois', en: 'With Kevin · €4,500/month' },
  hoc: { fr: 'Avec un Head of Content · 1 000 à 3 000 €/mois', en: 'With a Head of Content · €1,000 to €3,000/month' },
  unsure: { fr: 'Je ne sais pas encore', en: 'Not sure yet' },
}
export type PlanId = keyof typeof plans
export type FlowOutcome = 'legende' | 'review' | 'alternative'

const text = (v: unknown) => typeof v === 'string' ? v.trim() : ''
const UUID = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
const has = <T extends object>(options: T, key: unknown): key is Extract<keyof T, string> =>
  typeof key === 'string' && Object.prototype.hasOwnProperty.call(options, key)

function readPerson(data: Record<string, unknown>) {
  const firstName = text(data.firstName), lastName = text(data.lastName), email = text(data.email).toLowerCase()
  const phone = countryPhone(text(data.phone), data.phoneCountry)?.number
  const name = (v: string) => v.length > 0 && v.length <= 60 && !/[\r\n]/.test(v)
  if (!name(firstName) || !name(lastName) || !phone || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return { firstName, lastName, email, phone }
}

/** Étape 1 : prénom, nom, téléphone, e-mail. */
export function readContact(data: Record<string, unknown>) {
  if (text(data.website)) return 'bot' as const
  const submissionId = text(data.submissionId)
  const person = readPerson(data)
  if (!UUID.test(submissionId) || !person) return null
  if (data.plan !== undefined && !has(plans, data.plan)) return null
  return { submissionId, ...person, plan: data.plan }
}

/** Étapes 1 + 2 : la candidature complète, qui décide si on propose le calendrier. */
export function readFlowApplication(data: Record<string, unknown>) {
  if (text(data.website)) return 'bot' as const
  const submissionId = text(data.submissionId)
  const person = readPerson(data)
  if (!UUID.test(submissionId) || !person || !has(plans, data.plan) || !has(timings, data.timing)) return null
  const company = text(data.company)
  if (company.length > 200) return null
  let revenueBand: RevenueBand | undefined
  let kind: FlowOutcome = 'review'
  if (data.revenueBand !== 'unknown') {
    revenueBand = revenueBands.find(band => band.minimum === data.revenueBand)
    if (!revenueBand) return null
    kind = revenueBand.minimum >= 300_000 ? 'legende' : 'alternative'
  }
  return { submissionId, ...person, plan: data.plan, timing: data.timing, company: company || undefined, revenueBand, kind }
}

type Contact = Exclude<ReturnType<typeof readContact>, null | 'bot'>
type FlowApplication = Exclude<ReturnType<typeof readFlowApplication>, null | 'bot'>

function slack(channel: string, id: string, title: string, details: string[]) {
  return { channel, client_msg_id: id, text: title, mrkdwn: false, unfurl_links: false, unfurl_media: false,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title } },
      ...details.map(value => ({ type: 'section', text: { type: 'plain_text', text: value, emoji: false } })),
    ] }
}

export function contactSlackMessage(c: Contact, channel: string) {
  return slack(channel, c.submissionId, '1-to-1 · Nouveau contact (étape 1 sur 3)', [
    [`${c.firstName} ${c.lastName}`, c.phone, c.email].join('\n'),
    ...(c.plan ? ['A cliqué sur\n' + plans[c.plan].fr] : []),
    'S’il ne va pas plus loin, il n’a pas fini sa candidature : à rappeler.',
  ])
}

const flowTitles: Record<FlowOutcome, string> = {
  legende: '1-to-1 · Candidature retenue, calendrier proposé',
  review: '1-to-1 · CA inconnu, à rappeler',
  alternative: '1-to-1 · Sous 300 000 € de CA, orienté vers Intro',
}

export function flowSlackMessage(a: FlowApplication, channel: string) {
  return slack(channel, a.submissionId, flowTitles[a.kind], [
    [`${a.firstName} ${a.lastName}`, a.phone, a.email].join('\n'),
    'Offre visée\n' + plans[a.plan].fr,
    'CA HT sur les 12 derniers mois\n' + (a.revenueBand?.fr ?? 'Inconnu'),
    'Démarrage souhaité\n' + timings[a.timing].fr,
    ...(a.company ? ['Entreprise et ce qu’il vend\n' + a.company] : []),
  ])
}
