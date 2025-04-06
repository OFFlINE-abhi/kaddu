"use client";

import { Card } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 65 },
  { name: "Thu", value: 90 },
  { name: "Fri", value: 70 },
  { name: "Sat", value: 100 },
  { name: "Sun", value: 60 },
];

const stats = [
  { label: "Visitors", value: "3.2K" },
  { label: "Signups", value: "512" },
  { label: "Sales", value: "$8.4K" },
  { label: "Retention", value: "76%" },
];

export default function Analytics() {
  return (
    <motion.div
      className="p-6 bg-card rounded-2xl shadow-lg dark:bg-gray-900 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-primary">📊 Analytics Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-xl bg-muted shadow-inner hover:scale-[1.02] transition-transform duration-200"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-semibold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className="mt-4 bg-background shadow-md">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
