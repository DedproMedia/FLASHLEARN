# FlashLearn — Capital Cities Flashcards

A flashcard app for learning the world's capital cities: flip cards by continent, rate your
confidence on each one, and let Learning Mode resurface the cards you're shakiest on more
often. Sign in (optional) to sync your progress across devices.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

Open http://localhost:3000.

## Supabase setup

This app can run without any backend (progress is kept in `localStorage` as a guest), but
signing in requires a Supabase project with:

1. Google and/or email (magic link) auth enabled under **Authentication → Providers**
2. The `flashcard_progress` table + row-level security policies from `supabase/schema.sql`,
   run once in the SQL editor
3. `/auth/callback` added to **Authentication → URL Configuration → Redirect URLs** (both your
   local dev URL and your production domain)

This app was split out of the `project-lens-mvp` repo and can reuse that same Supabase
project — just copy its `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into
this app's environment variables.

## Deploying

Deploys as a standard Next.js app (e.g. on Vercel). Set the two Supabase env vars above in
your hosting provider's project settings.
