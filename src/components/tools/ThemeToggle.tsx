"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animateCircle, setAnimateCircle] = useState(false); // For triggering the circle animation
  const [showText, setShowText] = useState(true); // Initially show text
  const [buttonScale, setButtonScale] = useState(1); // For scaling effect

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!mounted) return null;

  const handleThemeChange = () => {
    setAnimateCircle(true); // Start the animation when button is clicked
    setShowText(false); // Hide the text while animating
    setButtonScale(0.95); // Slightly scale down the button to give a click effect

    // Change theme and reset the animation after it's finished (0.5s duration)
    setTheme(isDark ? "light" : "dark");

    // Reset button scale back to normal after the animation
    setTimeout(() => {
      setShowText(true);
      setAnimateCircle(false);
      setButtonScale(1); // Reset the scale to 1 (normal size)
    }, 300); // This should match the duration of the circle animation
  };

  return (
    <div className="relative w-full">
      {/* Dark Mode Button */}
      <motion.button
        onClick={handleThemeChange}
        className="flex items-center justify-start gap-3 p-3 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition-all duration-200 group relative w-auto"
        title="Toggle Dark Mode"
        aria-label="Toggle Dark Mode"
        style={{ scale: buttonScale }} // Apply the scale animation to the button
      >
        {/* Circle Animation for Dark Mode (On the left side of the text) */}
        {animateCircle && (
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-indigo-600 left-0 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}

        {/* Dark Mode Text (Only show after animation) */}
        <AnimatePresence>
          {showText && (
            <motion.span
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Dark Mode
            </motion.span>
          )}
        </AnimatePresence>

        {/* Theme Icon (Sun or Moon) */}
        <AnimatePresence>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="text-yellow-400"
            >
              <Sun size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.3 }}
              className="text-indigo-600"
            >
              <Moon size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
