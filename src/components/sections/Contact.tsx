"use client";

import { motion } from "framer-motion";
import { FiMail, FiUser, FiMessageCircle } from "react-icons/fi";

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-16 max-w-3xl mx-auto text-white"
    >
      <motion.h2
        className="text-4xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        📬 Let’s Connect
      </motion.h2>

      <motion.p
        className="text-center text-white/70 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Have a question, project, or just want to say hello? Fill out the form
        and I’ll get back to you as soon as possible.
      </motion.p>

      <motion.form
        action="https://formspree.io/f/xyzenoyb" // Replace with your Formspree form ID
        method="POST"
        className="space-y-6 bg-white/5 p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-white/10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center bg-black/20 rounded-md overflow-hidden">
          <span className="px-3 text-lg text-purple-300">
            <FiUser />
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="w-full p-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-black/20 rounded-md overflow-hidden">
          <span className="px-3 text-lg text-purple-300">
            <FiMail />
          </span>
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            className="w-full p-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
          />
        </div>

        <div className="flex items-start bg-black/20 rounded-md overflow-hidden">
          <span className="px-3 pt-3 text-lg text-purple-300">
            <FiMessageCircle />
          </span>
          <textarea
            name="message"
            rows={5}
            required
            placeholder="Your Message"
            className="w-full p-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-md transition-all shadow-md"
        >
          🚀 Send Message
        </button>
      </motion.form>
    </section>
  );
}
