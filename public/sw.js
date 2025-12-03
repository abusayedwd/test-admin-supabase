// public/sw.js
// Service Worker for handling push notifications

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  let payload = {};
  let title = 'Islamic App Notification';
  let body = 'You have a new notification';

  if (event.data) {
    try {
      payload = event.data.json();
      title = payload.title || title;
      body = payload.body || body;
    } catch (error) {
      // If parsing JSON fails, use the raw text
      body = event.data.text();
    }
  }

  const options = {
    body: body,
    icon: '/icon-192x192.png', // You'll need to add an icon to your public folder
    badge: '/icon-192x192.png',
    data: payload,
    actions: [
      {
        action: 'close',
        title: 'Close',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  // Handle notification click
  if (event.action === 'close') {
    console.log('Notification closed');
    return;
  }

  // Open a window to the app
  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});

// Optional: Handle push subscription expiration
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push subscription expired:', event);
  
  // You could re-register the subscription here
  event.waitUntil(
    // Re-register with your server
    // This would involve getting a new subscription and sending it to your backend
  );
});