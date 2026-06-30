-- ── IP-based rate limiting for /api/brief ────────────────────────────────────
-- Run once in Supabase → SQL Editor. Until this table exists, rate limiting is
-- skipped (best-effort) and the server-side topic cap still protects quota.
create table if not exists public.brief_rate (
  id bigint generated always as identity primary key,
  ip text not null,
  ts timestamptz not null default now()
);
create index if not exists brief_rate_ip_ts on public.brief_rate (ip, ts);
alter table public.brief_rate enable row level security;
-- Optional periodic cleanup (rows older than an hour are never needed):
-- delete from public.brief_rate where ts < now() - interval '1 hour';
