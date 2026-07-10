create table if not exists promo_deadlines (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  promo_id text not null,
  fingerprint text not null,
  ip_address text,
  email text,
  deadline timestamptz not null,
  unique (promo_id, fingerprint)
);

create index idx_promo_deadlines_lookup on promo_deadlines (promo_id, fingerprint);
create index idx_promo_deadlines_ip on promo_deadlines (promo_id, ip_address);
create index idx_promo_deadlines_email on promo_deadlines (promo_id, email);
