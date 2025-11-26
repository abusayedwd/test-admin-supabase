import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

// FCM API details for push notifications
const FCM_API_URL = "https://fcm.googleapis.com/fcm/send";
const FCM_SERVER_KEY = Deno.env.get("FCM_SERVER_KEY");

if (!FCM_SERVER_KEY) {
  throw new Error("FCM_SERVER_KEY environment variable not set");
}

interface NotificationPayload {
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
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
    const payload: NotificationPayload = await req.json();

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

    // Prepare the FCM notification payload
    const fcmPayload = {
      to: registrationData.fcm_token,
      notification: {
        title: payload.title,
        body: payload.body,
        sound: "default", // Play default notification sound
      },
      data: {
        ...payload.data,
        click_action: "FLUTTER_NOTIFICATION_CLICK", // For mobile apps
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

    // Mark notification as sent in the database
    await supabase
      .from("user_notifications")
      .update({ sent_at: new Date().toISOString() })
      .eq("user_id", payload.user_id)
      .eq("title", payload.title)
      .eq("body", payload.body)
      .is("sent_at", null); // Only update if not already sent

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in push notification function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});