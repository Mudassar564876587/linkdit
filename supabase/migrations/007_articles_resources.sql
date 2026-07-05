-- ============================================================================
-- LinkDit Articles & Resources System
-- ============================================================================

-- 1. Resources table
create table if not exists public.resources (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  slug           text        not null unique,
  description    text,
  content        text,
  category_id    uuid        references public.categories(id),
  logo_url       text,
  cover_image_url text,
  website_url   text,
  download_url   text,
  pricing        text        default 'Free',
  features       jsonb       default '[]'::jsonb,
  tags           jsonb       default '[]'::jsonb,
  featured       boolean     default false,
  is_published   boolean     default false,
  seo_title      text,
  seo_description text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2. Article tags junction
create table if not exists public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- 3. Resource tags junction
create table if not exists public.resource_tags (
  resource_id uuid not null references public.resources(id) on delete cascade,
  tag_id      uuid not null references public.tags(id) on delete cascade,
  primary key (resource_id, tag_id)
);

-- 4. Add tags column to articles (convenience)
alter table public.articles
  add column if not exists tags jsonb default '[]'::jsonb;

-- 5. Indexes
create index if not exists idx_resources_slug       on public.resources (slug);
create index if not exists idx_resources_published   on public.resources (is_published) where is_published = true;
create index if not exists idx_resources_featured    on public.resources (featured) where featured = true;
create index if not exists idx_resources_category    on public.resources (category_id);
create index if not exists idx_resources_created     on public.resources (created_at desc);
create index if not exists idx_article_tags_article  on public.article_tags (article_id);
create index if not exists idx_article_tags_tag      on public.article_tags (tag_id);
create index if not exists idx_resource_tags_resource on public.resource_tags (resource_id);
create index if not exists idx_resource_tags_tag     on public.resource_tags (tag_id);
create index if not exists idx_articles_published    on public.articles (is_published) where is_published = true;
create index if not exists idx_articles_featured     on public.articles (featured) where is_published = true;

-- 6. RLS
alter table public.resources      enable row level security;
alter table public.article_tags   enable row level security;
alter table public.resource_tags  enable row level security;

drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read"
  on public.resources for select
  using (is_published = true);

drop policy if exists "resources_admin_all" on public.resources;
create policy "resources_admin_all"
  on public.resources for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "article_tags_public_read" on public.article_tags;
create policy "article_tags_public_read"
  on public.article_tags for select
  using (true);

drop policy if exists "article_tags_admin_all" on public.article_tags;
create policy "article_tags_admin_all"
  on public.article_tags for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "resource_tags_public_read" on public.resource_tags;
create policy "resource_tags_public_read"
  on public.resource_tags for select
  using (true);

drop policy if exists "resource_tags_admin_all" on public.resource_tags;
create policy "resource_tags_admin_all"
  on public.resource_tags for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
