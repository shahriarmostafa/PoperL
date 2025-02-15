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



self.addEventListener("push", (event) => {
  const data = event.data.json();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length === 0) {
        // App is NOT open, show notification
        let title = "Notification";
        let body = "You have a new message.";
        let icon = "/favicon.ico";
        let notificationData = {};

        if (data.payload.callType === "incoming") {
          title = data.payload.callerName || "Incoming Call";
          body = "Incoming call...";
          notificationData = { callerId: data.callerId };
        } else if (data.payload.title && data.body) {
          title = data.title;
          body = data.body;
        }

        self.registration.showNotification(title, {
          body,
          icon,
          data: notificationData,
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