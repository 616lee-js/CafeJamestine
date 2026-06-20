-- Phase 2: private "images" bucket + per-user storage RLS.
-- Objects live at <user_id>/coffees/<coffee_id>/<uuid>.<ext> (and <user_id>/equipment/<id>/…).
-- The first path segment must equal the owner's auth.uid().

insert into storage.buckets (id, name, public)
values ('images', 'images', false)
on conflict (id) do nothing;

-- storage.objects already has RLS enabled by Supabase; add owner-scoped policies.
drop policy if exists "images_select_own" on storage.objects;
drop policy if exists "images_insert_own" on storage.objects;
drop policy if exists "images_update_own" on storage.objects;
drop policy if exists "images_delete_own" on storage.objects;

create policy "images_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "images_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "images_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "images_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);
