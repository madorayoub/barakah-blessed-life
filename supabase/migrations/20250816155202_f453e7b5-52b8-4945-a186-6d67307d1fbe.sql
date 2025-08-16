-- Create a table for custom task statuses/columns
CREATE TABLE public.task_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10b981',
  position INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE public.task_statuses ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own statuses" 
ON public.task_statuses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own statuses" 
ON public.task_statuses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statuses" 
ON public.task_statuses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own statuses" 
ON public.task_statuses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_task_statuses_updated_at
BEFORE UPDATE ON public.task_statuses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default statuses for existing users
INSERT INTO public.task_statuses (user_id, name, color, position, is_default)
SELECT DISTINCT p.user_id, 'To Do', '#6b7280', 1, true
FROM public.profiles p 
WHERE NOT EXISTS (
  SELECT 1 FROM public.task_statuses ts WHERE ts.user_id = p.user_id AND ts.name = 'To Do'
);

INSERT INTO public.task_statuses (user_id, name, color, position, is_default)
SELECT DISTINCT p.user_id, 'In Progress', '#3b82f6', 2, true
FROM public.profiles p 
WHERE NOT EXISTS (
  SELECT 1 FROM public.task_statuses ts WHERE ts.user_id = p.user_id AND ts.name = 'In Progress'
);

INSERT INTO public.task_statuses (user_id, name, color, position, is_default)
SELECT DISTINCT p.user_id, 'Done', '#10b981', 3, true
FROM public.profiles p 
WHERE NOT EXISTS (
  SELECT 1 FROM public.task_statuses ts WHERE ts.user_id = p.user_id AND ts.name = 'Done'
);

-- Create function to create default statuses for new users
CREATE OR REPLACE FUNCTION public.create_default_task_statuses()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.task_statuses (user_id, name, color, position, is_default) VALUES
    (NEW.user_id, 'To Do', '#6b7280', 1, true),
    (NEW.user_id, 'In Progress', '#3b82f6', 2, true),
    (NEW.user_id, 'Done', '#10b981', 3, true);
  RETURN NEW;
END;
$function$;

-- Create trigger to add default statuses for new users
CREATE TRIGGER trigger_create_default_task_statuses
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_task_statuses();