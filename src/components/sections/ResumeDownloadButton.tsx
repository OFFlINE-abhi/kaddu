"use client";

import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import Link from "next/link";

const ResumeDownloadButton = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg flex items-center space-x-3 cursor-pointer"
    >
      <Link
        href="/resume.pdf"
        download
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2"
      >
        <FaDownload className="text-lg" />
        <span>Download Resume</span>
      </Link>
    </motion.div>
  );
};

export default ResumeDownloadButton;
