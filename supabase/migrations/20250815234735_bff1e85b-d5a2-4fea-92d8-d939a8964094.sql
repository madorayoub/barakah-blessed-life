-- Update task_templates RLS policy to be more restrictive
-- Only allow users to see system templates or make all templates truly public
-- For now, we'll keep the current behavior but add better documentation
-- and prepare for potential user-specific templates

-- First, let's add a column to track if templates should be publicly visible
ALTER TABLE public.task_templates 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing templates to be public (maintaining current behavior)
UPDATE public.task_templates 
SET is_public = true 
WHERE is_public IS NULL;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view templates" ON public.task_templates;

-- Create a more secure policy that only shows public templates
CREATE POLICY "Users can view public templates" 
ON public.task_templates 
FOR SELECT 
USING (is_public = true);

-- Add index for better performance on the new column
CREATE INDEX IF NOT EXISTS idx_task_templates_is_public ON public.task_templates(is_public);

-- Add a policy for potential future user-specific templates
-- (Currently no user_id column, but this prepares for that possibility)
CREATE POLICY "System can manage templates" 
ON public.task_templates 
FOR ALL 
USING (is_system = true)
WITH CHECK (is_system = true);