"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/firebase";
import { getAuth } from "firebase/auth";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!feedback.trim()) {
      toast.error("⚠️ Please enter feedback before sending.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      await addDoc(collection(db, "feedback"), {
        uid: currentUser?.uid || "anonymous",
        name: currentUser?.displayName || "Anonymous",
        email: currentUser?.email || "Unknown",
        message: feedback.trim(),
        createdAt: serverTimestamp(),
      });

      toast.success("✅ Feedback sent successfully!");
      setFeedback("");
      onClose();
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("❌ Failed to send feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100"
              id="feedback-title"
            >
              📧 Send Feedback
            </h2>

            <textarea
              ref={textareaRef}
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
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
