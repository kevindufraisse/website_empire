import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy init so importing this module never crashes at build time
// (page-data collection runs without env vars locally).
function lazyClient(factory: () => SupabaseClient): SupabaseClient {
  let client: SupabaseClient | null = null
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!client) client = factory()
      const value = (client as any)[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  })
}

// Client-side (anon - used in browser)
export const supabase = lazyClient(() =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
)

// Server-side only (service role - bypasses RLS, never import this client-side)
export const supabaseAdmin = lazyClient(() =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)
)

export type ApplicationStatus = 'new' | 'contacted' | 'accepted' | 'rejected'

export type CertificationTier = 'bronze' | 'silver' | 'gold'

export interface Certification {
  id?: string
  created_at?: string
  first_name: string
  last_name: string
  email: string
  tier: CertificationTier
  promotion: string
  verification_code: string
  issued_at: string
  linkedin_url?: string
  photo_url?: string
}

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
