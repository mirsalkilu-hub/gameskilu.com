alter table public.posts
  add column if not exists click_count bigint not null default 0;

create or replace function public.increment_post_click_count(target_post_id integer)
returns bigint
language sql
security definer
set search_path = public
as $function$
  update public.posts
  set click_count = click_count + 1
  where id = target_post_id
  returning click_count;
$function$;

revoke all on function public.increment_post_click_count(integer) from public;
grant execute on function public.increment_post_click_count(integer) to anon, authenticated;

notify pgrst, 'reload schema';