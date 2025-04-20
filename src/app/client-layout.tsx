"use client"; // Mark this component as client-side

import { useEffect } from "react"; // Using useEffect in this component is fine here

export default function ClientLayout() {
  // ✅ Lazy FCM service worker registration
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js") // Path to your Firebase service worker
        .then((registration) => {
          console.log("✅ FCM SW registered:", registration);
        })
        .catch((err) => {
          console.error("❌ FCM SW registration failed:", err);
        });
    }
  }, []); // Empty array to ensure this runs only once when the component mounts

  return null; // This component doesn't render anything itself, it only handles client-side behavior
}
