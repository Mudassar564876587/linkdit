-- 011_review_system.sql
-- Add title, pros, cons columns to reviews table
-- Auto-update tools.rating and tools.review_count via trigger

alter table public.reviews
  add column if not exists title text,
  add column if not exists pros text[] default '{}',
  add column if not exists cons text[] default '{}';

create or replace function public.update_tool_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tool_id uuid;
begin
  if tg_op = 'DELETE' then
    v_tool_id := old.tool_id;
  else
    v_tool_id := new.tool_id;
  end if;

  update public.tools
  set
    rating = coalesce(
      (select round(avg(rating)::numeric, 2)
       from public.reviews
       where tool_id = v_tool_id and is_approved = true),
      0
    ),
    review_count = (
      select count(*)
      from public.reviews
      where tool_id = v_tool_id and is_approved = true
    )
  where id = v_tool_id;

  return null;
end;
$$;

drop trigger if exists trg_reviews_update_tool_rating on public.reviews;
create trigger trg_reviews_update_tool_rating
  after insert or update or delete on public.reviews
  for each row execute function public.update_tool_rating();
