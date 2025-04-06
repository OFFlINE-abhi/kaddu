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
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Listen for changes in dark mode
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
      <motion.h2
        className="text-center text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        🚀 My Projects
      </motion.h2>

      {/* Grid Layout: 2 Projects Per Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className={`relative group overflow-hidden rounded-lg shadow-lg cursor-pointer ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedProject(project)}
          >
            {/* Image with hover overlay */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-60 object-cover transition-all duration-300 group-hover:opacity-80 rounded-lg"
            />
            {/* Hover effect text */}
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-300 text-sm">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup for Project Details */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setSelectedProject(null)} // Close modal when clicking outside
        >
          <motion.div
            className={`p-6 rounded-lg shadow-xl max-w-md w-full text-center transition-all duration-300 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
            <p className="mt-2">{selectedProject.description}</p>
            <a
              href={selectedProject.link}
              target="_blank"
              className="mt-4 inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
            >
              🌐 View Project
            </a>
            <button
              onClick={() => setSelectedProject(null)}
              className="mt-4 block w-full text-gray-500 hover:text-red-500 transition"
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
