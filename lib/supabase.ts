import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

// Client-side (anon — used in browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side (service role — bypasses RLS, used only in API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey)

export type ApplicationStatus = 'new' | 'contacted' | 'accepted' | 'rejected'
// DISC profiling: D=dominant(red), I=influent(yellow), S=stable(green), C=conforme(blue)
export type DiscProfile = 'pending' | 'dominant' | 'influent' | 'stable' | 'conforme'
// Kept for backward compat — maps to DISC
export type ProfileColor = DiscProfile

export interface Application {
  id?: string
  created_at?: string
  updated_at?: string
  // Step 1
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  // Step 2
  hours_per_week?: string
  budget?: string
  // Step 3
  has_created_content?: string
  content_link?: string
  haunting_project?: string
  // Step 4 — DISC behavioral questions
  disc_role?: string        // behavioral style in a project
  disc_obstacle?: string    // reaction to obstacles
  friends_say?: string
  // Step 5
  social_link?: string
  motivation?: string
  // Scoring
  score?: number
  profile_color?: DiscProfile
  disc_profile?: DiscProfile
  step_completed?: number
  status?: ApplicationStatus
}

export function calculateScore(data: Partial<Application>): { score: number; color: DiscProfile; disc: DiscProfile } {
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

  // DISC profile from behavioral answers
  // Both disc_role and disc_obstacle map to D/I/S/C — majority wins
  const discVotes: Record<DiscProfile, number> = {
    pending: 0, dominant: 0, influent: 0, stable: 0, conforme: 0,
  }
  const discFields = ['disc_role', 'disc_obstacle'] as const
  for (const field of discFields) {
    const val = data[field as keyof Partial<Application>] as string | undefined
    if (val && val !== 'pending') {
      const d = val as DiscProfile
      if (d in discVotes) discVotes[d]++
    }
  }

  let disc: DiscProfile = 'influent' // default
  let maxVotes = 0
  for (const [k, v] of Object.entries(discVotes)) {
    if (k !== 'pending' && v > maxVotes) {
      maxVotes = v
      disc = k as DiscProfile
    }
  }

  // For backward compat, color = disc profile
  return { score, color: disc, disc }
}
