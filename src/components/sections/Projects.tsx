"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const projects = [
  {
    title: "Portfolio Website",
    description: "A modern portfolio built with Next.js, Tailwind CSS, and Framer Motion.",
    image: "/project1.jpg",
    link: "https://myportfolio.com",
  },
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce website with Stripe payments and user authentication.",
    image: "/project2.jpg",
    link: "https://myecommerce.com",
  },
  {
    title: "AI Chatbot",
    description: "An AI-powered chatbot that helps users get quick answers using OpenAI API.",
    image: "/project3.jpg",
    link: "https://aichatbot.com",
  },
  {
    title: "Weather App",
    description: "A real-time weather app that fetches live data and displays forecasts beautifully.",
    image: "/project4.jpg",
    link: "https://weatherapp.com",
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      className={`py-16 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Section Title */}
      <motion.h2
        className="text-center text-4xl font-bold mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        🚀 My Projects
      </motion.h2>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className={`relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer transform transition-transform duration-300 hover:scale-[1.03] ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedProject(project)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover rounded-2xl group-hover:opacity-75 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center px-4">
              <h3 className="text-2xl font-semibold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-300 text-sm">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className={`p-6 rounded-xl shadow-2xl max-w-md w-full text-center ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
            <p className="mt-3 text-sm">{selectedProject.description}</p>
            <a
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              🌐 View Project
            </a>
            <button
              onClick={() => setSelectedProject(null)}
              className="mt-4 w-full text-sm text-gray-400 hover:text-red-500 transition"
            >
              ✖ Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;
