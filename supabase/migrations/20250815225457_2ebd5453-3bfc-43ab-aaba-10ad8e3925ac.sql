-- Create prayer completions table
CREATE TABLE public.prayer_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  prayer_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, prayer_name, prayer_date)
);

-- Create prayer settings table
CREATE TABLE public.prayer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_method TEXT NOT NULL DEFAULT 'ISNA' CHECK (calculation_method IN ('ISNA', 'MuslimWorldLeague', 'Karachi', 'UmmAlQura', 'Egyptian', 'Tehran', 'Gulf', 'Kuwait', 'Qatar', 'Singapore')),
  madhab TEXT NOT NULL DEFAULT 'Shafi' CHECK (madhab IN ('Shafi', 'Hanafi')),
  high_latitude_rule TEXT NOT NULL DEFAULT 'MiddleOfTheNight' CHECK (high_latitude_rule IN ('MiddleOfTheNight', 'SeventhOfTheNight', 'TwilightAngle')),
  fajr_adjustment INTEGER DEFAULT 0,
  dhuhr_adjustment INTEGER DEFAULT 0,
  asr_adjustment INTEGER DEFAULT 0,
  maghrib_adjustment INTEGER DEFAULT 0,
  isha_adjustment INTEGER DEFAULT 0,
  notifications_enabled BOOLEAN DEFAULT true,
  notification_minutes_before INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prayer_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for prayer_completions
CREATE POLICY "Users can view their own prayer completions" 
ON public.prayer_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer completions" 
ON public.prayer_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer completions" 
ON public.prayer_completions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer completions" 
ON public.prayer_completions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for prayer_settings
CREATE POLICY "Users can view their own prayer settings" 
ON public.prayer_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer settings" 
ON public.prayer_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer settings" 
ON public.prayer_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on prayer_settings
CREATE TRIGGER update_prayer_settings_updated_at
  BEFORE UPDATE ON public.prayer_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_prayer_completions_user_date ON public.prayer_completions(user_id, prayer_date);
CREATE INDEX idx_prayer_completions_date ON public.prayer_completions(prayer_date);

-- Create function to initialize prayer settings for new users
CREATE OR REPLACE FUNCTION public.create_default_prayer_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.prayer_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create prayer settings on user signup
CREATE TRIGGER on_auth_user_created_prayer_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_prayer_settings();