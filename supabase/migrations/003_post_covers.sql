-- Sampul artikel (posts.cover_image_url → public URL bucket post-covers)
-- Jalankan di Supabase SQL Editor jika belum ada bucket ini.

insert into storage.buckets (id, name, public)
values ('post-covers', 'post-covers', true)
on conflict (id) do nothing;

drop policy if exists "post_covers_public_read" on storage.objects;
create policy "post_covers_public_read"
  on storage.objects for select
  using (bucket_id = 'post-covers');

drop policy if exists "post_covers_upload_admin" on storage.objects;
create policy "post_covers_upload_admin"
  on storage.objects for insert
  with check (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "post_covers_update_admin" on storage.objects;
create policy "post_covers_update_admin"
  on storage.objects for update
  using (bucket_id = 'post-covers' and public.is_admin())
  with check (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "post_covers_delete_admin" on storage.objects;
create policy "post_covers_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'post-covers' and public.is_admin());
