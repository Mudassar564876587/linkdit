-- ============================================================================
-- LinkDit: Fix recursive RLS on public.users
-- ============================================================================
-- The existing admin-select policy on public.users queries itself
-- (select 1 from public.users where ...), causing infinite recursion
-- that blocks ALL queries that reference users (including tool_submissions).
-- ============================================================================

-- 1. Drop ALL existing policies on users to start clean
drop policy if exists "users_own_update"                on public.users;
drop policy if exists "Users can view own profile"      on public.users;
drop policy if exists "Admins can view all profiles"     on public.users;
drop policy if exists "Enable read access for all users" on public.users;

-- 2. Create non-recursive policies

-- Users can read their own row
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

-- Users can read any row (needed for admin checks via foreign key refs)
-- This is safe because sensitive data lives in auth.users, not public.users
create policy "users_select_authenticated"
  on public.users for select
  using (auth.role() = 'authenticated');

-- Users can update their own row (existing policy, recreated)
create policy "users_own_update"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
