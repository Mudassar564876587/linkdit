-- ============================================================================
-- LinkDit Database Schema
-- PostgreSQL for Supabase
-- ============================================================================

-- 0. Extensions
-- ============================================================================
create extension if not exists "pgcrypto" with schema extensions;

-- 1. Helper: updated_at trigger
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Tables
-- ============================================================================

-- 2a. categories
-- ============================================================================
create table public.categories (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  description text        not null default '',
  icon_name   text        not null default '',
  tool_count  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- 2b. tools
-- ============================================================================
create table public.tools (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  slug            text        not null unique,
  description     text        not null default '',
  category_id     uuid        not null references public.categories(id) on delete restrict,
  logo_url        text,
  website_url     text        not null,
  pricing         text        not null default 'Free'
                                check (pricing in ('Free', 'Freemium', 'Paid')),
  rating          numeric(3,2) not null default 0
                                check (rating >= 0 and rating <= 5),
  review_count    integer     not null default 0,
  featured        boolean     not null default false,
  is_published    boolean     not null default false,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_tools_updated_at
  before update on public.tools
  for each row execute function public.handle_updated_at();

-- 2c. articles
-- ============================================================================
create table public.articles (
  id               uuid        primary key default gen_random_uuid(),
  title            text        not null,
  slug             text        not null unique,
  description      text        not null default '',
  content          text        not null default '',
  category_id      uuid        not null references public.categories(id) on delete restrict,
  cover_image_url  text,
  read_time        text        not null default '5 min read',
  published_at     timestamptz,
  author_id        uuid        references auth.users(id) on delete set null,
  author_name      text        not null,
  featured         boolean     not null default false,
  is_published     boolean     not null default false,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger trg_articles_updated_at
  before update on public.articles
  for each row execute function public.handle_updated_at();

-- 2d. users (profile mirror of auth.users)
-- ============================================================================
create table public.users (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null unique,
  full_name   text        not null default '',
  avatar_url  text,
  username    text        unique,
  bio         text,
  website     text,
  role        text        not null default 'user'
                             check (role in ('admin', 'user')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- Auto-create profile on auth sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger trg_users_on_auth_signup
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2e. bookmarks
-- ============================================================================
create table public.bookmarks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  tool_id     uuid        references public.tools(id) on delete cascade,
  article_id  uuid        references public.articles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint  chk_bookmark_target check (
    (tool_id is not null and article_id is null)
    or
    (tool_id is null and article_id is not null)
  ),
  constraint  uq_bookmarks_tool   unique (user_id, tool_id),
  constraint  uq_bookmarks_article unique (user_id, article_id)
);

-- 2f. reviews
-- ============================================================================
create table public.reviews (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  tool_id     uuid        not null references public.tools(id) on delete cascade,
  rating      integer     not null check (rating >= 1 and rating <= 5),
  content     text,
  is_approved boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint  uq_reviews_per_user_tool unique (user_id, tool_id)
);

create trigger trg_reviews_updated_at
  before update on public.reviews
  for each row execute function public.handle_updated_at();

-- 2g. tool_submissions
-- ============================================================================
create table public.tool_submissions (
  id              uuid        primary key default gen_random_uuid(),
  submitter_email text        not null,
  tool_name       text        not null,
  tool_url        text        not null,
  description     text        not null default '',
  category_id     uuid        references public.categories(id) on delete set null,
  status          text        not null default 'pending'
                                check (status in ('pending', 'approved', 'rejected')),
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_tool_submissions_updated_at
  before update on public.tool_submissions
  for each row execute function public.handle_updated_at();

-- 2h. newsletter_subscribers
-- ============================================================================
create table public.newsletter_subscribers (
  id              uuid        primary key default gen_random_uuid(),
  email           text        not null unique,
  subscribed      boolean     not null default true,
  subscribed_at   timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- 3. Indexes
-- ============================================================================

-- categories
create index idx_categories_slug on public.categories (slug);

-- tools
create index idx_tools_slug        on public.tools (slug);
create index idx_tools_category_id on public.tools (category_id);
create index idx_tools_featured    on public.tools (featured) where featured = true;
create index idx_tools_pricing     on public.tools (pricing);
create index idx_tools_rating_desc on public.tools (rating desc);
create index idx_tools_published   on public.tools (is_published) where is_published = true;

-- articles
create index idx_articles_slug          on public.articles (slug);
create index idx_articles_category_id   on public.articles (category_id);
create index idx_articles_published_at  on public.articles (published_at desc) where published_at is not null;
create index idx_articles_featured      on public.articles (featured) where featured = true;
create index idx_articles_published     on public.articles (is_published) where is_published = true;

-- bookmarks
create index idx_bookmarks_user_id   on public.bookmarks (user_id);
create index idx_bookmarks_tool_id   on public.bookmarks (tool_id);
create index idx_bookmarks_article_id on public.bookmarks (article_id);

-- reviews
create index idx_reviews_tool_id  on public.reviews (tool_id);
create index idx_reviews_user_id  on public.reviews (user_id);
create index idx_reviews_approved on public.reviews (is_approved) where is_approved = true;

-- tool_submissions
create index idx_tool_submissions_status on public.tool_submissions (status);
create index idx_tool_submissions_email  on public.tool_submissions (submitter_email);

-- newsletter_subscribers
create index idx_newsletter_subscribers_email on public.newsletter_subscribers (email);

-- 4. Full-Text Search
-- ============================================================================
alter table public.tools
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'a') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'b')
  ) stored;

create index idx_tools_search on public.tools using gin (search_vector);

alter table public.articles
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'a') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'b') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'c')
  ) stored;

create index idx_articles_search on public.articles using gin (search_vector);
