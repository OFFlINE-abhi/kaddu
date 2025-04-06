"use client";

import { useEffect, useState } from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode(); // Check on mount

    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      className={`py-12 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-700"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo and Short Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">
            Kaddu.dev
          </h2>
          <p className="text-sm">
            A passionate web developer creating modern and innovative solutions
            to make your web experience seamless.
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#home"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:kaddu@example.com"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                kaddu@example.com
              </a>
            </li>
            <li>📞 +91 8948624603</li>
          </ul>
        </div>

        {/* Footer Navigation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Navigate
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#privacy"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#terms"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-xs text-gray-600 dark:text-gray-500">
        <p>
          © {currentYear}{" "}
          <a
            href="https://kaddu.dev"
            className="text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            Kaddu.dev
          </a>{" "}
          • Made with 💙
        </p>
      </div>
    </footer>
  );
}
