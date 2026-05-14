-- User settings: topics, delivery time, timezone
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  topics text[] not null default '{}',
  delivery_time text not null default '07:00',
  delivery_hour_utc int not null default 12,
  timezone text not null default 'America/New_York',
  updated_at timestamptz default now()
);
alter table user_settings enable row level security;
create policy "Users manage own settings" on user_settings
  for all using (auth.uid() = user_id);

-- Push subscriptions: one per user (latest device wins)
create table if not exists push_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  updated_at timestamptz default now()
);
alter table push_subscriptions enable row level security;
create policy "Users manage own subscriptions" on push_subscriptions
  for all using (auth.uid() = user_id);

-- Saved briefs: one per user (overwritten each morning)
create table if not exists briefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  content jsonb not null,
  generated_at timestamptz default now()
);
alter table briefs enable row level security;
create policy "Users read own briefs" on briefs
  for select using (auth.uid() = user_id);
-- Service role can write briefs (cron job uses service role)
create policy "Service role writes briefs" on briefs
  for all using (true) with check (true);
