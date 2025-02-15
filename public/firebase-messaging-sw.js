importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");








firebase.initializeApp({
    apiKey: "AIzaSyD84PaHJyi_u87Lm1z467NdbxYG58du9cg",
    authDomain: "poperl-1st.firebaseapp.com",
    projectId: "poperl-1st",
    storageBucket: "poperl-1st.appspot.com",
    messagingSenderId: "773002657354",
    appId: "1:773002657354:web:b2c94cbb82a7a302eef0b3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message", payload);

  if (payload.data?.callType === "incoming") {  // ✅ Handle call notifications
    self.registration.showNotification(payload.notification.title, {
      body: "Incoming call...",
      icon: "/favicon.ico",
      data: {
        callerId: payload.data.callerId
      }
    });
  } else {  // Handle normal notifications
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/favicon.ico",
    });
  }
});


self.addEventListener("push", (event) => {
  const data = event.data.json();

  // Check if the app is open
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length === 0) {
        // App is not open, show notification
        self.registration.showNotification(data.callerName, {
          body: "Incoming call...",
          icon: "/call-icon.png",
          data: { callerId: data.callerId },
        });
      }
    })
  );
});




self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus(); // Bring the app to the foreground
        self.registration.getNotifications().then((notifications) => {
          notifications.forEach((notification) => notification.close());
        });
      } else {
        clients.openWindow("/chat").then(() => {
          self.registration.getNotifications().then((notifications) => {
            notifications.forEach((notification) => notification.close());
          });
        });
      }
    })
  );
});







