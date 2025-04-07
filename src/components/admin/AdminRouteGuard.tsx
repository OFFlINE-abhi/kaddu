// src/components/admin/AdminRouteGuard.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "@/app/firebase"; // or wherever your Firebase init is

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.data()?.role;
        if (role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/dashboard"); // redirect non-admins
        }
      } else {
        router.push("/login"); // redirect if not logged in
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, db]);

  if (loading) return <p className="p-6">Checking permissions...</p>;

  return isAdmin ? <>{children}</> : null;
}
