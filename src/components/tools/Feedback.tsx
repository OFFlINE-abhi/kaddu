"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const feedbackRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;
    alert("✅ Thanks for your feedback:\n\n" + text); // Replace with toast in prod
    setText("");
    setOpen(false);
  };

  // Escape key to close
  useEffect(() => {
    const escClose = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escClose);
    return () => window.removeEventListener("keydown", escClose);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (feedbackRef.current && !feedbackRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener("mousedown", handleOutsideClick);
    }
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-start gap-3 p-3 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition-all duration-200 group relative"
        title="Feedback"
        aria-label="Send Feedback"
      >
        <MessageCircle size={20} />
        <span className="text-sm">Feedback</span>
      </button>

      {/* Feedback Panel */}
      {open && (
        <div
          ref={feedbackRef}
          role="dialog"
          aria-modal="true"
          className="absolute left-0 mt-2 z-50 w-full sm:w-72 bg-zinc-900 text-white border border-zinc-700 rounded-lg shadow-xl p-4 max-h-[60vh] overflow-auto"
        >
          <h2 className="font-semibold mb-2">Send Feedback</h2>
          <textarea
            className="w-full h-24 p-2 rounded bg-zinc-800 text-sm text-white outline-none resize-none"
            placeholder="Your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="mt-2 w-full py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
