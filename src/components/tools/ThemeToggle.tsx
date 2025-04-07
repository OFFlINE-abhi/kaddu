"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animateCircle, setAnimateCircle] = useState(false);
  const [showText, setShowText] = useState(true);
  const [buttonScale, setButtonScale] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!mounted) return null;

  const handleThemeChange = () => {
    setAnimateCircle(true);
    setShowText(false);
    setButtonScale(0.95);

    setTheme(isDark ? "light" : "dark");

    setTimeout(() => {
      setShowText(true);
      setAnimateCircle(false);
      setButtonScale(1);
    }, 300);
  };

  return (
    <div className="relative w-full">
      <motion.button
        onClick={handleThemeChange}
        className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition-all duration-200 relative overflow-hidden w-full"
        title="Toggle Theme"
        aria-label="Toggle Theme"
        style={{ scale: buttonScale }}
      >
        {/* Circle pulse animation */}
        {animateCircle && (
          <motion.div
            className="absolute w-5 h-5 rounded-full bg-indigo-600 left-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}

        {/* Text */}
        <AnimatePresence mode="wait">
          {showText && (
            <motion.span
              key={isDark ? "dark" : "light"}
              className="text-sm font-medium z-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Icon */}
        <AnimatePresence mode="wait">
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: isDark ? -90 : 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: isDark ? 90 : -90 }}
            transition={{ duration: 0.3 }}
            className={isDark ? "text-yellow-400 z-10" : "text-indigo-500 z-10"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
