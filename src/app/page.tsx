"use client";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Projects from "./component/Projects";
import About from "./component/About";
import Contact from "./component/Contact";
import Footer from "./component/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Glassmorphism Navbar */}
      <Navbar />

      {/* Background Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#8A2BE2] via-[#4B0082] to-[#1B0032] opacity-90 blur-2xl" />
      {/* Hero Section with Animation */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.section>

      {/* Projects Section with Scroll Effect */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Projects />
      </motion.section>

      {/* About Section with a Cool Fade Effect */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <About />
      </motion.section>

      {/* Contact Section with a Smooth Entry */}
      <motion.section
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
