-- Delete all tasks from the tasks table
DELETE FROM public.tasks;

-- Verify deletion
SELECT COUNT(*) as remaining_tasks FROM public.tasks;