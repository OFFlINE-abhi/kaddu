import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Firebase Storage

// 🚀 Firebase Configuration (Using Environment Variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 🔄 Initialize Firebase App (Only if not already initialized)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔑 Firebase Services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialized Firebase Storage

// 🔌 Enable Firestore Offline Persistence
enableIndexedDbPersistence(db)
  .then(() => console.log("✅ Firestore offline persistence enabled"))
  .catch((err) => {
    switch (err.code) {
      case "failed-precondition":
        console.warn("⚠ Firestore Persistence failed: Multiple tabs open.");
        break;
      case "unimplemented":
        console.warn("⚠ Firestore Persistence is not supported on this browser.");
        break;
      default:
        console.error("❌ Firestore Persistence Error:", err);
    }
  });

// 🔄 Ensure Firestore reconnects if offline
enableNetwork(db)
  .then(() => console.log("✅ Firestore is online"))
  .catch((error) => console.error("❌ Firestore failed to reconnect:", error));

// 🌟 Export Firebase Services
export { app, auth, provider, db, storage };
