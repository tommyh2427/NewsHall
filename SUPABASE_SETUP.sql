-- Run this in Supabase SQL Editor

-- Table: user preferences (topics, delivery settings)
create table if not exists user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  topics text[] default '{}',
  settings jsonb default '{}',
  updated_at timestamptz default now()
);
alter table user_preferences enable row level security;
create policy "Users manage own preferences" on user_preferences
  for all using (auth.uid() = user_id);

-- Table: saved briefs (one per user, upserted daily)
create table if not exists user_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  brief jsonb not null,
  topics text[] default '{}',
  settings jsonb default '{}',
  generated_at timestamptz default now()
);
alter table user_briefs enable row level security;
create policy "Users manage own briefs" on user_briefs
  for all using (auth.uid() = user_id);
