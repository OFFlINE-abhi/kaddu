"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signOut, User } from "firebase/auth";
import { auth } from "@/app/firebase";
import { cn } from "@/lib/utils";
import { tabIcons } from "@/lib/constants";
import { Tooltip } from "react-tooltip";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { Bell, MessageCircle, X } from "lucide-react";
import Notifications from "@/components/tools/Notifications";
import Feedback from "@/components/tools/Feedback";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab:
    | "Overview"
    | "Analytics"
    | "Settings"
    | "Profile"
    | "Calculator"
    | "Notifications"
    | "Feedback";
  setActiveTab: (
    tab:
      | "Overview"
      | "Analytics"
      | "Settings"
      | "Profile"
      | "Calculator"
      | "Notifications"
      | "Feedback"
  ) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalOpen, setModalOpen] = useState<"Notifications" | "Feedback" | null>(null);

  // Handle sidebar expansion based on screen size
  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dark mode handling with local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      await signOut(auth);
      router.push("/");
    }, 800);
  };

  return (
    <>
      {/* 🔳 Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🏠 Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed md:relative z-30 h-screen flex flex-col justify-between px-3 py-6 shadow-xl",
          "border-r-0 transition-all sticky top-0 text-white",
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-700"
            : "bg-gradient-to-b from-indigo-600 to-purple-600"
        )}
      >
        <div className="flex flex-col h-full">
          {/* 📌 Logo */}
          <motion.div
            className="flex items-center justify-center md:justify-start mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-3xl">📊</span>
            {isExpanded && (
              <span className="ml-2 text-xl font-bold tracking-wide hidden md:inline-block">
                Dashboard
              </span>
            )}
          </motion.div>

          {/* 📌 Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {Object.entries(tabIcons).map(([label, Icon]) => {
              const isActive = activeTab === label;
              return (
                <motion.button
                  key={label}
                  onClick={() => {
                    setActiveTab(label as keyof typeof tabIcons);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group relative",
                    isActive
                      ? "bg-indigo-800 hover:bg-indigo-700 text-white"
                      : "hover:bg-indigo-700 text-white"
                  )}
                  data-tooltip-id={`tooltip-${label}`}
                  data-tooltip-content={!isExpanded ? label : ""}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">
                    <Icon />
                  </span>
                  {isExpanded && <span className="whitespace-nowrap">{label}</span>}
                  {!isExpanded && <Tooltip id={`tooltip-${label}`} place="right" />}
                </motion.button>
              );
            })}
          </nav>

          {/* 🔔 Notifications & Feedback */}
          <div className="mt-6 space-y-2">
            <motion.button
              onClick={() => setModalOpen("Notifications")}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-white"
              whileHover={{ scale: 1.05 }}
            >
              <Bell size={20} />
              {isExpanded && <span>Notifications</span>}
            </motion.button>

            <motion.button
              onClick={() => setModalOpen("Feedback")}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-white"
              whileHover={{ scale: 1.05 }}
            >
              <MessageCircle size={20} />
              {isExpanded && <span>Feedback</span>}
            </motion.button>
          </div>

          {/* ⚙️ Bottom Section */}
          <div className="mt-auto space-y-2">
            {/* 🌗 Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-white"
              whileHover={{ scale: 1.05 }}
            >
              {isDarkMode ? <BsMoonFill className="text-xl text-yellow-400" /> : <BsSunFill className="text-xl text-yellow-300" />}
              {isExpanded && <span>Dark Mode</span>}
            </motion.button>

            {/* 🚪 Logout */}
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-4 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 text-white"
              whileHover={{ scale: 1.05 }}
            >
              <FiLogOut className="text-xl" />
              {isExpanded && <span>Logout</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* 📌 Popups for Notifications & Feedback */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              className="absolute top-3 right-3"
              onClick={() => setModalOpen(null)}
              title="Close"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            {modalOpen === "Notifications" ? <Notifications /> : <Feedback />}
          </div>
        </div>
      )}
    </>
  );
}
