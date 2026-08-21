-- Capital cities flashcards: per-user confidence rating for each country card.
-- This app shares its Supabase project with Project Lens (project-lens-mvp);
-- run this once against that same project if the table doesn't already exist.
create extension if not exists pgcrypto;

create table if not exists flashcard_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  country_code text not null,
  rating smallint not null check (rating between 1 and 5),
  times_reviewed int not null default 1,
  last_reviewed timestamp with time zone not null default now(),
  primary key (user_id, country_code)
);

alter table flashcard_progress enable row level security;

create policy "select own flashcard progress" on flashcard_progress
  for select using (auth.uid() = user_id);

create policy "insert own flashcard progress" on flashcard_progress
  for insert with check (auth.uid() = user_id);

create policy "update own flashcard progress" on flashcard_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete own flashcard progress" on flashcard_progress
  for delete using (auth.uid() = user_id);
