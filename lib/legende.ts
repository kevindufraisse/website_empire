export const budgetAnswers = ['annual', 'below-budget', 'shorter-term'] as const
export type BudgetAnswer = typeof budgetAnswers[number]
export type RequestKind = 'legende' | 'consultation'

export function requestKind(budget: BudgetAnswer): RequestKind {
  return budget === 'annual' ? 'legende' : 'consultation'
}

type Application = {
  submissionId: string
  budget: BudgetAnswer
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
  const budget = budgetAnswers.find(answer => answer === data.budget)
  const name = trim(data.name), email = trim(data.email).toLowerCase(), project = trim(data.project)
  if (!budget || data.kind !== requestKind(budget)) return null
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(submissionId)) return null
  if (!name || name.length > 100 || /[\r\n]/.test(name) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  if (!project || project.length > 1200) return null
  return { submissionId, kind: requestKind(budget), budget, name, email, project }
}

const budgetLabels: Record<BudgetAnswer, string> = {
  annual: 'Budget confirmé · 4 000 €/mois pendant 12 mois (48 000 €)',
  'below-budget': 'Budget inférieur à 4 000 €/mois',
  'shorter-term': 'Ne souhaite pas un engagement de 12 mois',
}

export function legendeSlackMessage(application: Application, channel: string) {
  const annual = application.kind === 'legende'
  const title = annual ? 'Légende · Candidature à examiner' : 'Better Call Kevin · Demande de conseil'
  const details = [
    application.name + '\n' + application.email,
    budgetLabels[application.budget],
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
