# Push Notifications Implementation Guide

This document describes the implementation of push notifications in the Islamic App Admin Panel, specifically for user suspension notifications.

## Overview

The implementation uses:
- Firebase Cloud Messaging (FCM) for delivering push notifications
- Supabase Edge Functions to handle notification sending
- Supabase database tables to store notification records
- Web Push API for browser-based notifications

## Database Schema

### Notifications Table
The `user_notifications` table stores notification records:

```sql
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
```

### FCM Tokens Table
The `user_fcm_tokens` table stores device registration tokens:

```sql
CREATE TABLE IF NOT EXISTS public.user_fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL, -- The FCM registration token
  device_info JSONB, -- Additional device information (optional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fcm_token) -- Prevent duplicate tokens for the same user
);
```

## Implementation Flow

### 1. Device Registration
Users register their devices for push notifications via the `NotificationRegistrar` React component:
- Requests notification permission from the user
- Registers the service worker
- Subscribes to push notifications using the Web Push API
- Sends the subscription details to the server to store the FCM token

### 2. User Suspension
When an admin suspends a user:
- The admin is prompted for a suspension reason
- The `UserActions` component calls the `/api/admin/users` PUT endpoint
- The API updates the user's status to 'expired'
- The API detects the status change and triggers a suspension notification
- The notification is sent via the `/api/send-suspension-notification` endpoint

### 3. Notification Sending
The suspension notification flow:
- The API calls the Supabase Edge Function `suspend_user_notification`
- The Edge Function looks up the user's FCM token in the database
- The Edge Function sends the notification payload to FCM servers
- The notification is delivered to the user's device

## Key Components

### Supabase Edge Functions
- `send_push_notification`: General function for sending push notifications
- `suspend_user_notification`: Specialized function for user suspension notifications

### API Routes
- `/api/send-suspension-notification`: Triggers suspension notifications

### Services
- `lib/services/notifications.ts`: Client-side functions for notifications

### Client Components
- `components/NotificationRegistrar.tsx`: Handles device registration
- `public/sw.js`: Service worker to handle push notifications

## Environment Variables

### For FCM Integration
```
FCM_SERVER_KEY=your_fcm_server_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### For Supabase Integration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security Considerations

- Row Level Security (RLS) policies ensure users can only access their own notifications
- The service role key is used only in server-side code
- FCM server key should be kept secure and never exposed to the client

## Testing

To test the push notification implementation:

1. Register a device for notifications using the NotificationRegistrar component
2. Suspend a user through the admin panel
3. Verify that the notification is sent and received on the registered device
4. Check that the notification is recorded in the `user_notifications` table

## Troubleshooting

### Notifications Not Being Sent
- Check that the FCM server key is correctly set in environment variables
- Verify that the user has registered an FCM token
- Confirm that the Edge Function has the correct permissions

### Registration Issues
- Ensure the service worker is properly registered
- Check that the VAPID key is correctly formatted
- Verify notification permissions are granted by the user

This implementation provides a robust foundation for push notifications in the Islamic App Admin Panel with special focus on user suspension notifications.