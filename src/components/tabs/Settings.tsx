"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import { Switch } from "@/components/ui/switch";
import { UserCog, Bell, Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("kaddu@example.com");
  const [password, setPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const { setTheme, theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  const handlePasswordUpdate = async () => {
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }

    try {
      setUpdating(true);
      // Simulate API delay
      await new Promise((res) => setTimeout(res, 1000));
      setPassword("");
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error("Failed to update password.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      className="p-8 rounded-xl shadow-lg relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-all duration-500"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        ⚙️ Settings
      </motion.h2>
      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Manage your preferences, account settings, and configurations.
      </motion.p>

      <div className="space-y-6">
        {/* 🧑 Account Settings */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-500"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <UserCog className="w-5 h-5 text-blue-500" />
            Account Settings
          </h3>
          <CustomInput
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        {/* 🔔 Notifications */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between transition-all duration-500"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Enable or disable notifications</p>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </motion.div>
        </motion.div>

        {/* 🔐 Security Settings */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-500"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Lock className="w-5 h-5 text-red-500" />
            Security Settings
          </h3>
          <CustomInput
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CustomButton className="mt-4 w-full" disabled={updating} onClick={handlePasswordUpdate}>
              {updating ? "Updating..." : "Update Password"}
            </CustomButton>
          </motion.div>
        </motion.div>

        {/* 🌙 Dark Mode */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between transition-all duration-500"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Dark Mode
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Toggle dark mode</p>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: -10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
