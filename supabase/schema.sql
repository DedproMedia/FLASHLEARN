-- FlashLearn flashcard progress: per-user confidence rating for each card,
-- across all subjects (capital cities, solar system, ...).
-- This app shares its Supabase project with Project Lens (project-lens-mvp).
-- Safe to re-run this whole file any time (e.g. after adding a new subject) -
-- every statement below is idempotent.
create extension if not exists pgcrypto;

create table if not exists flashcard_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null default 'capitals',
  country_code text not null,
  rating smallint not null check (rating between 1 and 5),
  times_reviewed int not null default 1,
  last_reviewed timestamp with time zone not null default now(),
  primary key (user_id, subject, country_code)
);

-- Migration for a table created before the `subject` column existed: add it
-- (existing rows default to 'capitals', the only subject that existed then),
-- then widen the primary key to include it so multiple subjects can share
-- this table without id collisions.
alter table flashcard_progress add column if not exists subject text not null default 'capitals';
alter table flashcard_progress drop constraint if exists flashcard_progress_pkey;
alter table flashcard_progress add primary key (user_id, subject, country_code);

alter table flashcard_progress enable row level security;

drop policy if exists "select own flashcard progress" on flashcard_progress;
create policy "select own flashcard progress" on flashcard_progress
  for select using (auth.uid() = user_id);

drop policy if exists "insert own flashcard progress" on flashcard_progress;
create policy "insert own flashcard progress" on flashcard_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own flashcard progress" on flashcard_progress;
create policy "update own flashcard progress" on flashcard_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own flashcard progress" on flashcard_progress;
create policy "delete own flashcard progress" on flashcard_progress
  for delete using (auth.uid() = user_id);
