-- ============================================================================
-- LinkDit Articles & Resources System
-- ============================================================================

-- 0. Helper: ensure updated_at trigger function exists
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Tags (idempotent — safe if already created by 003)
create table if not exists public.tags (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null unique,
  slug       text        not null unique,
  created_at timestamptz not null default now()
);

-- 2. Resources table
create table if not exists public.resources (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  slug            text        not null unique,
  description     text,
  content         text,
  category_id     uuid        references public.categories(id) on delete set null,
  logo_url        text,
  cover_image_url text,
  website_url     text,
  download_url    text,
  pricing         text        not null default 'Free',
  features        jsonb       not null default '[]'::jsonb,
  tags            jsonb       not null default '[]'::jsonb,
  featured        boolean     not null default false,
  is_published    boolean     not null default false,
  seo_title       text,
  seo_description text,
  created_by      uuid        references public.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 3. Article tags junction
create table if not exists public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- 4. Resource tags junction
create table if not exists public.resource_tags (
  resource_id uuid not null references public.resources(id) on delete cascade,
  tag_id      uuid not null references public.tags(id) on delete cascade,
  primary key (resource_id, tag_id)
);

-- 5. Add convenience tags column to articles (idempotent)
alter table public.articles
  add column if not exists tags jsonb not null default '[]'::jsonb;

-- 6. Updated_at triggers
drop trigger if exists trg_resources_updated_at on public.resources;
create trigger trg_resources_updated_at
  before update on public.resources
  for each row execute function public.handle_updated_at();

-- 7. Indexes
create index if not exists idx_resources_slug        on public.resources (slug);
create index if not exists idx_resources_published   on public.resources (is_published) where is_published = true;
create index if not exists idx_resources_featured    on public.resources (featured) where featured = true;
create index if not exists idx_resources_category    on public.resources (category_id);
create index if not exists idx_resources_created     on public.resources (created_at desc);
create index if not exists idx_resources_created_by  on public.resources (created_by);
create index if not exists idx_article_tags_article  on public.article_tags (article_id);
create index if not exists idx_article_tags_tag      on public.article_tags (tag_id);
create index if not exists idx_resource_tags_resource on public.resource_tags (resource_id);
create index if not exists idx_resource_tags_tag     on public.resource_tags (tag_id);
create index if not exists idx_articles_published    on public.articles (is_published) where is_published = true;
create index if not exists idx_articles_featured     on public.articles (featured) where is_published = true;
create index if not exists idx_articles_author_id    on public.articles (author_id);

-- 8. RLS
alter table public.resources      enable row level security;
alter table public.article_tags   enable row level security;
alter table public.resource_tags  enable row level security;

-- Resources: public read (published only)
drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read"
  on public.resources for select
  using (is_published = true);

-- Resources: admin full access
drop policy if exists "resources_admin_all" on public.resources;
create policy "resources_admin_all"
  on public.resources for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Article tags: public read
drop policy if exists "article_tags_public_read" on public.article_tags;
create policy "article_tags_public_read"
  on public.article_tags for select
  using (true);

-- Article tags: admin full access
drop policy if exists "article_tags_admin_all" on public.article_tags;
create policy "article_tags_admin_all"
  on public.article_tags for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Resource tags: public read
drop policy if exists "resource_tags_public_read" on public.resource_tags;
create policy "resource_tags_public_read"
  on public.resource_tags for select
  using (true);

-- Resource tags: admin full access
drop policy if exists "resource_tags_admin_all" on public.resource_tags;
create policy "resource_tags_admin_all"
  on public.resource_tags for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Articles: public read (published only)
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
  on public.articles for select
  using (is_published = true);

-- Articles: admin full access
drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all"
  on public.articles for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
