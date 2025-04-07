"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, User } from "firebase/auth";
import { auth } from "@/app/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DropdownMenuProps {
  user: User | null;
  isAdmin?: boolean; // Optional admin role toggle
}

export default function DropdownMenu({ user, isAdmin = false }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleScroll = () => setOpen(false);

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setOpen(false);
    try {
      await signOut(auth);
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems = [
    { label: "👤 My Account", path: "/account" },
    { label: "⚙️ Settings", path: "/settings" },
    isAdmin && { label: "🛡️ Admin Panel", path: "/admin" },
  ].filter(Boolean) as { label: string; path: string }[];

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none"
        aria-label="Toggle profile menu"
      >
        <img
  src={user?.photoURL || "/default-avatar.png"}
  alt={user?.displayName || "User Avatar"}
  loading="lazy"
  referrerPolicy="no-referrer"
  onError={(e) => {
    (e.target as HTMLImageElement).src = "/default-avatar.png";
  }}
  className="w-10 h-10 rounded-full border-2 border-white hover:border-blue-400 transition-all duration-300 shadow-md object-cover"
/>

      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm sm:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Mobile menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-xl z-50 sm:hidden p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {user?.displayName || "Kaddu"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.email || "no-email@example.com"}
                  </p>
                </div>
                <button onClick={() => setOpen(false)} title="Close menu">
                  <X className="text-zinc-600 dark:text-zinc-300" />
                </button>
              </div>

              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push(item.path);
                      }}
                      className="w-full text-left px-2 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loggingOut ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Logging out...
                      </>
                    ) : (
                      <>🚪 Logout</>
                    )}
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* Desktop menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-1/2 translate-x-1/2 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl z-50 overflow-hidden border border-zinc-200 dark:border-zinc-700 hidden sm:block"
            >
              <div className="px-4 py-3 border-b dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {user?.displayName || "Kaddu"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {user?.email || "no-email@example.com"}
                </p>
              </div>

              <ul className="py-1 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push(item.path);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loggingOut ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Logging out...
                      </>
                    ) : (
                      <>🚪 Logout</>
                    )}
                  </button>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
