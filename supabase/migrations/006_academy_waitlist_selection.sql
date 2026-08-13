-- Extra selection fields for Academy waitlist candidatures
ALTER TABLE academy_waitlist
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS situation TEXT,
  ADD COLUMN IF NOT EXISTS content_level TEXT;
