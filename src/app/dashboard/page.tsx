"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { FiLogOut, FiSettings, FiGrid, FiTrendingUp, FiUser } from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#6a0dad] to-black text-white">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="w-64 bg-black/30 backdrop-blur-lg p-6 fixed h-full border-r border-white/20"
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg">
            <FiGrid /> Overview
          </a>
          <a href="#" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg">
            <FiTrendingUp /> Analytics
          </a>
          <a href="#" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg">
            <FiSettings /> Settings
          </a>
        </nav>
        <button onClick={handleLogout} className="mt-10 flex items-center gap-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg w-full">
          <FiLogOut /> Logout
        </button>
      </motion.aside>

      {/* Main Content */}
      <motion.div
        className="flex-1 ml-64 p-10 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.displayName || "User"} 👋</h1>
              <p className="text-sm text-white/60">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-xl">
            <h2 className="text-xl font-bold mb-2">🔥 Featured Templates</h2>
            <p>Explore amazing UI components and pre-built sections.</p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-xl">
            <h2 className="text-xl font-bold mb-2">📊 Analytics</h2>
            <p>Track user activity, performance, and traffic.</p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-xl">
            <h2 className="text-xl font-bold mb-2">🎨 Customization</h2>
            <p>Make the dashboard truly yours with flexible UI options.</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-4 hover:scale-105 transition shadow-lg flex items-center gap-2">
            <FiUser className="text-2xl" /> Profile
          </Card>
          <Card className="p-4 hover:scale-105 transition shadow-lg flex items-center gap-2">
            <FiSettings className="text-2xl" /> Settings
          </Card>
          <Card className="p-4 hover:scale-105 transition shadow-lg flex items-center gap-2">
            <FiTrendingUp className="text-2xl" /> Analytics
          </Card>
        </div>
      </motion.div>
    </div>
  );
}