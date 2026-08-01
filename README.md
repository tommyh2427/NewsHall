# NewsHall

NewsHall is a personalized morning-news PWA. Users choose topics, then receive
a concise linked brief assembled from RSS feeds and GNews. Topic briefs are
shared by topic and six-hour cache window, so generation cost tracks unique
topics rather than user count.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill every required value in `.env.local`; never commit that file. A production
build also needs the two `NEXT_PUBLIC_SUPABASE_*` values present at build time.

## Required setup

1. Create a Supabase project and add the schema in `supabase-schema.sql`,
   `supabase-topic-cache.sql`, `supabase-rate-limit.sql`, and
   `supabase-fix-briefs-rls.sql`, and `supabase-delivery-schedule.sql`.
2. Add the environment variables in `.env.example` to Vercel for Production,
   Preview, and Development as appropriate.
3. Configure VAPID keys and enable web-push permissions in a supported browser.
4. Deploy to Vercel. `vercel.json` schedules the daily brief route.

## Operational notes

- Gemini 2.5 Flash is the primary summarizer; Groq is the fallback. If both
  fail, the brief route serves RSS-only stories when available.
- Vercel Pro is required for the once-per-minute cron schedule that honors a
  saved delivery time. The delivery-slot index migration must be applied before
  deploying that configuration.
- `topic_briefs`, `briefs`, and push subscriptions are server-managed; do not
  relax their RLS policies to troubleshoot a client issue.

## Validate before deploying

```bash
npm run build
```

Set the required public Supabase variables locally before building. For a real
deployment, also smoke-test sign-in, one generated brief, a cron run, and a
push subscription in the Vercel and Supabase dashboards.
