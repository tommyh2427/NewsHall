-- ── Shared topic-brief cache ────────────────────────────────────────────────
-- A topic's brief is identical for every user who picks it, so we generate it
-- once per day and reuse it across all users. Cost scales with unique topics
-- per day, not with the number of users.
--
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.topic_briefs (
  topic_key     text not null,           -- normalized topic ("green bay packers")
  brief_date    date not null,           -- the day this brief is for
  content       jsonb not null,          -- { topic, stories[], watch_for[] }
  generated_at  timestamptz not null default now(),
  primary key (topic_key, brief_date)
);

-- Fast lookups by date + key
create index if not exists topic_briefs_date_idx
  on public.topic_briefs (brief_date, topic_key);

-- Service role (server) handles all reads/writes; lock down public access.
alter table public.topic_briefs enable row level security;

-- Optional: auto-clean old cached briefs (keep 7 days). Safe to skip.
-- delete from public.topic_briefs where brief_date < current_date - interval '7 days';
