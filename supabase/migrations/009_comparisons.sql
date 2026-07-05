-- ============================================================================
-- LinkDit Tool Comparison System Schema
-- ============================================================================

-- 1. Comparisons table
create table if not exists public.comparisons (
  id                  uuid        primary key default gen_random_uuid(),
  slug                text        not null unique,
  title               text        not null,
  description         text        not null default '',
  tool_a_id           uuid        not null references public.tools(id) on delete cascade,
  tool_b_id           uuid        not null references public.tools(id) on delete cascade,
  category_id         uuid        references public.categories(id) on delete set null,
  tool_a_notes        text        default '',
  tool_b_notes        text        default '',
  pros_a              text[]      default '{}',
  pros_b              text[]      default '{}',
  cons_a              text[]      default '{}',
  cons_b              text[]      default '{}',
  features_comparison jsonb       default '[]'::jsonb,
  pricing_comparison  jsonb       default '[]'::jsonb,
  ratings_comparison  jsonb       default '[]'::jsonb,
  views               integer     not null default 0,
  is_featured         boolean     not null default false,
  is_published        boolean     not null default false,
  seo_title           text,
  seo_description     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint comparisons_tool_check check (tool_a_id <> tool_b_id)
);

-- 2. Increment views function
create or replace function public.increment_comparison_views(comparison_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.comparisons
  set views = views + 1
  where id = comparison_id;
end;
$$;

-- 3. Indexes
create index if not exists idx_comparisons_slug
  on public.comparisons (slug);
create index if not exists idx_comparisons_tool_a
  on public.comparisons (tool_a_id);
create index if not exists idx_comparisons_tool_b
  on public.comparisons (tool_b_id);
create index if not exists idx_comparisons_category
  on public.comparisons (category_id);
create index if not exists idx_comparisons_featured
  on public.comparisons (is_featured, is_published)
  where is_featured = true and is_published = true;
create index if not exists idx_comparisons_views
  on public.comparisons (views desc);
create index if not exists idx_comparisons_created
  on public.comparisons (created_at desc);
create index if not exists idx_comparisons_published
  on public.comparisons (is_published, created_at desc)
  where is_published = true;

-- 4. Updated_at trigger
drop trigger if exists "comparisons_updated_at" on public.comparisons;
create trigger comparisons_updated_at
  before update on public.comparisons
  for each row
  execute function public.handle_updated_at();

-- 5. RLS
alter table public.comparisons enable row level security;

drop policy if exists "comparisons_public_read" on public.comparisons;
create policy "comparisons_public_read"
  on public.comparisons for select
  using (is_published = true);

drop policy if exists "comparisons_admin_all" on public.comparisons;
create policy "comparisons_admin_all"
  on public.comparisons for all
  using (
    auth.uid() in (
      select id from public.users where role = 'admin'
    )
  )
  with check (
    auth.uid() in (
      select id from public.users where role = 'admin'
    )
  );
