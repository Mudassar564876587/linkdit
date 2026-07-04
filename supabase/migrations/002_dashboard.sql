-- ============================================================================
-- LinkDit Dashboard Schema
-- ============================================================================

-- 1. Add social profile columns to users
alter table public.users
  add column if not exists twitter  text,
  add column if not exists linkedin text,
  add column if not exists github   text;

-- 2. recently_viewed
create table if not exists public.recently_viewed (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  tool_id    uuid        not null references public.tools(id) on delete cascade,
  viewed_at  timestamptz not null default now(),
  constraint uq_recently_viewed unique (user_id, tool_id)
);

create index if not exists idx_recently_viewed_user
  on public.recently_viewed (user_id, viewed_at desc);

-- 3. notifications
create table if not exists public.notifications (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  type       text        not null check (type in (
                           'review_reply', 'tool_approved', 'tool_rejected',
                           'bookmark_update', 'mention', 'system'
                         )),
  title      text        not null,
  body       text,
  link       text,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user
  on public.notifications (user_id, created_at desc);

-- 4. RLS policies
alter table public.recently_viewed enable row level security;
alter table public.notifications  enable row level security;

-- users: user can update own social fields
drop policy if exists "users_own_update" on public.users;
create policy "users_own_update"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- recently_viewed: user can see and insert own
drop policy if exists "recently_viewed_own_select" on public.recently_viewed;
create policy "recently_viewed_own_select"
  on public.recently_viewed for select
  using (auth.uid() = user_id);

drop policy if exists "recently_viewed_own_insert" on public.recently_viewed;
create policy "recently_viewed_own_insert"
  on public.recently_viewed for insert
  with check (auth.uid() = user_id);

drop policy if exists "recently_viewed_own_delete" on public.recently_viewed;
create policy "recently_viewed_own_delete"
  on public.recently_viewed for delete
  using (auth.uid() = user_id);

-- notifications: user can see and mark read own
drop policy if exists "notifications_own_select" on public.notifications;
create policy "notifications_own_select"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "notifications_own_update" on public.notifications;
create policy "notifications_own_update"
  on public.notifications for update
  using (auth.uid() = user_id);

-- bookmarks: user can delete own
drop policy if exists "bookmarks_own_delete" on public.bookmarks;
create policy "bookmarks_own_delete"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- reviews: user can update and delete own
drop policy if exists "reviews_own_update" on public.reviews;
create policy "reviews_own_update"
  on public.reviews for update
  using (auth.uid() = user_id);

drop policy if exists "reviews_own_delete" on public.reviews;
create policy "reviews_own_delete"
  on public.reviews for delete
  using (auth.uid() = user_id);
