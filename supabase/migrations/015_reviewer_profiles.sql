-- 015_reviewer_profiles.sql
-- Create reviewer_profiles table and enhance reviews with new fields

-- 1. Create reviewer_profiles table (standalone, not tied to auth)
create table if not exists public.reviewer_profiles (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  username text not null,
  avatar_url text,
  country text not null default 'USA',
  city text,
  job_title text not null default 'Developer',
  industry text,
  experience_level text not null default 'intermediate',
  years_of_experience integer default 0,
  joined_at timestamptz default now(),
  helpful_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Add new columns to reviews table
alter table public.reviews
  add column if not exists reviewer_profile_id uuid references public.reviewer_profiles(id) on delete set null,
  add column if not exists best_for text,
  add column if not exists would_recommend boolean default true,
  add column if not exists helpful_count integer default 0,
  add column if not exists usage_duration text,
  add column if not exists primary_use_case text,
  add column if not exists verified_user boolean default false,
  add column if not exists verified_purchase boolean default false;

-- 3. Indexes for performance
create index if not exists idx_reviews_profile_id on public.reviews (reviewer_profile_id);
create index if not exists idx_reviews_helpful on public.reviews (helpful_count desc);
create index if not exists idx_reviews_rating_dist on public.reviews (tool_id, rating);
create index if not exists idx_reviewer_profiles_country on public.reviewer_profiles (country);
create index if not exists idx_reviewer_profiles_experience on public.reviewer_profiles (experience_level);

-- 4. Enable RLS
alter table public.reviewer_profiles enable row level security;

-- 5. RLS policies
create policy "Anyone can view reviewer profiles"
  on public.reviewer_profiles for select
  using (true);

create policy "Service role can manage reviewer profiles"
  on public.reviewer_profiles for all
  using (true)
  with check (true);

-- 6. Grant access
grant usage on schema public to anon, authenticated;
grant all on public.reviewer_profiles to anon, authenticated, service_role;
