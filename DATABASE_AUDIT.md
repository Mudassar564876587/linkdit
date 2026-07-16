# Database Architecture Audit — LinkDit

**Date:** 2026-07-14  
**Scope:** Full Supabase PostgreSQL schema, RLS policies, indexes, triggers, service layer queries, action layer mutations  
**Auditor:** AI-assisted codebase audit  
**Target Scale:** 10k–100k tools, 50k–500k users, millions of monthly page views  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Schema Overview](#2-schema-overview)
3. [Table-by-Table Analysis](#3-table-by-table-analysis)
4. [Relationships & Foreign Keys](#4-relationships--foreign-keys)
5. [Index Analysis](#5-index-analysis)
6. [RLS Policy Audit](#6-rls-policy-audit)
7. [Triggers & Functions](#7-triggers--functions)
8. [Search Architecture](#8-search-architecture)
9. [Service Layer Query Patterns](#9-service-layer-query-patterns)
10. [Action Layer Mutation Patterns](#10-action-layer-mutation-patterns)
11. [Data Integrity & Normalization](#11-data-integrity--normalization)
12. [Scalability Bottlenecks](#12-scalability-bottlenecks)
13. [Security Gaps](#13-security-gaps)
14. [Missing Features / Schema Gaps](#14-missing-features--schema-gaps)
15. [Migration Plan (Prioritized)](#15-migration-plan-prioritized)
16. [Conclusion](#16-conclusion)

---

## 1. Executive Summary

The LinkDit database schema is **functional for a small-to-medium launch** but has **critical gaps** that will cause performance degradation, data integrity issues, and feature limitations as the platform scales. The most urgent findings are:

| Severity | Count | Key Issues |
|----------|-------|------------|
| **Critical** | 4 | No full-text search index on tools; no `deleted_at` anywhere; no foreign keys on core join tables; search architecture is pure application-level filtering |
| **High** | 8 | Missing indexes on all `category_id`, `user_id` FK columns; no composite indexes for common query patterns; RLS policies use subqueries that bypass indexes; `jsonb` usage without GIN indexes; no review metrics denormalization |
| **Medium** | 6 | `text` vs `varchar` inconsistency; no `updated_at` triggers on most tables; no `CHECK` constraints on enum-like columns; migration history is non-linear; `article_submissions` table in TypeScript types but absent from SQL |
| **Low** | 4 | No `created_at` defaults on some new tables; no explicit `IF NOT EXISTS` on index creation; `database.types.ts` drift from actual schema |

---

## 2. Schema Overview

### 2.1 Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- ✅ Present
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- ❌ Missing (needed for trigram search)
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- ❌ Missing (needed for query perf monitoring)
```

### 2.2 Tables (21 total)

| # | Table | Purpose | Has RLS? | Has Indexes? | Has FK? |
|---|-------|---------|----------|--------------|---------|
| 1 | `categories` | Tool categories (tree via `parent_id`) | ✅ | ❌ | ✅ (self-ref) |
| 2 | `tools` | Core tool records | ✅ | ✅ (2) | ✅ |
| 3 | `tool_categories` | M2M: tools ↔ categories | ✅ | ❌ | ❌ ❌ |
| 4 | `tool_screenshots` | Screenshot URLs per tool | ❓ (no explicit RLS) | ❌ | ✅ |
| 5 | `tool_views` | Page view analytics | ❓ | ❌ | ✅ |
| 6 | `tool_submissions` | User-submitted tools | ✅ | ❌ | ❌ |
| 7 | `comparisons` | Side-by-side comparisons | ✅ | ❌ | ❌ |
| 8 | `comparison_items` | Tools in a comparison | ❓ | ❌ | ❌ |
| 9 | `comparison_votes` | Votes on comparisons | ✅ | ❌ | ❌ |
| 10 | `ai_mentions` | AI tool mentions | ❓ | ❌ | ❌ |
| 11 | `newsletter_subscribers` | Email list | ✅ | ❌ | ❌ |
| 12 | `bookmarks` | User tool bookmarks | ✅ | ❌ | ✅ |
| 13 | `reviews` | User tool reviews | ✅ | ❌ | ✅ |
| 14 | `review_votes` | Helpfulness votes on reviews | ✅ | ❌ | ✅ |
| 15 | `articles` | Blog / editorial content | ✅ | ❌ | ❌ |
| 16 | `article_topics` | M2M: articles ↔ topics | ❓ | ❌ | ❌ |
| 17 | `categories_old` | **Dead table** (no FK refs, unused in app) | ❓ | ❌ | ❌ |
| 18 | `user_roles` | Role-based access (admin, etc.) | ✅ | ❌ | ✅ |
| 19 | `tool_submissions` | (listed above for completeness) | ✅ | ❌ | ❌ |
| 20 | `enterprise_requests` | Enterprise feature requests | ✅ | ❌ | ❌ |
| 21 | `notifications` | User notifications | ✅ | ❌ | ❌ |

### 2.3 Schema Drift: `database.types.ts` vs Actual SQL

| TypeScript Type | Exists in SQL? | Issue |
|----------------|---------------|-------|
| `article_submissions` | ❌ No | Referenced in types but never created — likely planned feature |
| `profiles` | ❌ No | User profile data is stored directly in `auth.users` raw metadata; no dedicated profiles table |
| `tool_submissions` columns | Partial | TS has `submitted_by`, SQL has `submitter_name` and `submitter_email` — naming drift |
| `reviews` `is_featured` | ❌ No | Only in TS types |
| `articles` `is_featured` | ❌ No | Only in TS types |

---

## 3. Table-by-Table Analysis

### 3.1 `categories`

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon        TEXT,
  color       TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ❌ **No index on `parent_id`** — every recursive category tree query will seq-scan
- ❌ **No index on `slug`** — `slug` has a `UNIQUE` constraint, which auto-creates a btree index ✅ (actually this is fine, UNIQUE creates an index)
- ❌ **No index on `is_active`** — filtering active categories will seq-scan
- ⚠️ `updated_at` has a `DEFAULT NOW()` but **no trigger** to auto-update on row modification

### 3.2 `tools`

```sql
CREATE TABLE tools (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  tagline           TEXT,
  description       TEXT,
  website_url       TEXT,
  pricing_type      TEXT CHECK (pricing_type IN ('free', 'freemium', 'paid', 'unknown')),
  price_amount      DECIMAL(10,2),
  twitter_url       TEXT,
  github_url        TEXT,
  logo_url          TEXT,
  logo_thumbnail    TEXT,
  is_featured       BOOLEAN DEFAULT false,
  is_published      BOOLEAN DEFAULT false,
  meta_description  TEXT,
  meta_keywords     TEXT,
  schema_markup     JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ✅ `slug` UNIQUE creates index — good
- ⚠️ No index on `is_published` — all public queries filter `WHERE is_published = true`
- ⚠️ No index on `is_featured` — featured tool queries will seq-scan
- ⚠️ No index on `pricing_type` — filtering by pricing will seq-scan
- ⚠️ No composite index `(is_published, is_featured, created_at DESC)` — this is the **main listing query pattern**
- ⚠️ No composite index `(is_published, slug)` — slug lookups always check published status
- ⚠️ No full-text search vector column or GIN index
- ⚠️ No `deleted_at` — tools cannot be soft-deleted

### 3.3 `tool_categories` (M2M Join Table)

```sql
CREATE TABLE tool_categories (
  tool_id     UUID NOT NULL,
  category_id UUID NOT NULL,
  PRIMARY KEY (tool_id, category_id)
);
```

**Issues:**
- ❌ **NO foreign keys!** `tool_id` and `category_id` are `UUID NOT NULL` but lack `REFERENCES tools(id) ON DELETE CASCADE` and `REFERENCES categories(id) ON DELETE CASCADE`
- ❌ **No index on `category_id`** — queries like "all tools in category X" will seq-scan the full join table, then do a lookup. The PK is on `(tool_id, category_id)`, so only the leading column is indexed.
- ❌ **No index on `category_id` alone** or a **covering index**
- ⚠️ Without FK constraints, orphaned rows accumulate when tools/categories are deleted

### 3.4 `tool_views`

```sql
CREATE TABLE tool_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id    UUID REFERENCES tools(id) ON DELETE CASCADE,
  viewed_at  TIMESTAMPTZ DEFAULT NOW(),
  viewer_ip  TEXT,
  user_agent TEXT
);
```

**Issues:**
- ❌ **No index on `tool_id`** — every "get view count for tool" query seq-scans
- ❌ **No index on `viewed_at`** — time-range aggregations seq-scan
- ❌ **No composite index `(tool_id, viewed_at)`** — this is THE query pattern for trending/best-tools-by-views-in-period
- ⚠️ No unique constraint on `(tool_id, viewer_ip, date)` — same IP can inflate counts arbitrarily
- ⚠️ No materialized or aggregated views table — counts are computed live from raw rows

### 3.5 `bookmarks`

```sql
CREATE TABLE bookmarks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id    UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);
```

**Issues:**
- ✅ `UNIQUE(user_id, tool_id)` creates composite index — good
- ✅ Foreign keys present — good
- ⚠️ No `folder` or `collection` column — users cannot organize bookmarks

### 3.6 `reviews`

```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id     UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title       TEXT,
  content     TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ⚠️ No index on `tool_id` — reviews for a tool page will seq-scan
- ⚠️ No index on `user_id` — user's review history will seq-scan
- ⚠️ No composite index `(tool_id, is_approved, created_at DESC)` — the review listing query
- ⚠️ No composite unique on `(tool_id, user_id)` — a user can write multiple reviews for the same tool (allowed, but unusual)
- ⚠️ No denormalized avg_rating / review_count on `tools` — every tool page re-aggregates all reviews
- ⚠️ No trigger to update tool's avg_rating on INSERT/UPDATE/DELETE of reviews

### 3.7 `comparisons`

```sql
CREATE TABLE comparisons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  author_id   UUID,
  is_published BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ❌ **`author_id` is UUID but has NO foreign key** — `UUID` without `REFERENCES auth.users(id)`
- ⚠️ No index on `slug` (UNIQUE creates index ✅)
- ⚠️ No index on `is_published`
- ⚠️ No index on `author_id`

### 3.8 `comparison_items`

```sql
CREATE TABLE comparison_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comparison_id UUID NOT NULL,
  tool_id       UUID NOT NULL,
  notes         TEXT,
  sort_order    INTEGER DEFAULT 0,
  UNIQUE(comparison_id, tool_id)
);
```

**Issues:**
- ❌ **NO foreign keys!** `comparison_id` and `tool_id` have no REFERENCES
- ⚠️ Missing FROM clause in audit — what if tools or comparisons are deleted? Orphaned rows.

### 3.9 `articles`

```sql
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  content         TEXT,
  excerpt         TEXT,
  featured_image  TEXT,
  author_id       UUID,
  is_published    BOOLEAN DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ❌ **`author_id` has NO foreign key**
- ⚠️ No index on `is_published` or `published_at`
- ⚠️ No full-text search vector
- ⚠️ No `category_id` on articles — articles are only tagged via `article_topics` M2M

### 3.10 `notifications`

```sql
CREATE TABLE notifications (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL,
  type      TEXT NOT NULL,
  title     TEXT NOT NULL,
  message   TEXT,
  data      JSONB,
  is_read   BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ❌ **`user_id` has NO foreign key** to `auth.users(id)`
- ❌ **No index on `user_id`** — every user notification query seq-scans
- ❌ **No composite index `(user_id, is_read, created_at DESC)`** — the primary notification query pattern
- ⚠️ No `type` constraint (CHECK or enum) — can be any arbitrary string

### 3.11 `tool_submissions`

```sql
CREATE TABLE tool_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id         UUID,
  name            TEXT NOT NULL,
  website_url     TEXT NOT NULL,
  description     TEXT,
  submitter_name  TEXT,
  submitter_email TEXT,
  category_id     UUID,
  status          TEXT DEFAULT 'pending',
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**Issues:**
- ❌ `tool_id` is UUID but **no FK** to tools(id)
- ❌ `category_id` is UUID but **no FK** to categories(id)
- ⚠️ No CHECK constraint on `status` — can be any string, not just 'pending'|'approved'|'rejected'|'draft'
- ⚠️ No index on `status` — admin filtering by status seq-scans
- ⚠️ No index on `submitter_email`

### 3.12 `categories_old` (Dead Table)

```sql
CREATE TABLE categories_old (...)
```

- **Entirely unused.** No code references, no FK refs. Should be dropped after verifying no data loss.

---

## 4. Relationships & Foreign Keys

### 4.1 Missing Foreign Keys (Critical)

| Table | Column | Should Reference | Severity |
|-------|--------|-----------------|----------|
| `tool_categories` | `tool_id` | `tools(id) ON DELETE CASCADE` | **Critical** — data integrity risk |
| `tool_categories` | `category_id` | `categories(id) ON DELETE CASCADE` | **Critical** — data integrity risk |
| `comparison_items` | `comparison_id` | `comparisons(id) ON DELETE CASCADE` | **Critical** — data integrity risk |
| `comparison_items` | `tool_id` | `tools(id) ON DELETE CASCADE` | **Critical** — data integrity risk |
| `notifications` | `user_id` | `auth.users(id) ON DELETE CASCADE` | **High** — orphaned notifications |
| `comparisons` | `author_id` | `auth.users(id) ON DELETE SET NULL` | **High** — orphaned reference |
| `articles` | `author_id` | `auth.users(id) ON DELETE SET NULL` | **High** — orphaned reference |
| `tool_submissions` | `tool_id` | `tools(id) ON DELETE SET NULL` | **High** — orphaned reference |
| `tool_submissions` | `category_id` | `categories(id) ON DELETE SET NULL` | **Medium** — orphaned reference |
| `tool_views` | `viewer_ip` | (none needed, but should be nullable with a view dedupe strategy) | Low |

### 4.2 Existing Foreign Keys (Good)

| Table | Column | References | Deletion |
|-------|--------|-----------|----------|
| `categories` | `parent_id` | `categories(id)` | `ON DELETE SET NULL` |
| `tools` | (none reference other tables directly) | — | — |
| `bookmarks` | `user_id` | `auth.users(id)` | `ON DELETE CASCADE` |
| `bookmarks` | `tool_id` | `tools(id)` | `ON DELETE CASCADE` |
| `reviews` | `tool_id` | `tools(id)` | `ON DELETE CASCADE` |
| `reviews` | `user_id` | `auth.users(id)` | `ON DELETE CASCADE` |
| `review_votes` | `review_id` | `reviews(id)` | `ON DELETE CASCADE` |
| `review_votes` | `user_id` | `auth.users(id)` | `ON DELETE CASCADE` |
| `tool_views` | `tool_id` | `tools(id)` | `ON DELETE CASCADE` |
| `tool_screenshots` | `tool_id` | `tools(id)` | `ON DELETE CASCADE` |
| `enterprise_requests` | `user_id` | `auth.users(id)` | (not specified) |

---

## 5. Index Analysis

### 5.1 Existing Indexes (with names from migrations)

| Index Name | Table | Columns | Method | Notes |
|-----------|-------|---------|--------|-------|
| `idx_tools_slug` | tools | slug | btree | ✅ From UNIQUE constraint |
| `idx_tools_created_at` | tools | created_at | btree | ✅ Good for recent tools |
| (implicit) | categories | slug | btree | ✅ From UNIQUE constraint |
| (implicit) | comparisons | slug | btree | ✅ From UNIQUE constraint |
| (implicit) | articles | slug | btree | ✅ From UNIQUE constraint |
| (implicit) | bookmarks | (user_id, tool_id) | btree | ✅ From UNIQUE constraint |

**Total explicit indexes: 2** (`idx_tools_slug`, `idx_tools_created_at`)  
**Total implicit (from UNIQUE): ~6**  
**Minimum indexes needed at scale: ~25+**

### 5.2 Missing Indexes — By Priority

#### Critical (query performance will degrade immediately at moderate scale)

```sql
-- 1. Category tree queries
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- 2. Tool listing queries (ALL public pages filter is_published=true)
CREATE INDEX idx_tools_is_published ON tools(is_published);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);
CREATE INDEX idx_tools_pricing_type ON tools(pricing_type);

-- 3. Composite for main listing pages
CREATE INDEX idx_tools_published_featured_date
  ON tools(is_published, is_featured, created_at DESC);

-- 4. M2M lookup (tools by category)
CREATE INDEX idx_tool_categories_category_id ON tool_categories(category_id);

-- 5. Tool views aggregation
CREATE INDEX idx_tool_views_tool_id ON tool_views(tool_id);
CREATE INDEX idx_tool_views_tool_id_viewed_at ON tool_views(tool_id, viewed_at DESC);

-- 6. Reviews per tool
CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_tool_id_approved_date
  ON reviews(tool_id, is_approved, created_at DESC);
```

#### High (query performance will become problematic)

```sql
-- 7. User-specific queries
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread
  ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_tool_views_viewer_ip_date
  ON tool_views(viewer_ip, viewed_at::date);

-- 8. Admin queries
CREATE INDEX idx_tool_submissions_status ON tool_submissions(status);
CREATE INDEX idx_tool_submissions_email ON tool_submissions(submitter_email);
CREATE INDEX idx_articles_is_published ON articles(is_published);
CREATE INDEX idx_comparisons_is_published ON comparisons(is_published);
```

#### Medium (nice-to-have, scale-dependent)

```sql
-- 9. Newsletter
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- 10. Vote aggregation
CREATE INDEX idx_comparison_votes_comparison_id ON comparison_votes(comparison_id);
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);

-- 11. Enterprise requests
CREATE INDEX idx_enterprise_requests_status ON enterprise_requests(status);
```

---

## 6. RLS Policy Audit

### 6.1 Current RLS Coverage

| Table | Has RLS? | Policies | Notes |
|-------|----------|----------|-------|
| `categories` | ✅ Yes | 3 (SELECT for all, INSERT/UPDATE for admins) | ✅ Good |
| `tools` | ✅ Yes | 3 (SELECT for all, INSERT/UPDATE for admins) | ✅ Good |
| `tool_categories` | ✅ Yes | 2 (SELECT for all, INSERT for admins) | ⚠️ Missing UPDATE/DELETE policies |
| `bookmarks` | ✅ Yes | 3 (SELECT/INSERT own, DELETE own) | ✅ Good |
| `reviews` | ✅ Yes | 4 (SELECT for all, INSERT any authed, UPDATE/DELETE own) | ✅ Good |
| `review_votes` | ✅ Yes | 3 (SELECT for all, INSERT own, UPDATE own) | ⚠️ Should not allow UPDATE on votes (tamper risk) |
| `comparisons` | ✅ Yes | 3 (SELECT for all, INSERT any authed, UPDATE/DELETE own) | ✅ Good but author_id lacks FK |
| `comparison_votes` | ✅ Yes | 3 (SELECT for all, INSERT own, DELETE own) | ✅ Good |
| `tool_submissions` | ✅ Yes | Varies by migration | ⚠️ Complex, needs review |
| `newsletter_subscribers` | ✅ Yes | 1 (INSERT only — anon can subscribe) | ✅ Good |
| `notifications` | ✅ Yes | 1 (SELECT own) | ⚠️ Missing INSERT/DELETE for the system |
| `user_roles` | ✅ Yes | Admin-level policies | ✅ Good |
| `enterprise_requests` | ✅ Yes | 2 (INSERT any authed, SELECT own) | ✅ Good |

### 6.2 RLS Anti-Patterns Found

**1. Subqueries in policies (performance issue)**
```sql
-- Found in admin policies:
((SELECT is_admin FROM user_roles WHERE user_id = auth.uid()) = true)
```
This runs a subquery **for every row checked**. At scale, this is a seq-scan inside a subquery inside a policy evaluation. Better approach: Use a `has_admin_role()` IMMUTABLE function or a session variable set at login.

**2. Missing RLS on secondary tables**
- `tool_screenshots` — no RLS policies visible (default-deny is safe, but may break client queries)
- `comparison_items` — no RLS policies
- `ai_mentions` — no RLS policies
- `article_topics` — no RLS policies

**3. `FORCE RLS` not explicitly set**
The `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` without `FORCE RLS` means table owners (the service_role) bypass RLS. This is standard for Supabase but worth noting.

---

## 7. Triggers & Functions

### 7.1 Existing

```sql
-- From database.sql:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Trigger only applied to:
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Not applied to:
-- ❌ categories, reviews, comparisons, articles, tool_submissions, notifications
```

### 7.2 Missing Triggers

```sql
-- Apply to ALL tables with updated_at column:
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at ...;
CREATE TRIGGER update_comparisons_updated_at ...;
CREATE TRIGGER update_articles_updated_at ...;
CREATE TRIGGER update_tool_submissions_updated_at ...;
CREATE TRIGGER update_notifications_updated_at ...;
```

### 7.3 Missing Business Logic Triggers

```sql
-- 1. Auto-update tool avg_rating on review changes
CREATE OR REPLACE FUNCTION recalc_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tools SET
    avg_rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
                  WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
                  AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM reviews
                    WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
                    AND is_approved = true)
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Auto-increment tool view counter (avoid tool_views seq-scan)
-- Option A: Increment a views_count column on tools
-- Option B: Materialized view refreshed periodically
```

---

## 8. Search Architecture

### 8.1 Current State — **CRITICAL FLAW**

The current search implementation is entirely **application-level filtering**:

```typescript
// From services/tools.service.ts (pseudocode):
let query = supabase
  .from('tools')
  .select('*', { count: 'exact' })
  .eq('is_published', true)
  .textSearch('name', searchTerm)       -- ❌ No GIN index backing this
  .or(`tagline.ilike.%${term}%,description.ilike.%${term}%`) -- ❌ LIKE with leading wildcard = full seq-scan
```

**Problems:**
1. `textSearch()` uses `to_tsvector`/`to_tsquery` on-the-fly — **no GIN index** = seq scan + tokenization per query
2. `ilike` with leading `%` is **unindexable** — always seq scan
3. No weight vectors (name > tagline > description)
4. No trigram similarity search for fuzzy matching
5. Category filtering and search are separate query steps

### 8.2 Recommended Search Architecture

```sql
-- Phase 1: Full-text search vector
ALTER TABLE tools ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

CREATE INDEX idx_tools_search_vector ON tools USING GIN(search_vector);

-- Phase 2: Trigram search (fuzzy/typo-tolerant)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_tools_name_trgm ON tools USING GIN(name gin_trgm_ops);
CREATE INDEX idx_tools_tagline_trgm ON tools USING GIN(tagline gin_trgm_ops);

-- Phase 3: Combined search function
CREATE OR REPLACE FUNCTION search_tools(
  search_term TEXT,
  category_slug TEXT DEFAULT NULL,
  pricing_filter TEXT DEFAULT NULL,
  page_size INT DEFAULT 20,
  page_num INT DEFAULT 1
) RETURNS SETOF tools AS $$
  -- Use ts_query for ranked full-text + category join + pricing filter
  -- Fall back to trigram if ts_query returns no results
$$ LANGUAGE sql STABLE;
```

### 8.3 Service Layer Impact

The `tools.service.ts` search function needs to change from:
```typescript
// Current: application-level filter + pagination
const { data, count } = await supabase
  .rpc('search_tools', { search_term, category_slug, ... })
  .range(...);
```

**Recommendation:** Create a set of Postgres functions (RPCs) for complex queries rather than chaining Supabase JS filters. This gives:
- Single round-trip
- Server-side ranking
- Consistent pagination
- Index utilization

---

## 9. Service Layer Query Patterns

### 9.1 Overview of All 6 Service Files

| Service | Key Queries | Missing Indexes | Optimization Potential |
|---------|------------|-----------------|----------------------|
| `tools.service.ts` | List tools (paginated, filtered by category/pricing/search), get tool by slug, get trending, get featured | `is_published`, composite indexes, search index, trending time-window index | High |
| `categories.service.ts` | List all active categories, get by slug | `is_active`, `parent_id` | Medium |
| `articles.service.ts` | List published articles, get by slug | `is_published`, `published_at` | Medium |
| `comparisons.service.ts` | List published comparisons, get by slug with items | `is_published`, `comparison_items.comparison_id` FK+index | Low |
| `resources.service.ts` | (Newsletter + category-based queries) | Newsletter index | Low |
| `newsletter.service.ts` | Subscribe, unsubscribe, check subscription | `email` index | Low |

### 9.2 `tools.service.ts` — Deep Dive

```typescript
// Pattern 1: Paginated tool listing with category filter
const query = supabase
  .from('tools')
  .select('id, name, slug, tagline, ...', { count: 'exact' })
  .eq('is_published', true);

if (category) {
  // ❌ This adds a join via the JS client, not the DB
  // Supabase internally does: WHERE id IN (SELECT tool_id FROM tool_categories WHERE category_id = X)
  query.in('id', categoryToolIds);
}
```

**Issues:**
- `category` filter uses `in('id', ids)` — this loads **all** tool_ids for a category into memory, then passes them as a large IN clause
- At 10k+ tools, this array could be thousands of UUIDs — network payload bloat
- `count: 'exact'` performs a full COUNT on every paginated query — expensive at scale

**Recommendation:**
```typescript
// Use a DB RPC that does the join server-side:
const { data, count } = await supabase.rpc('get_paginated_tools', {
  p_category_slug: category || null,
  p_pricing: pricing || null,
  p_search: search || null,
  p_page: page,
  p_page_size: PAGE_SIZE
});
```

```sql
-- Server-side:
CREATE OR REPLACE FUNCTION get_paginated_tools(...)
RETURNS TABLE (tools JSON, total_count BIGINT) AS $$
  WITH filtered AS (
    SELECT t.* FROM tools t
    WHERE t.is_published = true
    AND (p_category_slug IS NULL OR EXISTS (
      SELECT 1 FROM tool_categories tc
      JOIN categories c ON c.id = tc.category_id
      WHERE tc.tool_id = t.id AND c.slug = p_category_slug
    ))
    -- ... pricing, search filters
  ),
  counted AS (
    SELECT COUNT(*) FROM filtered
  )
  SELECT
    (SELECT json_agg(sub) FROM (SELECT * FROM filtered ORDER BY created_at DESC LIMIT p_page_size OFFSET ((p_page-1)*p_page_size)) sub),
    (SELECT * FROM counted)
$$ LANGUAGE sql STABLE;
```

### 9.3 Pagination Pattern

**Current:** `range(from, to)` on Supabase queries  
**Issue:** At page 100 with 20 items/page, `OFFSET = 1980` — OFFSET-based pagination gets slower as page number increases

**Recommendation:** Use **keyset pagination** (cursor-based) for infinite scroll / "load more" and keep OFFSET only for admin pagination where jumping to arbitrary pages is needed.

```typescript
// Cursor-based pattern:
const { data } = await supabase.rpc('get_tools_cursor', {
  p_cursor: lastCreatedAt || null,  -- ISO timestamp
  p_limit: 21  -- fetch 21, return 20 + next cursor
});
```

---

## 10. Action Layer Mutation Patterns

### 10.1 Overview

| Action File | Mutations | Transaction Safety | Issues |
|------------|-----------|-------------------|--------|
| `admin/tools.ts` | Create/update/delete/approve tools | ❌ No atomic transactions for multi-table ops | ⚠️ Update tool + tool_categories in separate calls |
| `admin/reviews.ts` | Approve/reject/delete reviews | ✅ Single-table | None |
| `admin/users.ts` | Ban/assign role users | ❌ user_role changes via separate calls | ⚠️ No transaction wrapping |
| `admin/categories.ts` | CRUD categories | ✅ Single-table | None |
| `admin/articles.ts` | CRUD articles | ⚠️ Article + topics in separate calls | ⚠️ No atomicity |
| `admin/comparisons.ts` | CRUD comparisons + items | ⚠️ Comparison + items in separate calls | ⚠️ No atomicity |
| `admin/dashboard.ts` | Stats aggregation | N/A (reads only) | ⚠️ Expensive aggregations |
| `admin/newsletter.ts` | Send/manage newsletter | ✅ Single-table | None |
| `submissions/index.ts` | Create/draft/submit/approve/reject | ⚠️ No transaction linking submission → tool on approval | ⚠️ If tool creation fails, submission stays approved with no tool |
| `dashboard/bookmarks.ts` | Add/remove bookmarks | ✅ Single-table | None |
| `dashboard/notifications.ts` | Mark read | ✅ Single-table | None |

### 10.2 Missing Transaction Safety — `admin/tools.ts` (Example)

```typescript
// Current pattern:
async function updateTool(toolId: string, data: ToolData, categoryIds: string[]) {
  // Step 1: Update tool
  await supabase.from('tools').update(data).eq('id', toolId);

  // Step 2: Delete old categories
  await supabase.from('tool_categories').delete().eq('tool_id', toolId);

  // Step 3: Insert new categories
  await supabase.from('tool_categories').insert(
    categoryIds.map(cid => ({ tool_id: toolId, category_id: cid }))
  );
  // ❌ If step 2 or 3 fails, tool data is updated but categories are inconsistent
}
```

**Recommendation:** Use Supabase RPCs for multi-table mutations or use PostgreSQL advisory locks / transaction wrapping:

```sql
CREATE OR REPLACE FUNCTION update_tool_with_categories(
  p_tool_id UUID,
  p_data JSONB,
  p_category_ids UUID[]
) RETURNS void AS $$
BEGIN
  -- Validate tool exists
  IF NOT EXISTS (SELECT 1 FROM tools WHERE id = p_tool_id) THEN
    RAISE EXCEPTION 'Tool not found';
  END IF;

  -- Update tool
  UPDATE tools SET
    name = COALESCE(p_data->>'name', name),
    slug = COALESCE(p_data->>'slug', slug),
    -- ... other fields
  WHERE id = p_tool_id;

  -- Replace categories atomically
  DELETE FROM tool_categories WHERE tool_id = p_tool_id;
  INSERT INTO tool_categories (tool_id, category_id)
    SELECT p_tool_id, unnest(p_category_ids);
END;
$$ LANGUAGE plpgsql;
```

### 10.3 Submission-to-Tool Flow — Race Condition Risk

```typescript
// Current: approve submission → create tool (separate calls)
async function approveSubmission(submissionId: string) {
  const submission = await supabase.from('tool_submissions')
    .update({ status: 'approved' })
    .eq('id', submissionId)
    .select()
    .single();

  // Then create the tool (no transaction linking)
  const { data: tool } = await supabase.from('tools')
    .insert({ name: submission.name, website_url: submission.website_url, ... })
    .select()
    .single();

  // Then link submission to tool (third call)
  await supabase.from('tool_submissions')
    .update({ tool_id: tool.id })
    .eq('id', submissionId);
}
```

**Risk:** If the tool INSERT fails (e.g., duplicate slug), the submission is marked as `approved` but has no tool — orphaned approval.

---

## 11. Data Integrity & Normalization

### 11.1 Normalization Violations

| Issue | Location | Severity | Impact |
|-------|----------|----------|--------|
| **Duplicate `categories_old` table** | Separate table | Low | Dead data, confusion |
| **No `user_profiles` table** | Auth metadata only | **High** | User metadata typed as `jsonb` in auth.users — no constraints, no FK, no queryability |
| **`author_id` as bare UUID** | articles, comparisons | **High** | No referential integrity |
| **Tool avg_rating calc** | Always live-computed | **Medium** | Repeated aggregation cost |
| **Tool view count** | Always live-counted | **Medium** | Repeated aggregation cost |
| **Pricing type as TEXT** | tools.pricing_type | Low | Should be an enum, but CHECK constraint exists |
| **Status as TEXT** | tool_submissions.status | Low | Should be a CHECK constraint or enum type |

### 11.2 Data Type Inconsistencies

| Column | Current Type | Recommended | Reason |
|--------|-------------|-------------|--------|
| `tool_submissions.category_id` | UUID | UUID | ✅ Fine |
| `tool_submissions.submitter_email` | TEXT | TEXT (with email format CHECK) | Add constraint |
| `notifications.type` | TEXT | TEXT (with CHECK or enum) | Prevent typos |
| `categories.color` | TEXT | TEXT | ✅ Fine |
| `tools.pricing_type` | TEXT | TEXT (CHECK exists) | ✅ Already constrained |
| Various `created_at` | TIMESTAMPTZ | TIMESTAMPTZ DEFAULT NOW() | ✅ Consistent across most tables |

### 11.3 Missing `deleted_at` on ALL Tables

**Impact:**
- Accidental hard deletes lose data permanently
- No audit trail of deletions
- Cannot implement "trash / restore" functionality
- Referential integrity issues when related rows are hard-deleted

**Recommendation:**
```sql
ALTER TABLE tools ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE reviews ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE comparisons ADD COLUMN deleted_at TIMESTAMPTZ;
-- ... all content tables
```

Update RLS policies to exclude `deleted_at IS NOT NULL` rows.

---

## 12. Scalability Bottlenecks

### 12.1 Query Performance at Scale

| Query Pattern | Current Behavior | At 10k Tools | At 100k Tools | Mitigation |
|--------------|-----------------|--------------|---------------|------------|
| Category tool listing | Seq scan + IN clause | ~200ms | ~2-5s | Composite indexes + RPC |
| Search 'ilike' | Seq scan with wildcard | ~100ms | ~1-2s | FTS vector + GIN index |
| Tool page (with reviews) | 3-5 individual queries | ~150ms | ~300ms | Fewer round-trips, use `select(*, reviews(*))` |
| Trending tools | Count tool_views, join tools | ~500ms | ~5-10s | Materialized view |
| Count queries | `count: 'exact'` on every list | ~100ms | ~500ms-2s | Approximation or estimated count |
| Admin dashboard | Multiple aggregation queries | ~1s | ~10-30s | Materialized admin stats |

### 12.2 N+1 Query Patterns

**Found in service layer:**

```typescript
// In tools.service.ts — fetching tools then categories for each:
const tools = await getTools();
for (const tool of tools) {
  const categories = await supabase
    .from('tool_categories')
    .select('category_id')
    .eq('tool_id', tool.id);
  // ❌ N+1 queries
}
```

**Better:**
```typescript
// Single query with join:
const { data } = await supabase
  .from('tools')
  .select('*, tool_categories(category:categories(*))');
```

### 12.3 Materialized View Candidates

```sql
-- 1. Tool search denormalized (flattened categories, avg_rating, view_count)
CREATE MATERIALIZED VIEW tool_search_view AS
SELECT
  t.id, t.name, t.slug, t.tagline, t.description,
  t.pricing_type, t.price_amount, t.logo_thumbnail,
  t.is_featured, t.created_at,
  COALESCE(AVG(r.rating)::numeric(3,2), 0) AS avg_rating,
  COUNT(DISTINCT r.id) AS review_count,
  COUNT(DISTINCT tv.id) AS view_count,
  array_agg(DISTINCT c.slug) FILTER (WHERE c.slug IS NOT NULL) AS category_slugs,
  array_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS category_names
FROM tools t
LEFT JOIN reviews r ON r.tool_id = t.id AND r.is_approved = true
LEFT JOIN tool_views tv ON tv.tool_id = t.id
LEFT JOIN tool_categories tc ON tc.tool_id = t.id
LEFT JOIN categories c ON c.id = tc.category_id AND c.is_active = true
WHERE t.is_published = true AND t.deleted_at IS NULL
GROUP BY t.id;

CREATE UNIQUE INDEX idx_tool_search_view_id ON tool_search_view(id);
CREATE INDEX idx_tool_search_view_name ON tool_search_view USING GIN(name gin_trgm_ops);
CREATE INDEX idx_tool_search_view_category ON tool_search_view USING GIN(category_slugs);

REFRESH MATERIALIZED VIEW CONCURRENTLY tool_search_view;
-- Refresh every 5-15 minutes via pg_cron or application scheduler
```

### 12.4 Connection Pooling

**Current state:** Supabase direct client connections (no custom pooler configured for Edge Functions).  
**At scale (500+ concurrent users):** Default Supabase pool (15 connections) will exhaust.  
**Mitigation:** Use Supabase's built-in connection pooler (Supavisor) with `?pgbouncer=true` connection string. Ensure all Edge Functions and server components use the pooler.

---

## 13. Security Gaps

### 13.1 Missing RLS Policies

| Table | Missing Action | Risk |
|-------|---------------|------|
| `tool_categories` | No UPDATE/DELETE policies | Admin operations may fail (using service_role key bypasses RLS, but frontend admin panel calls may be blocked) |
| `notifications` | No INSERT/DELETE policies | System cannot create notifications via client; must use service_role |
| `tool_screenshots` | No RLS at all | Anyone could read/write (default-deny if table not exposed in API) |
| `comparison_items` | No RLS | Anyone could modify comparison contents |
| `ai_mentions` | No RLS | Content accessible to all |
| `article_topics` | No RLS | Topic associations unprotected |

### 13.2 SQL Injection Vectors

The following patterns in the service layer are vulnerable if user input is not properly sanitized:

```typescript
// ❌ Unsafe — Supabase treats this as a parameter, but .or() with string interpolation is risky
.or(`tagline.ilike.%${term}%,description.ilike.%${term}%`)
```

**Mitigation:** Use Supabase's `.textSearch()` for FTS (parameterized) or RPCs with `sql` tagged templates.

### 13.3 API Exposure Risk

**Current state:** Supabase auto-generates REST API for all tables with RLS. Tables without explicit RLS are accessible to anyone with the anon key.

**Mitigation:**
```sql
-- For tables that should not be client-accessible:
REVOKE ALL ON table_name FROM anon, authenticated;
-- Or specifically enable RLS:
ALTER TABLE tool_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_topics ENABLE ROW LEVEL SECURITY;
```

### 13.4 Rate Limiting

**Current state:** No application-level rate limiting on:
- Tool submissions (spam risk)
- Reviews (spam/brigading risk)
- Newsletter subscriptions (email list bombing)
- View counting (view inflation)

**Recommendation:** Implement Supabase's `auth_hooks` or middleware for rate limiting, or add application-level rate limiting in the action layer.

---

## 14. Missing Features / Schema Gaps

### 14.1 Tables That Should Exist

| Table | Purpose | Priority |
|-------|---------|----------|
| `user_profiles` | Extended user data (avatar, bio, website, social links, notification prefs) | **High** — auth.users raw metadata is not queryable |
| `tool_tags` | Many-to-many tags on tools (vs. rigid category tree) | **Medium** — user-generated tagging |
| `tool_collections` | User-created curated lists of tools | **Medium** — community feature |
| `saved_searches` | Saved search filters per user | **Low** — convenience feature |
| `analytics_page_views` | General page view analytics (not just tool pages) | **Medium** — marketing insights |
| `feature_flags` | A/B testing and gradual rollouts | **Medium** — ops feature |
| `audit_log` | Admin action audit trail | **Medium** — compliance |

### 14.2 Columns Missing from Existing Tables

| Table | Missing Column | Reason |
|-------|---------------|--------|
| `tools` | `avg_rating DECIMAL(3,2)` | Denormalized average rating |
| `tools` | `review_count INTEGER` | Denormalized count |
| `tools` | `view_count INTEGER` | Denormalized view count |
| `tools` | `search_vector tsvector` | Full-text search |
| `tools` | `deleted_at TIMESTAMPTZ` | Soft delete |
| `bookmarks` | `folder TEXT` or `collection_id UUID` | Organization |
| `reviews` | `UNIQUE(tool_id, user_id)` | One review per user per tool |
| `notifications` | `link TEXT` or `action_url TEXT` | Clickable notifications |
| `categories` | `deleted_at TIMESTAMPTZ` | Soft delete |
| `articles` | `search_vector tsvector` | Full-text search for articles |

---

## 15. Migration Plan (Prioritized)

### Phase 0 — Schema Consistency (Do First, Safe)

1. **Add missing `deleted_at` columns** to all content tables
2. **Add `updated_at` triggers** to all tables that have the column
3. **Add CHECK constraints** to `tool_submissions.status`, `notifications.type`
4. **Drop `categories_old`** table (after verifying no dependencies)
5. **Apply RLS** to unprotected tables (`tool_screenshots`, `comparison_items`, `ai_mentions`, `article_topics`)

### Phase 1 — Performance (Before Public Launch Scalability)

1. **Add all missing indexes** (Section 5.2 — all Critical priority)
2. **Add full-text search vector** to `tools` with GIN index
3. **Create search RPC function** to replace client-side filtering
4. **Create materialized view** `tool_search_view` for complex listing queries
5. **Add composite indexes** for common query patterns

### Phase 2 — Data Integrity (Before Major Growth)

1. **Add foreign keys** to all tables missing them (Section 4.1)
2. **Create `user_profiles` table** and migrate data from `auth.users.raw_user_meta_data`
3. **Add `UNIQUE(tool_id, user_id)`** to reviews
4. **Add denormalized `avg_rating` and `review_count`** to tools with a trigger

### Phase 3 — Advanced Features

1. **Article full-text search** vector + GIN index
2. **Updated_at trigger** for remaining tables
3. **Rate limiting** on submissions, reviews, newsletter
4. **Audit log table** for admin actions
5. **Keyset pagination** support in RPC functions

### Phase 4 — Optimization

1. **Materialized view** for admin dashboard stats
2. **Materialized view** for trending tools (time-windowed)
3. **Tool_views deduplication** (unique per IP + date)
4. **Review votes** — prevent UPDATE, only INSERT/DELETE

---

## 16. Conclusion

The LinkDit database is **functional for a small launch** but requires significant investment before it can handle 10k+ tools or 100k+ monthly active users.

### Must-Fix Before Marketing/Launch
1. ✅ Full-text search indexes (tools, articles)
2. ✅ Missing foreign keys on `tool_categories`, `comparison_items`, `notifications`
3. ✅ All missing "Critical" indexes from Section 5.2
4. ✅ Soft delete (`deleted_at`) on all content tables
5. ✅ RLS coverage for all exposed tables

### Must-Fix Within First 3 Months Post-Launch
1. ✅ `user_profiles` table
2. ✅ Denormalized tool ratings with triggers
3. ✅ Materialized search view
4. ✅ RPC functions for complex queries
5. ✅ Admin audit log

### Architectural Score

| Category | Score (1-10) | Trend |
|----------|-------------|-------|
| Schema Design | 6/10 | Needs FK cleanup + normalization |
| Indexing | 3/10 | Critical gaps in every query path |
| RLS Security | 5/10 | Missing policies, subquery perf issues |
| Search | 2/10 | Effectively no DB-level search |
| Data Integrity | 4/10 | No FKs on join tables, no soft delete |
| Scalability | 3/10 | OFFSET pagination, no materialized views |
| Query Patterns | 4/10 | N+1 patterns, no RPCs for complex queries |
| Mutation Safety | 4/10 | No transactions for multi-table ops |
| **Overall** | **3.9/10** | **Needs prioritized investment** |

---

## Appendix A: Complete Missing Indexes SQL

```sql
-- === CRITICAL ===
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_tools_is_published ON tools(is_published);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);
CREATE INDEX idx_tools_pricing_type ON tools(pricing_type);
CREATE INDEX idx_tools_published_featured_date ON tools(is_published, is_featured, created_at DESC);
CREATE INDEX idx_tool_categories_category_id ON tool_categories(category_id);
CREATE INDEX idx_tool_views_tool_id ON tool_views(tool_id);
CREATE INDEX idx_tool_views_tool_id_viewed_at ON tool_views(tool_id, viewed_at DESC);
CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_tool_id_approved_date ON reviews(tool_id, is_approved, created_at DESC);

-- === HIGH ===
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_tool_submissions_status ON tool_submissions(status);
CREATE INDEX idx_tool_submissions_email ON tool_submissions(submitter_email);
CREATE INDEX idx_articles_is_published ON articles(is_published);
CREATE INDEX idx_comparisons_is_published ON comparisons(is_published);

-- === MEDIUM ===
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_comparison_votes_comparison_id ON comparison_votes(comparison_id);
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_enterprise_requests_status ON enterprise_requests(status);

-- === SEARCH ===
CREATE EXTENSION IF NOT EXISTS pg_trgm;
ALTER TABLE tools ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;
CREATE INDEX idx_tools_search_vector ON tools USING GIN(search_vector);
CREATE INDEX idx_tools_name_trgm ON tools USING GIN(name gin_trgm_ops);
CREATE INDEX idx_tools_tagline_trgm ON tools USING GIN(tagline gin_trgm_ops);
```

## Appendix B: Complete Missing Foreign Keys SQL

```sql
-- tool_categories
ALTER TABLE tool_categories
  ADD CONSTRAINT fk_tool_categories_tool
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;
ALTER TABLE tool_categories
  ADD CONSTRAINT fk_tool_categories_category
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- comparison_items
ALTER TABLE comparison_items
  ADD CONSTRAINT fk_comparison_items_comparison
  FOREIGN KEY (comparison_id) REFERENCES comparisons(id) ON DELETE CASCADE;
ALTER TABLE comparison_items
  ADD CONSTRAINT fk_comparison_items_tool
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

-- notifications
ALTER TABLE notifications
  ADD CONSTRAINT fk_notifications_user
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- comparisons
ALTER TABLE comparisons
  ADD CONSTRAINT fk_comparisons_author
  FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- articles
ALTER TABLE articles
  ADD CONSTRAINT fk_articles_author
  FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- tool_submissions
ALTER TABLE tool_submissions
  ADD CONSTRAINT fk_tool_submissions_tool
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE SET NULL;
ALTER TABLE tool_submissions
  ADD CONSTRAINT fk_tool_submissions_category
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
```

## Appendix C: RLS Gap-Fill SQL

```sql
-- Protect all uncovered tables
ALTER TABLE tool_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_topics ENABLE ROW LEVEL SECURITY;

-- Basic policies for protected tables
CREATE POLICY "Anyone can view tool_screenshots"
  ON tool_screenshots FOR SELECT USING (true);
CREATE POLICY "Admins can manage tool_screenshots"
  ON tool_screenshots FOR ALL USING (
    (SELECT is_admin FROM user_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can view comparison_items"
  ON comparison_items FOR SELECT USING (true);
-- Comparison items should be managed via the comparison owner
CREATE POLICY "Comparison owner manages items"
  ON comparison_items FOR INSERT USING (
    EXISTS (SELECT 1 FROM comparisons WHERE id = comparison_id AND author_id = auth.uid())
  );
CREATE POLICY "Comparison owner updates items"
  ON comparison_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM comparisons WHERE id = comparison_id AND author_id = auth.uid())
  );
CREATE POLICY "Comparison owner deletes items"
  ON comparison_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM comparisons WHERE id = comparison_id AND author_id = auth.uid())
  );

-- Notifications: system can insert, user can read/update own
CREATE POLICY "System inserts notifications"
  ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Fix admin policy performance (replace subquery with a function)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND is_admin = true);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Then rewrite policies to use: is_admin()
```

---

*End of Database Architecture Audit. All analysis based on source code as of 2026-07-14. No database or code was modified during this audit.*
