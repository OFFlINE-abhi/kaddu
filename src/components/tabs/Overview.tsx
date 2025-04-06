"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Activity, TrendingUp, Star, CalendarDays, Clock } from "lucide-react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const highlights = [
    { icon: <User className="text-blue-500" />, title: "New Users", value: "1,243" },
    { icon: <Activity className="text-green-500" />, title: "Active Sessions", value: "87%" },
    { icon: <TrendingUp className="text-purple-500" />, title: "Growth Rate", value: "24%" },
    { icon: <Star className="text-yellow-500" />, title: "Feedback Score", value: "4.8/5" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "activityLogs"));
        const data: any[] = [];
        querySnapshot.forEach((doc) => data.push(doc.data()));
        setActivityLog(data);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        setActivityLog([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <motion.div
      className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">
        {getGreeting()}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
        Here’s your latest dashboard overview with real-time stats & insights!
      </p>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {highlights.map((item, index) => (
          <motion.div
            key={index}
            className="rounded-xl p-5 bg-gray-100 dark:bg-gray-800 hover:scale-[1.02] transition-transform shadow-sm"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.title}</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline + Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="w-5 h-5 text-blue-400" />
            Activity Timeline
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"
                ></div>
              ))
            ) : activityLog.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No recent activity 🤷</p>
            ) : (
              activityLog.map((log, idx) => (
                <div key={idx} className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{log.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{log.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar Summary */}
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <CalendarDays className="w-5 h-5 text-rose-500" />
            Calendar Summary
          </h3>
          <Calendar
            onChange={(value) => value && setSelectedDate(value as Date)}
            value={selectedDate}
            className="rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            tileClassName="dark:bg-gray-800 dark:text-white"
          />
          <p className="text-sm mt-3 text-gray-600 dark:text-gray-400">
            Selected Date: <span className="font-medium text-gray-900 dark:text-white">{selectedDate.toDateString()}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
