-- Galeri gambar produk (JSON array + storage bucket)
-- WAJIB dijalankan jika fitur galeri / simpan produk error "gallery_images" / "schema cache".
-- Supabase Dashboard → SQL Editor → tempel file ini → Run.

alter table public.products
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

comment on column public.products.gallery_images is
  'Array of { "path": "rel/to/bucket" } untuk Supabase storage, atau { "url": "https://..." } untuk URL eksternal. Opsional: "alt" string.';

insert into storage.buckets (id, name, public)
values ('product-gallery', 'product-gallery', true)
on conflict (id) do nothing;

drop policy if exists "product_gallery_public_read" on storage.objects;
create policy "product_gallery_public_read"
  on storage.objects for select
  using (bucket_id = 'product-gallery');

drop policy if exists "product_gallery_upload_admin" on storage.objects;
create policy "product_gallery_upload_admin"
  on storage.objects for insert
  with check (bucket_id = 'product-gallery' and public.is_admin());

drop policy if exists "product_gallery_update_admin" on storage.objects;
create policy "product_gallery_update_admin"
  on storage.objects for update
  using (bucket_id = 'product-gallery' and public.is_admin())
  with check (bucket_id = 'product-gallery' and public.is_admin());

drop policy if exists "product_gallery_delete_admin" on storage.objects;
create policy "product_gallery_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'product-gallery' and public.is_admin());
