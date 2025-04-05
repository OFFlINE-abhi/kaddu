"use client";

import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAuth, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { tabIcons } from "@/lib/constants";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: keyof typeof tabIcons) => void;
  user: User;
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const isExpanded =
    typeof window !== "undefined" && window.innerWidth >= 768 ? true : sidebarOpen;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 250 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white/5 backdrop-blur-lg text-white h-screen fixed z-30 md:relative flex flex-col justify-between py-6 px-3 shadow-lg transition-all"
      >
        {/* Top - Branding and Nav */}
        <div>
          <div className="flex items-center justify-center md:justify-start mb-10">
            <span className="text-xl font-bold px-2">📊</span>
            {isExpanded && (
              <span className="ml-2 text-lg font-semibold tracking-wide hidden md:inline-block">
                Dashboard
              </span>
            )}
          </div>

          <nav className="flex flex-col space-y-2">
            {Object.entries(tabIcons).map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => {
                  setActiveTab(label as keyof typeof tabIcons);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group",
                  activeTab === label ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <span className="text-xl">
                  <Icon />
                </span>
                {isExpanded && <span className="whitespace-nowrap">{label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom - User Info + Logout */}
        <div>
          <div className="flex items-center gap-3 mb-4 px-1">
            <img
              src={user.photoURL || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
              alt={user.displayName || "User avatar"}
            />
            {isExpanded && (
              <div>
                <div className="text-sm font-semibold">
                  {user.displayName || "User"}
                </div>
                <div className="text-xs text-white/60">{user.email}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-sm rounded-lg bg-red-600 hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FiLogOut className="text-xl" />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
