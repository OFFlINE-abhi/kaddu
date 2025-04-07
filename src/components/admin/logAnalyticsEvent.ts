// utils/logAnalyticsEvent.ts
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/app/firebase"; // Adjust the import based on your Firebase setup

const db = getFirestore(app);

export async function logAnalyticsEvent({
  userId,
  email,
  action,
  metadata = {},
}: {
  userId: string;
  email: string;
  action: string;
  metadata?: Record<string, any>;
}) {
  try {
    await addDoc(collection(db, "analytics"), {
      userId,
      email,
      action,
      metadata,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging analytics:", error);
  }
}
