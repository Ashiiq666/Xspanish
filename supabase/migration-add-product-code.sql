-- =========================================================
-- X SPANISH — add product code (SKU)
-- Run once in Supabase: SQL Editor > New query > Run
--
-- Safe to re-run, and safe to run even if you never ran the earlier
-- style migration: both columns are added only if missing.
--
-- No uniqueness constraint on purpose. A duplicate code should not make
-- a save fail with a database error mid-edit — the dashboard warns about
-- duplicates instead, and you decide.
-- =========================================================

alter table public.products
    add column if not exists sku text;

-- Carried over from migration-add-style.sql so a single run brings an
-- older database fully up to date.
alter table public.products
    add column if not exists style text;

-- Looking a product up by its code should not scan the table
create index if not exists products_sku_idx
    on public.products (sku)
    where sku is not null;

-- Style pages filter on (category, style)
create index if not exists products_category_style_idx
    on public.products (category, style);
