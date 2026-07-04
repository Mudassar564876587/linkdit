-- ============================================================================
-- LinkDit Enterprise Admin CMS
-- ============================================================================

-- 1. Site settings (key-value)
create table if not exists public.site_settings (
  key        text        primary key,
  value      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Audit logs
create table if not exists public.audit_logs (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references public.users(id),
  action      text        not null,
  entity_type text        not null,
  entity_id   text,
  metadata    jsonb       default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- 3. Indexes
create index if not exists idx_audit_logs_created on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_user    on public.audit_logs (user_id);
create index if not exists idx_audit_logs_entity  on public.audit_logs (entity_type, entity_id);

-- 4. Media storage bucket
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. RLS
alter table public.site_settings enable row level security;
alter table public.audit_logs    enable row level security;

drop policy if exists "Admin read site_settings" on public.site_settings;
create policy "Admin read site_settings"
  on public.site_settings for select
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin write site_settings" on public.site_settings;
create policy "Admin write site_settings"
  on public.site_settings for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin read audit_logs" on public.audit_logs;
create policy "Admin read audit_logs"
  on public.audit_logs for select
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

drop policy if exists "System insert audit_logs" on public.audit_logs;
create policy "System insert audit_logs"
  on public.audit_logs for insert
  with check (true);

-- 6. Default settings
insert into public.site_settings (key, value) values
  ('site_name',         '"LinkDit"'),
  ('site_description',  '"Curated AI tools directory"'),
  ('site_logo',         'null'),
  ('theme_color',       '"#2563EB"'),
  ('seo_title',         '"LinkDit – AI Tools Directory"'),
  ('seo_description',   '"Discover the best AI tools for your needs."'),
  ('analytics_code',    '""'),
  ('social_twitter',    '""'),
  ('social_github',     '""'),
  ('social_linkedin',   '""')
on conflict (key) do nothing;

-- 7. Add slug column to articles if missing (for blog admin)
alter table public.articles
  add column if not exists seo_title       text,
  add column if not exists seo_description text;
