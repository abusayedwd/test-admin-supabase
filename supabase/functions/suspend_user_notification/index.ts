import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

// FCM API details for push notifications
const FCM_API_URL = "https://fcm.googleapis.com/fcm/send";
const FCM_SERVER_KEY = Deno.env.get("FCM_SERVER_KEY");

if (!FCM_SERVER_KEY) {
  throw new Error("FCM_SERVER_KEY environment variable not set");
}

interface SuspensionPayload {
  user_id: string;
  admin_id: string;
  reason?: string;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const payload: SuspensionPayload = await req.json();

    // Fetch user's FCM token from the database
    const { data: registrationData, error } = await supabase
      .from("user_fcm_tokens")
      .select("fcm_token")
      .eq("user_id", payload.user_id)
      .single();

    if (error || !registrationData) {
      console.error("Error fetching FCM token:", error);
      return new Response(
        JSON.stringify({ error: "FCM token not found for user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch admin details
    const { data: adminData, error: adminError } = await supabase
      .from("users") // Assuming you have a users table with admin details
      .select("email")
      .eq("id", payload.admin_id)
      .single();

    if (adminError) {
      console.error("Error fetching admin details:", adminError);
      // We can continue without admin details
    }

    // Prepare the FCM notification payload
    const fcmPayload = {
      to: registrationData.fcm_token,
      notification: {
        title: "Account Suspended",
        body: `Your account has been suspended. ${payload.reason ? `Reason: ${payload.reason}` : ''} Contact admin for more information.`,
        sound: "default",
      },
      data: {
        type: "account_suspension",
        user_id: payload.user_id,
        admin_id: payload.admin_id,
        reason: payload.reason || "",
        timestamp: new Date().toISOString(),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    };

    // Send the notification to FCM
    const fcmResponse = await fetch(FCM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify(fcmPayload),
    });

    if (!fcmResponse.ok) {
      const errorText = await fcmResponse.text();
      console.error("Error sending FCM notification:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send push notification", details: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store the notification in the database as well
    const { error: notificationError } = await supabase
      .from("user_notifications")
      .insert({
        user_id: payload.user_id,
        title: "Account Suspended",
        body: `Your account has been suspended. ${payload.reason ? `Reason: ${payload.reason}` : ''} Contact admin for more information.`,
        type: "suspension",
        data: {
          reason: payload.reason || "",
          admin_id: payload.admin_id,
          admin_email: adminData?.email || ""
        },
        sent_at: new Date().toISOString()
      });

    if (notificationError) {
      console.error("Error saving notification to database:", notificationError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Suspension notification sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in suspension notification function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});