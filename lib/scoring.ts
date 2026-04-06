// Pure scoring utility - no Supabase dependency, safe to import client-side

export type DiscProfile = 'pending' | 'dominant' | 'influent' | 'stable' | 'conforme'

export interface ScoringInput {
  hours_per_week?: string
  budget?: string
  has_created_content?: string
  disc_role?: string
  disc_obstacle?: string
}

export function calculateScore(data: ScoringInput): { score: number; disc: DiscProfile } {
  let score = 0

  const hoursScore: Record<string, number> = {
    '<2h': 0, '2-5h': 1, '5-10h': 2, '10h+': 3,
  }
  const budgetScore: Record<string, number> = {
    '0-400': 0, '400-1000': 1, '1000-2000': 2, '2000+': 3,
  }
  const contentScore: Record<string, number> = {
    'non': 0, 'oui_sans_preuve': 1, 'oui_preuve': 2,
  }

  if (data.hours_per_week) score += hoursScore[data.hours_per_week] ?? 0
  if (data.budget) score += budgetScore[data.budget] ?? 0
  if (data.has_created_content) score += contentScore[data.has_created_content] ?? 0

  // DISC: tally votes from behavioral answers
  const votes: Record<string, number> = {
    dominant: 0, influent: 0, stable: 0, conforme: 0,
  }
  for (const val of [data.disc_role, data.disc_obstacle]) {
    if (val && val in votes) votes[val]++
  }

  let disc: DiscProfile = 'influent'
  let max = 0
  for (const [k, v] of Object.entries(votes)) {
    if (v > max) { max = v; disc = k as DiscProfile }
  }

  return { score, disc }
}
