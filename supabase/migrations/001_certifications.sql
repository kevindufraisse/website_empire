-- Certifications table for Empire Internet alumni verification
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  promotion TEXT NOT NULL,
  verification_code TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  linkedin_url TEXT,
  photo_url TEXT
);

-- Index for fast lookup by verification code (public verification page)
CREATE INDEX idx_certifications_code ON certifications (verification_code);

-- Index for checking existing certifications per student per promotion
CREATE INDEX idx_certifications_email_promo ON certifications (email, promotion);

-- RLS: only the service_role key can read/write (API routes use supabaseAdmin)
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- No public policies = only service_role (supabaseAdmin) can access
-- The anon key has zero access to this table
