"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
}

export default function MotionWrapper({ children }: MotionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }} // ✅ Smooth exit animation
        transition={{ duration: 0.4, ease: "easeOut" }} // ✅ Smoother easing
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
