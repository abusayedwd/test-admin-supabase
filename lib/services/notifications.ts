// lib/services/notifications.ts

import { createClient } from '@/lib/supabase/server';

/**
 * Trigger a push notification when a user account is suspended
 */
export async function sendSuspensionNotification(
  userId: string,
  adminId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Call the Supabase Edge Function to send the push notification
    const response = await fetch('/api/send-suspension-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        admin_id: adminId,
        reason: reason
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error sending suspension notification:', errorData);
      return { success: false, error: errorData.error };
    }

    const data = await response.json();
    console.log('Suspension notification sent:', data);
    return { success: true };
  } catch (error) {
    console.error('Error in sendSuspensionNotification:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('user_notifications')
      .update({ status: 'read' })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error updating notification status:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return { success: false, error: (error as Error).message };
  }
}