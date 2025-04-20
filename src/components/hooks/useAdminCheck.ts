// src/hooks/useAdminCheck.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase"; // adjust path if needed

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        setIsAdmin(snap.exists() && snap.data().role === "admin");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { isAdmin, loading };
}
