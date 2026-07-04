-- ============================================================================
-- LinkDit Row Level Security Policies
-- ============================================================================

-- 0. Enable RLS on all tables
-- ============================================================================
alter table public.categories              enable row level security;
alter table public.tools                   enable row level security;
alter table public.articles                enable row level security;
alter table public.users                   enable row level security;
alter table public.bookmarks               enable row level security;
alter table public.reviews                 enable row level security;
alter table public.tool_submissions        enable row level security;
alter table public.newsletter_subscribers  enable row level security;

-- ============================================================================
-- 1. categories
-- ============================================================================
create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

create policy "Categories are insertable by admins only"
  on public.categories for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Categories are updatable by admins only"
  on public.categories for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Categories are deletable by admins only"
  on public.categories for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 2. tools
-- ============================================================================
create policy "Published tools are publicly readable"
  on public.tools for select
  using (is_published = true or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Tools are insertable by admins only"
  on public.tools for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Tools are updatable by admins only"
  on public.tools for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Tools are deletable by admins only"
  on public.tools for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 3. articles
-- ============================================================================
create policy "Published articles are publicly readable"
  on public.articles for select
  using (is_published = true or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Articles are insertable by admins only"
  on public.articles for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Articles are updatable by admins only"
  on public.articles for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Articles are deletable by admins only"
  on public.articles for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 4. users (profiles)
-- ============================================================================
create policy "Users can read their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update any profile"
  on public.users for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 5. bookmarks
-- ============================================================================
create policy "Users can read their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 6. reviews
-- ============================================================================
create policy "Approved reviews are publicly readable"
  on public.reviews for select
  using (is_approved = true or auth.uid() = user_id);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

create policy "Admins can approve or delete any review"
  on public.reviews for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete any review"
  on public.reviews for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 7. tool_submissions
-- ============================================================================
create policy "Anyone can submit a tool"
  on public.tool_submissions for insert
  with check (true);

create policy "Submitters can read their own submissions"
  on public.tool_submissions for select
  using (submitter_email = current_setting('request.jwt.claims', true)::json ->> 'email');

create policy "Admins can read all submissions"
  on public.tool_submissions for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update submissions"
  on public.tool_submissions for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete submissions"
  on public.tool_submissions for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- 8. newsletter_subscribers
-- ============================================================================
create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Admins can read all subscribers"
  on public.newsletter_subscribers for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage subscribers"
  on public.newsletter_subscribers for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
