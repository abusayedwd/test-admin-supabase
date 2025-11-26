-- Notifications table for the Islamic App Admin Panel
-- This table will store notifications to be sent to users

CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Target user for the notification
  title TEXT NOT NULL, -- Notification title
  body TEXT NOT NULL, -- Notification body
  data JSONB, -- Additional data payload (optional)
  type TEXT DEFAULT 'general', -- Type of notification (e.g., 'suspension', 'report_update', 'system')
  status TEXT DEFAULT 'unread', -- Status: 'unread', 'read', 'archived'
  scheduled_at TIMESTAMP WITH TIME ZONE, -- When to send the notification (NULL for immediate)
  sent_at TIMESTAMP WITH TIME ZONE, -- When the notification was actually sent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for user notifications
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.user_notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies - users can update their own notifications (to mark as read)
CREATE POLICY "Users can update their own notifications" ON public.user_notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies - admins can manage all notifications
CREATE POLICY "Admins can manage all notifications" ON public.user_notifications
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications (user_id);
CREATE INDEX idx_user_notifications_status ON public.user_notifications (status);
CREATE INDEX idx_user_notifications_created_at ON public.user_notifications (created_at);
CREATE INDEX idx_user_notifications_scheduled_at ON public.user_notifications (scheduled_at) 
WHERE scheduled_at IS NOT NULL;

-- Create a function to insert notification and trigger push notification
CREATE OR REPLACE FUNCTION notify_user(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_type TEXT DEFAULT 'general',
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Insert the notification record
  INSERT INTO public.user_notifications(user_id, title, body, type, data)
  VALUES (p_user_id, p_title, p_body, p_type, p_data)
  RETURNING id INTO notification_id;

  -- Here we would trigger the push notification via an external service
  -- This is typically handled by Supabase Functions or another service
  -- For now, we're just storing the notification in the DB

  -- Optionally trigger a Realtime event to notify connected clients
  -- PERFORM pg_notify('notifications', json_build_object(
  --   'user_id', p_user_id,
  --   'notification_id', notification_id,
  --   'title', p_title,
  --   'body', p_body
  -- )::text);

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policy for auth.users table to allow admins to access user data for notifications
CREATE POLICY "Admins can view user data" ON auth.users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admin_user_id = auth.uid()
    )
  );