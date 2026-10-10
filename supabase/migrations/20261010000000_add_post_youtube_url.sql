alter table public.posts
  add column if not exists youtube_url text;

notify pgrst, 'reload schema';
