/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB4jMxnVuIkHwAEmjXcuB9GtRTJsjhlAqg",
  authDomain: "kav-notification.firebaseapp.com",
  projectId: "kav-notification",
  storageBucket: "kav-notification.firebasestorage.app",
  messagingSenderId: "62544325884",
  appId: "1:62544325884:web:8ae9b3070166aa5fb7fb79",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("🔔 Background notification:", payload);

  const title = payload.data.title;
  const body = payload.data.body;
  const link = payload.data.link;

  self.registration.showNotification(title, {
    body: body,
    icon: "/images/logo1.png",
    badge: "/images/logo1.png",
    data: { link: link }
  });
});


// 🔥 CLICK NOTIFICATION → OPEN ADMIN PAGE
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const link = event.notification.data?.link;

  if (!link) return;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/pages/admin") && "focus" in client) {
            client.focus();
            client.navigate(link);
            return;
          }
        }
        return clients.openWindow(link);
      })
  );
});
