-- Kategori produk (tabel terpisah) + FK dari products; migrasi dari kolom teks `category`.
-- Jalankan setelah 001–004. Di Supabase: SQL Editor → tempel → Run.

create or replace function public.category_name_to_slug(raw text)
returns text
language sql
immutable
as $$
  select nullif(
    lower(regexp_replace(regexp_replace(trim(raw), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')),
    ''
  );
$$;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_product_categories_updated on public.product_categories;
create trigger trg_product_categories_updated
  before update on public.product_categories
  for each row execute procedure public.set_updated_at();

alter table public.product_categories enable row level security;

drop policy if exists "product_categories_select_public" on public.product_categories;
create policy "product_categories_select_public"
  on public.product_categories for select
  using (true);

drop policy if exists "product_categories_write_admin" on public.product_categories;
create policy "product_categories_write_admin"
  on public.product_categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Kolom FK (nullable sampai backfill)
alter table public.products
  add column if not exists category_id uuid references public.product_categories (id) on delete restrict;

insert into public.product_categories (slug, name, sort_order) values
  ('general', 'General', 0),
  ('water-treatment', 'Water Treatment', 10),
  ('oil-gas', 'Oil & Gas', 20)
on conflict (slug) do nothing;

-- Backfill dari kolom teks `category` hanya jika kolom itu masih ada (aman jika migrasi dijalankan ulang).
do $$
declare
  has_legacy boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'category'
  ) into has_legacy;

  if has_legacy then
    execute $legacy$
do $inner$
declare
  cat_name text;
  base_slug text;
  final_slug text;
  n int;
begin
  for cat_name in
    select distinct trim(p.category)
    from public.products p
    where trim(coalesce(p.category, '')) != ''
      and not exists (
        select 1 from public.product_categories pc
        where lower(pc.name) = lower(trim(p.category))
      )
  loop
    base_slug := coalesce(nullif(public.category_name_to_slug(cat_name), ''), 'kat');
    final_slug := base_slug;
    n := 0;
    while exists (select 1 from public.product_categories where slug = final_slug) loop
      n := n + 1;
      final_slug := base_slug || '-' || n::text;
    end loop;
    insert into public.product_categories (slug, name, sort_order)
    values (final_slug, cat_name, 100);
  end loop;

  update public.products p
  set category_id = pc.id
  from public.product_categories pc
  where p.category_id is null
    and lower(trim(p.category)) = lower(pc.name);
end
$inner$;
$legacy$;
  end if;
end $$;

update public.products
set category_id = (select id from public.product_categories where slug = 'general' limit 1)
where category_id is null;

alter table public.products alter column category_id set not null;

alter table public.products drop column if exists category;

create index if not exists idx_products_category_id on public.products (category_id);
