"use client";

import { motion } from "framer-motion";

interface QuickActionsProps {
  setFeedbackOpen: (val: boolean) => void;
  setScheduleOpen: (val: boolean) => void;
  betaAccess: boolean;
  setBetaAccess: (val: boolean) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const buttonVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { delay: 0.2 } },
  hover: { scale: 1.03 },
};

export default function QuickActions({
  setFeedbackOpen,
  setScheduleOpen,
  betaAccess,
  setBetaAccess,
  notificationsEnabled,
  toggleNotifications,
}: QuickActionsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      variants={buttonVariants}
      initial="initial"
      animate="animate"
    >
      {/* 📧 Feedback */}
      <motion.button
        whileHover="hover"
        onClick={() => setFeedbackOpen(true)}
        className="rounded-lg p-4 bg-card text-foreground hover:bg-muted/20 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        title="Send Feedback"
        aria-label="Send Feedback"
      >
        <h4 className="font-bold mb-1">📧 Send Feedback</h4>
        <p className="text-sm opacity-70">Let us know what you think.</p>
      </motion.button>

      {/* 📅 Schedule */}
      <motion.button
        whileHover="hover"
        onClick={() => setScheduleOpen(true)}
        className="rounded-lg p-4 bg-card text-foreground hover:bg-muted/20 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        title="Schedule Meeting"
        aria-label="Schedule Meeting"
      >
        <h4 className="font-bold mb-1">📅 Schedule Meeting</h4>
        <p className="text-sm opacity-70">Book a session with us.</p>
      </motion.button>

      {/* 🧪 Beta Access */}
      <motion.button
        whileHover="hover"
        onClick={() => setBetaAccess(!betaAccess)}
        className={`rounded-lg p-4 transition focus:outline-none focus:ring-2 focus:ring-green-500 text-left ${
          betaAccess
            ? "bg-green-600 text-white"
            : "bg-card text-foreground hover:bg-muted/20"
        }`}
        title="Toggle Beta Access"
        aria-label="Toggle Beta Access"
        aria-pressed={betaAccess}
      >
        <h4 className="font-bold mb-1">🧪 Beta Access</h4>
        <p className="text-sm opacity-70">
          {betaAccess ? "Access enabled" : "Get early features"}
        </p>
      </motion.button>

      {/* 🔔 Notifications */}
      <motion.button
        whileHover="hover"
        onClick={toggleNotifications}
        className={`rounded-lg p-4 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${
          notificationsEnabled
            ? "bg-blue-600 text-white"
            : "bg-card text-foreground hover:bg-muted/20"
        }`}
        title="Toggle Notifications"
        aria-label="Toggle Notifications"
        aria-pressed={notificationsEnabled}
      >
        <h4 className="font-bold mb-1">🔔 Notifications</h4>
        <p className="text-sm opacity-70">
          {notificationsEnabled ? "Enabled" : "Turn on alerts"}
        </p>
      </motion.button>
    </motion.div>
  );
}
