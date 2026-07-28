-- Empire Academy waitlist
-- Systeme.io is the source of truth (contact + `academy_waitlist` tag).
-- This table is a best-effort backup that also gives us an ordered queue.
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query).

CREATE TABLE academy_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Contact
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Tracking
  source TEXT NOT NULL DEFAULT 'academy_waitlist',
  lang TEXT NOT NULL DEFAULT 'fr',
  systeme_contact_id BIGINT,
  emp TEXT,
  user_agent TEXT,
  ip TEXT,

  -- Set when the person is invited into a cohort
  notified_at TIMESTAMPTZ
);

-- One row per email (idempotent re-submits keep the original queue position).
ALTER TABLE academy_waitlist
  ADD CONSTRAINT academy_waitlist_email_unique UNIQUE (email);

CREATE INDEX idx_academy_waitlist_created_at
  ON academy_waitlist (created_at DESC);

-- Everyone not yet invited, oldest first: the actual queue.
CREATE INDEX idx_academy_waitlist_pending
  ON academy_waitlist (created_at)
  WHERE notified_at IS NULL;

-- RLS: only the service_role key (supabaseAdmin) can read/write.
ALTER TABLE academy_waitlist ENABLE ROW LEVEL SECURITY;

-- No public policies = anon key has zero access; only API routes via supabaseAdmin can write.
