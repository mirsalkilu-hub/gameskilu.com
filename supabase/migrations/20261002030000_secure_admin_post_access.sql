create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $function$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$function$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.posts enable row level security;

revoke all on table public.posts from public, anon, authenticated;
grant select on table public.posts to anon, authenticated;
grant insert, update, delete on table public.posts to authenticated;

create policy posts_public_read
  on public.posts
  for select
  to anon, authenticated
  using (true);

create policy posts_admin_insert
  on public.posts
  for insert
  to authenticated
  with check (public.is_admin());

create policy posts_admin_insert_guard
  on public.posts
  as restrictive
  for insert
  to authenticated
  with check (public.is_admin());

create policy posts_admin_update
  on public.posts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy posts_admin_update_guard
  on public.posts
  as restrictive
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy posts_admin_delete
  on public.posts
  for delete
  to authenticated
  using (public.is_admin());

create policy posts_admin_delete_guard
  on public.posts
  as restrictive
  for delete
  to authenticated
  using (public.is_admin());

notify pgrst, 'reload schema';