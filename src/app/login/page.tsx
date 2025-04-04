"use client";
import { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Failed:", error);
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
      <div className="bg-white/10 p-10 rounded-2xl shadow-lg text-center border border-white/20 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
        <p className="mb-6 text-gray-300">Login to continue to your dashboard</p>
        <button
          onClick={handleLogin}
          aria-label="Sign in with Google"
          className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </motion.main>
  );
}
