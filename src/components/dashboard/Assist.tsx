"use client";

import { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Assist() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Tooltip or Message Box */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="assist-tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-xl max-w-xs w-full"
          >
            <p className="text-sm text-white">
              Need help? I'm your Assistant! Let me know what you're looking for.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-400"
        aria-expanded={open}
        aria-label="Toggle Assistant"
        title="Assistant"
      >
        <FiHelpCircle className="text-2xl text-white" />
      </button>
    </div>
  );
}
