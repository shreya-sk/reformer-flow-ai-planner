
-- Create table for syncing user data between devices
CREATE TABLE IF NOT EXISTS public.user_sync_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  class_plan JSONB,
  preferences JSONB,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_sync_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sync_data
CREATE POLICY "Users can view their own sync data" 
  ON public.user_sync_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync data" 
  ON public.user_sync_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync data" 
  ON public.user_sync_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at
CREATE TRIGGER update_user_sync_data_updated_at
  BEFORE UPDATE ON public.user_sync_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
