"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/app/firebase";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme(); // Shared Theme State
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!mounted) return null;

  const isDashboard = pathname.startsWith("/dashboard");

  const navLinks = user
    ? isDashboard
      ? [
          { label: "Home", href: "/dashboard" },
          { label: "Assistant", href: "/dashboard/assistant" },
          { label: "Weather", href: "/dashboard/weather" },
          { label: "Calculator", href: "/dashboard/calculator" },
          { label: "Settings", href: "/dashboard/settings" },
        ]
      : [
          { label: "About", href: "#about" },
          { label: "Projects", href: "#projects" },
          { label: "Contact", href: "#contact" },
        ]
    : [
        { label: "About", href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-lg z-50 shadow-md px-6 py-4 transition-colors duration-500"
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Title */}
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
          onClick={() => router.push(user ? "/dashboard" : "/")}
        >
          Kaddu's Portfolio
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-300 transition"
              >
                {label}
              </Link>
            </li>
          ))}

          {user ? (
            <li>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-600 transition-all"
              >
                Dashboard
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-600 transition-all"
              >
                Login
              </button>
            </li>
          )}

          {/* Theme Toggle */}
          <li>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md p-4 flex flex-col items-center space-y-4 md:hidden"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-gray-900 dark:text-white font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={() => {
                router.push("/dashboard");
                setMenuOpen(false);
              }}
              className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-600 transition-all"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setMenuOpen(false);
              }}
              className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-600 transition-all"
            >
              Login
            </button>
          )}

          {/* Theme Toggle Mobile */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:scale-110 transition-all"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
