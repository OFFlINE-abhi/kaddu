"use client";

import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAuth, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { tabIcons } from "@/lib/constants";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

// 🧩 Modular tools
import Notifications from "@/components/tools/Notifications";
import Feedback from "@/components/tools/Feedback";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: keyof typeof tabIcons) => void;
  user: User | null;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  user,
}: SidebarProps) {
  const router = useRouter();
  const auth = getAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      {/* 🔲 Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 📐 Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed md:relative z-30 h-screen flex flex-col justify-between px-3 py-6 shadow-xl",
          "border-r-0 transition-all sticky top-0 text-white",
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-700"
            : "bg-gradient-to-b from-purple-600 to-pink-600"
        )}
      >
        <div>
          {/* 🔹 Logo */}
          <div className="flex items-center justify-center md:justify-start mb-10">
            <span className="text-3xl">📊</span>
            {isExpanded && (
              <span className="ml-2 text-xl font-bold tracking-wide hidden md:inline-block">
                Dashboard
              </span>
            )}
          </div>

          {/* 🔹 Navigation Tabs */}
          <nav className="flex flex-col space-y-3">
            {Object.entries(tabIcons).map(([label, Icon]) => {
              const isActive = activeTab === label;
              return (
                <button
                  key={label}
                  onClick={() => {
                    setActiveTab(label as keyof typeof tabIcons);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 group relative",
                    isActive
                      ? "bg-indigo-800 hover:bg-indigo-700 text-white"
                      : "hover:bg-indigo-700 text-white"
                  )}
                  data-tooltip-id={`tooltip-${label}`}
                  data-tooltip-content={!isExpanded ? label : ""}
                >
                  <span className="text-xl">
                    <Icon />
                  </span>
                  {isExpanded && <span className="whitespace-nowrap">{label}</span>}
                  {!isExpanded && <Tooltip id={`tooltip-${label}`} place="right" />}
                </button>
              );
            })}
          </nav>

          {/* 🔹 Tools & Utilities */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              <Notifications />
            </div>
            <div className="flex items-center gap-4">
              <Feedback />
            </div>
          </div>
        </div>

        {/* 🔹 Profile & Dark Mode & Logout */}
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image + Dark Mode (Parallel Alignment) */}
          <div className="flex items-center justify-between w-full px-2">
            {/* Profile Image (Shifted to the left) */}
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover border-4 border-white/60 transition-all hover:scale-105"
            />

            {/* Dark Mode Toggle (Fully Circular, Smooth Animation) */}
            <button
              onClick={toggleDarkMode}
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {isDarkMode ? (
                  <BsMoonFill className="text-xl text-yellow-400" />
                ) : (
                  <BsSunFill className="text-xl text-yellow-300" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Logout Button (Below Profile Image) */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center gap-2 p-2 rounded-full w-12 h-12 bg-red-600 hover:bg-red-700 text-white transition-transform duration-200 transform hover:scale-105"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </motion.aside>
    </>
  );
}
