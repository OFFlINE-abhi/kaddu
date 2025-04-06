"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");

  const handleSend = () => {
    if (!feedback.trim()) {
      toast.error("⚠️ Please enter feedback before sending.");
      return;
    }

    toast.success("✅ Feedback sent successfully!");
    setFeedback("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-border"
          >
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              📧 Send Feedback
            </h2>

            <textarea
              placeholder="Type your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full h-32 resize-none p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Feedback message"
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => {
                  setFeedback("");
                  onClose();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
