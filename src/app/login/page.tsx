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
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { app } from "../firebase";
import ReCaptcha from "@/components/ReCaptcha/ReCAPTCHA"; // Ensure correct import path

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        router.push("/dashboard");
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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
        alert(`🎉 Welcome, ${user.displayName}! Thanks for joining!`);
      } else {
        alert(`👋 Welcome back, ${user.displayName}!`);
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login Failed:", error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("✅ Logged out successfully.");
    } catch (error: any) {
      console.error("Logout Failed:", error.message);
      alert(`Logout failed: ${error.message}`);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black/70 text-white flex items-center justify-center backdrop-blur-md"
    >
      <div className="bg-white/10 p-10 rounded-2xl shadow-lg text-center border border-white/20 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4">Welcome</h2>
        <p className="mb-6 text-gray-300">Login to continue to your dashboard</p>

        {/* reCAPTCHA */}
        <ReCaptcha onVerify={() => setVerified(true)} />

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 mt-4 rounded-full font-semibold hover:bg-red-600 transition-all hover:scale-105 hover:shadow-xl"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            aria-label="Sign in with Google"
            className="bg-white text-black px-6 py-2 mt-4 rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        )}
      </div>
    </motion.main>
  );
}
