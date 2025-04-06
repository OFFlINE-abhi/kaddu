'use client';

import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageCircle } from 'react-icons/fi';

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-16 max-w-3xl mx-auto transition-colors duration-500 bg-gray-100 dark:bg-gray-900"
    >
      <motion.h2
        className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        📬 Let’s Connect
      </motion.h2>

      <motion.p
        className="text-center text-gray-700 dark:text-gray-300 mb-10"
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
        className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 transition-all duration-500"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Name Input */}
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <span className="px-3 text-lg text-purple-500 dark:text-purple-300">
            <FiUser />
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="w-full p-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
          />
        </div>

        {/* Email Input */}
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <span className="px-3 text-lg text-purple-500 dark:text-purple-300">
            <FiMail />
          </span>
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            className="w-full p-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
          />
        </div>

        {/* Message Input */}
        <div className="flex items-start bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <span className="px-3 pt-3 text-lg text-purple-500 dark:text-purple-300">
            <FiMessageCircle />
          </span>
          <textarea
            name="message"
            rows={5}
            required
            placeholder="Your Message"
            className="w-full p-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-md transition-all shadow-md dark:shadow-lg dark:hover:from-purple-500 dark:hover:to-pink-500"
        >
          🚀 Send Message
        </button>
      </motion.form>
    </section>
  );
}
