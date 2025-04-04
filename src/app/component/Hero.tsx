"use client";
import { motion } from "framer-motion";

const Hero = () => {
  return (
<section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
<motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold"
      >
        Welcome to My Portfolio
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-4 text-lg"
      >
        I build modern and stunning websites.
      </motion.p>
    </section>
  );
};

export default Hero;
