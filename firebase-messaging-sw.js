/* AÏDABA MARKET — FIREBASE PUSH NOTIFICATIONS */

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

// Configuration Firebase
firebase.initializeApp({
apiKey: "AIzaSyCP1CvMB-tKGpx-mSzd-x8IkU45Dz2gNUc",
authDomain: "aidaba-market.firebaseapp.com",
databaseURL: "https://aidaba-market-default-rtdb.firebaseio.com",
projectId: "aidaba-market",
storageBucket: "aidaba-market.firebasestorage.app",
messagingSenderId: "451207374898",
appId: "1:451207374898:web:a9ec26c46258be0952342b",
measurementId: "G-9LL3KVGN53"
});

const messaging = firebase.messaging();

// Réception des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {

const data = payload.data || {};
const notification = payload.notification || {};

const title =
notification.title ||
data.title ||
"AÏDABA Market";

const options = {
body:
notification.body ||
data.body ||
"Vous avez reçu une nouvelle notification.",

icon: "./icon-192.png",
badge: "./icon-192.png",

data: {
  url: data.url || "./",
  orderId: data.order_id || data.orderId || "",
  role: data.role || "seller"
},

tag:
  data.notification_id ||
  data.order_id ||
  "aidaba-notification",

renotify: true

};

if (!payload.notification) {
return self.registration.showNotification(
title,
options
);
}
});

// Ouvrir l'application après avoir cliqué sur la notification
self.addEventListener("notificationclick", (event) => {

event.notification.close();

const info = event.notification.data || {};

const target = new URL(
info.url || "./",
self.location.origin
);

if (info.orderId) {
target.searchParams.set(
"aidaba_order",
info.orderId
);

target.searchParams.set(
  "aidaba_role",
  info.role || "seller"
);

}

event.waitUntil((async () => {

const windows = await clients.matchAll({
  type: "window",
  includeUncontrolled: true
});

for (const client of windows) {

  if ("focus" in client) {
    await client.navigate(target.href);
    return client.focus();
  }
}

return clients.openWindow(target.href);

})());

});
