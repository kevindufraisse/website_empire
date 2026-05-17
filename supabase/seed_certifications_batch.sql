-- Batch insert certifications — Mai 2026
-- Exécuter dans Supabase : SQL Editor → colle ce fichier → Run.
-- Codes de vérification : /verify?code=EMP-XXXXX

INSERT INTO certifications (first_name, last_name, email, tier, promotion, verification_code, issued_at)
VALUES
  ('Erwan', 'Le Gall', 'erwanlegall11@gmail.com', 'silver', 'Mai 2026', 'EMP-ELG-7K2', now()),
  ('T.', 'de Vasselot', 'tdevasselot@gmail.com', 'silver', 'Mai 2026', 'EMP-TDV-9M4', now()),
  ('Zahra', 'Chikhi', 'chikhizahra@icloud.com', 'gold', 'Mai 2026', 'EMP-ZCH-3G8', now()),
  ('Evelyne', 'Guitard', 'guitard.evelyne@gmail.com', 'silver', 'Mai 2026', 'EMP-EGU-5R1', now()),
  ('Sébastien', 'Min', 'sebastien.min@gmail.com', 'gold', 'Mai 2026', 'EMP-SMN-2J6', now()),
  ('Léa', 'Marie-Lecordier', 'lea.marielecordier@gmail.com', 'silver', 'Mai 2026', 'EMP-LML-8P3', now()),
  ('Ann', 'Marketing-Inception', 'ann@marketing-inception.com', 'silver', 'Mai 2026', 'EMP-ANN-4W7', now()),
  ('Cyrine', 'Benjabria', 'benjabriacyrine@gmail.com', 'silver', 'Mai 2026', 'EMP-CBJ-6T9', now()),
  ('Yushing', 'Eng', 'yushing.eng@gmail.com', 'silver', 'Mai 2026', 'EMP-YEN-1X5', now()),
  ('Manuela', 'Bux', 'manuela.bux@gmail.com', 'silver', 'Mai 2026', 'EMP-MBX-7N2', now()),
  ('A.', 'Faligot', 'afaligot@hotmail.com', 'silver', 'Mai 2026', 'EMP-AFL-3D8', now()),
  ('Matthieu', 'Jardin', 'matthieu.jardin76@gmail.com', 'bronze', 'Mai 2026', 'EMP-MJR-5H4', now()),
  ('Cédryc', 'Jouniaux', 'cedryc@jouniaux.com', 'silver', 'Mai 2026', 'EMP-CJN-9B1', now()),
  ('Gilles', 'Rolland-Monnet', 'gilles.rollandmonnet@gmail.com', 'silver', 'Mai 2026', 'EMP-GRM-2F6', now())
ON CONFLICT (verification_code) DO NOTHING;
