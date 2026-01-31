import { createClient } from '@supabase/supabase-js';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  // Verify admin authentication here
  // This would typically involve checking for admin session/role

  const { title, body, target, topic, token } = await request.json();

  if (!title || !body) {
    return Response.json({ error: 'Title and body are required' }, { status: 400 });
  }

  try {
    if (target === 'single' && token) {
      // Send notification to a single user
      const message = {
        notification: {
          title,
          body,
        },
        token: token,
      };

      await admin.messaging().send(message);
      return Response.json({ success: true, message: 'Notification sent to single user' });
    } else if (target === 'all') {
      // Get all device tokens from the user_fcm_tokens table
      const { data, error, status } = await supabase
        .from('user_fcm_tokens')
        .select('fcm_token as token');

      if (error) {
        console.error('Error fetching tokens:', error);
        // Check if the error is due to table not existing
        if (error.code === '42P01' || error.message.includes('does not exist')) { // PostgreSQL error code for "undefined_table"
          console.warn('user_fcm_tokens table does not exist, returning empty list');
          return Response.json({ success: true, message: 'No tokens found, but request processed' });
        }
        return Response.json({ error: 'Failed to fetch device tokens' }, { status: 500 });
      }

      const tokens = data?.map(item => item.token) || [];

      if (tokens.length === 0) {
        return Response.json({ success: true, message: 'No tokens found, but request processed' });
      }

      // Send notifications in batches of 500 (FCM limit)
      const batchSize = 500;
      const batches = [];

      for (let i = 0; i < tokens.length; i += batchSize) {
        batches.push(tokens.slice(i, i + batchSize));
      }

      const results = await Promise.allSettled(
        batches.map(batch =>
          admin.messaging().sendMulticast({
            notification: {
              title,
              body,
            },
            tokens: batch,
          })
        )
      );

      // Count successful and failed sends
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount += result.value.successCount;
          failureCount += result.value.failureCount;

          // Handle failed tokens
          if (result.value.responses && result.value.responses.length > 0) {
            const failedTokens = result.value.responses
              .map((resp, idx) => resp.success ? null : batch[index * batchSize + idx])
              .filter(token => token !== null) as string[];

            if (failedTokens.length > 0) {
              // Remove invalid tokens from database
              removeInvalidTokens(failedTokens);
            }
          }
        } else {
          console.error(`Batch ${index} failed:`, result.reason);
          failureCount += batch.length; // Assume all failed in this batch
        }
      });

      return Response.json({
        success: true,
        message: `Notifications sent successfully`,
        details: {
          totalTokens: tokens.length,
          successCount,
          failureCount,
        }
      });
    } else if (target === 'topic') {
      if (!topic) {
        return Response.json({ error: 'Topic is required for topic-based notifications' }, { status: 400 });
      }

      // Send to specific topic
      const message = {
        notification: {
          title,
          body,
        },
        topic: topic,
      };

      await admin.messaging().send(message);
      return Response.json({ success: true, message: `Notification sent to topic ${topic}` });
    } else {
      return Response.json({ error: 'Invalid target specified' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

async function removeInvalidTokens(tokens: string[]) {
  if (tokens.length === 0) return;

  const { error } = await supabase
    .from('user_fcm_tokens')
    .delete()
    .in('fcm_token', tokens);

  if (error) {
    // Check if the error is due to table not existing
    if (error.code !== '42P01' && !error.message.includes('does not exist')) {
      console.error('Error removing invalid tokens:', error);
    } else {
      console.warn('user_fcm_tokens table does not exist, skipping token removal');
    }
  } else {
    console.log(`Removed ${tokens.length} invalid tokens`);
  }
}