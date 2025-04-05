"use client";
import { motion } from "framer-motion";

const projects = [
  { title: "Project 1", description: "A cool project", image: "/project1.jpg" },
  { title: "Project 2", description: "Another awesome project", image: "/project2.jpg" },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 bg-gray-900 text-white">
      <h2 className="text-center text-4xl font-bold mb-8">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
          >
            <img src={project.image} alt={project.title} className="w-full rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
            <p className="text-gray-300">{project.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
