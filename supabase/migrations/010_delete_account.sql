-- ============================================================================
-- LinkDit — Delete User Account (RPC + cascade cleanup)
-- ============================================================================

-- 1. RPC: delete_user_account
-- Called from dashboard settings to fully remove the current user.
-- Runs as security definer so it can delete from auth.users.
-- ============================================================================
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  _user_id uuid;
begin
  _user_id := auth.uid();
  if _user_id is null then
    raise exception 'Not authenticated.';
  end if;

  -- Cleanup user data in public schema
  delete from public.bookmarks           where user_id = _user_id;
  delete from public.reviews             where user_id = _user_id;
  delete from public.notifications       where user_id = _user_id;
  delete from public.recently_viewed     where user_id = _user_id;
  delete from public.tool_submissions    where user_id = _user_id;
  delete from public.articles            where author_id = _user_id;
  delete from public.audit_logs          where user_id = _user_id;

  -- Delete the user profile (triggers cascade to auth.users if FK set up)
  delete from public.users where id = _user_id;

  -- Delete from auth.users directly
  delete from auth.users where id = _user_id;
end;
$$;
