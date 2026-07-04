-- ============================================================================
-- LinkDit Enterprise Tools Directory
-- ============================================================================

-- 1. Add enterprise columns to tools
alter table public.tools
  add column if not exists sponsored    boolean not null default false,
  add column if not exists is_verified  boolean not null default false;

-- 2. Indexes
create index if not exists idx_tools_sponsored   on public.tools (sponsored) where sponsored = true;
create index if not exists idx_tools_verified    on public.tools (is_verified) where is_verified = true;
