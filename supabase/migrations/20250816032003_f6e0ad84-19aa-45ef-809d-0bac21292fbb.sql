-- Create table for tracking Qur'an reading progress
CREATE TABLE public.quran_reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reading_session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for bookmarked verses
CREATE TABLE public.quran_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, surah_number, verse_number)
);

-- Create table for reading sessions
CREATE TABLE public.quran_reading_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  total_verses_read INTEGER DEFAULT 0,
  surahs_read INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quran_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reading progress
CREATE POLICY "Users can view their own reading progress" 
ON public.quran_reading_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reading progress" 
ON public.quran_reading_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress" 
ON public.quran_reading_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress" 
ON public.quran_reading_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.quran_bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.quran_bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" 
ON public.quran_bookmarks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.quran_bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for reading sessions
CREATE POLICY "Users can view their own reading sessions" 
ON public.quran_reading_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reading sessions" 
ON public.quran_reading_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions" 
ON public.quran_reading_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_quran_reading_progress_user_id ON public.quran_reading_progress(user_id);
CREATE INDEX idx_quran_reading_progress_surah ON public.quran_reading_progress(surah_number);
CREATE INDEX idx_quran_bookmarks_user_id ON public.quran_bookmarks(user_id);
CREATE INDEX idx_quran_reading_sessions_user_id ON public.quran_reading_sessions(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_quran_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_quran_reading_progress_updated_at
  BEFORE UPDATE ON public.quran_reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quran_updated_at_column();

CREATE TRIGGER update_quran_bookmarks_updated_at
  BEFORE UPDATE ON public.quran_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quran_updated_at_column();