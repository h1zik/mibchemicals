-- Kategori artikel + FK dari posts (mirip product_categories).
-- Jalankan setelah migrasi sebelumnya.

create table if not exists public.post_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_post_categories_updated on public.post_categories;
create trigger trg_post_categories_updated
  before update on public.post_categories
  for each row execute procedure public.set_updated_at();

alter table public.post_categories enable row level security;

drop policy if exists "post_categories_select_public" on public.post_categories;
create policy "post_categories_select_public"
  on public.post_categories for select
  using (true);

drop policy if exists "post_categories_write_admin" on public.post_categories;
create policy "post_categories_write_admin"
  on public.post_categories for all
  using (public.is_admin())
  with check (public.is_admin());

insert into public.post_categories (slug, name, sort_order) values
  ('umum', 'Umum', 0),
  ('berita', 'Berita', 10),
  ('studi-kasus', 'Studi kasus', 20),
  ('industri', 'Industri', 30)
on conflict (slug) do nothing;

alter table public.posts
  add column if not exists category_id uuid references public.post_categories (id) on delete restrict;

update public.posts p
set category_id = pc.id
from public.post_categories pc
where p.category_id is null and p.post_type = 'news' and pc.slug = 'berita';

update public.posts p
set category_id = pc.id
from public.post_categories pc
where p.category_id is null and p.post_type = 'case_study' and pc.slug = 'studi-kasus';

update public.posts
set category_id = (select id from public.post_categories where slug = 'umum' limit 1)
where category_id is null;

alter table public.posts alter column category_id set not null;

create index if not exists idx_posts_category_id on public.posts (category_id);
