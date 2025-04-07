"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import DarkModeToggle from "./DarkModeToggle";
import DropdownMenu from "./DropdownMenu";

interface HeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ user, setSidebarOpen }: HeaderProps) {
  const userName = user?.displayName ? user.displayName.split(" ")[0] : "Kaddu";
  const [isStuck, setIsStuck] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 🌀 Scroll tracking for sticky profile dropdown
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < lastScrollY || currentY < 100) {
        setIsStuck(true); // scrolling up or near top
      } else {
        setIsStuck(false); // scrolling down
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="relative z-40 bg-white dark:bg-gray-900 shadow-md transition-all duration-300">
      {/* Main Top Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          👤 Welcome, {userName}
        </div>

        {/* Center-aligned icons */}
        <div className="flex items-center justify-center gap-4 sm:ml-auto">
          <DarkModeToggle />
          {!isStuck && (
            <div className="sm:block hidden">
              <DropdownMenu user={user} />
            </div>
          )}
        </div>
      </div>

      {/* Sticky floating profile dropdown when scrolling up */}
      {isStuck && (
        <div className="fixed top-4 right-4 sm:right-10 z-50 transition-all duration-500 ease-in-out">
          <DropdownMenu user={user} />
        </div>
      )}
    </header>
  );
}
