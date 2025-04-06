"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import VoiceButton from "@/components/tools/VoiceButton";
import Assist from "@/components/tools/Assistant";
import DarkModeToggle from "@/components/dashboard/DarkModeToggle";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 Prevents Hydration Error: Ensures theme only loads after mounting
  if (!mounted) {
    return (
      <motion.div
        className="bg-white text-black min-h-screen flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="text-xl font-semibold"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading...
        </motion.span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative transition-colors duration-700 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 🌑 Dark Mode Toggle (Fixed Position with Hover Effect) */}
      <motion.div
        className="fixed top-5 right-5 z-50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <DarkModeToggle />
      </motion.div>

      {/* 🌌 Background Effect with Parallax Motion */}
      <motion.div
        className="absolute inset-0 -z-10 transition-all duration-700"
        animate={{
          background:
            theme === "dark"
              ? "linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)"
              : "linear-gradient(to bottom right, #6a11cb, #2575fc, #1b1b1b)",
          filter: theme === "dark" ? "blur(0px)" : "blur(80px) opacity(60%)",
        }}
        transition={{ duration: 1.5 }}
      />

      <Navbar />

      {/* 🌟 Hero Section Animation */}
      <motion.section
        id="home"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Hero />
      </motion.section>

      {/* 🚀 Projects Section */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Projects />
      </motion.section>

      {/* 🔥 About Section (Zoom-in Effect) */}
      <motion.section
        id="about"
        className="pt-24 pb-16"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <About />
      </motion.section>

      {/* 📞 Contact Section */}
      <motion.section
        id="contact"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Contact />
      </motion.section>

      <Footer />

      {/* 🎤 Mic & 🤖 Assistant Buttons (Stacked, Animated on Hover) */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
        {/* 🎤 Mic Button */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: -5 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <VoiceButton onResult={(text) => console.log("🎤 Final transcript:", text)} />
        </motion.div>

        {/* 🤖 Assistant Button - Smooth Pulsating Effect */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Assist />
        </motion.div>
      </div>
    </motion.div>
  );
}
