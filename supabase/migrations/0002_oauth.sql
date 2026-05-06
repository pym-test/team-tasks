-- Add assignee_id and created_by columns referencing auth.users
alter table public.tasks
  add column assignee_id uuid references auth.users(id) on delete set null,
  add column created_by  uuid references auth.users(id) on delete cascade;

-- Drop rows created without authentication before enforcing not null
delete from public.tasks where created_by is null;

alter table public.tasks
  alter column created_by set not null;

-- Remove temporary blanket access policy
drop policy if exists temp_all_access on public.tasks;

-- RLS policies
create policy tasks_select on public.tasks
  for select
  using (
    auth.uid() = created_by or
    auth.uid() = assignee_id
  );

create policy tasks_insert on public.tasks
  for insert
  with check (auth.uid() = created_by);

create policy tasks_update on public.tasks
  for update
  using (
    auth.uid() = created_by or
    auth.uid() = assignee_id
  );

create policy tasks_delete on public.tasks
  for delete
  using (auth.uid() = created_by);
