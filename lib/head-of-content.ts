import { createHash } from 'node:crypto'

export const SITUATIONS: Record<string, string> = { employee: 'Salarié / en reconversion', freelance: 'Freelance / consultant', business: 'Entrepreneur / agence', student: 'Étudiant', other: 'Autre situation' }
export const EXPERIENCES: Record<string, string> = { starting: 'Pas encore, prêt à me lancer', occasionally: 'Contenu occasionnel pour moi', regularly: 'Contenu régulier pour moi', clients: 'Contenu pour des clients' }
export const AVAILABILITIES: Record<string, string> = { under3: 'Moins de 3 h / semaine', '3to5': '3 à 5 h / semaine', '5to10': '5 à 10 h / semaine', over10: 'Plus de 10 h / semaine' }
export type Candidate = {
  submissionId: string; firstName: string; lastName: string; email: string; phone: string
  situation: string; experience: string; availability: string; project: string; profileUrl: string; consent: true
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
  const firstName = text(b.firstName), lastName = text(b.lastName), email = text(b.email).toLowerCase()
  if (firstName.length < 1 || firstName.length > 60) return { error: 'Indique ton prénom.', field: 'firstName' }
  if (lastName.length < 1 || lastName.length > 80) return { error: 'Indique ton nom.', field: 'lastName' }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Vérifie ton adresse email.', field: 'email' }
  const phone = normalizeCandidatePhone(text(b.phone))
  if (!phone) return { error: 'Vérifie ton téléphone. Hors France, ajoute l’indicatif du pays (par exemple +32).', field: 'phone' }
  const situation = text(b.situation), experience = text(b.experience), availability = text(b.availability)
  if (!Object.prototype.hasOwnProperty.call(SITUATIONS, situation)) return { error: 'Choisis ta situation.', field: 'situation' }
  if (!Object.prototype.hasOwnProperty.call(EXPERIENCES, experience)) return { error: 'Indique ton expérience en contenu.', field: 'experience' }
  if (!Object.prototype.hasOwnProperty.call(AVAILABILITIES, availability)) return { error: 'Indique ton temps disponible.', field: 'availability' }
  const project = text(b.project)
  if (project.length < 30 || project.length > 1000) return { error: 'Présente ton projet en 30 à 1 000 caractères.', field: 'project' }
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
  return { candidate: { submissionId, firstName, lastName, email, phone, situation, experience, availability, project, profileUrl, consent: true } }
}
export function candidateSummary(c: Candidate): string {
  return [
    'CANDIDATURE HEAD OF CONTENT — Formation gratuite sur sélection', `${c.firstName} ${c.lastName}`, `Email : ${c.email}`, `Téléphone : ${c.phone}`,
    `Situation : ${SITUATIONS[c.situation]}`, `Expérience : ${EXPERIENCES[c.experience]}`, `Disponibilité : ${AVAILABILITIES[c.availability]}`, `Projet : ${c.project}`,
    c.profileUrl ? `Profil : ${c.profileUrl}` : 'Profil : non renseigné', 'Consentement au recontact : oui', 'À recontacter sous 48 h si sélectionné.', `Référence : ${c.submissionId}`,
  ].join('\n')
}
export function candidateSlackPayload(c: Candidate, channel: string) {
  const section = (value: string) => ({ type: 'section', text: { type: 'plain_text', text: value, emoji: false } })
  return {
    channel, client_msg_id: c.submissionId, text: candidateSummary(c), mrkdwn: false, unfurl_links: false, unfurl_media: false,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Nouvelle candidature · Head of Content' } },
      section(`${c.firstName} ${c.lastName}\n${c.email}\n${c.phone}`),
      section(`Situation\n${SITUATIONS[c.situation]}\n\nExpérience en contenu\n${EXPERIENCES[c.experience]}\n\nTemps disponible\n${AVAILABILITIES[c.availability]}`),
      section(`Son projet\n${c.project}`), ...(c.profileUrl ? [section(`Profil / exemple de contenu\n${c.profileUrl}`)] : []),
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
