-- ============================================================================
-- Hero Settings — single-row JSON config for homepage hero section
-- ============================================================================

create table if not exists public.hero_settings (
  id          integer     primary key default 1,
  config      jsonb       not null,
  updated_at  timestamptz not null default now(),
  constraint single_hero_row check (id = 1)
);

-- Insert default hero configuration
insert into public.hero_settings (id, config) values (
  1,
  '{
    "announcement": {
      "enabled": false,
      "text": "New AI tools added weekly!",
      "url": "/tools",
      "bgColor": "#2563EB",
      "textColor": "#ffffff"
    },
    "heading": {
      "line1": "Find the Best",
      "line2": "AI Tools",
      "line3": "for Every Task",
      "gradient1": "#2563EB",
      "gradient2": "#4F46E5",
      "gradient3": "#7C3AED",
      "gradient4": "#A855F7",
      "fontWeight": "900",
      "fontSize": "76px",
      "letterSpacing": "-0.05em",
      "lineHeight": "0.9"
    },
    "description": {
      "text": "Explore curated AI tools, in-depth comparisons, and expert tutorials designed to help creators, developers, and businesses work smarter.",
      "maxWidth": "560px",
      "fontSize": "18px",
      "lineHeight": "1.75",
      "color": "#64748b"
    },
    "buttons": {
      "enabled": true,
      "primaryText": "Explore AI Tools",
      "primaryUrl": "/tools",
      "primaryIcon": "Sparkles",
      "secondaryText": "Read Articles",
      "secondaryUrl": "/articles",
      "secondaryIcon": "ArrowUpRight"
    },
    "search": {
      "enabled": true,
      "placeholder": "Search any AI tool...",
      "buttonText": "Search"
    },
    "background": {
      "style": "gradient",
      "primaryColor": "#2563EB",
      "secondaryColor": "#7C3AED",
      "showOrbs": true,
      "showDots": true
    },
    "clock": {
      "enabled": true
    },
    "media": {
      "imageUrl": ""
    },
    "seo": {
      "title": "Find the Best AI Tools | LinkDit",
      "description": "Discover and compare the best AI tools for every task. Curated reviews, expert insights, and real user feedback."
    }
  }'::jsonb
)
on conflict (id) do nothing;

-- RLS
alter table public.hero_settings enable row level security;

create policy "Admins can read hero_settings"
  on public.hero_settings for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert hero_settings"
  on public.hero_settings for insert
  with check (auth.role() = 'authenticated');

create policy "Admins can update hero_settings"
  on public.hero_settings for update
  using (auth.role() = 'authenticated');

-- Storage bucket for hero media
insert into storage.buckets (id, name, public) values ('hero', 'hero', true)
on conflict (id) do nothing;
