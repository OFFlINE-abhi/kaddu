"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/firebase";

export default function MeetingScheduler() {
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSchedule = async () => {
    if (!title || !scheduledTime) {
      alert("All fields are required.");
      return;
    }

    const meetingId = uuidv4();
    const scheduledDate = new Date(scheduledTime);

    try {
      await addDoc(collection(db, "meetings"), {
        id: meetingId,
        title,
        scheduledTime: Timestamp.fromDate(scheduledDate),
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(new Date(scheduledDate.getTime() + 3600 * 1000)),
      });

      alert("✅ Meeting scheduled!");
      setTitle("");
      setScheduledTime("");
    } catch (error) {
      console.error("❌ Error scheduling meeting:", error);
      alert("Failed to schedule the meeting.");
    }
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md text-white max-w-md w-full mx-auto">
      <h2 className="text-lg font-semibold mb-4">📅 Schedule a New Meeting</h2>

      <input
        type="text"
        className="w-full p-2 mb-3 rounded bg-zinc-700"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="scheduledTime" className="block mb-1">
        Scheduled Time
      </label>
      <input
        id="scheduledTime"
        type="datetime-local"
        className="w-full p-2 mb-4 rounded bg-zinc-700"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />

      <button
        onClick={handleSchedule}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full transition duration-200"
      >
        Schedule Meeting
      </button>
    </div>
  );
}
