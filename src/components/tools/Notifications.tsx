"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sampleMessages = [
  { id: 1, title: "New update available!", time: "2m ago", read: false },
  { id: 2, title: "You received a new message", time: "10m ago", read: false },
  { id: 3, title: "Daily stats are ready", time: "1h ago", read: true },
];

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<typeof sampleMessages>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(sampleMessages);
  }, []);

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 p-3 rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 group relative"
        title="Notifications"
        aria-label="Toggle notifications"
      >
        <Bell size={20} />
        <span className="text-sm">Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 z-50 w-full sm:w-72 bg-zinc-900 text-white border border-zinc-700 rounded-xl shadow-lg p-4 max-h-[60vh] overflow-auto"
          >
            <h2 className="font-semibold mb-2">Notifications</h2>
            {Array.isArray(notifications) && notifications.length === 0 ? (
              <p className="text-sm text-zinc-400">No new notifications.</p>
            ) : (
              <ul className="space-y-2 text-sm list-none">
                {notifications?.map((note) => (
                  <li key={note.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * note.id }}
                      className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded transition cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{note.title}</p>
                        <span className="text-xs text-zinc-400">{note.time}</span>
                      </div>
                      {!note.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </motion.div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}