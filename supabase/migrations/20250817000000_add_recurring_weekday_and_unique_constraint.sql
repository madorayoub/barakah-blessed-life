-- Ensure recurring tasks have a consistent weekday and avoid duplicate children
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS recurring_weekday integer;

CREATE UNIQUE INDEX IF NOT EXISTS tasks_parent_due_date_unique
ON public.tasks (parent_task_id, due_date)
WHERE parent_task_id IS NOT NULL;
