"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "../firebase";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-black/70 backdrop-blur-lg z-50 shadow-md px-6 py-4"
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => router.push("/")}>
          Kaddu's Portfolio
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center">
          {!user && (
            <>
              <li><Link href="#about" className="text-white hover:text-gray-300 transition">About</Link></li>
              <li><Link href="#projects" className="text-white hover:text-gray-300 transition">Projects</Link></li>
              <li><Link href="#contact" className="text-white hover:text-gray-300 transition">Contact</Link></li>
              <li>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition-all"
                >
                  Login
                </button>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <span className="text-white font-semibold">
                  {user.displayName}
                </span>
              </li>
              <li>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                )}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-black/80 backdrop-blur-md p-4 flex flex-col items-center space-y-4 md:hidden"
        >
          {!user && (
            <>
              <Link href="#about" className="text-white" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="#projects" className="text-white" onClick={() => setMenuOpen(false)}>Projects</Link>
              <Link href="#contact" className="text-white" onClick={() => setMenuOpen(false)}>Contact</Link>
              <button
                onClick={() => { router.push("/login"); setMenuOpen(false); }}
                className="bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition-all"
              >
                Login
              </button>
            </>
          )}

          {user && (
            <>
              <span className="text-white font-semibold">{user.displayName}</span>
              {user.photoURL && (
                <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white" />
              )}
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
