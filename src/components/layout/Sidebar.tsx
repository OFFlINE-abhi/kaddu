"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, User } from "firebase/auth";
import { auth } from "@/app/firebase";
import { cn } from "@/lib/utils";
import { tabIcons } from "@/lib/constants";
import { Tooltip } from "react-tooltip";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { Bell, MessageCircle, X, Palette } from "lucide-react";
import Notifications from "@/components/tools/Notifications";
import Feedback from "@/components/tools/Feedback";
import useSidebarTheme from "@/components/ui/SidebarTheme";

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
  const { theme, toggleTheme } = useSidebarTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalOpen, setModalOpen] = useState<"Notifications" | "Feedback" | null>(null);

  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      await signOut(auth);
      router.push("/");
    }, 800);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalOpen && !(event.target as HTMLElement).closest(".modal-content")) {
        setModalOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  return (
    <>
      {/* 📱 Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
        >
          <FiMenu size={20} />
        </motion.button>
      </div>

      {/* 🔳 Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 🏠 Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed md:relative z-30 h-screen flex flex-col justify-between px-3 py-6 shadow-xl transition-all overflow-hidden",
          "border-r-0 sticky top-0 text-white",
          theme === "default" ? "bg-gradient-to-r from-indigo-500 to-purple-700" :
          theme === "theme1" ? "bg-gradient-to-r from-green-500 to-teal-700" :
          "bg-gradient-to-r from-orange-500 to-red-700"
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* 🔷 Logo */}
            <motion.div
              className="flex items-center justify-center md:justify-start mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-3xl">📊</span>
              {isExpanded && (
                <span className="ml-2 text-xl font-bold tracking-wide hidden md:inline-block">
                  Dashboard
                </span>
              )}
            </motion.div>

            {/* 📌 Navigation Links */}
            <nav className="flex flex-col gap-3">
              {Object.entries(tabIcons).map(([label, Icon], index) => {
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
                    whileHover={{ scale: 1.07 }}
                  >
                    <Icon className="text-xl" />
                    {isExpanded && <span>{label}</span>}
                  </motion.button>
                );
              })}
            </nav>

            {/* 🔔 Notifications & Feedback */}
            <div className="mt-6 flex flex-col gap-3">
              <motion.button
                onClick={() => setModalOpen("Notifications")}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-white"
                whileHover={{ scale: 1.07 }}
              >
                <Bell size={20} />
                {isExpanded && <span>Notifications</span>}
              </motion.button>

              <motion.button
                onClick={() => setModalOpen("Feedback")}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-white"
                whileHover={{ scale: 1.07 }}
              >
                <MessageCircle size={20} />
                {isExpanded && <span>Feedback</span>}
              </motion.button>
            </div>
          </div>

          {/* 🎨 Theme & Logout Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={toggleTheme}
              className="flex items-center gap-4 p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white"
              whileHover={{ scale: 1.07 }}
            >
              <Palette className="text-xl" />
              {isExpanded && <span>Change Theme</span>}
            </motion.button>

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-4 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 text-white"
              whileHover={{ scale: 1.07 }}
              disabled={isLoggingOut}
            >
              <FiLogOut className="text-xl" />
              {isExpanded && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* 📌 Modals */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96 relative modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3"
                onClick={() => setModalOpen(null)}
                title="Close"
              >
                <X size={24} />
              </button>
              {modalOpen === "Notifications" ? <Notifications /> : <Feedback />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
