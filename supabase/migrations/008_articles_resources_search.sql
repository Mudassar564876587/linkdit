-- ============================================================================
-- LinkDit Articles & Resources — Full-Text Search & Extended Features
-- ============================================================================

-- 0. Helper: ensure updated_at trigger function exists (idempotent)
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Add search_vector to resources for full-text search
alter table public.resources
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'a') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'b')
  ) stored;

create index if not exists idx_resources_search
  on public.resources using gin (search_vector);

-- 2. Add author_avatar_url to articles (for author box display)
alter table public.articles
  add column if not exists author_avatar_url text;

-- 3. Composite index for featured + published queries
drop index if exists idx_articles_featured_published;
create index idx_articles_featured_published
  on public.articles (featured, is_published)
  where featured = true and is_published = true;

-- 4. Ensure resources updated_at trigger exists
drop trigger if exists trg_resources_updated_at on public.resources;
create trigger trg_resources_updated_at
  before update on public.resources
  for each row execute function public.handle_updated_at();
