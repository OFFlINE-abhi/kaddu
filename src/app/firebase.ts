import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Prevent multiple initializations
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Enable Firestore Persistence Only in the Browser
if (typeof window !== "undefined") {
  import("firebase/firestore").then(({ enableIndexedDbPersistence, enableNetwork }) => {
    enableIndexedDbPersistence(db).catch((err) => {
      console.warn("⚠ Firestore Persistence Error:", err.code);
    });

    enableNetwork(db)
      .then(() => console.log("✅ Firestore is online"))
      .catch((error) => console.error("❌ Firestore reconnect failed:", error));
  });
}

export { app, auth, provider, db, storage };
