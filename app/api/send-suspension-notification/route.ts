// app/api/send-suspension-notification/route.ts

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

interface SuspensionPayload {
  user_id: string;
  admin_id: string;
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: SuspensionPayload = await request.json();
    
    // Validate the payload
    if (!payload.user_id || !payload.admin_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: user_id, admin_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call the Supabase Edge Function
    // In a real implementation, you would make a call to your Supabase Edge Function
    // Since we can't directly call Edge Functions from within Next.js API routes,
    // we'll need to make an HTTP request to the Edge Function URL
    
    // For now, we'll simulate the behavior by calling the Supabase function
    // that stores the notification in the database
    const supabase = await createAdminClient();
    
    const { error } = await supabase.rpc('notify_user', {
      p_user_id: payload.user_id,
      p_title: "Account Suspended",
      p_body: `Your account has been suspended. ${payload.reason ? `Reason: ${payload.reason}` : ''} Contact admin for more information.`,
      p_type: "suspension",
      p_data: {
        reason: payload.reason || "",
        admin_id: payload.admin_id
      }
    });
    
    if (error) {
      console.error('Error triggering notification:', error);
      return new Response(
        JSON.stringify({ error: "Failed to trigger notification", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Suspension notification triggered" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in suspension notification API route:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}