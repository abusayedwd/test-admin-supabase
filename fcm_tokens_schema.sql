-- Additional schema for storing FCM tokens
-- This allows users to register their devices for push notifications

CREATE TABLE IF NOT EXISTS public.user_fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL, -- The FCM registration token
  device_info JSONB, -- Additional device information (optional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fcm_token) -- Prevent duplicate tokens for the same user
);

-- Enable RLS for FCM tokens
ALTER TABLE public.user_fcm_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for FCM tokens
CREATE POLICY "Users can view their own FCM tokens" ON public.user_fcm_tokens
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FCM tokens" ON public.user_fcm_tokens
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FCM tokens" ON public.user_fcm_tokens
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own FCM tokens" ON public.user_fcm_tokens
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all FCM tokens" ON public.user_fcm_tokens
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create an index on user_id for better performance
CREATE INDEX idx_user_fcm_tokens_user_id ON public.user_fcm_tokens (user_id);

-- Function to register a new FCM token
CREATE OR REPLACE FUNCTION register_fcm_token(
  p_user_id UUID,
  p_fcm_token TEXT,
  p_device_info JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  -- Insert or update the FCM token for the user
  INSERT INTO public.user_fcm_tokens(user_id, fcm_token, device_info)
  VALUES (p_user_id, p_fcm_token, p_device_info)
  ON CONFLICT (user_id, fcm_token) 
  DO UPDATE SET 
    device_info = EXCLUDED.device_info,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to remove an FCM token
CREATE OR REPLACE FUNCTION unregister_fcm_token(
  p_user_id UUID,
  p_fcm_token TEXT
) RETURNS VOID AS $$
BEGIN
  DELETE FROM public.user_fcm_tokens
  WHERE user_id = p_user_id AND fcm_token = p_fcm_token;
END;
$$ LANGUAGE plpgsql;