import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

// Client-side (anon — used in browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side (service role — bypasses RLS, used only in API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey)

export type ApplicationStatus = 'new' | 'contacted' | 'accepted' | 'rejected'
export type ProfileColor = 'pending' | 'red' | 'blue' | 'green'

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
  // Step 4
  money_project?: string
  unpopular_opinion?: string
  friends_say?: string
  // Step 5
  social_link?: string
  motivation?: string
  // Scoring
  score?: number
  profile_color?: ProfileColor
  step_completed?: number
  status?: ApplicationStatus
}

export function calculateScore(data: Partial<Application>): { score: number; color: ProfileColor } {
  let score = 0

  const hoursScore: Record<string, number> = {
    '<2h': 0,
    '2-5h': 1,
    '5-10h': 2,
    '10h+': 3,
  }
  const budgetScore: Record<string, number> = {
    '0-400': 0,
    '400-1000': 1,
    '1000-2000': 2,
    '2000+': 3,
  }
  const contentScore: Record<string, number> = {
    'non': 0,
    'oui_sans_preuve': 1,
    'oui_preuve': 2,
  }

  if (data.hours_per_week) score += hoursScore[data.hours_per_week] ?? 0
  if (data.budget) score += budgetScore[data.budget] ?? 0
  if (data.has_created_content) score += contentScore[data.has_created_content] ?? 0

  const color: ProfileColor = score <= 2 ? 'red' : score <= 5 ? 'blue' : 'green'
  return { score, color }
}
