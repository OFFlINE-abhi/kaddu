"use client";

import { useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { app } from "../firebase";
import ReCaptcha from "@/components/ReCaptcha/ReCAPTCHA";

let analytics: any = null;
if (typeof window !== "undefined") {
  const { getAnalytics, logEvent } = require("firebase/analytics");
  analytics = getAnalytics(app);
}

export default function LoginPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        const userData = {
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          role: "user",
          rememberMe,
          updatedAt: new Date(),
        };

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            ...userData,
            createdAt: new Date(),
          });
        } else {
          await updateDoc(userRef, userData);
        }

        // Log analytics event if in browser
        if (analytics) {
          analytics.logEvent?.("login", {
            method: "Google",
            user_id: currentUser.uid,
            email: currentUser.email,
          });
        }

        setRedirecting(true);
        setTimeout(async () => {
          const finalSnap = await getDoc(userRef);
          const role = finalSnap.data()?.role || "user";
          router.push(role === "admin" ? "/admin" : "/dashboard");
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    if (!verified) {
      alert("⚠️ Please verify the reCAPTCHA first.");
      return;
    }

    setLoading(true);
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await signInWithPopup(auth, provider);
      // auth state will trigger the useEffect automatically
    } catch (error: any) {
      console.error("Login Failed:", error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black/70 text-white flex items-center justify-center backdrop-blur-md"
    >
      {redirecting ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-10 bg-white/10 border border-white/20 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back 👋</h2>
          <p className="text-gray-300">Redirecting to your dashboard...</p>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto" />
        </motion.div>
      ) : (
        <div className="bg-white/10 p-10 rounded-2xl shadow-lg text-center border border-white/20 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-4">Welcome</h2>
          <p className="mb-6 text-gray-300">Login to continue to your dashboard</p>

          <ReCaptcha onVerify={() => setVerified(true)} />

          <div className="flex items-center justify-center mt-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4"
              />
              <span className="text-sm">Remember Me</span>
            </label>
          </div>

          <button
            onClick={handleLogin}
            className="bg-white text-black px-6 py-2 mt-4 rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      )}
    </motion.main>
  );
}
