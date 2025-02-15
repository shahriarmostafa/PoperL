self.addEventListener("push", (event) => {
  const data = event.data.json();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length === 0) {
        // App is NOT open, show notification
        let title = "Notification";
        let body = "You have a new message.";
        let icon = "./favicon.ico";
        let notificationData = {};

        if (data.callType === "incoming") {
          const audio = new Audio("./ringtone.mp3"); // Provide the path to your sound file
          audio.play().catch((error) => console.error("Audio play error:", error));
          title = data.callerName || "Incoming Call";
          body = "Incoming call...";
          notificationData = { callerId: data.callerId };
        } else if (data.title && data.body) {
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







