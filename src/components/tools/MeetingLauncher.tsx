"use client";

import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";

interface Meeting {
  id: string;
  title: string;
  scheduledTime: { seconds: number };
}

export default function MeetingLauncher() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "meetings"), (snapshot) => {
      const upcoming: Meeting[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Meeting;
        const time = new Date(data.scheduledTime.seconds * 1000);
        if (time >= new Date()) upcoming.push(data);
      });

      setMeetings(upcoming);
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("📢 New meeting scheduled!");
      }
    });

    return () => unsub();
  }, []);

  const getCountdown = (seconds: number) => {
    const diff = new Date(seconds * 1000).getTime() - Date.now();
    if (diff <= 0) return "Now";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const handleJoin = (id: string) => {
    router.push(`/dashboard/meeting/${id}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md text-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-4">🔔 Upcoming Meetings</h2>
      {meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="p-4 bg-zinc-800 rounded-lg text-white flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{meeting.title}</h3>
                <p className="text-sm text-gray-400">
                  Starts in: {getCountdown(meeting.scheduledTime.seconds)}
                </p>
              </div>
              <button
                onClick={() => handleJoin(meeting.id)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-3 sm:mt-0"
              >
                Join Now
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
