-- Pay-As-You-Go (PAYG) beta waitlist
-- Captures qualification + contact info for the credit-based à-la-carte offer beta.
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query).

CREATE TABLE payg_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Contact
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Qualification
  platforms TEXT[] NOT NULL,                 -- ['linkedin','instagram',...] - distribution targets
  content_types TEXT[] NOT NULL DEFAULT '{}',-- ['youtube','reels','posts','newsletters','carrousels']
  pack_id TEXT NOT NULL,                     -- 'starter' | 'growth' | 'scale' | 'illimite'
  credits_per_month INT NOT NULL,            -- 2200 | 6000 | 10400 | -1 (illimité)
  estimated_monthly_price INT NOT NULL,      -- 199 | 499 | 799 | 999 (€/mois)
  current_situation TEXT,                    -- 'rien' | 'solo' | 'freelance' | 'agence' | 'in_house'

  -- Tracking
  source TEXT NOT NULL DEFAULT 'payg_beta',
  emp TEXT,
  user_agent TEXT,
  ip TEXT
);

-- One row per email (idempotent re-submits return the same waitlist slot).
ALTER TABLE payg_waitlist
  ADD CONSTRAINT payg_waitlist_email_unique UNIQUE (email);

CREATE INDEX idx_payg_waitlist_created_at
  ON payg_waitlist (created_at DESC);

-- Hottest leads first (highest committed monthly price).
CREATE INDEX idx_payg_waitlist_price
  ON payg_waitlist (estimated_monthly_price DESC);

-- RLS: only the service_role key (supabaseAdmin) can read/write.
ALTER TABLE payg_waitlist ENABLE ROW LEVEL SECURITY;

-- No public policies = anon key has zero access; only API routes via supabaseAdmin can write.
