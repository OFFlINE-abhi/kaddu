"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;

    setLoading(true);
    setTimeout(() => {
      toast.success("✅ Thanks for your feedback!");
      setText("");
      setOpen(false);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (feedbackRef.current && !feedbackRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 p-3 rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 group relative"
        title="Feedback"
        aria-label="Send Feedback"
      >
        <MessageCircle size={20} />
        <span className="text-sm">Feedback</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={feedbackRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 z-50 w-full sm:w-72 bg-zinc-900 text-white border border-zinc-700 rounded-lg shadow-xl p-4 max-h-[60vh] overflow-auto"
          >
            <h2 className="font-semibold mb-2">Send Feedback</h2>
            <textarea
              className="w-full h-24 p-2 rounded bg-zinc-800 text-sm text-white outline-none resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className={`mt-2 w-full py-1 rounded text-sm transition ${
                loading || !text.trim()
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
