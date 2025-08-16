-- Add missing estimated_duration column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN estimated_duration integer;