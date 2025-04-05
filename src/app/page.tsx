"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/Projects";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      {/* Glassmorphism Navbar */}
      <Navbar />

      {/* Background Glow Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600 via-indigo-900 to-black opacity-70 blur-3xl" />

      {/* Hero Section */}
      <motion.section
        id="home"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Projects />
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <About />
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Contact />
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
