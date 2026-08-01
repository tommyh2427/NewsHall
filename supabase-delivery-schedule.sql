-- Minute-precise delivery lookup for the Pro cron schedule.
-- Run once in Supabase SQL Editor before deploying the matching application code.
alter table public.user_settings
  add column if not exists delivery_minute_utc smallint not null default 0
  check (delivery_minute_utc between 0 and 59);

-- Existing rows are corrected whenever a user next saves their settings.
update public.user_settings
set delivery_minute_utc = extract(minute from delivery_time::time)::smallint
where delivery_minute_utc = 0;

-- Keeps each once-per-minute cron lookup indexed as the user base grows.
create index if not exists user_settings_delivery_slot_idx
  on public.user_settings (delivery_hour_utc, delivery_minute_utc)
  where cardinality(topics) > 0;
