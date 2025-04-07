"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [meetingTopic, setMeetingTopic] = useState("");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const startMeeting = () => {
    const roomName = `${meetingTopic.replace(/\s+/g, "-")}-${uuidv4()}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}`;
    window.open(jitsiUrl, "_blank");
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
          aria-labelledby="schedule-modal-title"
          aria-describedby="schedule-modal-description"
          tabIndex={-1}
          onClick={onClose}
        >
          <motion.div
            className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md text-white relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="schedule-modal-title" className="text-xl font-bold mb-4">
              📅 Schedule a Meeting
            </h2>
            <p id="schedule-modal-description" className="mb-4 text-white/80">
              Enter a topic and start your secure video meeting instantly.
            </p>

            <input
              type="text"
              placeholder="Enter meeting topic..."
              className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={meetingTopic}
              onChange={(e) => setMeetingTopic(e.target.value)}
            />

            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={startMeeting}
                disabled={!meetingTopic.trim()}
              >
                Start Meeting
              </button>
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
