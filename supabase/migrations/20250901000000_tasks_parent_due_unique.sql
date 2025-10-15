create unique index if not exists tasks_parent_due_unique
  on public.tasks (parent_task_id, due_date)
  where parent_task_id is not null;
