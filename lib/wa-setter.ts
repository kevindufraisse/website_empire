/**
 * Ouverture de conversation WhatsApp par le setter (app Empire, hébergée sur Render).
 *
 * Deux précautions qui ont l'air cosmétiques mais ne le sont pas :
 * - on envoie les réponses en clair, pas les slugs, parce qu'elles sont réinjectées
 *   telles quelles dans le prompt et que l'IA doit pouvoir les citer ;
 * - on ne déclenche rien pour un candidat non francophone : le setter ne parle que
 *   français.
 */

type Dict = Record<string, string>

const FREQUENCY: Dict = {
  '3-plus-semaine': '3 fois ou plus par semaine',
  '1-2-semaine': '1 à 2 fois par semaine',
  '1-3-mois': '1 à 3 fois par mois',
  rarement: "moins d'une fois par mois",
  jamais: 'pas encore',
}

const STATS: Dict = {
  'moins-1k': 'moins de 1 000 vues / mois',
  '1k-10k': '1 000 à 10 000 vues / mois',
  '10k-50k': '10 000 à 50 000 vues / mois',
  '50k-plus': 'plus de 50 000 vues / mois',
  'pas-de-stats': 'pas encore de stats',
}

const SKILL: Dict = {
  oui: "oui, à l'aise",
  'un-peu': "un peu, a besoin d'aide",
  non: 'non, part de zéro',
}

const NETWORKS: Dict = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X / Twitter',
  autres: 'autres',
  aucun: 'aucun pour l’instant',
}

const SITUATION: Dict = {
  salarie: 'salarié',
  indep: 'indépendant / freelance',
  etudiant: 'étudiant',
  createur: 'créateur de contenu',
  autre: 'autre',
}

const CONTENT_LEVEL: Dict = {
  jamais: 'pas encore',
  parfois: 'de temps en temps',
  regulier: 'régulièrement',
}

const TEAM_SIZE: Dict = {
  solo: 'moi uniquement',
  '2-5': '2 à 5 personnes',
  '6-10': '6 à 10 personnes',
  '11-19': '11 à 19 personnes',
  '20-30': '20 à 30 personnes',
  '30-plus': 'plus de 30 personnes',
}

export const waLabels = { FREQUENCY, STATS, SKILL, NETWORKS, SITUATION, CONTENT_LEVEL, TEAM_SIZE }

function label(dict: Dict, value: unknown): string {
  const key = String(value || '').trim()
  if (!key) return ''
  return dict[key] || key
}

export function labelFrequency(v: unknown) { return label(FREQUENCY, v) }
export function labelStats(v: unknown) { return label(STATS, v) }
export function labelSkill(v: unknown) { return label(SKILL, v) }
export function labelSituation(v: unknown) { return label(SITUATION, v) }
export function labelContentLevel(v: unknown) { return label(CONTENT_LEVEL, v) }
export function labelTeamSize(v: unknown) { return label(TEAM_SIZE, v) }

/** Orientation offre pour le prompt du setter : ~10 pers. → Empire, 20-30 → Légende. */
export function suggestOfferFromTeam(teamSize: unknown): string {
  const key = String(teamSize || '').trim()
  if (key === '20-30' || key === '30-plus') {
    return 'Légende — équipe de 20 personnes ou plus : volume et CA potentiel trop larges pour Empire seul. Oriente vers Légende.'
  }
  if (key === '11-19') {
    return 'Empire en priorité, Légende si l’équipe est déjà structurée et veut tout déléguer. Équipe de 11 à 19 personnes.'
  }
  if (key === '6-10' || key === '2-5' || key === 'solo') {
    return 'Empire — taille d’équipe (jusqu’à ~10 personnes) et CA potentiel alignés avec Empire, pas Légende.'
  }
  return ''
}

export function labelNetworks(v: unknown): string {
  const list = Array.isArray(v) ? v : String(v || '').split(',')
  return list.map((n) => label(NETWORKS, n)).filter(Boolean).join(', ')
}

export async function startWaSetterConversation(input: {
  phone?: string | null
  firstName?: string | null
  source: string
  lang?: string
  lead?: Record<string, unknown>
}): Promise<void> {
  const base = (process.env.WA_SETTER_API_URL || '').replace(/\/$/, '')
  const secret = process.env.WA_SETTER_SECRET
  const phone = (input.phone || '').trim()

  if (!base || !secret || !phone) return
  if (input.lang && input.lang !== 'fr') return

  const lead = Object.fromEntries(
    Object.entries(input.lead || {}).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  )

  try {
    const resp = await fetch(`${base}/api/wa-setter/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wa-setter-secret': secret },
      body: JSON.stringify({
        phone,
        name: input.firstName || undefined,
        source: input.source,
        lead,
      }),
    })
    if (!resp.ok) {
      console.error('[wa-setter] start refusé', resp.status, await resp.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[wa-setter] start injoignable', err)
  }
}
