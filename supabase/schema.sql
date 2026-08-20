-- =========================================================
-- X SPANISH — Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor > New query > Run
-- =========================================================

-- ---------------------------------------------------------
-- Products
-- ---------------------------------------------------------
create table if not exists public.products (
    id           uuid primary key default gen_random_uuid(),

    name         text        not null,
    brand        text,
    category     text        not null default 'shirts',   -- shirts | tshirts | jeans | trousers | ethnic | accessories
    style        text,                                    -- e.g. Formal, Printed, Linen — drives the style pages

    price        numeric(10,2) not null check (price >= 0),
    old_price    numeric(10,2)              check (old_price is null or old_price >= 0),

    image_url    text,
    image_path   text,          -- storage object path, kept so deletes can clean up the file

    sizes        text[]      not null default '{}',       -- {S,M,L,XL,XXL}
    colors       jsonb       not null default '[]',       -- [{"name":"Black","hex":"#1c1c1c"}]

    is_new       boolean     not null default false,      -- drives the "New" badge
    offer_tag    text,                                    -- free text, e.g. "20% OFF" — shown when set
    collections  text[]      not null default '{}',       -- {new,best,shirts,ethnic,casual} carousel groups

    in_stock     boolean     not null default true,
    sort_order   integer     not null default 0,

    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- Storefront reads filter on these
create index if not exists products_sort_idx        on public.products (sort_order, created_at desc);
create index if not exists products_category_idx    on public.products (category);
create index if not exists products_category_style_idx on public.products (category, style);
create index if not exists products_collections_idx on public.products using gin (collections);

-- Keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
    before update on public.products
    for each row execute function public.touch_updated_at();


-- ---------------------------------------------------------
-- Row Level Security
--
-- The anon key ships in the public site, so it must only ever
-- be able to READ. Every write requires a signed-in admin.
-- ---------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products are publicly readable"   on public.products;
drop policy if exists "admins can insert products"        on public.products;
drop policy if exists "admins can update products"        on public.products;
drop policy if exists "admins can delete products"        on public.products;

create policy "products are publicly readable"
    on public.products for select
    to anon, authenticated
    using (true);

create policy "admins can insert products"
    on public.products for insert
    to authenticated
    with check (true);

create policy "admins can update products"
    on public.products for update
    to authenticated
    using (true) with check (true);

create policy "admins can delete products"
    on public.products for delete
    to authenticated
    using (true);


-- ---------------------------------------------------------
-- Storage bucket for product photography
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product images are publicly readable" on storage.objects;
drop policy if exists "admins can upload product images"     on storage.objects;
drop policy if exists "admins can update product images"     on storage.objects;
drop policy if exists "admins can delete product images"     on storage.objects;

create policy "product images are publicly readable"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'product-images');

create policy "admins can upload product images"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'product-images');

create policy "admins can update product images"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'product-images');

create policy "admins can delete product images"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'product-images');
