import { createHash } from 'node:crypto'

export const SITUATIONS: Record<string, string> = { cdi: 'Salarié en CDI', cdd: 'Salarié en CDD / intérim', freelance: 'Freelance / consultant', business: 'Entrepreneur / dirigeant d’agence', student: 'Étudiant / alternant', jobseeking: 'En recherche d’emploi / reconversion', other: 'Autre situation' }
export const EXPERIENCES: Record<string, string> = { starting: 'Pas encore, prêt à me lancer', occasionally: 'Contenu occasionnel pour moi', regularly: 'Contenu régulier pour moi', clients: 'Contenu pour des clients' }
// Keep the original intake valid for people with the previous page still open.
export const AVAILABILITIES: Record<string, string> = { under3: 'Moins de 3 h / semaine', '3to5': '3 à 5 h / semaine', '5to10': '5 à 10 h / semaine', over10: 'Plus de 10 h / semaine' }
export const MONTHLY_HOURS: Record<string, string> = { under10: 'Moins de 10 h / mois', '10to20': '10 à 20 h / mois', '20to40': '20 à 40 h / mois', '40to80': '40 à 80 h / mois', over80: 'Plus de 80 h / mois' }
export const CURRENT_INCOMES: Record<string, string> = { none: 'Aucun revenu actuellement', under1000: 'Moins de 1 000 €', '1000to2000': '1 000 à 1 999 €', '2000to3000': '2 000 à 2 999 €', '3000to5000': '3 000 à 4 999 €', over5000: '5 000 € ou plus', private: 'Préfère en parler lors de l’échange' }
export const INCOME_GOALS: Record<string, string> = { under1000: 'Un complément de moins de 1 000 €', '1000to3000': '1 000 à 3 000 €', '3000to5000': '3 000 à 5 000 €', over5000: 'Plus de 5 000 €', exploring: 'Objectif encore à définir' }
export const NETWORKS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook', x: 'X / Twitter', other: 'Un autre réseau', none: 'Aucun pour l’instant' }
export const STRENGTHS: Record<string, string> = { writing: 'À l’écrit : posts, textes, scripts', speaking: 'À l’oral : échanges, interviews, audio', video: 'En vidéo : parler face caméra', versatile: 'À l’aise dans plusieurs formats', learning: 'Points forts à découvrir' }
export const START_DATES: Record<string, string> = { now: 'Dès maintenant', thismonth: 'Dans le mois', later: 'Dans 1 à 3 mois' }
type Qualification = { monthlyHours: string; currentIncome: string; incomeGoal: string; networks: string[]; strength: string; favoriteCreator: string; startWhen: string }
export type Candidate = {
  submissionId: string; firstName: string; lastName: string; email: string; phone: string
  situation: string; experience: string; availability: string; project: string; profileUrl: string; consent: true
  qualification?: Qualification
}
type Validation = { candidate: Candidate } | { error: string; field?: string } | { honeypot: true }
const text = (v: unknown) => typeof v === 'string' ? v.trim() : ''

