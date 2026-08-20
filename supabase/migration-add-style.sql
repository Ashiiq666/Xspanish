-- =========================================================
-- X SPANISH — add product "style"
-- Run once in Supabase: SQL Editor > New query > Run
--
-- Safe to re-run. Existing products get an empty style and keep working;
-- they simply won't appear under a style card until one is set.
-- =========================================================

alter table public.products
    add column if not exists style text;

-- Style pages filter on (category, style), so index the pair
create index if not exists products_category_style_idx
    on public.products (category, style);
