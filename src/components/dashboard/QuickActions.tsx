"use client";

import { motion } from "framer-motion";

interface QuickActionsProps {
  setFeedbackOpen: (val: boolean) => void;
  setScheduleOpen: (val: boolean) => void;
  betaAccess: boolean;
  setBetaAccess: (val: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
}

export default function QuickActions({
  setFeedbackOpen,
  setScheduleOpen,
  betaAccess,
  setBetaAccess,
  notificationsEnabled,
  setNotificationsEnabled,
}: QuickActionsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Feedback */}
      <button
        onClick={() => setFeedbackOpen(true)}
        className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Send Feedback"
      >
        <h4 className="font-bold text-white mb-1">📧 Send Feedback</h4>
        <p className="text-sm text-white/70">Let us know what you think.</p>
      </button>

      {/* Schedule */}
      <button
        onClick={() => setScheduleOpen(true)}
        className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Schedule Meeting"
      >
        <h4 className="font-bold text-white mb-1">📅 Schedule Meeting</h4>
        <p className="text-sm text-white/70">Book a session with us.</p>
      </button>

      {/* Beta Access */}
      <button
        onClick={() => setBetaAccess(!betaAccess)}
        className={`rounded-lg p-4 transition text-left focus:outline-none focus:ring-2 focus:ring-green-500 ${
          betaAccess ? "bg-green-700" : "bg-zinc-800 hover:bg-zinc-700"
        }`}
        aria-label="Toggle Beta Access"
      >
        <h4 className="font-bold text-white mb-1">🧪 Beta Access</h4>
        <p className="text-sm text-white/70">
          {betaAccess ? "Access enabled" : "Get early features"}
        </p>
      </button>

      {/* Notifications */}
      <button
        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        className={`rounded-lg p-4 transition text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          notificationsEnabled ? "bg-blue-700" : "bg-zinc-800 hover:bg-zinc-700"
        }`}
        aria-label="Toggle Notifications"
      >
        <h4 className="font-bold text-white mb-1">🔔 Notifications</h4>
        <p className="text-sm text-white/70">
          {notificationsEnabled ? "Enabled" : "Turn on alerts"}
        </p>
      </button>
    </motion.div>
  );
}
