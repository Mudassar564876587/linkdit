-- ============================================================================
-- LinkDit Tools Directory Schema
-- ============================================================================

-- 1. Tags
create table if not exists public.tags (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null unique,
  slug       text        not null unique,
  created_at timestamptz not null default now()
);

-- 2. Tool-Tags junction
create table if not exists public.tool_tags (
  tool_id uuid not null references public.tools(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (tool_id, tag_id)
);

-- 3. Add columns to tools
alter table public.tools
  add column if not exists screenshots jsonb    default '[]'::jsonb,
  add column if not exists features   text[]    default '{}',
  add column if not exists pros       text[]    default '{}',
  add column if not exists cons       text[]    default '{}',
  add column if not exists faqs       jsonb     default '[]'::jsonb,
  add column if not exists website_label text   default 'Visit Website';

-- 4. Tool screenshots (alternative approach)
create table if not exists public.tool_screenshots (
  id         uuid        primary key default gen_random_uuid(),
  tool_id    uuid        not null references public.tools(id) on delete cascade,
  url        text        not null,
  alt        text        default '',
  sort_order integer     not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_tool_screenshots_tool
  on public.tool_screenshots (tool_id, sort_order);

-- 5. RLS
alter table public.tags             enable row level security;
alter table public.tool_tags        enable row level security;
alter table public.tool_screenshots enable row level security;

-- public read for published tools
drop policy if exists "tags_public_read" on public.tags;
create policy "tags_public_read"
  on public.tags for select
  using (true);

drop policy if exists "tool_tags_public_read" on public.tool_tags;
create policy "tool_tags_public_read"
  on public.tool_tags for select
  using (true);

drop policy if exists "tool_screenshots_public_read" on public.tool_screenshots;
create policy "tool_screenshots_public_read"
  on public.tool_screenshots for select
  using (true);

-- 6. Indexes
create index if not exists idx_tool_tags_tag  on public.tool_tags (tag_id);
create index if not exists idx_tool_tags_tool on public.tool_tags (tool_id);
create index if not exists idx_tools_created_desc on public.tools (created_at desc);
create index if not exists idx_tools_name_trgm on public.tools using gin (name gin_trgm_ops);
