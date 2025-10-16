create or replace function public.create_recurring_child(p_parent uuid, p_due date)
returns public.tasks as
$$
declare
  inserted public.tasks;
begin
  insert into public.tasks (
    user_id,
    parent_task_id,
    title,
    description,
    priority,
    status,
    category_id,
    due_date,
    is_recurring
  )
  select
    t.user_id,
    t.id,
    t.title,
    t.description,
    t.priority,
    'pending',
    t.category_id,
    p_due,
    false
  from public.tasks t
  where t.id = p_parent
  on conflict (parent_task_id, due_date) do nothing
  returning * into inserted;

  return inserted;
end;
$$
language plpgsql
security definer
set search_path = public;
