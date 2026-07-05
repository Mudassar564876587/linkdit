-- ============================================================================
-- LinkDit Articles & Resources - Full Text Search & Extended Features
-- ============================================================================

-- 1. Add search_vector to resources for full-text search
alter table public.resources
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'a') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'b')
  ) stored;

create index if not exists idx_resources_search on public.resources using gin (search_vector);

-- 2. Add author_avatar_url to articles (for author box)
alter table public.articles
  add column if not exists author_avatar_url text;

-- 3. Add created_by for audit tracking on resources
alter table public.resources
  add column if not exists created_by uuid references public.users(id) on delete set null;

-- 4. Ensure updated_at trigger for resources
create trigger if not exists trg_resources_updated_at
  before update on public.resources
  for each row execute function public.handle_updated_at();

-- 5. Additional indexes for performance
create index if not exists idx_resources_created_by on public.resources (created_by);
create index if not exists idx_articles_author_id on public.articles (author_id);
create index if not exists idx_articles_featured_published on public.articles (featured, is_published)
  where featured = true and is_published = true;

-- 6. RLS policies for resources (ensure complete coverage)
drop policy if exists "resources_admin_all" on public.resources;
create policy "resources_admin_all"
  on public.resources for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read"
  on public.resources for select
  using (is_published = true);

-- 7. RLS for articles (ensure admin can manage all)
drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all"
  on public.articles for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
  on public.articles for select
  using (is_published = true);
