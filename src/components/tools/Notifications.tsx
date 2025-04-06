"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sampleMessages = [
  { id: 1, title: "New update available!", time: "2m ago" },
  { id: 2, title: "You received a new message", time: "10m ago" },
  { id: 3, title: "Daily stats are ready", time: "1h ago" },
];

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<typeof sampleMessages>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotifications(sampleMessages);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Close on Escape
  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-start gap-3 p-3 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition-all duration-200 group relative"
        title="Notifications"
        aria-label="Toggle notifications"
      >
        <Bell size={20} />
        <span className="text-sm">Notifications</span>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-2 z-50 w-full sm:w-72 bg-zinc-900 text-white border border-zinc-700 rounded-xl shadow-lg p-4 max-h-[60vh] overflow-auto"
        >
          <h2 className="font-semibold mb-2">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-sm text-zinc-400">No new notifications.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded transition"
                >
                  <p>{note.title}</p>
                  <span className="text-xs text-zinc-400">{note.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
