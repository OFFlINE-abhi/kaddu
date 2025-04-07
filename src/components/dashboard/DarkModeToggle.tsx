"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileTap={{ scale: 0.9 }}
      whileHover={{ rotate: 5 }}
      className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white shadow-md transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
}
