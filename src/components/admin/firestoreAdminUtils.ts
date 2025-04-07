import { db } from "@/app/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const logAdminAction = async (admin: string, action: string) => {
  const logRef = doc(db, "adminLogs", `${Date.now()}-${admin}`);
  await setDoc(logRef, {
    admin,
    action,
    timestamp: serverTimestamp(),
  });
};
