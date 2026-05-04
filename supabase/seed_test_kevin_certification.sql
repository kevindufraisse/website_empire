-- Test / démo : insère TA certification avec un code fixe facile à taper.
-- 1. Exécute d'abord supabase/migrations/001_certifications.sql si ce n’est pas fait.
-- 2. Dans Supabase : SQL Editor → colle ce fichier → Run.
-- 3. Ouvre ton site : /verify puis saisis EMP-KDV-TST
--    ou directement : /verify?code=EMP-KDV-TST
--
-- Prénom/nom/email : adapte ci-dessous si besoin puis relance une fois (sans le ON CONFLICT si tu modifies l’email).

INSERT INTO certifications (
  first_name,
  last_name,
  email,
  tier,
  promotion,
  verification_code,
  issued_at
)
VALUES (
  'Kevin',
  'Dufraisse',
  'kevin@empire.test',
  'gold',
  'Promo test — dev',
  'EMP-KDV-TST',
  now()
)
ON CONFLICT (verification_code) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  tier = EXCLUDED.tier,
  promotion = EXCLUDED.promotion,
  issued_at = EXCLUDED.issued_at;
