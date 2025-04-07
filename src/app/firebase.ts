import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase app (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔐 Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// 📊 Enable analytics (only in the browser)
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });

  // ✅ Enable Firestore persistence in browser only
  import("firebase/firestore").then(({ enableIndexedDbPersistence, enableNetwork }) => {
    enableIndexedDbPersistence(db).catch((err) => {
      console.warn("⚠ Firestore Persistence Error:", err.code);
    });

    enableNetwork(db)
      .then(() => console.log("✅ Firestore is online"))
      .catch((error) => console.error("❌ Firestore reconnect failed:", error));
  });
}

// 🔥 Firebase Cloud Messaging (FCM)
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== "undefined" && "Notification" in window) {
  messaging = getMessaging(app);
}

// ✅ Function to request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.warn("🚫 FCM is not available on this device/browser.");
    return;
  }

  if (typeof window === "undefined") return;

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("🔔 Notification permission granted.");

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log("🔥 Push Notifications Token:", token);
        return token;
      } else {
        console.warn("⚠ No FCM token available.");
      }
    } catch (error) {
      console.error("❌ Error getting FCM token:", error);
    }
  } else {
    console.warn("🚫 Notification permission denied.");
  }
};

// ✅ Function to handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log("📩 Foreground Push Notification Received:", payload);
      resolve(payload);
    });
  });

// ✅ Export everything
export { app, auth, provider, db, storage, analytics, messaging };
