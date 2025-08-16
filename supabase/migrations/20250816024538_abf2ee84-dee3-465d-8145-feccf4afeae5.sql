-- Create default Islamic task categories for all users
-- This will help users immediately have meaningful categories available

-- Function to create default categories for a user
CREATE OR REPLACE FUNCTION create_default_categories_for_user(user_id_param uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.task_categories (user_id, name, color, icon, is_default) VALUES
    (user_id_param, '🕌 Worship', '#10b981', 'mosque', true),
    (user_id_param, '📚 Knowledge', '#3b82f6', 'book-open', true), 
    (user_id_param, '👥 Family & Community', '#f59e0b', 'users', true),
    (user_id_param, '💼 Work & Career', '#6366f1', 'briefcase', true),
    (user_id_param, '🏃 Health & Fitness', '#ef4444', 'heart', true),
    (user_id_param, '🤲 Charity & Service', '#8b5cf6', 'gift', true),
    (user_id_param, '🏠 Personal & Household', '#06b6d4', 'home', true),
    (user_id_param, '🌱 Self Development', '#84cc16', 'star', true)
  ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create default categories for new users
CREATE OR REPLACE FUNCTION trigger_create_default_categories()
RETURNS trigger AS $$
BEGIN
  PERFORM create_default_categories_for_user(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on profiles table (assuming users get a profile when they sign up)
DROP TRIGGER IF EXISTS create_categories_on_profile_creation ON public.profiles;
CREATE TRIGGER create_categories_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_categories();

-- Also create a function to manually create categories for existing users
-- (This will be useful for current users who don't have categories yet)
CREATE OR REPLACE FUNCTION create_default_categories_for_existing_users()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get all users who don't have any categories yet
  FOR user_record IN 
    SELECT DISTINCT p.user_id 
    FROM public.profiles p 
    LEFT JOIN public.task_categories tc ON p.user_id = tc.user_id 
    WHERE tc.user_id IS NULL
  LOOP
    PERFORM create_default_categories_for_user(user_record.user_id);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create categories for existing users
SELECT create_default_categories_for_existing_users();