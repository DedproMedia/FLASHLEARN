# FlashLearn

A flashcard app for learning trivia by subject. Two categories so far:

- **Capital Cities** — flip cards by continent, learn each country's capital
- **Solar System** — flip cards by planet, covering moons, distance from the Sun, orbit and
  day length, size, temperature, atmosphere, and a fun fact for each of the 8 planets plus
  Pluto

Rate your confidence on each card and let Learning Mode resurface the cards you're shakiest
on more often. Sign in (optional) to sync your progress across devices.

Adding another subject means adding a new items/subject file under `src/lib/flashcards/`
(see `capitals.ts` and `planets.ts` for the pattern) and registering it in `subjects.ts` —
everything else (flip cards, confidence rating, Learning Mode, Browse Deck, Dashboard) is
shared and subject-agnostic.

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
