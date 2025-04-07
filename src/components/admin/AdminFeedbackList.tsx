"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebase";
import { motion } from "framer-motion";

interface Feedback {
  id: string;
  message: string;
  uid: string;
  name: string;
  email: string;
  createdAt: any;
}

export default function AdminFeedbackList() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feedbackRef = collection(db, "feedback");
    const q = query(feedbackRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbackData: Feedback[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Feedback, "id">),
      }));
      setFeedbackList(feedbackData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">Loading feedback...</p>;
  }

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto mt-8 space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      {feedbackList.length === 0 && (
        <p className="text-zinc-500 text-center">No feedback found.</p>
      )}

      {feedbackList.map((fb) => (
        <motion.div
          key={fb.id}
          className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <p className="text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap">
            {fb.message}
          </p>
          <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <p>From: {fb.name} ({fb.email})</p>
            <p>User ID: {fb.uid}</p>
            <p>
              Sent:{" "}
              {fb.createdAt?.toDate
                ? fb.createdAt.toDate().toLocaleString()
                : "Unknown"}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
