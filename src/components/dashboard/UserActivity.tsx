"use client";

import React from "react";
import { motion } from "framer-motion";

const activities = [
  { id: 1, message: "Logged in", time: "2 min ago" },
  { id: 2, message: "Viewed Analytics", time: "8 min ago" },
  { id: 3, message: "Edited profile", time: "20 min ago" },
];

const UserActivity = () => {
  return (
    <motion.div
      className="mt-8 bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <ul className="space-y-3 text-sm text-gray-200">
        {activities.map((activity) => (
          <li key={activity.id} className="flex justify-between">
            <span>{activity.message}</span>
            <span className="text-gray-400">{activity.time}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default UserActivity;
