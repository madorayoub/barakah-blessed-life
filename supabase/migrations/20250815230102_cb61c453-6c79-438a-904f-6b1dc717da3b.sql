-- Create task categories table
CREATE TABLE public.task_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10b981', -- emerald-500
  icon TEXT DEFAULT 'circle',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.task_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  due_time TIME,
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern TEXT, -- 'daily', 'weekly', 'monthly'
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task templates for Islamic activities
CREATE TABLE public.task_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'worship',
  priority TEXT NOT NULL DEFAULT 'medium',
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern TEXT,
  estimated_duration INTEGER, -- in minutes
  icon TEXT DEFAULT 'book-open',
  is_system BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for task_categories
CREATE POLICY "Users can view their own categories" 
ON public.task_categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.task_categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.task_categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.task_categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for task_templates (readable by all authenticated users)
CREATE POLICY "Authenticated users can view templates" 
ON public.task_templates 
FOR SELECT 
TO authenticated
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_task_categories_updated_at
  BEFORE UPDATE ON public.task_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_category_id ON public.tasks(category_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_parent_task_id ON public.tasks(parent_task_id);
CREATE INDEX idx_task_categories_user_id ON public.task_categories(user_id);

-- Function to create default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_task_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.task_categories (user_id, name, color, icon, is_default) VALUES
    (NEW.id, 'Worship', '#10b981', 'mosque', true),
    (NEW.id, 'Personal', '#3b82f6', 'user', true),
    (NEW.id, 'Work', '#f59e0b', 'briefcase', true),
    (NEW.id, 'Family', '#ef4444', 'heart', true),
    (NEW.id, 'Learning', '#8b5cf6', 'book-open', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create default categories on user signup
CREATE TRIGGER on_auth_user_created_task_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_task_categories();

-- Insert default Islamic task templates
INSERT INTO public.task_templates (name, description, category, priority, is_recurring, recurring_pattern, estimated_duration, icon) VALUES
  ('Morning Dhikr', 'Recite morning supplications after Fajr prayer', 'worship', 'high', true, 'daily', 15, 'sun'),
  ('Evening Dhikr', 'Recite evening supplications after Maghrib prayer', 'worship', 'high', true, 'daily', 15, 'moon'),
  ('Quran Reading', 'Read and reflect on the Quran', 'worship', 'high', true, 'daily', 30, 'book-open'),
  ('Istighfar (100x)', 'Seek forgiveness from Allah', 'worship', 'medium', true, 'daily', 10, 'heart'),
  ('Salawat on Prophet', 'Send blessings upon Prophet Muhammad (PBUH)', 'worship', 'medium', true, 'daily', 5, 'star'),
  ('Charity/Sadaqah', 'Give charity or help someone in need', 'worship', 'medium', false, null, 5, 'gift'),
  ('Friday Prayer', 'Attend Jummah prayer at the mosque', 'worship', 'high', true, 'weekly', 60, 'mosque'),
  ('Study Islamic Knowledge', 'Learn about Islamic teachings and history', 'learning', 'medium', false, null, 45, 'graduation-cap'),
  ('Call Parents/Family', 'Maintain family ties and relationships', 'family', 'high', true, 'weekly', 20, 'phone'),
  ('Help a Neighbor', 'Assist neighbors or community members', 'personal', 'medium', false, null, 30, 'users');