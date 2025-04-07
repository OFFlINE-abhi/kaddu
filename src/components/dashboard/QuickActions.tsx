"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { requestNotificationPermission } from "@/app/firebase"; // Import FCM function

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
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function QuickActions({
  setFeedbackOpen,
  setScheduleOpen,
  betaAccess,
  setBetaAccess,
  notificationsEnabled,
  toggleNotifications,
}: QuickActionsProps) {
  // Handle notifications toggle and request permission dynamically
  const handleToggleNotifications = async () => {
    toggleNotifications();
    if (!notificationsEnabled) {
      const token = await requestNotificationPermission();
      if (token) {
        console.log("🔥 Notifications Enabled. Token:", token);
      }
    }
  };

  useEffect(() => {
    console.log("🔔 Notifications are", notificationsEnabled ? "enabled" : "disabled");
  }, [notificationsEnabled]);

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      variants={buttonVariants}
      initial="initial"
      animate="animate"
    >
      {/* 📧 Send Feedback */}
      <motion.button
        whileHover="hover"
        whileTap="tap"
        onClick={() => setFeedbackOpen(true)}
        className="rounded-lg p-4 bg-card text-foreground hover:bg-muted/20 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        title="Send Feedback"
        aria-label="Send Feedback"
        role="button"
      >
        <h4 className="font-bold mb-1">📧 Send Feedback</h4>
        <p className="text-sm opacity-70">Let us know what you think.</p>
      </motion.button>

      {/* 📅 Schedule Meeting */}
      <motion.button
        whileHover="hover"
        whileTap="tap"
        onClick={() => setScheduleOpen(true)}
        className="rounded-lg p-4 bg-card text-foreground hover:bg-muted/20 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        title="Schedule Meeting"
        aria-label="Schedule Meeting"
        role="button"
      >
        <h4 className="font-bold mb-1">📅 Schedule Meeting</h4>
        <p className="text-sm opacity-70">Book a session with us.</p>
      </motion.button>

      {/* 🧪 Beta Access */}
      <motion.button
        whileHover="hover"
        whileTap="tap"
        onClick={() => setBetaAccess(!betaAccess)}
        className={`rounded-lg p-4 transition focus:outline-none focus:ring-2 focus:ring-green-500 text-left ${
          betaAccess
            ? "bg-green-600 text-white shadow-lg"
            : "bg-card text-foreground hover:bg-muted/20"
        }`}
        title="Toggle Beta Access"
        aria-label="Toggle Beta Access"
        aria-pressed={betaAccess}
        role="button"
      >
        <h4 className="font-bold mb-1">🧪 Beta Access</h4>
        <p className="text-sm opacity-70" aria-live="polite">
          {betaAccess ? "Access enabled" : "Get early features"}
        </p>
      </motion.button>

      {/* 🔔 Notifications */}
      <motion.button
        whileHover="hover"
        whileTap="tap"
        onClick={handleToggleNotifications}
        className={`rounded-lg p-4 transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${
          notificationsEnabled
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-card text-foreground hover:bg-muted/20"
        }`}
        title="Toggle Notifications"
        aria-label="Toggle Notifications"
        aria-pressed={notificationsEnabled}
        role="button"
      >
        <h4 className="font-bold mb-1">🔔 Notifications</h4>
        <p className="text-sm opacity-70" aria-live="polite">
          {notificationsEnabled ? "Enabled" : "Turn on alerts"}
        </p>
      </motion.button>
    </motion.div>
  );
}
