"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  duration?: number; // optional custom timeout
  onClose?: () => void;
}

const ToastNotification = ({ message, duration = 4000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 bg-black/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
        >
          <p className="text-sm font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
