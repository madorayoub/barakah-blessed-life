-- Enable real-time for tasks table
ALTER TABLE public.tasks REPLICA IDENTITY FULL;

-- Add the tasks table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;