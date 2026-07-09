-- ============================================================================
-- Add platforms array to tools & populate resources+tutorials content seed
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/PROJECT_REF/sql/new
-- ============================================================================

alter table public.tools
  add column if not exists platforms text[] default '{}';

-- Sample platform data (run once)
update public.tools set platforms = '{"Web"}' where platforms is null or platforms = '{}';

-- Create or update trigger to auto-set platforms if missing
create or replace function public.ensure_tool_platforms()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.platforms is null or new.platforms = '{}' then
    new.platforms := '{"Web"}';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_ensure_tool_platforms on public.tools;
create trigger trg_ensure_tool_platforms
  before insert or update on public.tools
  for each row execute function public.ensure_tool_platforms();

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';