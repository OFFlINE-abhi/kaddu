"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Feedback {
  id: string;
  name?: string;
  email?: string;
  message: string;
  reply?: string;
  createdAt?: Timestamp;
  repliedAt?: Timestamp;
}

export default function AdminFeedbackPanel() {
  const db = getFirestore();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<Record<string, string>>({});

  useEffect(() => {
    const feedbackQuery = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        const data: Feedback[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Feedback[];
        setFeedbacks(data);
        setLoading(false);
      },
      (error) => {
        console.error("Feedback fetch error:", error);
        toast.error("Failed to load feedback.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up listener
  }, [db]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "feedbacks", id));
      toast.success("Feedback deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting feedback.");
    }
  };

  const handleReply = async (id: string) => {
    const text = reply[id];
    if (!text?.trim()) return toast.error("Reply cannot be empty.");
    try {
      await updateDoc(doc(db, "feedbacks", id), {
        reply: text.trim(),
        repliedAt: Timestamp.now(),
      });
      setReply((r) => ({ ...r, [id]: "" }));
      toast.success("Replied successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reply.");
    }
  };

  return (
    <div className="p-6 mt-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-white">📬 User Feedback</h2>

      {loading ? (
        <p className="text-zinc-500 dark:text-zinc-400">Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No feedback yet.</p>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {f.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-zinc-500">{f.email || "N/A"}</p>
                </div>
                <p className="text-xs text-zinc-400">
                  {f.createdAt?.seconds
                    ? format(new Date(f.createdAt.seconds * 1000), "PPpp")
                    : "Unknown"}
                </p>
              </div>

              <p className="mt-2 text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-line">
                {f.message}
              </p>

              {f.reply ? (
                <div className="mt-2 bg-blue-100 dark:bg-blue-800 p-2 rounded">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Your Reply:</p>
                  <p className="text-sm text-blue-900 dark:text-blue-100">{f.reply}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Write a reply..."
                    value={reply[f.id] || ""}
                    onChange={(e) => setReply({ ...reply, [f.id]: e.target.value })}
                    className="w-full text-sm rounded p-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleReply(f.id)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Send Reply
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
