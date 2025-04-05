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
      toast.error("Please enter feedback before sending.");
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[90%] max-w-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">📧 Send Feedback</h2>

            <textarea
              placeholder="Type your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full h-32 p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Feedback message"
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                onClick={() => {
                  setFeedback("");
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={handleSend}
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
