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

  return (
    <div className={`relative transition-colors duration-500 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* 🌑 Dark Mode Toggle (Fixed Position) */}
      <div className="fixed top-5 right-5 z-50">
        <DarkModeToggle />
      </div>

      {/* 🌌 Background Effect */}
      <motion.div 
        className={`absolute inset-0 -z-10 transition-all duration-700 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-black to-black" : "bg-gradient-to-br from-purple-600 via-indigo-900 to-black opacity-70 blur-3xl"}`} 
      />

      <Navbar />

      <motion.section id="home" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Hero />
      </motion.section>

      <motion.section id="projects" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <Projects />
      </motion.section>

      <motion.section id="about" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
        <About />
      </motion.section>

      <motion.section id="contact" initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
        <Contact />
      </motion.section>

      <Footer />

      {/* 🎤 Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceButton onResult={(text) => console.log("🎤 Final transcript:", text)} />
      </div>

      {/* 🤖 Sticky Assistant */}
      <div className="fixed bottom-20 right-6 z-50">
        <Assist />
      </div>
    </div>
  );
}
