-- Webinar leads (La Méthode Gourou) - backup of Systeme.io contacts
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE webinar_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  first_name TEXT,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'webinar_methode_gourou',
  systeme_contact_id BIGINT,
  user_agent TEXT,
  ip TEXT
);

-- One row per (email, source). The API normalizes email to lowercase before insert.
ALTER TABLE webinar_leads
  ADD CONSTRAINT webinar_leads_email_source_unique UNIQUE (email, source);

CREATE INDEX idx_webinar_leads_created_at
  ON webinar_leads (created_at DESC);

-- RLS: only the service_role key (supabaseAdmin) can read/write
ALTER TABLE webinar_leads ENABLE ROW LEVEL SECURITY;

-- No public policies = anon key has zero access; only API routes via supabaseAdmin can write.
