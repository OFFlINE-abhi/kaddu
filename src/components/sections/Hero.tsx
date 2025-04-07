"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const Hero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const bgGradient = isDark
    ? "bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e]"
    : "bg-gradient-to-r from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]";

  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-white/80" : "text-gray-700";

  return (
    <section
      className={`relative h-screen flex flex-col items-center justify-center text-center ${bgGradient} ${textColor} px-6 transition-all duration-500`}
    >
      {/* Animated Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-5xl sm:text-6xl font-extrabold tracking-wide drop-shadow-lg"
      >
        Welcome to{" "}
        <span className="text-purple-500 dark:text-purple-400">My Portfolio</span>
      </motion.h1>

      {/* Animated Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className={`mt-4 text-lg sm:text-xl ${secondaryTextColor} transition-all`}
      >
        I build{" "}
        <span className="text-pink-500 dark:text-pink-400">modern</span> and{" "}
        <span className="text-blue-500 dark:text-blue-400">stunning</span> websites.
      </motion.p>

      {/* Call-to-Action Button */}
      <motion.a
        href="#projects"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
      >
        🚀 Explore My Work
      </motion.a>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`${secondaryTextColor} text-xl`}
        >
          <FiChevronDown />
        </motion.div>
        <span className={`mt-1 text-sm ${secondaryTextColor}`}>Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default Hero;
