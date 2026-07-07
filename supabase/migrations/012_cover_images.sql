-- ============================================================================
-- LinkDit Cover Image Support
-- ============================================================================

-- 1. Add cover_image_url to tools table
alter table public.tools
  add column if not exists cover_image_url text;
