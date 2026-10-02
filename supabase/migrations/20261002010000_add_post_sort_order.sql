alter table public.posts
  add column if not exists sort_order bigint;

with ranked_posts as (
  select
    id,
    row_number() over (order by created_at desc, id desc) as position
  from public.posts
)
update public.posts as post
set sort_order = ranked_posts.position
from ranked_posts
where post.id = ranked_posts.id;

alter table public.posts
  alter column sort_order set not null;

create or replace function public.move_post(target_post_id integer, move_direction text)
returns void
language plpgsql
set search_path = public
as $function$
declare
  current_sort_order bigint;
  neighbor_id integer;
  neighbor_sort_order bigint;
begin
  select sort_order
  into current_sort_order
  from public.posts
  where id = target_post_id;

  if not found then
    return;
  end if;

  if move_direction = 'up' then
    select id, sort_order
    into neighbor_id, neighbor_sort_order
    from public.posts
    where sort_order < current_sort_order
    order by sort_order desc
    limit 1;
  elsif move_direction = 'down' then
    select id, sort_order
    into neighbor_id, neighbor_sort_order
    from public.posts
    where sort_order > current_sort_order
    order by sort_order asc
    limit 1;
  else
    raise exception 'move_direction must be up or down';
  end if;

  if neighbor_id is null then
    return;
  end if;

  update public.posts
  set sort_order = case
    when id = target_post_id then neighbor_sort_order
    else current_sort_order
  end
  where id in (target_post_id, neighbor_id);
end;
$function$;

revoke all on function public.move_post(integer, text) from public;
grant execute on function public.move_post(integer, text) to anon, authenticated;

notify pgrst, 'reload schema';