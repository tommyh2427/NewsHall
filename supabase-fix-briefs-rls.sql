-- ── FIX: briefs RLS security hole ───────────────────────────────────────────
-- The old policy "for all using (true) with check (true)" let ANY request
-- (including anonymous) overwrite ANY user's saved brief. Replace it so a user
-- can read/write only their own row. The cron uses the service role, which
-- bypasses RLS, so it keeps writing everyone's briefs with no policy needed.
--
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query).

drop policy if exists "Service role writes briefs" on public.briefs;
drop policy if exists "Users read own briefs" on public.briefs;

create policy "Users manage own briefs" on public.briefs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
