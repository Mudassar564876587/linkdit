-- ============================================================================
-- LinkDit Tool Submission System
-- ============================================================================

-- 1. Expand tool_submissions
alter table public.tool_submissions
  add column if not exists user_id          uuid        references public.users(id),
  add column if not exists logo_url         text,
  add column if not exists cover_image_url  text,
  add column if not exists gallery_images   jsonb       default '[]'::jsonb,
  add column if not exists full_description text        default '',
  add column if not exists pricing          text        default 'Free',
  add column if not exists tags             jsonb       default '[]'::jsonb,
  add column if not exists features         jsonb       default '[]'::jsonb,
  add column if not exists pros             jsonb       default '[]'::jsonb,
  add column if not exists cons             jsonb       default '[]'::jsonb,
  add column if not exists faqs             jsonb       default '[]'::jsonb,
  add column if not exists contact_email    text,
  add column if not exists slug             text,
  add column if not exists submission_status text       not null default 'draft',
  add column if not exists publish_status   text        not null default 'draft',
  add column if not exists reviewed_by      uuid        references public.users(id),
  add column if not exists reviewed_at      timestamptz;

-- 2. Indexes
create index if not exists idx_tool_submissions_user
  on public.tool_submissions (user_id);
create index if not exists idx_tool_submissions_status
  on public.tool_submissions (submission_status);
create index if not exists idx_tool_submissions_slug
  on public.tool_submissions (slug);

-- 3. Storage buckets
insert into storage.buckets (id, name, public)
values ('tool-logos', 'tool-logos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('tool-covers', 'tool-covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('tool-galleries', 'tool-galleries', true)
on conflict (id) do nothing;

-- 4. Storage RLS
drop policy if exists "Public read tool-logos" on storage.objects;
create policy "Public read tool-logos"
  on storage.objects for select
  using (bucket_id = 'tool-logos');

drop policy if exists "Authenticated upload tool-logos" on storage.objects;
create policy "Authenticated upload tool-logos"
  on storage.objects for insert
  with check (
    bucket_id = 'tool-logos'
    and auth.role() = 'authenticated'
  );

drop policy if exists "Public read tool-covers" on storage.objects;
create policy "Public read tool-covers"
  on storage.objects for select
  using (bucket_id = 'tool-covers');

drop policy if exists "Authenticated upload tool-covers" on storage.objects;
create policy "Authenticated upload tool-covers"
  on storage.objects for insert
  with check (
    bucket_id = 'tool-covers'
    and auth.role() = 'authenticated'
  );

drop policy if exists "Public read tool-galleries" on storage.objects;
create policy "Public read tool-galleries"
  on storage.objects for select
  using (bucket_id = 'tool-galleries');

drop policy if exists "Authenticated upload tool-galleries" on storage.objects;
create policy "Authenticated upload tool-galleries"
  on storage.objects for insert
  with check (
    bucket_id = 'tool-galleries'
    and auth.role() = 'authenticated'
  );

-- 5. RLS on tool_submissions
alter table public.tool_submissions enable row level security;

drop policy if exists "Users read own submissions" on public.tool_submissions;
create policy "Users read own submissions"
  on public.tool_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own submissions" on public.tool_submissions;
create policy "Users insert own submissions"
  on public.tool_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own submissions" on public.tool_submissions;
create policy "Users update own submissions"
  on public.tool_submissions for update
  using (auth.uid() = user_id);

drop policy if exists "Admin read all submissions" on public.tool_submissions;
create policy "Admin read all submissions"
  on public.tool_submissions for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admin update submissions" on public.tool_submissions;
create policy "Admin update submissions"
  on public.tool_submissions for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
