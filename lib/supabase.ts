import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

// Client-side (anon - used in browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side only (service role - bypasses RLS, never import this client-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey)

export type ApplicationStatus = 'new' | 'contacted' | 'accepted' | 'rejected'

export interface Application {
  id?: string
  created_at?: string
  updated_at?: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  hours_per_week?: string
  budget?: string
  has_created_content?: string
  content_link?: string
  haunting_project?: string
  disc_role?: string
  disc_obstacle?: string
  friends_say?: string
  social_link?: string
  motivation?: string
  score?: number
  profile_color?: string
  disc_profile?: string
  step_completed?: number
  status?: ApplicationStatus
}
