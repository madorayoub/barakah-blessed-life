-- Delete all tasks for the current user
DELETE FROM public.tasks 
WHERE user_id = auth.uid();

-- Reset any auto-increment sequences if needed
-- Note: This will delete all tasks for the authenticated user only