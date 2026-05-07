create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks(id) on delete cascade,
  body       text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy comments_select on public.comments
  for select
  using (auth.uid() is not null);

create policy comments_insert on public.comments
  for insert
  with check (auth.uid() = created_by);

create policy comments_update on public.comments
  for update
  using (auth.uid() = created_by);

create policy comments_delete on public.comments
  for delete
  using (auth.uid() = created_by);