export function normalizeCandidatePhone(raw: string): string | null {
  if (/[^\d\s+().-]/.test(raw)) return null
  let phone = raw.replace(/[\s().-]/g, '')
  if (phone.startsWith('00')) phone = '+' + phone.slice(2)
  if (/^0\d{9}$/.test(phone)) phone = '+33' + phone.slice(1)
  if (/^\+330\d{9}$/.test(phone)) phone = '+33' + phone.slice(4)
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null
}
export function validateCandidate(input: unknown): Validation {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Candidature invalide.' }
  const b = input as Record<string, unknown>
  if (text(b.company)) return { honeypot: true }
  const expanded = b.applicationVersion === 2
  if (b.applicationVersion !== undefined && !expanded) return { error: 'Recharge la page pour accéder au formulaire de candidature à jour.' }
  const firstName = text(b.firstName), lastName = text(b.lastName), email = text(b.email).toLowerCase()
  if (firstName.length < 1 || firstName.length > 60) return { error: 'Indique ton prénom.', field: 'firstName' }
  if (lastName.length < 1 || lastName.length > 80) return { error: 'Indique ton nom.', field: 'lastName' }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Vérifie ton adresse email.', field: 'email' }
  const phone = normalizeCandidatePhone(text(b.phone))
  if (!phone) return { error: 'Vérifie ton téléphone. Hors France, ajoute l’indicatif du pays (par exemple +32).', field: 'phone' }
  const situation = text(b.situation), experience = text(b.experience), availability = text(b.availability)
  if (!Object.prototype.hasOwnProperty.call(SITUATIONS, situation) && !(situation === 'employee' && !expanded)) return { error: 'Choisis ta situation.', field: 'situation' }
  if (!Object.prototype.hasOwnProperty.call(EXPERIENCES, experience)) return { error: 'Indique ton expérience en contenu.', field: 'experience' }
  if (!expanded && !Object.prototype.hasOwnProperty.call(AVAILABILITIES, availability)) return { error: 'Indique ton temps disponible.', field: 'availability' }
  const project = text(b.project)
  if (project.length < (expanded ? 60 : 30) || project.length > (expanded ? 1200 : 1000)) return { error: expanded ? 'Présente ta motivation en 60 à 1 200 caractères.' : 'Présente ton projet en 30 à 1 000 caractères.', field: 'project' }
  let qualification: Qualification | undefined
  if (expanded) {
    for (const [field, choices] of Object.entries({ monthlyHours: MONTHLY_HOURS, currentIncome: CURRENT_INCOMES, incomeGoal: INCOME_GOALS, strength: STRENGTHS, startWhen: START_DATES })) {
      if (!Object.prototype.hasOwnProperty.call(choices, text(b[field]))) return { error: 'Sélectionne une réponse à cette question.', field }
    }
    if (!Array.isArray(b.networks) || !b.networks.length || b.networks.length > 7 || b.networks.some(n => typeof n !== 'string' || !Object.prototype.hasOwnProperty.call(NETWORKS, n)) || new Set(b.networks).size !== b.networks.length || (b.networks.includes('none') && b.networks.length > 1)) return { error: 'Choisis les réseaux où tu as publié, ou « Aucun pour l’instant ».', field: 'networks' }
    const favoriteCreator = text(b.favoriteCreator)
    if (favoriteCreator.length < 20 || favoriteCreator.length > 600) return { error: 'Présente ton créateur préféré et ce qui te plaît chez lui en 20 à 600 caractères.', field: 'favoriteCreator' }
    qualification = { monthlyHours: text(b.monthlyHours), currentIncome: text(b.currentIncome), incomeGoal: text(b.incomeGoal), networks: [...b.networks].sort() as string[], strength: text(b.strength), favoriteCreator, startWhen: text(b.startWhen) }
  }
  let profileUrl = text(b.profileUrl)
  if (profileUrl) {
    try {
      if (profileUrl.length > 400) throw Error()
      const u = new URL(/^https?:\/\//i.test(profileUrl) ? profileUrl : `https://${profileUrl}`)
      if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password || !u.hostname.includes('.')) throw Error()
      profileUrl = u.href
    } catch { return { error: 'Indique un lien de profil valide, ou laisse ce champ vide.', field: 'profileUrl' } }
  }
  if (b.consent !== true) return { error: 'Confirme que l’équipe peut te contacter au sujet de ta candidature.', field: 'consent' }
  const submissionId = text(b.submissionId)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) return { error: 'Recharge la page puis réessaie.' }
  return { candidate: { submissionId, firstName, lastName, email, phone, situation, experience, availability: expanded ? '' : availability, project, profileUrl, consent: true, ...(qualification ? { qualification } : {}) } }
}
const situationLabel = (c: Candidate) => SITUATIONS[c.situation] || 'Salarié / en reconversion'
const networkSummary = (q: Qualification) => `${q.networks.includes('none') ? 0 : q.networks.length} — ${q.networks.map(n => NETWORKS[n]).join(', ')}`
export function candidateSummary(c: Candidate): string {
  const q = c.qualification
  return [
    'CANDIDATURE HEAD OF CONTENT — Formation gratuite sur sélection', `${c.firstName} ${c.lastName}`, `Email : ${c.email}`, `Téléphone : ${c.phone}`,
    `Situation : ${situationLabel(c)}`, `Expérience : ${EXPERIENCES[c.experience]}`,
    ...(q ? [`Disponibilité mensuelle : ${MONTHLY_HOURS[q.monthlyHours]}`, `Revenus personnels nets actuels / mois : ${CURRENT_INCOMES[q.currentIncome]}`, `Objectif de CA mensuel à 6 mois : ${INCOME_GOALS[q.incomeGoal]}`, `Réseaux déjà utilisés (${networkSummary(q)})`, `Aisance : ${STRENGTHS[q.strength]}`, `Créateur préféré et pourquoi : ${q.favoriteCreator}`, `Démarrage : ${START_DATES[q.startWhen]}`] : [`Disponibilité : ${AVAILABILITIES[c.availability]}`, 'Ancien formulaire : les questions supplémentaires n’étaient pas encore affichées.']),
    `Motivation : ${c.project}`,
    c.profileUrl ? `Profil : ${c.profileUrl}` : 'Profil : non renseigné', 'Consentement au recontact : oui', 'À recontacter sous 48 h si sélectionné.', `Référence : ${c.submissionId}`,
  ].join('\n')
}
export function candidateSlackPayload(c: Candidate, channel: string) {
  const q = c.qualification
  const section = (value: string) => ({ type: 'section', text: { type: 'plain_text', text: value, emoji: false } })
  return {
    channel, client_msg_id: c.submissionId, text: candidateSummary(c), mrkdwn: false, unfurl_links: false, unfurl_media: false,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Nouvelle candidature · Head of Content' } },
      section(`${c.firstName} ${c.lastName}\n${c.email}\n${c.phone}`),
      ...(q ? [
        section(`Situation\n${situationLabel(c)}\n\nTemps disponible\n${MONTHLY_HOURS[q.monthlyHours]}\n\nRevenus personnels nets actuels / mois\n${CURRENT_INCOMES[q.currentIncome]}\n\nObjectif de CA mensuel à 6 mois\n${INCOME_GOALS[q.incomeGoal]}`),
        section(`Expérience en contenu\n${EXPERIENCES[c.experience]}\n\nRéseaux déjà utilisés (${networkSummary(q)})\n\nAisance\n${STRENGTHS[q.strength]}\n\nPeut commencer\n${START_DATES[q.startWhen]}`),
        section(`Créateur préféré et pourquoi\n${q.favoriteCreator}`),
      ] : [section(`Situation\n${situationLabel(c)}\n\nExpérience en contenu\n${EXPERIENCES[c.experience]}\n\nTemps disponible\n${AVAILABILITIES[c.availability]}\n\nAncien formulaire : questions supplémentaires non affichées.`)]),
      section(`Pourquoi sélectionner ce profil\n${c.project}`), ...(c.profileUrl ? [section(`Profil / exemple de contenu\n${c.profileUrl}`)] : []),
      { type: 'actions', elements: [{ type: 'button', text: { type: 'plain_text', text: 'Contacter sur WhatsApp' }, url: `https://wa.me/${c.phone.slice(1)}` }] },
      { type: 'context', elements: [{ type: 'plain_text', text: `Formation gratuite · Recontact accepté · Sous 48 h si sélectionné\nRéf. ${c.submissionId}` }] },
    ],
  }
}
// This bounded cache complements Slack client_msg_id deduplication. It is not
// durable across serverless instances, so the reference is also visible in Slack.
const attempts = new Map<string, { at: number; count: number }>()
const sent = new Map<string, { at: number; fingerprint: string }>()
const inflight = new Map<string, Promise<void>>()
const hash = (s: string) => createHash('sha256').update(s).digest('hex')
export function allowCandidateRequest(ip: string, now = Date.now()): boolean {
  for (const [key, item] of attempts) if (now - item.at > 15 * 60000) attempts.delete(key)
  const key = hash(ip), item = attempts.get(key)
  if (item && item.count >= 5) return false
  if (attempts.size > 10000) attempts.delete(attempts.keys().next().value!)
  attempts.set(key, { at: item?.at ?? now, count: (item?.count ?? 0) + 1 })
  return true
}
export async function deliverCandidateOnce(c: Candidate, deliver: () => Promise<void>): Promise<void> {
  const now = Date.now(), fingerprint = hash(JSON.stringify(c))
  for (const [key, item] of sent) if (now - item.at > 60 * 60000) sent.delete(key)
  const previous = sent.get(c.submissionId)
  if (previous) { if (previous.fingerprint !== fingerprint) throw new Error('submission_conflict'); return }
  const pending = inflight.get(c.submissionId)
  if (pending) { await pending; return deliverCandidateOnce(c, deliver) }
  const task = deliver().then(() => {
    if (sent.size > 10000) sent.delete(sent.keys().next().value!)
    sent.set(c.submissionId, { at: now, fingerprint })
  })
  inflight.set(c.submissionId, task)
  try { await task } finally { inflight.delete(c.submissionId) }
}
