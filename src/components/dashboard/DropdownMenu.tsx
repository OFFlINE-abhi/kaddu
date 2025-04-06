"use client";

import { getAuth, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DropdownMenuProps {
  user: User | null;
}

export default function DropdownMenu({ user }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Sign out from Firebase
      console.log("✅ User signed out");

      setTimeout(() => {
        router.replace("/"); // ✅ Redirect to the main page (`/`)
        router.refresh(); // ✅ Force UI refresh
      }, 100); // ✅ Small delay to ensure Firebase state updates
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* 🔹 Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Avatar"
          className="w-9 h-9 rounded-full border-2 border-white hover:border-blue-400 transition"
        />
      </button>

      {/* 🔹 Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 transition-all">
          <div className="px-4 py-3 border-b dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {user?.displayName || "Kaddu"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {user?.email}
            </p>
          </div>
          <ul className="py-1">
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
